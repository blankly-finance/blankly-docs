---
title: Backtest Result
description: 'Organized result class for backtesting systems'
position: 28
version: 1.0
category: Utilities

---

The backtest result is designed to give the user full access to all the information produced in a backtest. This creates a pipeline allowing the user rapid iteration or neural network training on outputs.

## Creation

The `BacktestResult` is always returned by a successful `strategy.backtest()` call.

# Functions

## `get_account_history() -> pd.DataFrame`

### Response

| Description                                                  | Examples                                                     | Type         |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------ |
| The account history DataFrame contains the user account values at every strategy function call. There is a row for queries for any asset and variable timings. Do not rely on this DataFrame having homogenous time spacing between each row, if using metrics & indicators, evaluate on the resampled account value DataFrame. | `0     2.000000  100000.00  1.599354e+09        120266.140000` | pd.DataFrame |

## get_returns() -> pd.DataFrame

### Response

| Description                                                  | Examples                         | Type         |
| ------------------------------------------------------------ | -------------------------------- | ------------ |
| This returns a DataFrame with a time and value column. The epoch times on this DataFrame are resampled to follow the `resample_account_value_for_metrics` setting in `backtest.json`. The first value will always be `NaN` because no change can ever be calculated for the first value. This is useful for indicators & metrics. | `0    1.599354e+09          NaN` | pd.DataFrame |

## get_resampled_account() -> pd.DataFrame

### Response

| Description                                                  | Examples                         | Type         |
| ------------------------------------------------------------ | -------------------------------- | ------------ |
| This returns a DataFrame similar to that returned by `get_account_history()`. However, the epoch times on this DataFrame are resampled to follow the `resample_account_value_for_metrics` setting in `backtest.json`. This is useful for indicators & metrics. | `0    1.599354e+09          NaN` | pd.DataFrame |

## get_user_callback_results() -> dict

### Response

| Description                                                  | Examples                       | Type |
| ------------------------------------------------------------ | ------------------------------ | ---- |
| Get the results of any callback defined by the user as a dictionary. The key/value pairs will be organized by the user function name and the value returned | `{'custom_function': 2.51341}` | dict |

## get_metrics() -> dict

### Response

| Description                                                  | Examples                                 | Type |
| ------------------------------------------------------------ | ---------------------------------------- | ---- |
| Get a dictionary with key/value pairs, each representing built in blankly metrics valuations. These keys will always be added unless a failure occurs during the calculation. | `{'cagr': 0.647633, 'sortino': 1.24808}` | dict |
