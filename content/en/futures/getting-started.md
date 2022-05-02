# Getting started with Blankly Futures

Blankly is the first open-source platform to support backtesting futures.

Getting started with futures trading on blankly is slightly more involved than SPOT markets since it is one of our newest features.
This page will aim to guide you through it, and in the future we hope to make the process more streamlined so you can focus on building trading algorithms.

# Initializing with the CLI

TODO link to CLI setup page

You will need the blankly CLI installed. If you've already done this you can skip this step. Otherwise the CLI can be installed through `pip`:

```bash
$ pip install blankly
```

Then, create a new directory for your project to live in, `cd` into it, and run `blankly init`:

```bash
$ mkdir my-futures-model
$ cd my-futures-model
$ blankly init
```

If running `blankly` fails with a "command not found" error, this can mean that you don't have your PATH setup properly.
TODO link to tutorial for fixing this, maybe here: https://www.makeuseof.com/python-windows-path/
You can also work around this issue by adding `python -m` before the `blankly init` command, so the entire line becomes: `python -m blankly init` (You can do this for any blankly command).

**Important**

The CLI will ask you a few questions about your model. Please read the following section before answering each one.

#### What exchange would you like to connect to?

**Futures Markets are only supported by Binance and FTX**. If you will only be backtesting and/or don't have a preference, we recommend Binance.

#### What type of model do you want to create?

Futures screeners are not yet supported. **Pick strategy for this one**.

#### What template would you like to use for your new model?

**Pick none**. The templates are for SPOT Markets and won't work for futures.

#### Would you like to add keys for this exchange?

**You will need exchange keys to download historical data for backtesting**.
You can always add these later by running `blankly key add`.

#### Would you like to connect this model to the Blankly Platform?

The Blankly Platform doesn't support Futures trading yet. **Select NO for this one**.

# Futures Setup

If all went well, the CLI will have generated a bunch of files that your model needs to run. Open up `bot.py` to get started.

This code is for SPOT markets. We will change two lines to make our model run on perpetual contracts instead:

`exchange = blankly.Binance()` -> `exchange = blankly.BinanceFutures()` (If you are using FTX, this is `FTXFutures` instead.)

`strategy = blankly.Strategy(exchange)` -> `strategy = blankly.FuturesStrategy(exchange)`

**Important**: For Binance, you likely want to change 'USD' on the last line of the script to 'USDT'.

# Adding a price event

Price events are very similar to SPOT price events.

```python
import blankly

# This function is new!
# This will get run every day and passed the current price of the contract
def price_event(price, symbol, state: FuturesStrategyState):
    print('current price:', price)

if __name__ == "__main__":
    exchange = blankly.BinanceFutures()
    strategy = blankly.FuturesStrategy(exchange)

    # This line is new!
    strategy.add_price_event(price_event, symbol='BTC-USDT', resolution='1d')

    if blankly.is_deployed:
        strategy.start()
    else:
        strategy.backtest(to='1y', initial_values={'USDT': 10000})  # This is USDT and not USD because we are trading on Binance
```

# Placing orders

Let's buy a short position if the price rises more than $1,000 in a day:


```python
def price_event(price, symbol, state: FuturesStrategyState):
  prev_price = state.variables['prev_price']
  position = state.interface.get_position(symbol)

  # if the price rose more than 1,000 and we don't already have a short position, then short sell
  if not position and price - prev_price >= 1000:
    order_size = state.interface.cash / price
    state.interface.market_order(symbol, Side.SELL, order_size)

  # if the price stablized and we *do* have a short position, close our position.
  elif position and abs(price - prev_price) <= 100:
    # we use abs(position['size']) here because position['size'] can (and will) be negative, since we have taken a short position.
    state.interface.market_order(symbol, Side.BUY, abs(position['size']), reduce_only=True)

  state.variables['prev_price'] = price
```

# Init and teardown

Almost done. 
Let's add some code to give the algo some context (right now the first call to price_event will always error because `state.variables['prev_price']` doesn't exist yet).
We can also add a function to close our short position after when the algo shuts down or we finish our backtest.

Add these three functions:
```python
# Helper function to close out a position
def close_position(symbol, state: FuturesStrategyState):
    position = state.interface.get_position(symbol)
    if not position:
        return
    size = position['size']
    if size < 0:
        state.interface.market_order(symbol,
                                     Side.BUY,
                                     abs(size),
                                     reduce_only=True)
    elif size > 0:
        state.interface.market_order(symbol,
                                     Side.SELL,
                                     abs(size),
                                     reduce_only=True)

# This function will be run before our algorithm starts
def init(symbol, state: FuturesStrategyState):
    # Sanity check to make sure we don't have any open positions
    close_position(symbol, state)

    # Set initial leverage and margin type
    state.interface.set_leverage(1, symbol)
    state.interface.set_margin_type(symbol, MarginType.ISOLATED)

    # Give the algo the previous price as context
    last_price = state.interface.history(symbol, to=1, return_as='deque', resolution=state.resolution)['close'][-1]
    state.variables['prev_price'] = last_price


# After our backtest is finished, close all our open positions
def teardown(symbol, state):
    close_position(symbol, state)
```

Then change the strategy.add_price_event line to this:

```python
strategy.add_price_event(price_event, init=init, teardown=teardown, symbol='BTC-USDT', resolution='1d')
```

TODO link to example here (I will add it to the github)
You've just implemented a super basic Futures strategy! The completed example can be found at
