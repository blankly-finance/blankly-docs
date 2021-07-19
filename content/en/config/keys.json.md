---
title: keys.json
description: 'Description for keys.json'
position: 4
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
