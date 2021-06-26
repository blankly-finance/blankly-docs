---
title: Websocket Manager
description: 'Inherited object that contains universal interaction abilities'
position: 17
version: 1.0
category: Websockets
---

The websocket manager is at the top of the inheritance tree of the managers. This means that functions in here apply broadly & function in each of the managers. **Note that the only exception to this rule is the `GeneralManager` which will require a `channel` argument with all the functions given here.**

# Functions

## `close_all_websockets()`

Recursively iterate through order books and make sure they're all closed.

** Make sure to fill channel argument if using `GeneralManager`

## `get_ticker(currency_id, override_exchange=None)`

Get a websocket (`Ticker`) object attached to a currency.

### Arguments

| Arg               | Description                                                  | Examples                        | Type |
| ----------------- | ------------------------------------------------------------ | ------------------------------- | ---- |
| currency_id       | Fill with a default asset for the manager to use when no overrides are given later. | `'BTC-USD'` or `'XLM-USD'`      | str  |
| override_exchange | Optionally fill with a default exchange for the manager to use when no overrides are given later. | `'coinbase_pro'` or `'binance'` | str  |

** Make sure to fill channel argument if using `GeneralManager`

### Response

| Description                                                  | Examples                                    | Type   |
| ------------------------------------------------------------ | ------------------------------------------- | ------ |
| A `Ticker` object. Get the ticker object on a currency or exchange. | `websocket = Blankly.get_ticker('BTC-USD')` | Ticker |

## `get_all_tickers() -> dict`

Get the tickers object dictionary. This can be used for individual management, or to stop using the manager.

** Make sure to fill channel argument if using `GeneralManager`

### Response

| Description                                  | Examples                                        | Type |
| -------------------------------------------- | ----------------------------------------------- | ---- |
| The ticker dictionary that the manager uses. | `{'coinbase_pro':{'BTC-USD': <Ticker Object>}}` | dict |

## `append_callback(callback_object, override_currency=None, override_exchange=None)`

Append a callback directly to the websocket.

This bypasses all processing that manager class may do before returning to the user's main. For example with an orderbook feed, this will return he ticks instead of a stored orderbook. This can be very useful in working with multiple tickers.

### Arguments

| Arg               | Description                                                  | Examples                        | Type     |
| ----------------- | ------------------------------------------------------------ | ------------------------------- | -------- |
| callback_object   | New callback function to add to the object                   | `price_event`                   | callable |
| currency_id       | Optionally fill with a default asset for the manager to use when no overrides are given later. | `'BTC-USD'` or `'XLM-USD'`      | str      |
| override_exchange | Optionally fill with a default exchange for the manager to use when no overrides are given later. | `'coinbase_pro'` or `'binance'` | str      |

** Make sure to fill channel argument if using `GeneralManager`

## `is_websocket_open(override_currency=None, override_exchange=None) -> bool`

Check if the websocket attached to a currency is open.

### Arguments

| Arg               | Description                                                  | Examples                        | Type |
| ----------------- | ------------------------------------------------------------ | ------------------------------- | ---- |
| currency_id       | Optionally fill with a default asset for the manager to use when no overrides are given later. | `'BTC-USD'` or `'XLM-USD'`      | str  |
| override_exchange | Optionally fill with a default exchange for the manager to use when no overrides are given later. | `'coinbase_pro'` or `'binance'` | str  |

** Make sure to fill channel argument if using `GeneralManager`

### Response

| Description                                 | Examples          | Type |
| ------------------------------------------- | ----------------- | ---- |
| Boolean describing if the websocket is open | `True` or `False` | bool |

## `get_most_recent_time(override_currency=None, override_exchange=None)`

Get the most recent time associated with the most recent tick

### Arguments

| Arg               | Description                                                  | Examples                        | Type |
| ----------------- | ------------------------------------------------------------ | ------------------------------- | ---- |
| currency_id       | Optionally fill with a default asset for the manager to use when no overrides are given later. | `'BTC-USD'` or `'XLM-USD'`      | str  |
| override_exchange | Optionally fill with a default exchange for the manager to use when no overrides are given later. | `'coinbase_pro'` or `'binance'` | str  |

** Make sure to fill channel argument if using `GeneralManager`

### Response

| Description                                 | Examples          | Type |
| ------------------------------------------- | ----------------- | ---- |
| Boolean describing if the websocket is open | `True` or `False` | bool |

## `get_time_feed(override_currency=None, override_exchange=None)`

Get a time array associated with the ticker feed.

### Arguments

