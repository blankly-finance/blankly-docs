---
title: Common Gotchas
description: Here are some common gotchas that might cause your code to not work with Blankly
position: 4
version: 1.0
category: Getting Started
---

It happens all the time. When the code works on someone else's computer but not yours. Unfortunately, as much as we try to handle every use case. Some times we miss some things. 
Fortunately, if you have an issue, we're readily available to help you out! Submit an issue on our [GitHub](https://github.com/Blankly-Finance/Blankly) or message us in [Discord](https://discord.gg/xJAjGEAXNS) and we'll respond as soon as possible! 

That being said, here are a couple of Blankly gotchas that we've seen so far. 

## Switching Your Code to Binance and Non-USD Exchanges

At Blankly, we try to support as many exchanges as possible, and with the rise of crypto exchanges, there has arisen the issue that not every exchange supports USD. A key example of this is Binance that has all base currency done in [`USDT` (Tether USD)](https://tether.to/en/). Unfortunately, as much as we'd like our code to be easily switchable, there are a few gotchas in order to make sure that your backtests and settings run correctly. 

### Ensure `backtest.json` uses USDT as Quote Account

Under backtest.json, there are a wide variety of settings to allow your backtests to run correctly and the way that you want. One of these is being able to easily quote your account value in any asset you'd like (this could be in `AAPL` or `BTC` if you really wanted to). By default, for Coinbase Pro, Alpaca, and OANDA, this is in USD. However for Binance, FTX, Kucoin, and all non-usd exchanges, we have to quote in USDT as USD is not supported. In order to do this we change `quote_account_value_in` to 'USDT' to get this `backtest.json`. 

```json
{
  "price_data": {
    "assets": ...
  },
  "settings": {
    ...
    "quote_account_value_in": "USDT",
    ....
  }
}
```

### Check Your Binance TLD

If you're an international Binance user, you must also make sure you change your `binance_tld` in `settings.json` to `com` instead of the default of `us`. Because we support both binance, this is how we separate between the two and allow your keys to work perfectly. If you're in the US, make sure you keep the default `us'

```json
{
  "settings": {
    "use_sandbox": false,
    "use_sandbox_websockets": false,
    "websocket_buffer_size": 10000,
    "test_connectivity_on_auth": true,
    ...
    "binance": {
      "cash": "USDT",
      "binance_tld": "com"
    },
    ...
  }
}
```

## Are You Using Sandbox Keys? 

Because we support both paper-trading environments and live trading, we allow users to input not just live keys but also sandbox keys that utilize various exchange's sandbox mode.

<alert type="info">
    Note, not all of the exchanges support sandbox mode (FTX for example does not). In this case, Blankly has a <a href="/API/sandbox_trading">different way</a> to do paper trading for these exchanges. 
</alert>

Thus, ensuring that you properly have `use_sandbox` to be `true` or `false` is critical in the `settings.json`. Blankly will also throw an error if it detect sandbox keys. 

## I Can't Short on Alpaca

Alpaca shorting right now is a feature that is supported and is enabled by default. However, if you can't seem to short, make sure that in your `settings.json` you have `enable_shorting` to be set to true. 

```json
...

"alpaca": {
      "websocket_stream": "iex",
      "cash": "USD",
      "enable_shorting": true,
      "use_yfinance": false
    },

...
```

## I'm Getting an InvalidOrderError and My Trades Aren't Going Through 

Trades not going through can be caused by a multitude of reasons that may range from incorrect quantity calculation, to not having enough money in the account. However, the most critical gotcha that we typically is when we see the transition from Alpaca to a crypto asset. 

### Switching from Alpaca to Crypto 

Currently alpaca does not allow for fractional trading. Thus, all quantity calculations must be casted to an integer. However, for crypto, we can't do this. Thankfully Blankly has a `blankly.trunc()` function to help us out. 

#### Alpaca Quantity Calculation

```python

def price_event(price, symbol, state):
    ...
    qty = int(price / interface.cash) # must be cast to an int
    ...
```

#### Crypto Quantity Calculation

```python

def price_event(price, symbol, state):
    ...
    qty = blankly.trunc(price / interface.cash, 2) # must reduce floating precision to 2 decimal places
    ...
```
