---
title: The Golden Cross
description: 'Implementing the golden cross using Blankly'
position: 12
category: Examples
---

## Overview

The golden cross is perhaps one of the most initial trading algorithms out there. It takes items such as moving averages into play and makes a quick decision on when to buy and when to sell. 
Typically speaking, it utilizes the `50-Day SMA` and the `200-Day SMA` to determine whether or not to buy or sell a stock. 

### The Buy/Sell Condition

We choose to buy a stock when the 50-day SMA crosses the 200-day SMA in an upward direction (typically signifying change in sentiment or stock movement) and sell when the 50-day recrosses the 200-day SMA in a downwards direction. 

## Implementing in Blankly

### Boilerplate Code

<alert>
To get started, make sure you have already [set up](/getting-started/installation) your environment along with the necssary keys and settings. 
</alert>

We will be implementing the golden cross using `Blankly.Strategy` that allows for a quick and easy way of building out our golden cross. We'll also be utilizing `blankly.indicators` to quickly implement moving average calculations. 

#### Create Strategy

```python
from Blankly import Strategy, StrategyState, Interface
from Blankly import Alpaca
from Blankly.indicators import sma

def price_event(price, currency_pair, state: StrategyState):
    # we'll come back to this soon
    pass

alpaca = Alpaca()
s = Strategy(alpaca)
s.add_price_event(price_event, 'MSFT', resolution='1d')
s.variables["has_bought"] = false
s.run()
```

### Implementing the Price Event

Now that we have the code set up, let's take a deep dive into how to implement this price event.

First, as we recall, we want to buy an entity when the 50-day SMA crosses the 200-day SMA in an upward direction, we can tell this by looking at the slope of the SMA

Traditionally, calculating an SMA would typically involve utilizing `numpy` or `pandas`. Blankly has done all the hard lifting for you AND returns the SMA as an array so that we can easily calculate the slope between any two points (we'll take a difference of 5)

```python
def price_event(price, currency_pair, state: StrategyState):
    interface: Interface = state.interface
    # allow the resolution to be any resolution: 15m, 30m, 1d, etc.
    resolution: str = state.resolution
    variables = state.variables

    history = interface.get_product_history(currency_pair, 800, resolution)

    sma50 = sma(history, period=50)
    sma200 = sma(history, period=200)
    diff = sma200 - sma50
    slope_sma50 = (sma50[-1] - sma50[-5]) / 5 # get the slope of the last 5 SMA50 Data Points
    prev_diff = diff[-2]
    curr_diff = diff[-1]
    # comparing prev diff with current diff will show a cross
    if slope_sma50 > 0 and curr_diff >= 0 and prev_diff < 0 and not variables['has_bought']:
        interface.market_order('buy', currency_pair, interface.cash)
        variables['has_bought'] = true
    else if slope_sma50 < 0 and curr_diff <= 0 and prev_diff > 0 and variables['has_bought']:
        curr_value = interface.account[currency_pair]['available'] * price
        interface.market_order('sell', currency_pair, curr_value)
        variables['has_bought'] = false
```

### Adding it All Together

Now that we've gotten everything, let's bring it all together

```python

from Blankly import Strategy, StrategyState, Interface
from Blankly import Alpaca
from Blankly.indicators import sma

def price_event(price, currency_pair, state: StrategyState):
    interface: Interface = state.interface
    # allow the resolution to be any resolution: 15m, 30m, 1d, etc.
    resolution: str = state.resolution
    variables = state.variables

    history = interface.get_product_history(currency_pair, 800, resolution)

    sma50 = sma(history, period=50)
    sma200 = sma(history, period=200)
    diff = sma200 - sma50
    slope_sma50 = (sma50[-1] - sma50[-5]) / 5 # get the slope of the last 5 SMA50 Data Points
    prev_diff = diff[-2]
    curr_diff = diff[-1]
    # comparing prev diff with current diff will show a cross
    if slope_sma50 > 0 and curr_diff > 0 and prev_diff < 0 and not variables['has_bought']:
        interface.market_order('buy', currency_pair, interface.cash)
        variables['has_bought'] = true
    else if slope_sma50 < 0 and curr_diff < 0 and prev_diff > 0 and variables['has_bought']:
        curr_value = interface.account[currency_pair]['available'] * price
        interface.market_order('sell', currency_pair, curr_value)
        variables['has_bought'] = false

alpaca = Alpaca()
s = Strategy(alpaca)
s.add_price_event(price_event, 'MSFT', resolution='1d')
s.variables["has_bought"] = false
s.backtest(to='2y')
```