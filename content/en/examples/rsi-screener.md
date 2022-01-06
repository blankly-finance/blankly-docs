---
title: An RSI Screener
description: 'Screening a set of assets for oversold signals'
position: 23
category: Examples
---

## Overview

Let's analyze RSI (Relative Strength Index) to build a screener tha we can easily use to filter a universe of assets (say the NYSE or all assets on Coinbase). It is a common oscillator that is used to indicate whether or not an asset is overbought or oversold by analyzing the average price gains and losses for a given time period. 

### What is a screener?

A screener is a "filter", here at Blankly, we like to call it a "signal". Instead of like a [strategy](/core/strategy)  that runs on a specific asset (like `BTC-USD`), a [signal](/core/signal) runs on a **set of assets** (so giving it an array such as `['BTC-USD', 'ETH-USD']`). This makes it extremely useful to evaluate and analyze multiple assets all at once and instead of "trading" each individually, we will make decisions based on the signal output **across** all of the assets. 

### When should I use a Signal vs a Strategy

Use a strategy if you're interested in testing an algorithm that will **fully automate** your trading algorithm (i.e I want to specifically trade `NVDA` better). Use a signal if you're looking to find better investment ideas based on an objective function / evaluator (i.e. I want to find the best stocks to invest in based on RSI oversold). 

<alert>

What you can begin to see is that there might be a lot of synergies like using the output from signals to easily redeploy and automate our strategies in real-time (switching up price events, redeploying strategies, etc.)

</alert> 

### The Evaluator 

Every `Blankly.Signal` requires an evaluator function that will actually be run across each asset. This could be anything from an indicator like RSI, or it could be a complex machine learning model that takes things in like fundamental data, share price momentum, sentiment analysis, and more. 

This example will go through using the RSI indicator. RSI typically has two bounds set: an upper bound of 70 and a lower bound of 30 (see [Investopedia](https://www.investopedia.com/terms/r/rsi.asp)). Specifically, when the asset hits below 30, then we want to buy in, and when the asset hits above 70, we want to sell. Since we're evaluating assets, we want to find all the assets that are oversold (i.e. hit below 30). 

## Implementing in Blankly

### Boilerplate Code

<alert>
To get started, make sure you have already <a href="/getting-started/installation">set up</a> your environment along with the necssary keys and settings. 
</alert>

We will be implementing this strategy using `Blankly.Signal` that allows for a quick and easy way of building out our screener that connects all of our functions and runs them on a set interval of time. We'll also be utilizing `blankly.indicators` to quickly implement the RSI calculation. 

### Create Signal

```python
from blankly import Signal, Alpaca, SignalState

tickers = ['AAPL', 'GME', 'MSFT' ... ] # any stocks that you may want
# This function is our evaluator and runs per stock
def is_stock_buy(symbol, state: SignalState):
  # in here we can get the price data, do anything else that we may need
def init(state):
  # initialize price data for example (so price queries are faster)
def formatter(results, state: SignalState):
  # here we can format the results on a per ticker basis
  
alpaca = Alpaca() # initialize our interface
signal = Signal(alpaca, is_stock_buy, symbols=tickers, init=init, resolution="1d") # run this every day
signal.notify()
```

### Implementing the Evaluator Function

Now that we've set up our signal. Let's build out our "buy condition", i.e. when the stock is oversold or less than 30. This is our `is_stock_buy` function that takes in a `symbol` and a `state` object that blankly passes into handle any storage of variables and data, just like a `Strategy`. This function will automatically be run on every stock in the universe. 


```python
def is_stock_buy(symbol, state: SignalState):
  # This runs per stock
  prices = state.interface.history(symbol, 40, resolution=state.resolution) # get past 40 data points
  rsi_values = rsi(prices['close'], 14)
  return { 'is_oversold': rsi_values[-1] < 30, 'price': price, 'symbol': symbol }
```

### Formatting the Results 

Now that we have the results, we want to actually format it to be something readable and that we'd be willing to share with friends over email. That's why we have our formatter function. 

```python
def formatter(results, state: SymbolState):
  # results is a dictionary on a per symbol basis
  result_string = 'These are all the stocks that are currently oversold: \n'
  for result in results:
        if result['is_oversold']:
      result_string += '{} is currently oversold at a price of {}\n\n'.format(symbol, price)
  return result_string
```

This will return all the stocks that are oversold and their associated price level which we can now make a decision on whether or not we want to execute. 

### Adding it All Together

Now that we've gotten everything, let's bring it all together. Congrats! In just 20 lines of code, you've built a fully functional, backtestable trading algorithm.

<alert type="success">
One thing you'll begin to realize as you continue to develop with Blankly is that the majority of the Blankly code will stay the same "create a strategy, connect an exchange, run the model, etc.", all you have to do is focus on making a good model. Let us handle the rest.
</alert>

```python
from blankly import Signal, Alpaca, SignalState
from blankly.indicators import rsi

tickers = ['AAPL', 'GME', 'MSFT'] # any stocks that you may want

# This function is our evaluator and runs per stock
def is_stock_buy(symbol, state: SignalState):
  # This runs per stock
  prices = state.interface.history(symbol, 40, resolution=state.resolution, return_as='list') # get past 40 data points
  price = state.interface.get_price(symbol)
  rsi_values = rsi(prices['close'], 14)
  return { 'is_oversold': rsi_values[-1] < 30, 'price': price, 'symbol': symbol }

def formatter(results, state: SignalState):
  # results is a dictionary on a per symbol basis
  result_string = 'These are all the stocks that are currently oversold: \n'
  for symbol in results:
    if results[symbol]['is_oversold']:
      result_string += '{} is currently oversold at a price of {}\n\n'.format(symbol, results[symbol]['price'])
  return result_string
  
alpaca = Alpaca() # initialize our interface
signal = Signal(alpaca, is_stock_buy, symbols=tickers, formatter=formatter, resolution='1d') # find oversold every day
signal.notify()
```

## Output

Running this file and we get: 

```
These are all the stocks that are currently oversold: 
AAPL is currently oversold at a price of $143
```

That's it! You were able to build out an entire RSI screener in as much as 20 lines. Now how do we improve this? We have a couple of suggestions: 

* Don't just analyze whether it's oversold, analyze how much it's oversold by (i.e. why did we pick 30?, what if we looked at RSI momentum like the first derivative)
* What if we wanted to screen for multiple things? How do we combine this with a moving average analysis? 
* Now that we've decided on these oversold stocks, **how** **much** do we buy of each? Should we do it based on how oversold they are? Sharpe ratio? etc. 