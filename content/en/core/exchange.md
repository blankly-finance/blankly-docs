---
title: Exchange
description: 'Authenticate and interact with a representation of your exchange.'
position: 12
version: 1.0
category: Framework
---

The exchange object is designed to be an easy & homogeneous way to interact with each exchange or brokerage added to Blankly. Each object will contain a similar set of baseline functions outlined here.

## Creation

Because this is designed to work with each exchange, the creation is different depending on usage & goal.

**Coinbase Pro**

`exchange = blankly.CoinbasePro()`

**Binance**

`exchange = blankly.Binance()`

**Alpaca**

`exchange = blankly.Alpaca()`

### Arguments

| Arg            | Description                                                  | Examples              | Type |
| -------------- | ------------------------------------------------------------ | --------------------- | ---- |
| portfolio_name | Optionally fill this with a reference to a portfolio inside `keys.json`. | `'my cool portfolio'` | str  |
| keys_path      | Optionally fill this with a path to the `keys.json` file.    | `'./keys.json'`       | str  |
| settings_path  | Optionally fill this with a path to the `settings.json` file | `'./settings.json'`   | str  |

### Response

| Description        | Examples                             | Type             |
| ------------------ | ------------------------------------ | ---------------- |
| An exchange object | `scheduler = blankly.CoinbasePro()` | Exchange object. |

# Functions

## `get_name()`

Get the name of the portfolio that the exchange object is using.

### Response

| Description                                | Examples              | Type |
| ------------------------------------------ | --------------------- | ---- |
| The name of the portfolio from `Keys.json` | `'my_cool_portfolio'` | str  |

## `get_type()`

Get the type of exchange that the interface is running on.

### Response

| Description                          | Examples                                  | Type |
| ------------------------------------ | ----------------------------------------- | ---- |
| A string identifier for the exchange | `'binance'`, `'coinbase_pro'`, `'alpaca'` | str  |

## `get_preferences()`

Get the preferences dictionary that the exchange class is using.

### Response

| Description                                                  | Examples                                  | Type |
| ------------------------------------------------------------ | ----------------------------------------- | ---- |
| A dictionary with defined preferences. See [here](/config/settings.json). | `'binance'`, `'coinbase_pro'`, `'alpaca'` | str  |

## `get_interface()`

Get the authenticated interface object (very important).

### Response

| Description                                                  | Examples                            | Type               |
| ------------------------------------------------------------ | ----------------------------------- | ------------------ |
| This gives the actual interface object to use. See [here](/core/exchange_interface). | All interfaces have identical calls | ICurrencyInterface |

## `start_models(symbol=None)`

Used for multiprocessed bots. This calls the run functions of each appended multiprocessed model. See the multiprocessing demo for usage.

### Arguments

| Arg    | Description                                                  | Examples    | Type |
| ------ | ------------------------------------------------------------ | ----------- | ---- |
| symbol | Models are appended by reference to their asset. Optionally fill this with a reference to just start that single asset. | `'BTC-USD'` | str  |

## `get_model_state(self, symbol)`

Returns the shared memory dictionary from the requested multiprocessed model. This is the function used by the main process to understand what other processes are doing internally.

### Arguments

| Arg    | Description                                       | Examples    | Type |
| ------ | ------------------------------------------------- | ----------- | ---- |
| symbol | The asset identifier for the multiprocessed model | `'BTC-USD'` | str  |

### Response

| Description                                                  | Examples             | Type |
| ------------------------------------------------------------ | -------------------- | ---- |
| A shared dictionary that can be written to and read by both processes | `{'heartbeat': 231}` | dict |

## `get_full_state(self, symbol)`

Returns the shared memory dictionary from the requested multiprocessed model as well as an exchange API request that shows the state of the coin that the process is running on.

### Arguments

| Arg    | Description                                       | Examples    | Type |
| ------ | ------------------------------------------------- | ----------- | ---- |
| symbol | The asset identifier for the multiprocessed model | `'BTC-USD'` | str  |

### Response

| Description                                                  | Examples                                                     | Type |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ---- |
| A shared dictionary that can be written to and read by both processes | `{'model':{'heartbeat': 231}, "account": {"currency":"BTC","hold": 0.0,"available": 54.90091578}}` | dict |

## `write_value(symbol, key, value)`

Write a value to the shared memory dictionary. This can be used to communicate with other processes. Generally this is used for multiprocess bots.

### Arguments

| Arg    | Description                                                  | Examples    | Type      |
| ------ | ------------------------------------------------------------ | ----------- | --------- |
| symbol | Asset identifier for which bot to write the dictionary value. | `'BTC-USD'` | str       |
| key    | The key of the value to write                                | `'stop'`    | immutable |
| value  | Value to write to they key                                   | `'true'`    | any       |

## `append_model(model, symbol, args=None)`

Append a new `blankly.BlanklyBot` object to the exchange. This can be run with `.start_models()`. This is the append function for multiprocess bots.

### Arguments

| Arg    | Description                                                  | Examples                 | Type |
| ------ | ------------------------------------------------------------ | ------------------------ | ---- |
| model  | An object inheriting from `blankly.BlanklyBot`               | See multicore_bot.py     | Bot  |
| symbol | The asset to append the bot to                               | `'BTC-USD'`              | str  |
| args   | Optionally add *any* type which will be passed into the main function in the `Bot` class. This works well as a dictionary with key/value pairs that can give settings. | `{'check_interval': .5}` | any  |

## `get_direct_calls() -> API`

This is an important function that allows the user to get the direct, unfiltered API calls to the exchange. This function can be used to bypass the user interface & opens up all implemented calls which go far beyond the scope of the interface.

This is also pre-typed for each exchange which allows autofill when using this function.

### Response

| Description                                               | Examples | Type                |
| --------------------------------------------------------- | -------- | ------------------- |
| A direct calls object which bypasses all Blankly features | `API`    | Various API objects |


## `get_market_clock() -> dict` (Alpaca Specific)

This will get the current market clock (i.e. current market timestamp, whether or not it's open and when the next open and close will be) that's running for the U.S. stock exchanges. 

### Response

| Description                                               | Examples | Type                |
| --------------------------------------------------------- | -------- | ------------------- |
| A response displaying the current timestamp, whether the market is open or not, and when the next market open or close is. | `dict`    | View [this](https://alpaca.markets/docs/api-documentation/api-v2/clock/) for more detalis |