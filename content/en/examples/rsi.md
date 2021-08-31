---
title: RSI
description: 'Detecting overbuying and overselling using RSI'
position: 21
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
from blankly import Strategy, StrategyState, Interface
from blankly import Alpaca
from blankly.indicators import rsi


def init(symbol, state: StrategyState):
    # run on a new price event to initialize variables
    pass


def price_event(price, symbol, state: StrategyState):
    # we'll come back to this soon
    pass


alpaca = Alpaca()
s = Strategy(alpaca)
s.add_price_event(price_event, 'MSFT', resolution='15m', init=init)
s.start()
```

### Initializing Variables and History

In order to speed things up, we should make one call to get the historical data that we need and append data as new prices come in. 
We can actually easily do this on initialization and make sure the proper data is passed in to the proper price events:

```python
def init(symbol, state: StrategyState):
    # Download price data to give context to the algo
    state.variables['history'] = state.interface.history(symbol, to='1y', return_as='list')['close']
```

### Implementing the Price Event

Now that we have the code set up, let's take a deep dive into how to implement this price event.

First, as we recall, we want to buy an entity when the RSI is under 30 and sell when the RSI is greater than 70, we will use a period of 14 (the typical setup)
This is a very simple conditional statement. 

<alert> Due to float precision errors with binary (try 2.1 * 0.2 in the terminal), we've carefully implemented a function called trunc that will allow you to easily calculate the correct amount you want to sell without worrying about floating point errors with the exchange. Simply import it from utils</alert>

```python
def price_event(price, symbol, state: StrategyState):
    """ This function will give an updated price every 15 seconds from our definition below """
    state.variables['history'].append(price)
    rsi = blankly.indicators.rsi(state.variables['history'])
    if rsi[-1] < 30:
        # Dollar cost average buy
        state.interface.market_order(symbol, side='buy', funds=10)
    elif rsi[-1] > 70:
        # Dollar cost average sell
        state.interface.market_order(symbol, side='sell', funds=10)
```

### Adding it All Together

Now that we've gotten everything, let's bring it all together

<alert type="success">
One thing you'll begin to realize as you continue to develop with Blankly is that the majority of the Blankly code will stay the same "create a strategy, connect an exchange, run the model, etc.", all you have to do is focus on making a good model. Let us handle the rest.
</alert>

```python

import blankly
from blankly import StrategyState


def price_event(price, symbol, state: StrategyState):
    """ This function will give an updated price every 15 seconds from our definition below """
    state.variables['history'].append(price)
    rsi = blankly.indicators.rsi(state.variables['history'])
    if rsi[-1] < 30:
        # Dollar cost average buy
        state.interface.market_order(symbol, side='buy', funds=10)
    elif rsi[-1] > 70:
        # Dollar cost average sell
        state.interface.market_order(symbol, side='sell', funds=10)


def init(symbol, state: StrategyState):
    # Download price data to give context to the algo
    state.variables['history'] = state.interface.history(symbol, to='1y', return_as='list')['close']


if __name__ == "__main__":
    # Authenticate coinbase pro strategy
    coinbase_pro = blankly.CoinbasePro()

    # Use our strategy helper on coinbase pro
    coinbase_strategy = blankly.Strategy(coinbase_pro)

    # Run the price event function every time we check for a new price - by default that is 15 seconds
    coinbase_strategy.add_price_event(price_event, symbol='BTC-USD', resolution='30m', init=init)

    # Start the strategy. This will begin each of the price event ticks
    coinbase_strategy.start()
    # Or backtest using this
    # coinbase_strategy.backtest(to='1y', initial_values={'USD': 100000, 'BTC': 2})

```