---
title: Utilities
description: 'Useful utility functions built into blankly'
position: 1
category: Utilities
---

These are useful utility functions that simplify interactions with the blankly module.

## `epoch_from_ISO8601(ISO8601) -> float`

Get the epoch time from an iso string.

### Arguments

| Arg     | Description    | Examples             | Type |
| ------- | -------------- | -------------------- | ---- |
| ISO8601 | ISO8601 string | 2021-06-06T23:38:27Z | str  |

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

## `to_blankly_coin_id(asset_id, exchange, quote_guess=None) -> str`

Convert an asset id returned by an exchange to one that can be easily parsed & manipulated by blankly. This generally means adding a "-" between the quote and base pairs.

### Arguments

| Arg         | Description                                                  | Examples                    | Type |
| ----------- | ------------------------------------------------------------ | --------------------------- | ---- |
| asset_id    | The identifier or trading pair returned by the non-conforming exchange. | "BTCUSD" or "XLMUSD"        | str  |
| exchange    | The identifier for the exchange the trading pair comes from  | "coinbase_pro" or "binance" | str  |
| quote_guess | An optional argument that allows the function to more easily parse the trading pair. If left blank, this will attempt applying a list of known quotes. | "USD" if guessing "BTCUSD"  | str  |

### Response

| Description                                         | Examples               | Type |
| --------------------------------------------------- | ---------------------- | ---- |
| A asset id string that follows blankly conventions. | "BTC-USD" or "XLM-USD" | str  |

## `to_exchange_coin_id(blankly_coin_id, exchange)`

Turn a blankly asset id into one that can be used by other exchanges.

### Arguments

| Arg             | Description                                                  | Examples                    | Type |
| --------------- | ------------------------------------------------------------ | --------------------------- | ---- |
| blankly_coin_id | Blankly formatted asset id for a particular currency.        | "BTC-USD" or "XLM-USD"      | str  |
| exchange        | The identifier for the exchange to convert the trading pair to. | "coinbase_pro" or "binance" | str  |

### Response

| Description                                                  | Examples              | Type |
| ------------------------------------------------------------ | --------------------- | ---- |
| An asset id that follows the specified exchange's conventions. | "BTCUSD" or "XLM-USD" | str  |

## `get_base_currency(blankly_coin_id)`

Get the base asset from the blankly trading pair.

### Arguments

| Arg             | Description                                           | Examples               | Type |
| --------------- | ----------------------------------------------------- | ---------------------- | ---- |
| blankly_coin_id | Blankly formatted asset id for a particular currency. | "BTC-USD" or "XLM-USD" | str  |

### Response

| Description                                   | Examples                                     | Type |
| --------------------------------------------- | -------------------------------------------- | ---- |
| The base asset of the specified trading pair. | "BTC" from "BTC-USD" or "XLM" from "XLM-USD" | str  |

## `get_quote_currency(blankly_coin_id)`

Get the quote asset from the blankly trading pair.

### Arguments

| Arg             | Description                                           | Examples               | Type |
| --------------- | ----------------------------------------------------- | ---------------------- | ---- |
| blankly_coin_id | Blankly formatted asset id for a particular currency. | "BTC-USD" or "XLM-USD" | str  |

### Response

| Description                                    | Examples                                     | Type |
| ---------------------------------------------- | -------------------------------------------- | ---- |
| The quote asset of the specified trading pair. | "USD" from "BTC-USD" or "USD" from "XLM-USD" | str  |

