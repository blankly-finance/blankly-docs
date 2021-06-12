---
title: settings.json
description: 'Key/value descriptions for settings.json'
position: 3
category: Usage
---

The `settings.json` file follows this format:

## Format

```json[settings.json]
{
  "settings": {
    "account_update_time": 5000,
    "use_sandbox": true,
    "use_sandbox_websockets": false,
    "binance_tld": "us",
    "websocket_buffer_size": 10000
  }
}
```

| Key                    | Description                                                  | Type  |
| ---------------------- | ------------------------------------------------------------ | ----- |
| account_update_time    | For multiprocessing. This describes how often should the process check the exchange to report status | float |
| use_sandbox            | Use your exchange's sandbox network for all REST calls. There is more info below for each exchange. | bool  |
| use_sandbox_websockets | Because the volume can be incredibly low on sandbox servers, this is a separate setting to allow test REST requests while still working with high volume on the non-sandbox exchange. Coinbase Pro also occasionally turns off their websocket servers for the sandbox while leaving on the REST servers. | bool  |
| binance_tld            | This specifies the binance ending. Some examples include `us` or `com` for `binance.us` and `binance.com` respectively | str   |
| websocket_buffer_size  | This setting limits the amount of history that a websocket can hold to limit memory usage. For example, `10000` means that it can only hold 10,000 of the most recent messages before the old messages begin to get deleted. | int   |

## Sandbox Information

### Coinbase Pro

You can find details about Coinbase Pro's sandbox here:

https://docs.pro.coinbase.com/#sandbox-urls

**To deposit money in your sandbox account:**

1. Go to the web interface here: https://public.sandbox.pro.coinbase.com. 
2. Go to the top & press "portfolios" then click "deposit." 
3. Click on the currency you would like to add, then select the deposit from "Coinbase.com" option. 
4. You should notice the Coinbase.com funds should be quite large.
5. Hit "max" by amount and press deposit.

**To use this account with Blankly just generate the API key normally inside the web interface and use that in the "coinbase_pro" section of `keys.json`**

One thing to note is that Coinbase Pro seems to occasionally turn off their websocket servers for the sandbox. When this happens the web interface: https://public.sandbox.pro.coinbase.com will not load.

### Binance

You can find the details about the Binance sandbox here:

https://testnet.binance.vision

**You have to generate your API key**:

1. Go to https://testnet.binance.vision
2. You need to have a GitHub account (if you create one make sure you give Blankly a star!)
3. Log in with GitHub at the top of that page
4. You can then generate a `HMAC_SHA256` key. This is the key type that Blankly uses.

In contrast to Coinbase Pro, Binance automatically creates default balances for the test accounts - no depositing necessary.