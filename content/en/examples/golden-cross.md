---
title: The Golden Cross
description: 'Implementing the golden cross using Blankly'
position: 20
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
from blankly import Strategy, StrategyState, Interface
from blankly import Alpaca
from blankly.utils import trunc
from blankly.indicators import sma


def init(symbol, state: StrategyState):
    # run on a new price event to initialize variables
    pass


def price_event(price, symbol, state: StrategyState):
    # we'll come back to this soon
    pass


alpaca = Alpaca()
s = Strategy(alpaca)
s.add_price_event(price_event, 'MSFT', resolution='1d', init=init)
s.start()
```

### Initializing Variables and History

In order to speed things up, we should make one call to get the historical data that we need and append data as new prices come in. 
We can actually easily do this on initialization and make sure the proper data is passed in to the proper price events:

```python
def init(symbol, state: StrategyState):
    interface: Interface = state.interface
    resolution: float = state.resolution
    variables = state.variables
    # initialize the historical data
    variables['history'] = interface.history(symbol, 800, 
        resolution, return_as='list')['close']
    variables['has_bought'] = False
```

### Implementing the Price Event

Now that we have the code set up, let's take a deep dive into how to implement this price event.

First, as we recall, we want to buy an entity when the 50-day SMA crosses the 200-day SMA in an upward direction, we can tell this by looking at the slope of the SMA

Traditionally, calculating an SMA would typically involve utilizing `numpy` or `pandas`. Blankly has done all the hard lifting for you AND returns the SMA as an array so that we can easily calculate the slope between any two points (we'll take a difference of 5)

<alert> Due to float precision errors with binary (try 2.1 * 0.2 in the terminal), we've carefully implemented a function called trunc that will allow you to easily calculate the correct amount you want to sell without worrying about floating point errors with the exchange. Simply import it from utils</alert>

```python
def price_event(price, symbol, state: StrategyState):
    interface: Interface = state.interface
    variables = state.variables

    variables['history'].append(price)

    sma200 = sma(variables['history'], period=200)
    # match up dimensions
    sma50 = sma(variables['history'], period=50)[-len(sma200):]
    diff = sma200 - sma50
    slope_sma50 = (sma50[-1] - sma50[-5]) / 5 # get the slope of the last 5 SMA50 Data Points
    prev_diff = diff[-2]
    curr_diff = diff[-1]
    is_cross_up = slope_sma50 > 0 and curr_diff >= 0 and prev_diff < 0
    is_cross_down = slope_sma50 < 0 and curr_diff <= 0 and prev_diff > 0
    # comparing prev diff with current diff will show a cross
    if is_cross_up and not variables['has_bought']:
        interface.market_order(symbol, 'buy', interface.cash)
        variables['has_bought'] = True
    elif is_cross_down and variables['has_bought']:
        # use strategy.base_asset if on CoinbasePro or Binance
        # truncate here to fix any floating point errors
        curr_value = trunc(interface.account[symbol].available * price, 2)
        interface.market_order(symbol, 'sell', curr_value)
        variables['has_bought'] = False
```

### Adding it All Together

Now that we've gotten everything, let's bring it all together

```python
from blankly import Strategy, StrategyState, Interface
from blankly import Alpaca
from blankly.indicators import sma


def init(symbol, state: StrategyState):
    interface: Interface = state.interface
    resolution: float = state.resolution
    variables = state.variables
    # initialize the historical data
    variables['history'] = interface.history(symbol, 800, resolution)['close']
    variables['has_bought'] = False


def price_event(price, symbol, state: StrategyState):
    interface: Interface = state.interface
    # allow the resolution to be any resolution: 15m, 30m, 1d, etc.
    resolution: float = state.resolution
    variables = state.variables

    variables['history'].append(price)

    sma50 = sma(variables['history'], period=50)
    sma200 = sma(variables['history'], period=200)
    diff = sma200 - sma50
    slope_sma50 = (sma50[-1] - sma50[-5]) / 5 # get the slope of the last 5 SMA50 Data Points
    prev_diff = diff[-2]
    curr_diff = diff[-1]
    is_cross_up = slope_sma50 > 0 and curr_diff >= 0 and prev_diff < 0
    is_cross_down = slope_sma50 < 0 and curr_diff <= 0 and prev_diff > 0
    # comparing prev diff with current diff will show a cross
    if is_cross_up and not variables['has_bought']:
        interface.market_order('buy', symbol, interface.cash)
        variables['has_bought'] = True
    elif is_cross_down and variables['has_bought']:
        curr_value = interface.account[symbol].available * price
        interface.market_order('sell', symbol, curr_value)
        variables['has_bought'] = False


alpaca = Alpaca()
s = Strategy(alpaca)
s.add_price_event(price_event, 'MSFT', resolution='1d', init=init)
s.backtest(initial_values={'USD': 10000}, to='2y')
```