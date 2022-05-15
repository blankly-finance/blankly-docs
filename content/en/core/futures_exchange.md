---
title: Futures Exchange
description: 'Authenticate and interact with a representation of your exchange.'
position: 13
version: 1.0
category: Framework
---

The Futures Exchange object is similar to the Exchange object, except it is designed to work with exchanges or brokerages
that trade perpetual futures. For example, Blankly supports both Binance and BinanceFutures objects, for SPOT markets and
Perpetual Futures respectively.

## Creation

Because this is designed to work with each exchange, the creation is different depending on usage & goal.

`from blankly import futures`

**Binance**

`exchange = futures.BinanceFutures()`

**FTX**

`exchange = futures.FTXFutures()`

### Arguments

| Arg            | Description                                                  | Examples              | Type |
| -------------- | ------------------------------------------------------------ | --------------------- | ---- |
| portfolio_name | Optionally fill this with a reference to a portfolio inside `keys.json`. | `'my cool portfolio'` | str  |
| keys_path      | Optionally fill this with a path to the `keys.json` file.    | `'./keys.json'`       | str  |
| settings_path  | Optionally fill this with a path to the `settings.json` file | `'./settings.json'`   | str  |

### Response

| Description        | Examples                               | Type                    |
| ------------------ |----------------------------------------|-------------------------|
| An exchange object | `scheduler = futures.BinanceFutures()` | FuturesExchange object. |

# Functions

## `get_name()`

Get the name of the portfolio that the exchange object is using.

### Response

| Description                                | Examples              | Type |
| ------------------------------------------ | --------------------- | ---- |
| The name of the portfolio from `keys.json` | `'my_cool_portfolio'` | str  |

## `get_type()`

Get the type of exchange that the interface is running on.

### Response

| Description                          | Examples                             | Type |
| ------------------------------------ |--------------------------------------| ---- |
| A string identifier for the exchange | `'binance_futures'`, `'ftx_futures'` | str  |

## `preferences`

Get the preferences dictionary that the exchange class is using.

### Response

| Description                            | Examples                            | Type |
|----------------------------------------|-------------------------------------| ---- |
| A dictionary with defined preferences. | See [here](/config/settings.json).  | str  |

## `get_interface()`

Get the authenticated interface object (very important).

### Response

| Description                                                                                  | Examples                            | Type                     |
|----------------------------------------------------------------------------------------------| ----------------------------------- |--------------------------|
| This gives the actual interface object to use. See [here](/core/futures_exchange_interface). | All interfaces have identical calls | FuturesExchangeInterface |

## `calls`

This is an important field that allows the user to get the direct, unfiltered API calls to the exchange. 
This function can be used to bypass the user interface & opens up all implemented calls which go far beyond the scope of the interface.

### Response

| Description                                               | Examples | Type                |
| --------------------------------------------------------- | -------- | ------------------- |
| A direct calls object which bypasses all Blankly features | `API`    | Various API objects |