| Arg               | Description                                                  | Examples                        | Type |
| ----------------- | ------------------------------------------------------------ | ------------------------------- | ---- |
| currency_id       | Optionally fill with a default asset for the manager to use when no overrides are given later. | `'BTC-USD'` or `'XLM-USD'`      | str  |
| override_exchange | Optionally fill with a default exchange for the manager to use when no overrides are given later. | `'coinbase_pro'` or `'binance'` | str  |

** Make sure to fill channel argument if using `GeneralManager`

### Response

| Description                                 | Examples                                                    | Type |
| ------------------------------------------- | ----------------------------------------------------------- | ---- |
| A list of epoch times associated with ticks | `[1623356615.244464, 1623356616.244599, 1623356617.244478]` | list |

## `get_feed(override_currency=None, override_exchange=None)`

Get the full ticker array.

### Arguments

| Arg               | Description                                                  | Examples                        | Type |
| ----------------- | ------------------------------------------------------------ | ------------------------------- | ---- |
| currency_id       | Optionally fill with a default asset for the manager to use when no overrides are given later. | `'BTC-USD'` or `'XLM-USD'`      | str  |
| override_exchange | Optionally fill with a default exchange for the manager to use when no overrides are given later. | `'coinbase_pro'` or `'binance'` | str  |

** Make sure to fill channel argument if using `GeneralManager`

### Response

| Description                                            | Examples                                                     | Type |
| ------------------------------------------------------ | ------------------------------------------------------------ | ---- |
| A list of responses from the exchange inside a buffer. | `[{'type': 'heartbeat', 'last_trade_id': 0, 'product_id': 'BTC-USD', 'sequence': 26222011258, 'time': 1623356791.70079}, {'type': 'heartbeat', 'last_trade_id': 0, 'product_id': 'BTC-USD', 'sequence': 26222011927, 'time': 1623356792.700799}]` | list |

## `get_response(override_currency=None, override_exchange=None)`

Get the exchange's response to the request to subscribe to a feed.

### Arguments

| Arg               | Description                                                  | Examples                        | Type |
| ----------------- | ------------------------------------------------------------ | ------------------------------- | ---- |
| currency_id       | Optionally fill with a default asset for the manager to use when no overrides are given later. | `'BTC-USD'` or `'XLM-USD'`      | str  |
| override_exchange | Optionally fill with a default exchange for the manager to use when no overrides are given later. | `'coinbase_pro'` or `'binance'` | str  |

** Make sure to fill channel argument if using `GeneralManager`

### Response

| Description                                            | Examples                                                     | Type |
| ------------------------------------------------------ | ------------------------------------------------------------ | ---- |
| A list of responses from the exchange inside a buffer. | `{"type":"subscriptions","channels":[{"name":"heartbeat","product_ids":["BTC-USD"]}]}` | list |

## `close_websocket(override_currency=None, override_exchange=None)`

Close a websocket connection & thread.

### Arguments

| Arg               | Description                                                  | Examples                        | Type |
| ----------------- | ------------------------------------------------------------ | ------------------------------- | ---- |
| currency_id       | Optionally fill with a default asset for the manager to use when no overrides are given later. | `'BTC-USD'` or `'XLM-USD'`      | str  |
| override_exchange | Optionally fill with a default exchange for the manager to use when no overrides are given later. | `'coinbase_pro'` or `'binance'` | str  |

** Make sure to fill channel argument if using `GeneralManager`

## `restart_ticker(override_currency=None, override_exchange=None`

Restart a websocket after asking it to stop.

### Arguments

| Arg               | Description                                                  | Examples                        | Type |
| ----------------- | ------------------------------------------------------------ | ------------------------------- | ---- |
| currency_id       | Optionally fill with a default asset for the manager to use when no overrides are given later. | `'BTC-USD'` or `'XLM-USD'`      | str  |
| override_exchange | Optionally fill with a default exchange for the manager to use when no overrides are given later. | `'coinbase_pro'` or `'binance'` | str  |

** Make sure to fill channel argument if using `GeneralManager`

## `get_most_recent_tick(override_currency=None, override_exchange=None)`

Get the most recent ticker received.

### Arguments

| Arg               | Description                                                  | Examples                        | Type |
| ----------------- | ------------------------------------------------------------ | ------------------------------- | ---- |
| currency_id       | Optionally fill with a default asset for the manager to use when no overrides are given later. | `'BTC-USD'` or `'XLM-USD'`      | str  |
| override_exchange | Optionally fill with a default exchange for the manager to use when no overrides are given later. | `'coinbase_pro'` or `'binance'` | str  |

### Response

| Description                                                  | Examples                                                     | Type |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ---- |
| Get the most recent tick received by the client from the exchange. | `{'type': 'heartbeat', 'last_trade_id': 0, 'product_id': 'BTC-USD', 'sequence': 26222119970, 'time': 1623356989.244522}` | dict |

