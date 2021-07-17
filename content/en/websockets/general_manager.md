---
title: General Manager
description: 'Generalized websocket manager for connecting to any user-specified channels'
position: 20
version: 1.0
category: Websockets
---

The general manager object inherits from the `Websocket Manager` object, found [here](/websockets/websocket_manager). This means that all the functions described in that document will also work here ***however, those inherited functions require that the channel that the function is referring to is also passed in.* **.

*Websocket connections should be used only if strictly necessary for the trading strategy.* They require significantly higher CPU, bandwidth & memory usage when compared to making simple REST requests on a set interval.

The general manager class is designed to allow easy subscription to any channel on any exchange. This is to provide flexibility beyond price events and orderbook events, and allow more in-depth analysis.

## Creation

`manager = blankly.GeneralManager('coinbase_pro', 'BTC-USD')`

Because these websocket objects are designed to work across currencies and exchanges, specifying a default exchange and currency for the object to behave on can make interaction significantly simpler.

| Arg              | Description                                                  | Examples                        | Type |
| ---------------- | ------------------------------------------------------------ | ------------------------------- | ---- |
| default_exchange | Fill with a default exchange for the manager to use when no overrides are given later. | `'coinbase_pro'` or `'binance'` | str  |
| default_currency | Fill with a default asset for the manager to use when no overrides are given later. | `'BTC-USD'` or `'XLM-USD'`      | str  |

### Response

| Description               | Examples                                                     | Type           |
| ------------------------- | ------------------------------------------------------------ | -------------- |
| A `GeneralManager` object | `manager = blankly.GeneralManager('coinbase_pro', 'BTC-USD')` | GeneralManager |

# Functions

## `create_general_connection(callback, channel, log=None, asset_id=None, override_exchange=None)`

| Arg               | Description                                                  | Examples                                | Type     |
| ----------------- | ------------------------------------------------------------ | --------------------------------------- | -------- |
| callback          | Function with argument that accepts a single json-type message. | `price_event` function reference        | callable |
| channel           | The websocket channel to create this connection on. Demos are given below. | `'aggTrade'`, `'ticker'`, `'heartbeat'` | str      |
| log               | Optionally fill this with a path to a log file to enable logging. | `'./btc_log.csv'`                       | str      |
| asset_id          | Override the default currency id and create the websocket this currency. | `'BTC-USD'` or `'XLM-USD'`              | str      |
| override_exchange | Override the default exchange and create the websocket on this exchange. | `'coinbase_pro'` or '`binance`'         | str      |

## Coinbase Pro Streams

A list of the Coinbase Pro websocket streams can be found below:

https://docs.pro.coinbase.com/#websocket-feed

### Example

To use a Coinbase Pro stream, such as `heartbeat`, simply create a general connection using that channel:

```python
# Demo callback object
def callback(message):
  print(message)

  
# Create the manager:
manager = blankly.GeneralManager('binance', 'BTC-USD')


# Create the connection
websocket = manager.create_general_connection(callback, 'heartbeat')
```

This will begin printing heartbeats from Coinbase Pro on that currency.

## Binance Streams

A list of the supported binance streams can be found below:

https://github.com/binance/binance-spot-api-docs/blob/master/web-socket-streams.md

### Example

To use a binance stream, such as `"btcusdt@aggTrade"`, simply create a general connection using that channel:

```python
# Demo callback object
def callback(message):
  print(message)

  
# Create the manager):
manager = blankly.GeneralManager('binance', 'BTC-USDT')


# Create the connection
websocket = manager.create_general_connection(callback, 'aggTrade')
```
