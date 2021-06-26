---
title: Strategy
description: 'Develop, backtest, paper trade, and run with the same code.'
position: 5
version: 1.0
category: Framework
---

The strategy class is the heart of the Blankly development framework. The goal when developing this class was to create something that could seamlessly integrate with the powerful user-objects that Blankly provides, while also giving an experience that barely goes beyond basic python. This means that functions can be asynchronous and multithreaded without the user ever noticing, while taking advantage of highly integrated exchange interfaces to make model development incredibly clean & simple.

Strategies created using the class can be instantly ***backtested, paper traded, sandbox tested, and deployed by only changing a single line*.**

## Creation

The object requires an authenticated [`exchange`](/core/exchange) object to function:

```python
# Authenticate coinbase pro strategy
coinbase_pro = Blankly.Coinbase_Pro()

# Use our strategy helper on coinbase pro
strategy = Blankly.Strategy(coinbase_pro)
```

### Arguments

| Arg           | Description                                                  | Examples                   | Type     |
| ------------- | ------------------------------------------------------------ | -------------------------- | -------- |
| exchange      | An [`exchange`](/core/exchange) object                 | `Blankly.Coinbase_Pro`     | Exchange |
| currency_pair | Optionally fill this to create a default for the websocket managers | `'BTC-USD'` or `'XLM-USD'` | str      |

### Response

| Description       | Examples                                    | Type     |
| ----------------- | ------------------------------------------- | -------- |
| A strategy object | `strategy = Blankly.Strategy(coinbase_pro)` | Strategy |

# Functions

## `add_price_event(callback: typing.Callable, currency_pair: str, resolution: str)`

Add a price event to the strategy. This will pass a price as well as a `price_event` function with args `(price, currency_pair)`

### Arguments

| Arg           | Description                                                | Examples                   | Type         |
| ------------- | ---------------------------------------------------------- | -------------------------- | ------------ |
| callback      | A callback function to add a price event for               | `Blankly.Coinbase_Pro`     | Exchange     |
| currency_pair | Fill this to inform the price_event which price to provide | `'BTC-USD'` or `'XLM-USD'` | str          |
| resolution    | Resolution to send prices to the user function.            | `3600` or `'15s'`          | str or float |

## `add_orderbook_event(callback: typing.Callable, currency_pair: str)`

Add a orderbook events to the strategy. This will pass a price as well as a full orderbook with args `(price, currency_pair)`

### Arguments

| Arg           | Description                                                | Examples                   | Type         |
| ------------- | ---------------------------------------------------------- | -------------------------- | ------------ |
| callback      | A callback function to add a price event for               | `Blankly.Coinbase_Pro`     | Exchange     |
| currency_pair | Fill this to inform the price_event which price to provide | `'BTC-USD'` or `'XLM-USD'` | str          |
| resolution    | Resolution to send prices to the user function.            | `3600` or `'15s'`          | str or float |

## `backtest(initial_values: dict = None, to: str = None, start_date: str = None, end_date: str = None, save: bool = False, settings_path: str = None, **kwargs)`

Turn this strategy into a backtest

### Arguments

| Arg            | Description                                                  | Examples                                                     | Type  |
| -------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ----- |
| initial_values | Optional dictionary of initial value sizes                   | `{ 'BTC': 3, 'USD': 5650}`                                   | dict  |
| to             | Optionally declare an amount of time before now to backtest  | `'5y'` or `'10h'`                                            | str   |
| start_date     | Optionally override argument "to" by specifying a start date | `'03/06/2018'`                                               | str   |
| end_date       | Optionally end the backtest at a date                        | `'03/06/2018'`                                               | str   |
| save           | Optionally save the price data references to the data required for the backtest as well as     overriden settings | `'True'` or `'False'`                                        | bool  |
| settings_path  | Optional path to the backtest.json file.                     | `'./backtest.json'`                                          | str   |
| **kwargs       | Use these `**kwargs` to set any of the backtesting `settings` defined in [`backtest.json`](/usage/backtest.json). | `strategy.backtest(use_price='open')`. You can also specify `save=True` to write these directly to `backtest.json`: | kwarg |

