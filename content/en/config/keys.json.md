---
title: keys.json
description: 'Description for keys.json'
position: 6
version: 1.0
category: Config
---

The `keys.json` file follows this format.

## Format

```json[keys.json]
{
    "coinbase_pro": {
        "my cool portfolio": {
            "API_KEY": "******************************",
            "API_SECRET": "**************************************************************************************",
            "API_PASS": "**********"
        }
    },
    "binance": {
        "another cool portfolio": {
            "API_KEY": "**************************************************************",
            "API_SECRET": "*************************************************************"
        }, 
        "second cool portfolio": {
            "API_KEY": "**************************************************************",
            "API_SECRET": "*************************************************************"
        } 
    },
    "alpaca": {
        "another cool portfolio": {
            "API_KEY": "********************",
            "API_SECRET": "****************************************"
        }
    }
}
```

Each supported exchange uses API keys. This document is designed to make it easy to interact & authenticate across different accounts. 

## Usage

Authenticating using `keys.json` is designed to be incredibly easy.

This example is for Coinbase Pro. If I wanted to use a particular Coinbase Pro portfolio, then I can specify that: 

```python
exchange = blankly.CoinbasePro(portfolio_name='my cool portfolio')	
```

This will find `"my cool portfolio"` under `"coinbase_pro"` in the document. You can use this to have many different portfolios & accounts across exchanges and dynamically use each one.

**If you don't specify a `portfolio_name`, then Blankly will authenticate using the first portfolio in the document under the exchange & show a warning.**

```python
exchange = blankly.CoinbasePro()
```

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

## Alpaca

Alpaca is very easy to obtain sandbox keys from without opening a brokerage account.

1. Go to https://alpaca.markets
2. Create an account with just an email
3. On the Welcome to Alpaca screen below **Individual Account** and **Business Trading Account** buttons, press the hyperlink inside: "Try your *paper trading API* first."
4. Generate keys on the right hand side

