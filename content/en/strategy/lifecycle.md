---
title: Strategy Event Lifecycle
description: 'Develop, backtest, paper trade, and run with the same code.'
position: 12
version: 1.1
category: Blankly Strategy
---

With the Strategy class, we often want to be able to run some code BEFORE a specific price event occurs (such as gather data, initialize variables into the state, store existing open orders if the model is running live), and we often want to run something AFTER the model finishes (close all outstanding positions say for a grid bot, send all trades to a database, etc.)

In order to do this. Strategies have a specific lifecycle on a per price event basis. This allows you to use the same function across multiple price events (such as one `init` function that's used everywhere). Or create separate `init` functions for each and every price event. 

<alert>
Using an init function is almost always a must if you want to do any interesting algorithms as you ahve to initialize history in order to calculate just about anything. We also recommend using init to check for any existing outstanding orders and properly manage those when initializing state.
</alert>

## The Strategy Object

![Strategy Visually](https://firebasestorage.googleapis.com/v0/b/blankly-docs-images.appspot.com/o/strategy%2Fblankly-strategy.png?alt=media&token=e5d7879e-ece3-4ee7-bf9d-b5adb8220994)

Now let's look at a specific example of a strategy that has as price event (note this is the same for `bar_event` and other events as well)

```python
from blankly import CoinbasePro, Strategy

def custom_price_event(price, symbol, state):
  	# do something here

# Authenticate coinbase pro strategy
coinbase_pro = blankly.CoinbasePro()

# Use our strategy helper on coinbase pro
strategy = blankly.Strategy(coinbase_pro)
strategy.add_price_event(custom_price_event, 'BTC-USD', resolution='1h')

strategy.start()
```

This looks pretty straightforward, but unfortunately, there isn't much that we can do. Why? Because we need to initialize some historical data so that we can calculate rolling values and information. In order to do this, we create an additional `init` function. 


### Init Function

```python
from blankly import CoinbasePro, Strategy, StrategyState

def init(symbol, state: StrategyState):
    pass

def custom_price_event(price, symbol, state: StrategyState):
  	# do something here

# Authenticate coinbase pro strategy
coinbase_pro = blankly.CoinbasePro()

# Use our strategy helper on coinbase pro
strategy = blankly.Strategy(coinbase_pro)
strategy.add_price_event(custom_price_event, 'BTC-USD', resolution='1h')

strategy.start()
```

This init function allows us to initialize anything that we'd like. Almost every [example](https://package.blankly.finance/examples) that we have, always initialize things like "do we have a position?" "what's my stop loss", and of course "my historical data". 

```python

def init(symbol, state: StrategyState):
    # get last 150 data points
    state.variables['history'] = state.interface.history(symbol, 150, state.resolution)
    state.variables['has_position'] = False
    state.variables['TP'] = 0
    ...
```

<alert>
Notice how we utilized symbol and state.resolution so we can actually use the SAME init function across multiple price events with different symbols and resolutions by leveraging state.
</alert>


Now, all we have to do is add this to our price events that we want to initialize. 

```python

from blankly import CoinbasePro, Strategy, StrategyState

def init(symbol, state: StrategyState):
    # get last 150 data points
    state.variables['history'] = state.interface.history(symbol, 150, state.resolution)
    state.variables['has_position'] = False
    state.variables['TP'] = 0
    ...

def custom_price_event(price, symbol, state: StrategyState):
  	# do something here

# Authenticate coinbase pro strategy
coinbase_pro = blankly.CoinbasePro()

# Use our strategy helper on coinbase pro
strategy = blankly.Strategy(coinbase_pro)
strategy.add_price_event(custom_price_event, 'BTC-USD', resolution='1h', init=init)

strategy.add_price_event(custom_price_event, 'ETH-USD', resolution='1h', init=init)

strategy.start()

```

### Teardown Function

And we would do the same with a `teardown` function


```python

from blankly import CoinbasePro, Strategy, StrategyState

def init(symbol, state: StrategyState):
    # get last 150 data points
    state.variables['history'] = state.interface.history(symbol, 150, state.resolution)
    state.variables['has_position'] = False
    state.variables['TP'] = 0
    ...

def teardown(symbol, state: StrategyState):
    if state.variables['has_position']:
        state.interface.market_order(symbol, 'sell', interface.account[symbol].available)


def custom_price_event(price, symbol, state: StrategyState):
  	# do something here

# Authenticate coinbase pro strategy
coinbase_pro = blankly.CoinbasePro()

# Use our strategy helper on coinbase pro
strategy = blankly.Strategy(coinbase_pro)
strategy.add_price_event(custom_price_event, 'BTC-USD', resolution='1h', init=init, teardown=teardown)

strategy.add_price_event(custom_price_event, 'ETH-USD', resolution='1h', init=init, teardown=teardown)

strategy.start()

```