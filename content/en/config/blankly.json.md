---
title: blankly.json
description: 'Key/value descriptions for blankly.json'
position: 8
version: 1.0
category: Config
---

The `blankly.json` file is used to specify settings that are read by blankly when deploying on the cloud.

This file is only necessary if using blankly cloud.

This file can be placed in version control.

## Format

```json[blankly.json]
{
  "main_script": "./bot.py",
  "python_version": "3.7",
  "requirements": "./requirements.txt",
  "working_directory": "."
}
```

| Key                    | Description                                                  | Type  |
| ---------------------- | ------------------------------------------------------------ | ----- |
| account_update_time    | For multiprocessing. This describes how often should the process check the exchange to report status (unit is milliseconds). | float |
| use_sandbox            | Use your exchange's sandbox network for all REST calls. There is more info below for each exchange. | bool  |
| use_sandbox_websockets | Because the volume can be incredibly low on sandbox servers, this is a separate setting to allow test REST requests while still working with high volume on the non-sandbox exchange. Coinbase Pro also occasionally turns off their websocket servers for the sandbox while leaving on the REST servers. | bool  |
| binance_tld            | This specifies the binance ending. Some examples include `us` or `com` for `binance.us` and `binance.com` respectively | str   |
| websocket_buffer_size  | This setting limits the amount of history that a websocket can hold to limit memory usage. For example, `10000` means that it can only hold 10,000 of the most recent messages before the old messages begin to get deleted. | int   |
| cash                   | This is the account that `.cash` corresponds to when running `interface.cash` (`interface` corresponds to an interface type object). This is a shortcut used for simplified buying/selling. If this were set to `USD` then running `interface.cash` on Coinbase Pro, it would give how much `USD` (size) is in the account to purchase with. See [here](/core/exchange_interface#cash---dict). | float |