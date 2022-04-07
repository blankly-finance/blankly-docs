---
title: Why Blankly?
description: ''
position: 5
category: Getting Started
---

We started Blankly because we knew that the traditional way of doing things was simply frustrating. Whether it was building your model and connecting it to exchanges, getting historical data, or even just implementing metrics, backtesting, and indicators, building and testing trading models was tedious and error-prone. Here, we'll show you how Blankly makes the current way of doing things seem so outdated. 


## Gathering Data

### Traditionally

Current methods involve heavily using third-party packages including `yfinance` `CoinAPI` `Polygon.io` and many more that each have their own API, rate limits, and syntax. 

### Using Blankly

Blankly makes it extremely easy to gather data by integrating with our interfaces that run on any exchange.

<alert type="warning">
    Most recent data will be delayed by 15 minutes with Alpaca if a premium key is not specified in your keys.json. 
    If you have a premium key, make sure you add the property "premium: true". 
    We are actively working on a blankly.data that will be a new source for financial data.
</alert>

```python
from blankly import Alpaca, CoinbasePro, Binance

a = Alpaca()
c = CoinbasePro()
b = Binance()

interface = a.interface
# get last 50 price data points at a specific resolution
interface.history('MSFT', 50, resolution='15m')
interface.history('AAPL', 50, resolution='1d')
```

## Backtesting with Portfolio Metrics

<alert>
    If you're not familiar with portfolio metrics, please check out our <a href="/metrics/metrics">metrics docs</a>
</alert>

Traditionally, building out all the metrics takes a lot of time. Even if it's simply calculating a Sharpe or Sortino ratio, the process of doing so typically takes significant work to gather the necessary data and implement the relevant function.

### Traditionally
#### Getting Return History

The first step is to get all the price data of a stock.
```python
from model import Model # model that returns buy or sell signal
import yfinance as yf
price_data = yf.Ticker('MSFT')
# yfinance returns OHLC data 
prices = price_data.history('1y', interval='1d')
```

#### Calculating Model Returns
Now that we have the data, let's make some decisions based on our model on when to buy or sell.

```python
... 

# this strategy assumes 100% of portfolio goes into one stock
portfolio_value = 100000
portfolio_value_per_day = []
num_shares = 0.0
for price in prices:  # loop through each day
    decision: bool = model(price)

    if num_shares > 0:
        # calculate portfolio value based on share price
        portfolio_value = price * num_shares

    # buy/sell logic
    if decision and num_shares == 0.0:
        num_shares = portfolio_value // price
    elif not decision and num_shares > 0.0:
        portfolio_value = num_shares * price
        num_shares = 0

    # add the portfolio value results
    portfolio_value_per_day.append(portfolio_value)

```

#### Calculate the Ratios

Now, let's implement the code needed to calculate portfolio returns and ratios. We're going to calculate the Sharpe ratio.

```python
...
import math
from statistics import mean, stdev


def sharpe(returns, days=252):
    return mean(returns) / stdev(returns) * math.sqrt(days)


sharpe_ratio = sharpe(portfolio_value_per_day)
```

#### Overall Code

Adding all of this code up we have:

```python
from model import model  # model that returns buy or sell signal
import yfinance as yf
import math
from statistics import mean, stdev

price_data = yf.Ticker('MSFT')
# yfinance returns OHLC data
prices = price_data.history('1y', interval='1d')

# this strategy assumes 100% of portfolio goes into one stock
portfolio_value = 100000
portfolio_value_per_day = []
num_shares = 0.0
for price in prices: # loop through each day
    decision: bool = model(price)

    if num_shares > 0:
        # calculate portfolio value based on share price
        portfolio_value = price * num_shares

    # buy/sell logic
    if decision and num_shares == 0.0:
        num_shares = portfolio_value // price
    elif not decision and num_shares > 0.0:
        portfolio_value = num_shares * price
        num_shares = 0

    # add the portfolio value results
    portfolio_value_per_day.append(portfolio_value)


def sharpe(returns, days=252):
    return mean(returns) / stdev(returns) * math.sqrt(days)


sharpe_ratio = sharpe(portfolio_value_per_day)
```

### Using Blankly

