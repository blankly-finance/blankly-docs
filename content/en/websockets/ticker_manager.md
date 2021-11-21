---
title: Ticker Manager
description: 'Price event websocket feed.'
position: 31
version: 1.0
category: Websockets
---

The ticker object inherits from the `Websocket Manager` object, found [here](/websockets/websocket_manager). This means that all the functions described in that document will also work here.

One of the most common areas of confusion with our code comes from mistaking what "ticker" means in the context of websockets. 
In finance, people often use the term tickers to describe the identifier for a certain stock or trading asset, like "BTC-USD" or "AAPL."
**In the context of websockets, a "tick" actually means an update - generally a change of price. The ticker manager organizes the price events you're watching across different exchanges and assets.**
This is true of the websocket managers we have in this module. They are each designed to organize a type of websocket connection.

*Websocket connections should be used only if strictly necessary for the trading strategy.* They require significantly higher CPU, bandwidth & memory usage when compared to making simple REST requests on a set interval.

Any ticker connections to the supported exchanges will give this information for each trade:

```python
{
	'price': 51714.73, 
	'time': 1630896526.812199, 
    'trade_id': 208225105, 
    'symbol': 'BTC-USD', 
    'size': 0.0153549
}
```

There will also be an `'exchange_specific'` tag that will give any extra information given from any exchange.

# Creation

A ticker manager can be created by calling `ticker = blankly.TickerManager(default_exchange, default_currency)`.

Because these websocket objects are designed to work across currencies and exchanges, specifying a default exchange and currency for the object to behave on can make interaction significantly simpler.

This call will also automatically switch channels to use the correct subscription for your exchange.

### Arguments

| Arg              | Description                                                  | Examples                        | Type |
| ---------------- | ------------------------------------------------------------ | ------------------------------- | ---- |
| default_exchange | Fill with a default exchange for the manager to use when no overrides are given later. | `'coinbase_pro'` or `'binance'` | str  |
| default_currency | Fill with a default asset for the manager to use when no overrides are given later. | `'BTC-USD'` or `'XLM-USD'`      | str  |

### Response

| Description              | Examples                                                     | Type          |
| ------------------------ | ------------------------------------------------------------ | ------------- |
| A `TickerManager` object | `manager = blankly.TickerManager('coinbase_pro', 'BTC-USD')` | TickerManager |

### Example

```python
import blankly

def price_event(message):
  	"""
  	This callback function will be run for every single update
  	
  	The message variable has at least these keys:
  	{
  		'price': 51714.73, 
  		'time': 1630896526.812199, 
  		'trade_id': 208225105, 
  		'symbol': 'BTC-USD', 
  		'size': 0.0153549
  	}
  	"""
    print(message)


if __name__ == "__main__":
    # Create a manager - this object can be used for managing 		#  many websocket connections
    manager = blankly.TickerManager('coinbase_pro', 'BTC-USD')
    
    # This will create and start a websocket connection. It
    #  will use the defaults defined above unless overridden
    manager.create_ticker(price_event)
```

# Functions

## `create_ticker(callback, log=None, override_symbol=None, override_exchange=None)`

Create a new price event websocket feed.

### Arguments

| Arg               | Description                                                  | Examples                         | Type     |
| ----------------- | ------------------------------------------------------------ | -------------------------------- | -------- |
| callback          | Function with argument that accepts a single json-type message. | `price_event` function reference | callable |
| log               | Optionally fill this with a path to a log file to enable logging. | `'./btc_log.csv'`                | str      |
| override_symbol   | Override the default symbol and create the websocket this currency. | `'BTC-USD'` or `'XLM-USD'`       | str      |
| override_exchange | Override the default exchange and create the websocket on this exchange. | `'coinbase_pro'` or '`binance`'  | str      |

### Response

| Description             | Examples                                         | Type   |
| ----------------------- | ------------------------------------------------ | ------ |
| A blankly Ticker object | `websocket = blankly.create_ticker(price_event)` | Ticker |

