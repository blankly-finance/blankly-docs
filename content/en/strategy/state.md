---
title: Managing Strategy State
description: 'Develop, backtest, paper trade, and run with the same code.'
position: 11
version: 1.1
category: Blankly Strategy
---

`StrategyState` is how we access and manage the state behind a specific price event. It essentially allows us to keep tabs on the data for each and every event that occurs and fires. For example, let's say that we have a strategy that runs on `MSFT` and `AAPL`. To create this, we would have this kind of scaffolding. 

```python
from blankly import Alpaca, Strategy, StrategyState

def custom_price_event(price, symbol, state: StrategyState):
  	# do something here

# Authenticate coinbase pro strategy
exchange = blankly.Alpaca()

# Use our strategy helper on coinbase pro
strategy = blankly.Strategy(exchange)
strategy.add_price_event(custom_price_event, 'AAPL', resolution='1h')
strategy.add_price_event(custom_price_event, 'MSFT', resolution='15m')

strategy.start()
```

Now as you can see, not only are `AAPL` and `MSFT` different tickers, they also can run at different resolutions, have different price data, and ultimately are two separate scheduled functions. As a result, the `StrategyState` is defined to be the *individual state of a price event* (i.e. each price event has and maintains it's own state)

<alert>
Each price event maintains it's own state. If you wish to share a global state, use the python global keyword as we integrate this in.
</alert>

![image](https://firebasestorage.googleapis.com/v0/b/blankly-docs-images.appspot.com/o/strategy%2Fblankly-strategy-state.png?alt=media&token=b78b34c9-c160-4e2c-9afd-616c1ec6bc54)


## Accessing State: `StrategyState`

Each event that is added to your `Strategy` will have it's own initialized state that houses key metadata along with information about the price event. Specifically you are able to access the underlying [`interface`](/core/exchange_interface) that allows you to make calls for price data, submit market orders, access current account positions, etc. In addition, users have access to the price_event `resolution` and a state `variables` dictionary where you can assign state variables. 

### Why Use State?

The state object helps you define really useful values including keeping track of historical data (such as bar events, previous prices in order to calculate rolling technical indicators or prevoius positions), for example using any [indicator](/metrics/indicators) will require a storage / rolling price data that would be stored in `state.variables['history']`. 

Other items include storing previous trades, or orders so that you can retrieve them later if you'd like to cancel an order if another opportunity arises. You can do this by creating a 
```python
state.variables['has_position'] = False
```

or something more complex like 

```python
state.variables['previous_order'] = 'order-id'
state.variables['SL'] = 125.23
state.variables['TP'] = 356.23

if state.variables['TP']: 
    state.interface.market_order('sell' ...)
    ...

```

As you can see, you can store any data that you'd like to easily reference later.


### Properties

| Property    | Description                                                  | Examples                          | Type              |
| ----------- | ------------------------------------------------------------ | --------------------------------- | ----------------- |
| interface   | Pulls the interface stored in the strategy object            | `interface = state.interface`     | blankly.Interface |
| variables   | Access to all underlying user-defined state variables. This is a modular dictionary used for general storage. | `variables = state.variables`     | dict              |
| resolution  | Specific Strategy Event Resolution (`None` for Orderbook Event). This is the number of seconds between runs if defined. | `resolution = state.resolution`   | float             |
| symbol      | The symbol the price event is running on                     | `symbol = state.symbol`           | str               |
| time        | The current epoch time (if in backtest mode or in real-time) | `time = state.time`               | Int               |
| base_asset  | The base asset of the symbol (`BTC` of `BTC-USD` or `AAPL` of `AAPL`) | `base_asset = state.base_asset`   | str               |
| quote_asset | The quote asset of the symbol (`USD` of `BTC-USD` or `USD` of `AAPL`) | `quote_asset = state.quote_asset` | str               |

### Example Use Case

With any price event function, you will most definitely be working with `state` to do things like submit a market order or get data as needed.

```python
import blankly
from blankly import StrategyState


def init(symbol: str, state: StrategyState):
    variables = state.variables  # grab the variables dictionary
    # initialize any variables here
    variables['this_is_cool'] = True
    # get 50 data points at specific resolution of event
    variables['history'] = state.interface.history(symbol, 50, state.resolution)['close'].tolist()


def price_event(price, symbol, state: StrategyState):
    interface: blankly.Interface = state.interface
    state.variables['history'].append(price)  # add new price to history
    # buy as much as possible with the available cash
    interface.market_order(symbol, 'buy', int(interface.cash/price))
```

For some real-life example uses, check out our [examples](/examples/rsi)
