---
title: Orderbook Manager
description: 'Live orderbook creation & management'
position: 28
version: 1.0
category: Websockets
---

The orderbook websocket object inherits from the `Websocket Manager` object, found [here](/websockets/websocket_manager). This means that all the functions described in that document will also work here.

*Websocket connections should be used only if strictly necessary for the trading strategy.* They require significantly higher CPU, bandwidth & memory usage when compared to making simple REST requests on a set interval. This is especially true of orderbook websocket managers, because those sort the open orders to provide an accurate orderbook.

Orderbook managers not only subscribe to the orderbook update feed from the exchange, each new message update provides the subscribed function an entirely new & updated orderbook. These messages are generally very large & arrive at an extremely high rate, so printing directly is not recommended. The high CPU, bandwidth and memory usage of these feeds make the strategies that rely on this suboptimal for cloud deployment.

The orderbook is currently organized to give this format:

```python
{
  "bids": {
    35600: 3.4,
    23400: 1.5
  },
  "asks": {
    54000: 2.1,
    45000: 5.3
  }
}
```

Where they key/value pairs indicate `price: quantity at that price`

## Creation

An orderbook manager can be created by calling `ticker = blankly.OrderbookManager(default_exchange, default_currency)`.

Because these websocket objects are designed to work across currencies and exchanges, specifying a default exchange and currency for the object to behave on can make interaction significantly simpler.

This call will also automatically switch channels to use the correct subscription for your exchange.

This will also construct orderbooks within the object that can be reported to your callback functions.

| Arg              | Description                                                  | Examples                        | Type |
| ---------------- | ------------------------------------------------------------ | ------------------------------- | ---- |
| default_exchange | Fill with a default exchange for the manager to use when no overrides are given later. | `'coinbase_pro'` or `'binance'` | str  |
| default_currency | Fill with a default asset for the manager to use when no overrides are given later. | `'BTC-USD'` or `'XLM-USD'`      | str  |

### Response

| Description                  | Examples                                                     | Type             |
| ---------------------------- | ------------------------------------------------------------ | ---------------- |
| An `OrderbookManager` object | `manager = blankly.OrderbookManager('coinbase_pro', 'BTC-USD')` | OrderbookManager |

# Functions

## `create_orderbook(callback, symbol=None, override_exchange=None)`

Create a new orderbook feed.

### Arguments

| Arg               | Description                                                  | Examples                         | Type     |
| ----------------- | ------------------------------------------------------------ | -------------------------------- | -------- |
| callback          | Function with argument that accepts a single json-type message. | `price_event` function reference | callable |
| symbol            | Override the default symbol and create the websocket this currency. | `'BTC-USD'` or `'XLM-USD'`       | str      |
| override_exchange | Override the default exchange and create the websocket on this exchange. | `'coinbase_pro'` or '`binance`'  | str      |

### Response

| Description             | Examples                                            | Type   |
| ----------------------- | --------------------------------------------------- | ------ |
| A blankly Ticker object | `websocket = blankly.create_orderbook(price_event)` | Ticker |

## `append_orderbook_callback(callback_object, override_symbol=None, override_exchange=None)`

Because the storing, sorting and aggregation of order books works as an intermediary between the websocket and the user, this function is added so that it's possible to append functions to that intermediary.

To emphasize this point, if you use the `.append_callback()` function found in the `Websocket Manager`, on an orderbook websocket, the appended callback would only receive single-line orderbook updates from the exchange, not a full & sorted book. In contrast, callbacks appended using this function would receive the full orderbook.

### Arguments

| Arg               | Description                                                  | Examples                         | Type     |
| ----------------- | ------------------------------------------------------------ | -------------------------------- | -------- |
| callback          | Function with argument that accepts a single json-type message. | `price_event` function reference | callable |
| symbol            | Override the default symbol and create the websocket this currency. | `'BTC-USD'` or `'XLM-USD'`       | str      |
| override_exchange | Override the default exchange and create the websocket on this exchange. | `'coinbase_pro'` or '`binance`'  | str      |

## `get_most_recent_orderbook(override_symbol=None, override_exchange=None)`

Get the most recent orderbook under a currency and exchange.

### Arguments

| Arg               | Description                                                  | Examples                        | Type |
| ----------------- | ------------------------------------------------------------ | ------------------------------- | ---- |
| symbol            | Override the default symbol and create the websocket this currency. | `'BTC-USD'` or `'XLM-USD'`      | str  |
| override_exchange | Override the default exchange and create the websocket on this exchange. | `'coinbase_pro'` or '`binance`' | str  |

### Response

| Description             | Examples                                                     | Type |
| ----------------------- | ------------------------------------------------------------ | ---- |
| An orderbook dictionary | `{"buy": {35600: 3.4,23400: 1.5},"sell": {54000: 2.1,45000: 5.3}}` | dict |

