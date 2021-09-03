---
title: backtest.json
description: 'Key/value descriptions for backtest.json'
position: 7
version: 1.0
category: Config
---

The `backtest.json` file is used to specify settings for the backtest. 

This file is only necessary if running backtests.

This file can be placed in version control.

## Format

```json[backtest.json]
{
  "price_data": {
    "assets": [
      [
        "BTC-USD",
        1621726015,
        1622590015,
        3600.0
      ],
      [
        "BTC-USD",
        1591389962.5150762,
        1622925962.515081,
        3600.0
      ]
    ]
  },
  "settings": {
    "use_price": "close",
    "smooth_prices": false,
    "GUI_output": true,
    "show_tickers_with_zero_delta": false,
    "save_initial_account_value": true,
    "show_progress_during_backtest": true,
    "cache_location": "./price_caches",
    "resample_account_value_for_metrics": "1d",
    "quote_account_value_in": "USD",
    "ignore_user_exceptions": false
  }
}
```

### Price Data

| Key    | Description                                                  | Type |
| ------ | ------------------------------------------------------------ | ---- |
| assets | This contains lists that identify prices to include in the backtest. Each array is of the format `[asset_id, start_time_epoch, end_time_epoch, resolution]`. If there is no matching cache .csv, the backtest algorithm will automatically download the prices and save them to a file. New time frames & resolutions can be easily added by just appending to the assets list. Anything in this list will always be downloaded & kept permanently. | list |

### Settings

| Key                                | Description                                                  | Type        |
| ---------------------------------- | ------------------------------------------------------------ | ----------- |
| use_price                          | Which price to use in the downloaded price data. This can be `"high"`, `"low"`, `"open"`, `"close"` | str         |
| smooth_prices                      | This will create lines that connect the different price points, designed to mimic higher resolution data. | bool        |
| GUI_output                         | Show the bokeh GUI output. Disable this if rapidly or continually backtesting. | bool        |
| show_tickers_with_zero_delta       | Exclude all assets that had no change in their account values. Including all assets can make the GUI output slow and laggy, so this is disabled by default. | bool        |
| save_initial_account_value         | Write an extra line in the data frame that has all the initial account values before running any user-defined function. | bool        |
| show_progress_during_backtest      | This draws a progress bar in the terminal. Keep this disabled if printing while backtesting because it can clutter output. | bool        |
| cache_location                     | The path to the *folder* which will contain the price caches saved for backtesting. | str         |
| resample_account_value_for_metrics | Because backtest data can be input at a variety of resolutions, account value often needs to be recalculated at consistent intervals for use in metrics & indicators. This setting allows the specification of that consistent interval. The value can be set to `False` to skip any recalculation. | str or bool |
| quote_account_value_in             | Specify what quote value should be used when calculating the account value. This valuation can only be done for accounts that have price data that has been downloaded | str         |
| ignore_user_exceptions             | If enabled, this will treat exceptions in the backtesting class identically to how they're treated by a strategy. This means excepting any general exception and printing the traceback. If the setting is `False` the backtest will immediately exit on error and metrics will be generated. | bool        |

