---
title: Overview
description: 'Blankly makes it extremely easy for you to build and deploy your models at scale, allowing you to write your code once and run it on any exchange. Check out our docs for more examples.'
position: 1
version: 1.0
category: Getting Started
---

<blockquote> Blankly is making quantitative finance more accessible for everyone </blockquote>

<iframe className="mx-auto m-10 rounded-md shadow-xl" width="100%" height="400" src="https://www.youtube.com/embed/qyST9CxLNPY" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

## The Quick Run-Down

Blankly is a package that allows you to rapidly build and deploy trading models at scale in the cloud. We've built the platform that enables you to backtest, paper trade, sandbox test, and deploy live cross-exchange without modifying a single line of trading logic.

We abstract away all the code related to connecting to exchanges (i.e. Coinbase Pro, Binance, and Stock Exchanges), order submission, and order book and price data (historical and real-time at your designated resolution) so that you can focus on building your models. 

<alert type="success">
Our goal is to take what originally takes 3-4 months of scrounging for data, connecting endpoints, and more, and make it only a few lines of code so that your workflow is optimized and easy
</alert>

![Overview Image](https://firebasestorage.googleapis.com/v0/b/blankly-docs-images.appspot.com/o/overview%2Fpackage-overview.png?alt=media&token=917d757f-1c02-4d91-9b04-d8891291ed05)


### One Codebase, Cross-Exchange, Trading Multiple Entities

Blankly is the only package on the market that allows you to build a model once and allow it to run on any supported exchange and trading multiple entities at a time.
Write logic once and trade `MSFT`, `AAPL`, and `BTC-USD` from the same file. 

We support all the major cryptocurrencies through Coinbase and Binance, all equity markets through Alpaca, and Forex through OANDA. Blankly makes it as simple as one line to convert an existing strategy or bot trading on one exchange into another. 

### Optimized for Performance at Scale

We've designed Blankly to run extraordinarily efficiently - allowing robust trading logic to run with less than 1% CPU consumption. Furthermore, by integrating libraries written in C, we use all the power that python provides to streamline your development and ensure that your models are always up and running.

### Easy Integration with Existing Codebases

Blankly makes it extremely easy to integrate with your existing machine learning models, deep learning models, or simple trading bots. Create `Blankly.Strategy` objects and add a `price_event`. Pass the necessary data to your model, and you're golden.

```python
import blankly
from blankly.strategy import Strategy, StrategyState
from model import my_awesome_model


def init(symbol: str, state: StrategyState):
    # Every price event will have a separate version of this
    state.variables['owns_a_position'] = False

    # Download price history in the init - get last 50 days worth of price data
    state.variables['history'] = state.interface.history(symbol, 50, '1d')['close'].to_list()


def price_event(price: float, symbol: str, state: StrategyState):
    # Pull our interface from the state
    interface = state.interface

    # Save the price update
    state.variables['history'].append(price)

    # Easily integrate your model
    decision = my_awesome_model(state.variables['history'])

    # buy or sell based on that decision
    if decision:
        interface.market_order(symbol, 'buy', int((0.25 * interface.cash)/price))
        state.variables['owns_a_position'] = True
    elif state.variables['owns_a_position'] and not decision:
        # Sell it all if you get a sell signal
        amt = interface.account[state.base_asset]['available']
        interface.market_order(symbol, 'sell', int(amt))
        state.variables['owns_a_position'] = False


c = blankly.Alpaca()
s = Strategy(c)

s.add_price_event(price_event,
                  symbol='MSFT',
                  resolution='20s',
                  init=init)

s.start()

```

### Easy Access to Historical Data

Past methods of getting historical data relied on scrounging different data sources and using other packages, including `yfinance` or paid providers like `polygon.io`, and each method of gathering data was different. Blankly is unifying historical data gathering so that it's the same code to grab the necessary data that you need. We currently directly connect with Coinbase Pro, Binance, and Alpaca for historical data (15-minute delay due for Alpaca unless a premium key), but will eventually be releasing our own `blankly.data` package.

### Built-In Backtesting

Don't worry about importing another library or configuring your model to fit into a backtesting code. We handle that all for you under our `Strategy` class. Simply run `s.backtest()`, and you can rapidly improve your models and get all the information you want. For more information, check out our [backtest docs](/core/strategy)

### Customization for Any Level

Whether you are new to quantitative finance, need a simple integration, want to deploy your models as fast as possible, or customize Blankly for your needs, we make it extremely useful for you to extend Blankly and adapt it for your use cases. We've modularized Blankly and optimized it for as many use cases as possible. 

## Goals
### Any Exchange

Our goal with Blankly is to enable it to run on any and every exchange across cryptocurrencies, equity markets, and foreign exchange. One codebase for any exchange.

### Any Model Design

We want any model running at any resolution to be possible with Blankly, making it the one-stop fastest way of building and deploying models at scale.

### Simplicity 

We want Blankly to be simple to use but powerful in scope. That's why we're putting so much effort into every detail of our docs and our code.
## Motivation

We originally started the Blankly trading module in December 2020. Far before it took the form as it is today, it was just a way of learning how to make requests to API endpoints and mess with the outputs. Today it's a complete quantitative development platform with hundreds of users.

Blankly aims to remove the barriers when developing quantitative models. Writing well-tested & stable code can be time-consuming and difficult. Many current solutions often force you to use online IDEs or only allow limited API calls through their servers. They diminish the user experience to hide the source code. Blankly doesn't do that. We give you the same tools for free and the code that makes it work. We allow you to build how you want and run anywhere.
We try to avoid complex docker configurations, Gradle scripts, or confusing configurations. We want our module to be usable out of the box but still provide infinite customization and powerful abilities. Our goal is to write code so simple and powerful that anyone - from the python beginner to the professional developer - can take advantage of features previously inaccessible. We can't wait to see what you make and how you contribute. Thanks for being a part of the Blankly family.


## Ecosystem

Blankly is actively developed and maintained full-time by a core team. Its ecosystem is guided by a growing community of developers and contributors who influence its growth and future. Developers and companies small and large use Blankly to build their models across all infrastructures.

<!-- ### Join the Community

Get up and running with our growing developer community:

*  -->

## License

Blankly is a free and open source project, released under the permissible LGPL license. This means it can be used in closed-source personal or commercial projects for free. However, because of the high piracy rate for this type of code, any modifications to Blankly source code (stuff with the LGPL header) must be made open sourced for everybody. Here's how wikipedia says it: "Any developer who modifies an LGPL-covered component is required to make their modified version available under the same LGPL license."

We hope to move to the more permissible Apache License in the future.

This is not legal advice.

This documentation content (found in the [blankly-docs](https://github.com/Blankly-Finance/blankly-docs) repo) is licensed under the [Apache 2 license](https://www.apache.org/licenses/LICENSE-2.0).
