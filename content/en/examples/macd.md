---
title: MACD
description: 'Implementing a MACD strategy using Blankly'
position: 12
category: Examples
---

## Overview

The MACD (Moving Average Convergence and Divergence) is another particular example of a strategy that is common and can be implemented. Similarly to the Golden Cross, the MACD takes in moving averages and calculates the difference between the two (convergence and divergence). 

<alert type="info">For those that have a keen eye, this strategy is extremely similar to the golden cross strategy. In fact if you used the 50 and the 200-day SMA as your configuration, you would produce the same algorithm just written differently!</alert>

### The Buy/Sell Condition

Our condition for buying and selling will be when the MACD crosses above the zero (i.e. when two moving averages cross) and sell when they cross below 0. 

## Implementing in Blankly

### Boilerplate Code

<alert>
To get started, make sure you have already [set up](/getting-started/installation) your environment along with the necssary keys and settings. 
</alert>

We will be implementing a MACD strategyusing `Blankly.Strategy` that allows for a quick and easy way of building out our golden cross. We'll also be utilizing `blankly.indicators` to quickly implement the MACD calculations. 

#### Create Strategy

```python
from Blankly import Strategy, StrategyState, Interface
from Blankly import Alpaca
from Blankly.indicators import macd

def price_event(price, currency_pair, state: StrategyState):
    # we'll come back to this soon
    pass

alpaca = Alpaca()
s = Strategy(alpaca)
s.add_price_event(price_event, 'MSFT', resolution='30m')
s.variables["has_bought"] = false
s.run()
```

### Implementing the Price Event

Now that we have the code set up, let's take a deep dive into how to implement this price event.

We want to buy when the MACD crosses up (which means the slope of MACD must be positive), thus, we're going to analyze the difference between two points of the MACD to detect positive slope and the crossing up. We also want to note that the MACD may skip over zero (i.e. go from -0.00005 to 0.35), and in this case, we still want to buy when the MACD is 0.35. 

We will use the 12 and 26 day EMA as our short and long periods and 9 as our signal period (see [Investopedia](https://www.investopedia.com/terms/m/macd.asp))

```python

SHORT_PERIOD = 12
LONG_PERIOD = 26
SIGNAL_PERIOD = 9

def price_event(price, currency_pair, state: StrategyState):
    interface: Interface = state.interface
    # allow the resolution to be any resolution: 15m, 30m, 1d, etc.
    resolution: str = state.resolution
    variables = state.variables

    history = interface.get_product_history(currency_pair, 800, resolution)
    macd_res = macd(history, short_period=variables['short_period'], long_period=variables['long_period'], signal_period=variables['signal_period'])

    # alternatively, we can use variables, which allows us to integrate 
    # this with any strategy with these constants defined during initial run time:
    # macd_res = macd(history, short_period=variables['short_period'], long_period=variables['long_period'], signal_period=variables['signal_period'])

    slope_macd = (macd_res[-1] - macd_res[-5]) / 5 # get the slope of the last 5 MACD_points
    prev_macd = macd_res[-2]
    curr_macd = macd_res[-1]
    
    # We want to make sure this works even if curr_macd does not equal 0

    if slope_macd > 0 and curr_macd >= 0 and prev_macd < 0 and not variables['has_bought']:
        # buy with all available cash
        interface.market_order('buy', currency_pair, interface.cash)
        variables['has_bought'] = true
    else if slope_macd < 0 and curr_diff <= 0 and prev_macd > 0 and variables['has_bought']:
        # sell all of the position
        curr_value = interface.account[currency_pair]['available'] * price
        interface.market_order('sell', currency_pair, curr_value)
        variables['has_bought'] = false

```

<alert type="success">
    This example shows how global namespace can actually also be used in price_events, Blankly does not change namespaces so you can access anything in your general python file. This makes it easy to customize different strategies. You can also use <pre>state.variables</pre> as a way to integrate with local Strategy state
</alert>

### Adding it All Together

Now that we've gotten everything, let's bring it all together

```python

from Blankly import Strategy, StrategyState, Interface
from Blankly import Alpaca
from Blankly.indicators import sma

SHORT_PERIOD = 12
LONG_PERIOD = 26
SIGNAL_PERIOD = 9

def price_event(price, currency_pair, state: StrategyState):
    interface: Interface = state.interface
    # allow the resolution to be any resolution: 15m, 30m, 1d, etc.
    resolution: str = state.resolution
    variables = state.variables

    history = interface.get_product_history(currency_pair, 800, resolution)
    macd_res = macd(history, short_period=variables['short_period'], long_period=variables['long_period'], signal_period=variables['signal_period'])

    # alternatively, we can use variables, which allows us to integrate 
    # this with any strategy with these constants defined during initial run time:
    # macd_res = macd(history, short_period=variables['short_period'], long_period=variables['long_period'], signal_period=variables['signal_period'])

    slope_macd = (macd_res[-1] - macd_res[-5]) / 5 # get the slope of the last 5 MACD_points
    prev_macd = macd_res[-2]
    curr_macd = macd_res[-1]
    
    # We want to make sure this works even if curr_macd does not equal 0
    
    if slope_macd > 0 and curr_macd >= 0 and prev_macd < 0 and not variables['has_bought']:
        # buy with all available cash
        interface.market_order('buy', currency_pair, interface.cash)
        variables['has_bought'] = true
    else if slope_macd < 0 and curr_diff <= 0 and prev_macd > 0 and variables['has_bought']:
        # sell all of the position
        curr_value = interface.account[currency_pair]['available'] * price
        interface.market_order('sell', currency_pair, curr_value)
        variables['has_bought'] = false

alpaca = Alpaca()
s = Strategy(alpaca)
s.add_price_event(price_event, 'MSFT', resolution='1d')
s.variables["has_bought"] = false
s.backtest(to='2y')
```