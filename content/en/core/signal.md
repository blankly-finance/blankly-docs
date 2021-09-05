---
title: Signal
description: 'High level class for long term security monitoring'
position: 14
version: 1.0
category: Framework
---

The signal class is designed for long term and reliable market monitoring abilities. Instead of running on a single symbol, a signal will provide logic for a large number of symbols.

When contrasted with a strategy, a signal is designed to be stopped and started by external processes. When run locally, a separate thread attempts to closely replicate the starting/stopping behavior experienced by chron scheduling. When deployed live on blankly cloud, models are fully stopped and started.

## Creation

All signal behaviors & execution occurs in the object creation. Any consecutive logic is used to handle the output from the signal. **The signal will execute on construction.**

### Arguments

| Arg        | Description                                                  | Examples                                                     | Type         |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------ |
| exchange   | An [`exchange`](/core/exchange) object. This is what the signal will run on. | `exchange = blankly.CoinbasePro()`                           | Exchange     |
| evaluator  | A function with signature `(symbol: str, signal_state: blankly.SignalState)` used to perform user logic on that symbol. The function should return the user defined result (`return {'price': signal_state.interface.get_price(symbol)}`). | `def evaluator(symbol, signal_state: blankly.SignalState)`   | Callable     |
| symbols    | A list of signals to evaluate in the evaluator function.     | `['BTC-USD', 'ETH-USD']`                                     | list         |
| resolution | The time interval between signal runs.                       | `'1w'`, `'3d'` or `86400`                                    | str or float |
| init       | Optional setup code to run when the program starts. This should modify the passed signal state. | `def init(signal_state: blankly.SignalState)`                | Callable     |
| final      | Optional teardown code to run before the program finishes. This will be run every time the  signal finishes a cycle. | `def final(signalState: blankly.SignalState)`                | Callable     |
| formatter  | Optional formatting function that pretties the results form the evaluator. The user function should return a formatted string. | `def formatter(raw_results: dict, signal_state: blankly.SignalState)` | Callable     |

## Functions

### `notify(message: str = None)`

Send the formatted string to the user over both text and email. This requires configuration of the `notify.json` with both a user phone number and email.

| Arg     | Description                                                  | Examples            | Type |
| ------- | ------------------------------------------------------------ | ------------------- | ---- |
| message | An optional string to override the formatted message (if not filled it sends the formatted string created during the signal) | `'Output Override'` | str  |

