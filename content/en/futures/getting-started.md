---
title: Getting Started with Futures
description: Blankly is the first open-source platform to support backtesting futures.
position: 5
version: 1.0
category: Futures
---

Blankly is the first open-source platform to support backtesting futures.

Getting started with futures trading on blankly is slightly more involved than SPOT markets since it is one of our newest features.
This page will aim to guide you through it, and in the future we hope to make the process more streamlined so you can focus on building trading algorithms.

## Initializing with the CLI

You will need the [blankly CLI installed](/getting-started/installation). If you've already done this you can skip this step. Otherwise the CLI can be installed through `pip`:

```bash
$ pip install blankly
```

Then, create a new directory for your project to live in, `cd` into it, and run `blankly init`:

```bash
$ mkdir my-futures-model
$ cd my-futures-model
$ blankly init
```

If running `blankly` fails with a "command not found" error, this can mean that you don't have your PATH setup properly. Check out this [tutorial](https://www.makeuseof.com/python-windows-path/).

Alternatively, you can work around this issue by adding `python -m` before the `blankly init` command, so the entire line becomes: `python -m blankly init` (You can do this for any blankly command).

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

## Futures Setup

If all went well, the CLI will have generated a bunch of files that your model needs to run. Open up `bot.py` to get started.

This code is for SPOT markets. We will need to change it to make our model run on perpetual contracts instead.

Add these lines at the top of your file:

```python
from blankly import futures
from blankly.futures import FuturesStrategyState
from blankly.futures.utils import close_position
```

And change these two lines:

`exchange = blankly.Binance()` -> `exchange = futures.BinanceFutures()` (If you are using FTX, this is `FTXFutures` instead.)

`strategy = blankly.Strategy(exchange)` -> `strategy = futures.FuturesStrategy(exchange)`

**Important**: For Binance, you likely also want to change 'USD' on the last line of the script to 'USDT'.

## Adding a price event

Price events are very similar to SPOT price events.

```python
# This function is new!
# This will get run every day and passed the current price of the contract
def price_event(price, symbol, state: FuturesStrategyState):
    print('current price:', price)

if __name__ == "__main__":
    exchange = futures.BinanceFutures()
    strategy = futures.FuturesStrategy(exchange)

    # This line is new!
    strategy.add_price_event(price_event, symbol='BTC-USDT', resolution='1d')

    ...
```

## Placing orders

Let's buy a short position if the price rises more than $1,000 in a day:


```python
def price_event(price, symbol, state: FuturesStrategyState):
    prev_price = state.variables['prev_price']
    position = state.interface.get_position(symbol)

    # if the price rose more than 1,000 and we don't already have a short position, then short sell
    if not position and price - prev_price >= 1000:
        order_size = (state.interface.cash / price) * 0.99
        state.interface.market_order(symbol, Side.SELL, order_size)

    # if the price stablized and we *do* have a short position, close our position.
    elif position and abs(price - prev_price) <= 100:
        # we use abs(position['size']) here because position['size'] can (and will) be negative, since we have taken a short position.
        state.interface.market_order(symbol, Side.BUY, abs(position['size']), reduce_only=True)

    state.variables['prev_price'] = price
```

## Init and teardown

Almost done. 
Let's add some code to give the algo some context (right now the first call to price_event will always error because `state.variables['prev_price']` doesn't exist yet).
We can close our short position after when the algo shuts down or we finish our backtest by adding `teardown=close_position` to our price event.

Add our init functions:
```python
# This function will be run before our algorithm starts
def init(symbol, state: FuturesStrategyState):
    # Close any open positions
    close_position(symbol, state)

    # Give the algo the previous price as context
    last_price = state.interface.history(symbol, to=1, return_as='deque', resolution=state.resolution)['close'][-1]
    state.variables['prev_price'] = last_price
```

Then change the strategy.add_price_event line to this:

```python
strategy.add_price_event(price_event, init=init, teardown=close_position, symbol='BTC-USDT', resolution='1d')
```

You've just implemented a super simple Futures strategy! The completed example can be found [here](https://github.com/blankly-finance/blankly/blob/main/examples/futures_tutorial.py).
