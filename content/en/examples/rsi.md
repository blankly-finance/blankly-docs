---
title: RSI
description: 'Detecting overbuying and overselling using RSI'
position: 12
category: Examples
---

## Overview

Let's analyze RSI (Relative Strength Index). It is a common oscillator that is used to indicate whether or not an asset is overbought or oversold by analyzing the average price gains and losses for a given time period. 

### The Buy/Sell Condition

The RSI typically has two bounds set: an upper bound of 70 and a lower bound of 30 (see [Investopedia](https://www.investopedia.com/terms/r/rsi.asp)). Specifically, when the asset hits below 30, then we want to buy in, and when the asset hits above 70, we want to sell. 

## Implementing in Blankly

### Boilerplate Code

<alert>
To get started, make sure you have already [set up](/getting-started/installation) your environment along with the necssary keys and settings. 
</alert>

We will be implementing this strategy using `Blankly.Strategy` that allows for a quick and easy way of building out our golden cross. We'll also be utilizing `blankly.indicators` to quickly implement moving average calculations. 

#### Create Strategy

```python
from Blankly import Strategy, StrategyState, Interface
from Blankly import Alpaca
from Blankly.indicators import rsi

def price_event(price, currency_pair, state: StrategyState):
    # we'll come back to this soon
    pass

alpaca = Alpaca()
s = Strategy(alpaca)
s.add_price_event(price_event, 'MSFT', resolution='15m')
s.variables["has_bought"] = false
s.run()
```

### Implementing the Price Event

Now that we have the code set up, let's take a deep dive into how to implement this price event.

First, as we recall, we want to buy an entity when the RSI is under 30 and sell when the RSI is greater than 70, we will use a period of 14 (the typical setup)
This is a very simple conditional statement. 

```python
def price_event(price, currency_pair, state: StrategyState):
    interface: Interface = state.interface
    # allow the resolution to be any resolution: 15m, 30m, 1d, etc.
    resolution: str = state.resolution
    variables = state.variables

    history = interface.get_product_history(currency_pair, 150, resolution)

    rsi = rsi(history, period=14)
    # comparing prev diff with current diff will show a cross
    if rsi < 30 and not variables['has_bought']:
        interface.market_order('buy', currency_pair, interface.cash)
        variables['has_bought'] = true
    else if rsi > 70 and variables['has_bought']:
        curr_value = interface.account[currency_pair]['available'] * price
        interface.market_order('sell', currency_pair, curr_value)
        variables['has_bought'] = false
```

### Adding it All Together

Now that we've gotten everything, let's bring it all together

<alert type="success">
One thing you'll begin to realize as you continue to develop with Blankly is that the majority of the Blankly code will stay the same "create a strategy, connect an exchange, run the model, etc.", all you have to do is focus on making a good model. Let us handle the rest.
</alert>

```python

from Blankly import Strategy, StrategyState, Interface
from Blankly import Alpaca
from Blankly.indicators import sma

def price_event(price, currency_pair, state: StrategyState):
    interface: Interface = state.interface
    # allow the resolution to be any resolution: 15m, 30m, 1d, etc.
    resolution: str = state.resolution
    variables = state.variables

    history = interface.get_product_history(currency_pair, 150, resolution)

    rsi = rsi(history, period=14)
    # comparing prev diff with current diff will show a cross
    if rsi < 30 and not variables['has_bought']:
        interface.market_order('buy', currency_pair, interface.cash)
        variables['has_bought'] = true
    else if rsi > 70 and variables['has_bought']:
        curr_value = interface.account[currency_pair]['available'] * price
        interface.market_order('sell', currency_pair, curr_value)
        variables['has_bought'] = false

alpaca = Alpaca()
s = Strategy(alpaca)
s.add_price_event(price_event, 'MSFT', resolution='1d')
s.variables["has_bought"] = false
s.backtest(to='2y')
```