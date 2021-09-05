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

## `get_account_history() -> DataFrame`

### Response

