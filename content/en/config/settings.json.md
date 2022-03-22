---
title: settings.json
description: 'Key/value descriptions for settings.json'
position: 39
version: 1.0
category: Config
---

The `settings.json` file is used to define global settings for the blankly module. Multiple settings can be used for different exchange objects by specifying which settings document to load in the constructor. This allows the dynamic inclusion of sandbox and non-sandbox exchanges in a single process. 

Note that blankly will always remember the most recently overridden path. If the path is overridden then on the next read of a `settings.json` file, it will always reuse the overridden path even if `override_path=None`. This is done so that classes like websockets can always use the most up to date settings.

This file can be placed in version control.

## Format

```json[settings.json]
{
  "settings": {
    "use_sandbox": false,
    "use_sandbox_websockets": false,
    "websocket_buffer_size": 10000,
    "test_connectivity_on_auth": true,

    "coinbase_pro": {
      "cash": "USD"
    },
    "binance": {
      "cash": "USDT",
      "binance_tld": "us"
    },
    "alpaca": {
      "websocket_stream": "iex",
      "cash": "USD",
      "enable_shorting": true,
      "use_yfinance": false
    },
    "oanda": {
      "cash": "USD"
    },
    "ftx": {
      "cash": "USDT"
    },
    "kucoin": {
      "cash": "USDT"
    }
  }
}
```

| Key                       | Description                                                  | Type  |
| ------------------------- | ------------------------------------------------------------ | ----- |
| account_update_time       | For multiprocessing. This describes how often should the process check the exchange to report status (unit is milliseconds). | float |
| use_sandbox               | Use your exchange's sandbox network for all REST calls. There is more info below for each exchange. | bool  |
| use_sandbox_websockets    | Because the volume can be incredibly low on sandbox servers, this is a separate setting to allow test REST requests while still working with high volume on the non-sandbox exchange. Coinbase Pro also occasionally turns off their websocket servers for the sandbox while leaving on the REST servers. | bool  |
| binance_tld               | This specifies the binance ending. Some examples include `us` or `com` for `binance.us` and `binance.com` respectively | str   |
| websocket_buffer_size     | This setting limits the amount of history that a websocket can hold to limit memory usage. For example, `10000` means that it can only hold 10,000 of the most recent messages before the old messages begin to get deleted. | int   |
| test_connectivity_on_auth | This will enable/disable an initialization function that checks if the connection is correct and loads things like an internal products list. If disabled, interfaces objects can be constructed extremely rapidly. | bool  |
| cash                      | This is the account that `.cash` corresponds to when running `interface.cash` (`interface` corresponds to an interface type object). This is a shortcut used for simplified buying/selling. If this were set to `USD` then running `interface.cash` on Coinbase Pro, it would give how much `USD` (size) is in the account to purchase with. See [here](/core/exchange_interface#cash---dict). | float |
| websocket_stream          | Alpaca internal websocket stream setting. If you upgrade your data feed through alpaca you can take advantage of it here. | str   |
