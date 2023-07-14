---
title: RSI
description: 'Detecting overbuying and overselling using RSI'
position: 11
category: Examples
---

## Overview

Let's analyze RSI (Relative Strength Index). It is a common oscillator that is used to indicate whether or not an asset is overbought or oversold by analyzing the average price gains and losses for a given time period. 

### The Buy/Sell Condition

The RSI typically has two bounds set: an upper bound of 70 and a lower bound of 30 (see [Investopedia](https://www.investopedia.com/terms/r/rsi.asp)). Specifically, when the asset hits below 30, then we want to buy in, and when the asset hits above 70, we want to sell. 

## Implementing in Blankly

### Boilerplate Code

<alert>
To get started, make sure you have already <a href="/getting-started/installation">set up</a> your environment along with the necssary keys and settings. 
</alert>

We will be implementing this strategy using `Blankly.Strategy` that allows for a quick and easy way of building out our RSI strategy. We'll also be utilizing `blankly.indicators` to quickly implement the RSI calculations. 

#### Create Strategy

```python
from blankly import Strategy, StrategyState, Interface
from blankly import Alpaca
from blankly.indicators import rsi


def init(symbol, state: StrategyState):
    # run on a new price event to initialize variables
    pass


def price_event(price, symbol, state: StrategyState):
    # we'll come back to this soon
    pass


exchange = Alpaca()
strategy = Strategy(exchange)
strategy.add_price_event(price_event, 'MSFT', resolution='15m', init=init)
strategy.start()
```

### Initializing Variables and History

In order to speed things up, we should make one call to get the historical data that we need and append data as new prices come in. 
We can actually easily do this on initialization and make sure the proper data is passed in to the proper price events:

```python
def init(symbol, state: blankly.StrategyState):
    # Download price data to give context to the algo
    # This gets the past 150 data points as a deque to reduce memory usage
    state.variables['history'] = state.interface.history(symbol, to=150, return_as='deque')['close']
    state.variables['owns_position'] = False
```

### Implementing the Price Event

Now that we have the code set up, let's take a deep dive into how to implement this price event.

First, as we recall, we want to buy an entity when the RSI is under 30 and sell when the RSI is greater than 70, we will use a period of 14 (the typical setup)
This is a very simple conditional statement. 


```python
def price_event(price, symbol, state: StrategyState):
    """ This function will give an updated price every 15 minutes from our definition below """
    state.variables['history'].append(price)
    rsi = blankly.indicators.rsi(state.variables['history'])
    if rsi[-1] < 30 and not state.variables['owns_position']:
        buy = int(state.interface.cash / price) # calculate number of shares from cash
        state.interface.market_order(symbol, side='buy', size=buy)
        state.variables['owns_position'] = True
    elif rsi[-1] > 70 and state.variables['owns_position']:
        curr_value = int(state.interface.account[state.base_asset].available)
        state.interface.market_order(symbol, side='sell', size=curr_value)
        state.variables['owns_position'] = False
```

### Adding it All Together

Now that we've gotten everything, let's bring it all together. Congrats! In just 20 lines of code, you've built a fully functional, backtestable trading algorithm.

<alert type="success">
One thing you'll begin to realize as you continue to develop with Blankly is that the majority of the Blankly code will stay the same "create a strategy, connect an exchange, run the model, etc.", all you have to do is focus on making a good model. Let us handle the rest.
</alert>

```python

import blankly


def price_event(price, symbol, state: blankly.StrategyState):
    """ This function will give an updated price every 15 seconds from our definition below """
    state.variables['history'].append(price) # appends to the deque of historical prices
    rsi = blankly.indicators.rsi(state.variables['history'])
    if rsi[-1] < 30 and not state.variables['owns_position']:
        buy = int(state.interface.cash / price)
        state.interface.market_order(symbol, side='buy', size=buy)
        state.variables['owns_position'] = True
    elif rsi[-1] > 70 and state.variables['owns_position']:
        curr_value = int(state.interface.account[state.base_asset].available)
        state.interface.market_order(symbol, side='sell', size=curr_value)
        state.variables['owns_position'] = False


def init(symbol, state: blankly.StrategyState):
    # Download price data to give context to the algo
    state.variables['history'] = state.interface.history(symbol, to=150, return_as='deque')['close']
    state.variables['owns_position'] = False


if __name__ == "__main__":
    # Authenticate alpaca strategy
    exchange = blankly.Alpaca()

    # Use our strategy helper on alpaca
    strategy = blankly.Strategy(exchange)

    # Run the price event function every time we check for a new price - by default that is 15 seconds
    strategy.add_price_event(price_event, symbol='MSFT', resolution='15m', init=init)

    # Start the strategy. This will begin each of the price event ticks
    # strategy.start()
    # Or backtest using this
    results = strategy.backtest(to='1y', initial_values={'USD': 10000})
    print(results)

```
