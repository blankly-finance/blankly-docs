---
title: Exchange
description: 'Authenticate and interact with a representation of your exchange.'
position: 7
version: 1.0
category: Framework
---

The exchange object is designed to be an easy & homogeneous way to interact with each exchange or brokerage added to Blankly. Each object will contain a similar set of baseline functions outlined here.

## Creation

Because this is designed to work with each exchange, the creation is different depending on usage & goal.

**Coinbase Pro**

`exchange = Blankly.CoinbasePro()`

**Binance**

`exchange = Blankly.Binance()`

**Alpaca**

`exchange = Blankly.Alpaca()`

### Arguments

| Arg            | Description                                                  | Examples              | Type |
| -------------- | ------------------------------------------------------------ | --------------------- | ---- |
| portfolio_name | Optionally fill this with a reference to a portfolio inside `keys.json`. | `'my cool portfolio'` | str  |
| keys_path      | Optionally fill this with a path to the `keys.json` file.    | `'./keys.json'`       | str  |
| settings_path  | Optionally fill this with a path to the `settings.json` file | `'./settings.json'`   | str  |

### Response

| Description        | Examples                             | Type             |
| ------------------ | ------------------------------------ | ---------------- |
| An exchange object | `scheduler = Blankly.CoinbasePro()` | Exchange object. |

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
| A dictionary with defined preferences. See [here](/usage/settings.json). | `'binance'`, `'coinbase_pro'`, `'alpaca'` | str  |

## `get_interface()`

Get the authenticated interface object (very important).

### Response

| Description                                                  | Examples                            | Type               |
| ------------------------------------------------------------ | ----------------------------------- | ------------------ |
| This gives the actual interface object to use. See [here](/API/exchange_interface). | All interfaces have identical calls | ICurrencyInterface |

## `start_models(coin_id=None)`

Used for multiprocessed bots. This calls the run functions of each appended multiprocessed model. See the multiprocessing demo for usage.

### Arguments

| Arg     | Description                                                  | Examples    | Type |
| ------- | ------------------------------------------------------------ | ----------- | ---- |
| coin_id | Models are appended by reference to their asset. Optionally fill this with a reference to just start that single asset. | `'BTC-USD'` | str  |

## `get_model_state(self, currency)`

Returns the shared memory dictionary from the requested multiprocessed model. This is the function used by the main process to understand what other processes are doing internally.

### Arguments

| Arg      | Description                                          | Examples    | Type |
| -------- | ---------------------------------------------------- | ----------- | ---- |
| currency | The currency identifier for the multiprocessed model | `'BTC-USD'` | str  |

### Response

| Description                                                  | Examples             | Type |
| ------------------------------------------------------------ | -------------------- | ---- |
| A shared dictionary that can be written to and read by both processes | `{'heartbeat': 231}` | dict |

## `get_full_state(self, currency)`

Returns the shared memory dictionary from the requested multiprocessed model as well as an exchange API request that shows the state of the coin that the process is running on.

### Arguments

| Arg      | Description                                          | Examples    | Type |
| -------- | ---------------------------------------------------- | ----------- | ---- |
| currency | The currency identifier for the multiprocessed model | `'BTC-USD'` | str  |

### Response

| Description                                                  | Examples                                                     | Type |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ---- |
| A shared dictionary that can be written to and read by both processes | `{'model':{'heartbeat': 231}, "account": {"currency":"BTC","hold": 0.0,"available": 54.90091578}}` | dict |

## `write_value(currency, key, value)`

Write a value to the shared memory dictionary. This can be used to communicate with other processes.

### Arguments

| Arg      | Description                                                  | Examples    | Type      |
| -------- | ------------------------------------------------------------ | ----------- | --------- |
| currency | Currency identifier for which bot to write the dictionary value. | `'BTC-USD'` | str       |
| key      | The key of the value to write                                | `'stop'`    | immutable |
| value    | Value to write to they key                                   | `'true'`    | any       |

## `append_model(model, coin_id, args=None)`

Append a new `Blankly.BlanklyBot` object to the exchange. This can be run with `.start_models()`

### Arguments

| Arg     | Description                                                  | Examples                 | Type |
| ------- | ------------------------------------------------------------ | ------------------------ | ---- |
| model   | An object inheriting from `Blankly.BlanklyBot`               | See multicore_bot.py     | Bot  |
| coin_id | The coin_id to append the bot to                             | `'BTC-USD'`              | str  |
| args    | Optionally add *any* type which will be passed into the main function in the `Bot` class. This works well as a dictionary with key/value pairs that can give settings. | `{'check_interval': .5}` | any  |

## `get_direct_calls() -> API`

This is an important function that allows the user to get the direct, unfiltered API calls to the exchange. This function can be used to bypass the user interface & opens up all implemented calls which go far beyond the scope of the interface.

### Response

| Description                                               | Examples | Type                |
| --------------------------------------------------------- | -------- | ------------------- |
| A direct calls object which bypasses all Blankly features | `API`    | Various API objects |