Blankly simplifies this code into fewer lines, and even better, allows the same code to immediately be deployed by simply removing the `.backtest()` call.

```python
from examples.working_examples.model import my_awesome_model as model

import blankly
from blankly import Strategy
from blankly.strategy.strategy_state import StrategyState


def init(ticker, state):
    state.variables['own_position'] = False


def buy_or_sell(price, symbol, state: StrategyState):
    decision: bool = model(price)
    interface = state.interface

    if decision and not state.variables['own_position']:
        # buy using all of our cash (to 2 safety decimals)
        interface.market_order(symbol=symbol, side='buy', int(blankly.trunc(interface.cash, 2)/price))
        # store order amount for sell order
        state.variables['own_position'] = True
    elif state.variables['own_position'] and not decision:
        # sell if we have decided to sell
        interface.market_order(symbol=symbol, side='sell', int(interface.get_account(state.base_asset)['available']))
        state.variables['own_position'] = False

a = blankly.Alpaca()
s = Strategy(a)

s.add_price_event(buy_or_sell, symbol='MSFT', resolution='1d', init=init)

s.backtest(to='1y', initial_values={'USD': 100000})  # sharpe is already included as a backtest metric

```

## Build vs Test

### Traditionally

In order to make our traditional code work, we would need to create a separate function to work with a Python package like `alpaca` or `CoinbasePro` that is completely different from our backtesting code. This leads to:
 1. a lot of unnecessary code duplication
 2. difficulty in maintaining code, especially when switching across exchanges
 3. difficulty in making one strategy run on multiple tickers at the same time. 

### Using Blankly
Blankly's build and test environments are exactly the same, so we can simply take our strategy defined in the previous example and immediately use it to run a real model by removing `.backtest()` 

```python
... 

a = Alpaca()
s = Strategy(a)
s.add_price_event(buy_or_sell, symbol='MSFT', resolution='1d')
s.add_price_event(buy_or_sell, symbol='AAPL', resolution='1d')

# Testing
s.backtest(to='1y')

# Production
s.run()
```

## Running on Multiple Tickers

<alert type="warning">
It's important that when implementing price_event functions that run on multiple tickers that you make your order sizes relative to a percentage of your available cash so that you are not overdrawing and purchasing items on margin. 
</alert>

### Traditionally

Using the example from above, we would have to wrap the traditional way into a function and call the function on various tickers. 

```python
msft_sharpe = calculate_sharpe_with_portfolio(model, 'MSFT')
aapl_sharpe = calculate_sharpe_with_portfolio(model, 'AAPL')
```

But we would have more trouble if we wanted to run our strategy on crypto because we would need to implement separate data gathering and separate functions. 

### Using Blankly

With Blankly, we just need to add one more line of code, AND we can change the resolution:
```python
s.add_price_event(buy_or_sell, symbol='MSFT', resolution='1d')
s.add_price_event(buy_or_sell, symbol='AAPL', resolution='1d')
s.add_price_event(buy_or_sell, symbol='TSLA', resolution='15m')
```

If we wanted to change the exchange we just need to instantiate a new strategy:

```python

coinbase_pro = CoinbasePro()
s = Strategy(coinbase_pro)

s.add_price_event(buy_or_sell, symbol='BTC-USD', resolution='1d')
s.add_price_event(buy_or_sell, symbol='COMP-USD', resolution='1d')
s.add_price_event(buy_or_sell, symbol='BTC-ETH', resolution='15m')
```

Better yet, we run your metrics not only individually per stock but also on the entire portfolio of price events.


## Modularization and Scaling

### Traditionally

Traditionally, your price events are tied to your market orders of a specific ticker or strategy, but we want to change that 

### Using Blankly

With Blankly, you can create a library of price events and plug and chug.

```python

from price_events import rsi_strategy, macd_strategy

coinbase_pro = CoinbasePro()
s = Strategy(coinbase_pro)

s.add_price_event(rsi_strategy, symbol='BTC-USD', resolution='1d')
s.add_price_event(rsi_strategy, symbol='COMP-USD', resolution='1d')
s.add_price_event(macd_strategy, symbol='BTC-ETH', resolution='15m')
```
