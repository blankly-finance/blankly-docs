---
title: Introduction
description: ''
position: 1
category: Introduction
features:
    - Full REST API support for non-margin accounts on listed exchanges
    - Ticker websocket support
    - Order book websocket support
    - Fully multiprocessed bots with flexible arguments
    - Quickstart access for interacting with exchanges
    - Support for multiple portfolios on multiple exchanges, all independently
    - Multi-process communication
    - Long term and high resolution historical data downloads as pandas dataframes
    - Single pip module (`pip install Blankly`)
    - Asynchronous callbacks from ticker feeds
    - ZeroRPC server to report to Javascript or React **
    - Easy access to raw API calls
    - Customizable circular buffer websocket feeds
    - Support for Coinbase Pro & Binance sandbox modes
    - Instant paper trade wrapper for supported exchanges
    - Run scheduled functions natively
    - Logs for websocket feeds
    - Status management for purchases
    - Create strategies using an event-based framework
    - Instantly backtest your strategies (`strategy.backtest(to='1y')`)
    - Automatic price downloads & caching for use in backtests
    - Interface that allows calls to each supported exchange to be identical
	
---

## We're making quantitative finance more accessible for everyone

We originally started the Blankly trading module in December 2020. Far before it took the form as it is today, it was just a way of learning how to make requests to API endpoints and mess with the outputs. Today it's a complete quantitative development platform with hundreds of users.

Blankly aims to remove the barriers when developing quantitative models. Writing well tested & stable code can be time consuming and difficult. Many current solutions also often force you to use online IDEs or only allow limited API calls through their servers. They diminish the user experience in an effort to hide the source code. Blankly doesn't do that. We give you the same tools for free and the code that makes it work. We allow you to build how you want and run anywhere. 
We try to avoid complex docker configurations, Gradle scripts, or complex configurations. We want our module to be usable out of the box but still provide infinite customization and powerful abilities. Our goal is to write code so simple and powerful that anyone - from the python beginner to the professional developer - can take advantage of features previously inaccessible. We can't wait to see what you make and how you contribute. Thanks for being a part of the Blankly family.


## Features

<list :items="features"></list>
