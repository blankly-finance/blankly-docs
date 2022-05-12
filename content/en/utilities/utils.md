---
title: Utilities
description: 'Useful utility functions built into blankly'
position: 24
version: 1.0
category: Utilities
---

These are useful utility functions that simplify interactions with the blankly module.

## `epoch_from_ISO8601(iso8601) -> float`

Get the epoch time from an iso string.

### Arguments

| Arg     | Description    | Examples             | Type |
| ------- | -------------- | -------------------- | ---- |
| iso8601 | ISO8601 string | 2021-06-06T23:38:27Z | str  |

### Response

| Description                                                  | Examples   | Type  |
| ------------------------------------------------------------ | ---------- | ----- |
| An epoch number representation of the ISO time that as passed in. | 1623022707 | float |

## `ISO8601_from_epoch(epoch) -> str`

Get the ISO8601 string from epoch time.

### Arguments

| Arg   | Description       | Examples   | Type  |
| ----- | ----------------- | ---------- | ----- |
| epoch | Epoch time number | 1623022707 | float |

### Response

| Description                                                  | Examples             | Type |
| ------------------------------------------------------------ | -------------------- | ---- |
| An ISO representation of the epoch number that was passed in. | 2021-06-06T23:38:27Z | str  |

## `to_blankly_sybol(symbol, exchange, quote_guess=None) -> str`

Convert an asset id returned by an exchange to one that can be easily parsed & manipulated by blankly. This generally means adding a "-" between the quote and base pairs.

### Arguments

| Arg         | Description                                                  | Examples                    | Type |
| ----------- | ------------------------------------------------------------ | --------------------------- | ---- |
| symbol      | The identifier or trading pair returned by the non-conforming exchange. | "BTCUSD" or "XLMUSD"        | str  |
| exchange    | The identifier for the exchange the trading pair comes from  | "coinbase_pro" or "binance" | str  |
| quote_guess | An optional argument that allows the function to more easily parse the trading pair. If left blank, this will attempt applying a list of known quotes. | "USD" if guessing "BTCUSD"  | str  |

### Response

| Description                                         | Examples               | Type |
| --------------------------------------------------- | ---------------------- | ---- |
| A asset id string that follows blankly conventions. | "BTC-USD" or "XLM-USD" | str  |

## `to_exchange_symbol(blankly_symbol, exchange)`

Turn a blankly asset id into one that can be used by other exchanges. For example this will remove the `-` from `BTC-USDT` if `exchange='binance'`.

### Arguments

| Arg            | Description                                                  | Examples                    | Type |
| -------------- | ------------------------------------------------------------ | --------------------------- | ---- |
| blankly_symbol | Blankly formatted symbol for a particular currency.          | "BTC-USD" or "XLM-USD"      | str  |
| exchange       | The identifier for the exchange to convert the trading pair to. | "coinbase_pro" or "binance" | str  |

### Response

| Description                                                  | Examples              | Type |
| ------------------------------------------------------------ | --------------------- | ---- |
| An asset id that follows the specified exchange's conventions. | "BTCUSD" or "XLM-USD" | str  |

## `get_base_asset(symbol)`

Get the base asset from the blankly trading pair. This will give the `BTC` of `BTC-USD`

### Arguments

| Arg    | Description                                        | Examples                         | Type |
| ------ | -------------------------------------------------- | -------------------------------- | ---- |
| symbol | Blankly formatted asset id for a particular asset. | "BTC-USD" or "XLM-USD" or "MSFT" | str  |

### Response

| Description                             | Examples                                               | Type |
| --------------------------------------- | ------------------------------------------------------ | ---- |
| The base asset of the specified symbol. | "BTC" from "BTC-USD" or "XLM" from "XLM-USD" or "MSFT" | str  |

## `get_quote_asset(symbol)`

Get the quote asset from the blankly trading pair. This will get the `USD` of `BTC-USD`.

### Arguments

| Arg    | Description                                           | Examples                         | Type |
| ------ | ----------------------------------------------------- | -------------------------------- | ---- |
| symbol | Blankly formatted asset id for a particular currency. | "BTC-USD" or "XLM-USD" or "MSFT" | str  |

### Response

| Description                                    | Examples                                               | Type |
| ---------------------------------------------- | ------------------------------------------------------ | ---- |
| The quote asset of the specified trading pair. | "USD" from "BTC-USD" or "USD" from "XLM-USD" or "MSFT" | str  |

## `trunc(number: float, decimals: int) -> float`

Cleanly truncate a number to a certain number of decimals. This is very useful for interacting with exchange resolutions. 

**Using the `round()` function can create slippage & make a number to greater than an account value leading to an `Insufficient Funds` error**.

### Arguments

| Arg      | Description                | Examples                        | Type  |
| -------- | -------------------------- | ------------------------------- | ----- |
| number   | A float input              | `2.353244245` or `'459.435322'` | float |
| decimals | Number of decimals to keep | `2` or `'13'`                   | int   |

### Response

| Description                             | Examples                              | Type  |
| --------------------------------------- | ------------------------------------- | ----- |
| A truncated version of the input number | `blankly.trunc(2.3453243, 2) == 2.34` | float |

## `aggregate_candles(history: pd.DataFrame, aggregation_size: int)`

Given a set of high resolution candles, turn them into low resolution candles at a different interval. For example, turn 15 1-minute bars into 1 15-minute bar. Any remainder candles that don't evenly fit an interval are still aggregated into a final bar (which of course represents less data).

### Arguments

| Arg              | Description                                             | Examples                              | Type         |
| ---------------- | ------------------------------------------------------- | ------------------------------------- | ------------ |
| history          | A dataframe with `open, high, low, close, volume, time` | `open, high, low close, volume, time` | pd.DataFrame |
| aggregation_size | Number of bars to put into a single bar                 | `2` or `15`                           | int          |

### Response

| Description                                                  | Examples                              | Type         |
| ------------------------------------------------------------ | ------------------------------------- | ------------ |
| A dataframe with the original candles aggregated at the `aggregation_size` | `open, high, low close, volume, time` | pd.Dataframe |

## `count_decimals(number: float) -> int`

A simple & very useful function especially for order filters. Given a number such as `3.141` this will return the number of decimals of that number `3.141 -> 3`. An integer will give a zero value.

### Arguments

| Arg    | Description                                             | Examples         | Type         |
| ------ | ------------------------------------------------------- | ---------------- | ------------ |
| number | A float or integer value to find the number of decimals | `3.141` or `143` | int or float |

### Response

| Description                                 | Examples   | Type |
| ------------------------------------------- | ---------- | ---- |
| The number of decimals in the passed number | `4` or `0` | int  |
