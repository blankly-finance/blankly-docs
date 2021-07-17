---
title: Overview
description: ''
position: 1
version: 1.0
category: Getting Started
---

<blockquote> Blankly is making quantitative finance more accessible for everyone </blockquote>

## The Quick Run-Down

Blankly is a package that allows you to rapidly build and deploy trading models at scale in the cloud. We abstract away all the code related to connecting to exchanges (i.e. Coinbase Pro, Binance, and Stock Exchanges), order submission (Limit, Market, and Stop), and order book and price data (historical and real-time at your designated resolution) so that you can focus on building your models. 

<alert type="success">
Our goal is to take what originally takes 3-4 months of scrounging for data, connecting endpoints, and more, and make it only a few lines of code so that your workflow is optimized and easy
</alert>


### One Codebase, Any Exchange, Trading Multiple Entities

Blankly is the only package on the market that allows you to build a model once and allow it to run on any supported exchange and trading multiple entities at a time.
You can trade `MSFT`, `AAPL`, `PLTR` all from a single code-file with three lines of code. 

We support all the major cryptocurrencies through Coinbase and Binance along with all equity markets through Alpaca (we'll be adding support for Forex through OANDA soon). 
Blankly makes it as simple as one line to convert an existing strategy or bot trading on one exchange into another. 

### Optimized for Performance at Scale

We've designed Blankly to work well and really well, reducing CPU usage to a mere 1% so that your model can do what it needs to do. We make use of all the power that python provides to really streamline your development and ensure that your models are always up and running.

### Easy Integration with Existing Codebases

Blankly makes it extremely easy to integrate with any of your existing machine learning models, deep learning models, or simple trading bots. Simply create `Blankly.Strategy` objects as as add a `price_event` and pass the necessary data to your model and you're golden.

```python
import Blankly
from Blankly.strategy import Strategy, StrategyState
from model import MyAwesomeModel


def init(symbol: str, state: StrategyState):
    # initialize per price event state
    state.variables['has_buy_order'] = False

def price_event(price: float, symbol: str, state: StrategyState):
    interface: Blankly.Interface = state.interface
    # get last 50 days worth of price data 
    history = interface.history(symbol, 50, '1d')

    # easily integrate your model
    decision = MyAwesomeModel(history)

    # buy or sell based on that decision
    if decision:
        interface.market_order('buy', 0.25 * interface.cash)
        state.variables['has_buy_order'] = True
    else if state.variables['has_buy_order'] and not decision:
        amt = interface.account[currency_pair].available
        interface.market_order('sell', amt)
        state.variables['has_buy_order'] = False

c = Blankly.Alpaca()
s = Strategy(c)

s.add_price_event(price_event, 
    currency_pair='MSFT', 
    resolution='1d'
    init=init)
```

### Easy Access to Historical Data

Past methods of getting historical data relied on scrounging different data sources and using other packages including `yfinance` or paid providers like `polygon.io`, and each method of gathering data was different. Blankly is unifying historical data gathering so that it's the same code to grab the necessary data that you need. We currently directly connect with Coinbase Pro, Binance, and Alpaca for historical data (15 minute delay due for Alpaca unless a premium key), but will eventually be releasing our own `blankly.data` package.

### Built-In Backtesting

Don't worry about importing another library or configuring your model to fit into a backtesting code. We handle that all for you under our `Strategy` class. Simply run `s.backtest()` and you can rapidly improve your models and get all the information that you want. For more information, check out our [backtest docs](/core/strategy)

### Customization for Any Level

Whether you are new to quantitative finance, need a simple integration, want to deploy your models as fast as possible, or customize Blankly for your needs. We make it extremely useful for you to extend Blankly and adapt it for your use cases. We've modularized Blankly and optimized it for as many use cases as possible. 

## Goals
### Any Exchange

Our goal with Blankly is to enable it to run on any and every exchange across cryptocurrencies, equity markets, and foreign exchange. One codebase for any exchange.

### Any Model Design

We want any model running at any resolution to be possible with Blankly, making it the one-stop fastest way of building and deploying models at scale.

### Simplicity 

We want Blankly to simple to use but powerful in scope. That's why we're putting so much effort into every detail of our docs and our code.
## Motivation

We originally started the Blankly trading module in December 2020. Far before it took the form as it is today, it was just a way of learning how to make requests to API endpoints and mess with the outputs. Today it's a complete quantitative development platform with hundreds of users.

Blankly aims to remove the barriers when developing quantitative models. Writing well tested & stable code can be time consuming and difficult. Many current solutions also often force you to use online IDEs or only allow limited API calls through their servers. They diminish the user experience in an effort to hide the source code. Blankly doesn't do that. We give you the same tools for free and the code that makes it work. We allow you to build how you want and run anywhere. 
We try to avoid complex docker configurations, Gradle scripts, or complex configurations. We want our module to be usable out of the box but still provide infinite customization and powerful abilities. Our goal is to write code so simple and powerful that anyone - from the python beginner to the professional developer - can take advantage of features previously inaccessible. We can't wait to see what you make and how you contribute. Thanks for being a part of the Blankly family.


## Ecosystem

Blankly is actively developed and maintained full-time by a core team, and its ecosystem is guided by an growing community of developers and contributors who continue to influence its growth and future. Developers and companies small and large use Blankly to build their models across all infrastructures.

<!-- ### Join the Community

Get up and running with our growing developer community:

*  -->

## License

Blankly is a free and open source project, released under the permissable MIT license. This means it can be used in personal or commercial projects for free. MIT is the same license used by such popular projects as jQuery and Ruby on Rails.

This documentation content (found in the [blankly-docs](https://github.com/Blankly-Finance/blankly-docs) repo) is licensed under the [Apache 2 license](https://www.apache.org/licenses/LICENSE-2.0).
