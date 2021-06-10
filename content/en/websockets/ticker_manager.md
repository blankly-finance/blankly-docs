---
title: Ticker Manager
description: 'Price event websocket feed.'
position: 3
category: Websockets
---

One of the most common areas of confusion with our code comes from mistaking what "ticker" means in the context of websockets. 
In finance, people often use the term tickers to describe the identifier for a certain stock or trading asset, like "BTC-USD" or "AAPL."
**In the context of websockets, a "tick" actually means an update - generally a change of price. The ticker manager organizes the price events you're watching across different exchanges and assets.**
This is true of the websocket managers we have in this module. They are each designed to organize a type of websocket connection.

*Websocket connections should be used only if strictly necessary for the trading strategy.* They require significantly higher CPU, bandwidth & memory usage when
compared to making simple REST requests on a set interval. This is especially true of orderbook websocket managers, because those sort the open orders to provide an accurate orderbook.

# Creation

A ticker manager can be created by calling `ticker = Blankly.TickerManager(default_exchange, default_currency)`

Because these websocket objects are designed to work across currencies and exchanges, specifying a default exchange and currency for the object to behave on can make interaction significantly simpler.
