---
title: Blankly Bot
description: 'Usage & Functions of the Blankly Bot class'
position: 6
category: Framework
---

## What is it?

A `BlanklyBot` class is used for complex, multicore bots. The usage of this class is targeted towards those running hundreds or thousands of different bots on distributed computing systems. When a single process isn't fast enough to handle  the demands of a bot workflow - due to neural network usage, intense computation or high volume data aggregation, this is the structure that should be used.

## Motivation

The design of the `Blankly Bot` class is very exciting because it opens the door for incredibly complex trading logic. By design, code built in the class will be run on a seperate core of the computer. This allows complex and intensive logic to be created without lagging the other processes. Writing code in this module allows Blankly can take advantage of an unlimited number of cores. This gives access to data scientists to gather & interpret vast amounts of live data, or traders to create a diverse portfolio of bots.

Although they run independently, messages & updates can be sent between bots through the main thread. This opens the door to creating meshes of complex trading bots. Each one with custom and powerful logic. Models can be run not only on different currencies, but also on seperate exchanges. This can be advantage of in multiple ways. For example, arbitrage can be implmeneted betweent two bots, with very basic communication by reporting exchange price data, and transferring funds between wallets. Dictionaries of these can be created and all managed simultaneously.

## Components

### Creation

`BlanklyBot` inherits from the `Blankly.BlanklyBot` class. This inheritance is what makes the magic happen, and what is called when actually setting up the module.

### Provided Instance Variables

- `self.exchange_type`: Type of exchange i.e "binance" or "coinbase_pro"
- `self.currency_pair`: The default trading pair or identifier for the market (`'BTC-USD'`)
- `self.initial_state`: Information about the account the model is defaulted to running on.
- `self.user_preferences`: User preferences read in from [settings.json](/usage/settings.json)
- `self.Interface`: An [interface](/API/exchange_interface) pre-authenticated & setup for running on the default exchange
- `self.direct_calls`: The [direct calls](/frameworks/exchange#get_direct_calls---api) object for the given exchange
- `self.coinbase_pro_direct`: If you know that you're using Coinbase Pro, use this for IDE autofill. This is set equal to `self.direct_calls`
- `self.binance_direct`: If you know that you're using Binance, use this for IDE autofill. This is set equal to `self.direct_calls`
- `self.Ticker_Manager`: A [ticker manager](/websockets/ticker_manager) for easy price event generation
- `self.Orderbook_Manager`: An [orderbook manager](/websockets/orderbook_manager) for easy orderbook generation.

# Functions

## `get_state()`

Get the shared memory dictionary state.

### Response

| Description                                                  | Examples             | Type |
| ------------------------------------------------------------ | -------------------- | ---- |
| This returns the dictionary that is shared between this process and the main. | `{'heartbeat': 425}` | dict |

## `update_state(key, value)`

Write a key/value pair to the shared memory dictionary.

### Arguments

| Arg   | Description            | Examples | Type      |
| ----- | ---------------------- | -------- | --------- |
| key   | Key to set a value for | `'stop'` | immutable |
| value | Value for that key     | `True`   | any       |

## `remove_key(key)`

Remove key in the shared state dictionary.

| Arg  | Description                       | Examples | Type      |
| ---- | --------------------------------- | -------- | --------- |
| key  | Key to remove from the dictionary | `'stop'` | immutable |

