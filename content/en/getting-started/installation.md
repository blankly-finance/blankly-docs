---
title: Installation
description: 'Description for how to setup and use Blankly'
position: 2
version: 1.0
category: Getting Started
---

## Installing the Package

### Download

The easiest way to quickly install & use is to download the Blankly pip module:

```bash
pip install blankly
```

Make sure you're using a supported version of python. The module is currently tested on these versions:
- Python 3.7
- Python 3.9

### Required Files

In the working directory of your project (normally the root), Blankly needs two files:
1. settings.json
```json[settings.json]
{
  "settings": {
    "account_update_time": 5000,
    "use_sandbox": true,
    "use_sandbox_websockets": false,
    "websocket_buffer_size": 10000,

    "coinbase_pro": {
      "cash": "USD"
    },
    "binance": {
      "cash": "USDT",
      "binance_tld": "us"
    },
    "alpaca": {
      "websocket_stream": "iex",
      "cash": "USD"
    }
  }
}
```
2. keys.json
```json[Keys.json]
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

The repository shows the keys as `keys_example.json` - *you have to rename that to* `keys.json` (so you don't accidentally commit to VCS).

The standard project structure is
```
Project
|-script.py
|-keys.json
|-settings.json
```
You can find each of these files in the "examples" folder of our GitHub.

Using the module is quite easy now. Here is a very simple demo that shows some features:

```python[script.py]
import blankly


def price_event(price, currency_pair, state):
    """
    This function will run every time we check for a new price - defined below
    """
    print("New price event: " + str(price) + " on " + str(currency_pair) + ".")


if __name__ == "__main__":
    # Authenticate coinbase pro strategy
    coinbase_pro = blankly.CoinbasePro()

    # Define our interface in case we want to make our own API calls
    interface = coinbase_pro.get_interface()

    # Create a strategy on coinbase pro
    coinbase_strategy = blankly.Strategy(coinbase_pro)

    # Run the price event function every time we check for a new price - in this case we can even specify varying resolutions
    coinbase_strategy.add_price_event(price_event, symbol='BTC-USD', resolution='1m')
    coinbase_strategy.add_price_event(price_event, symbol='LINK-USD', resolution='1h')
    coinbase_strategy.add_price_event(price_event, symbol='ETH-BTC', resolution='4h')

    # Make sure to run the strategy definition
    coinbase_strategy.start()

```

## Contributing

Interested in contributing or see a feature we need? The best way is to 
1. Fork the module on [GitHub](https://github.com/Blankly-Finance/Blankly)
2. Place it as a directory inside your project
```
Project
|-blankly
|-keys.json
|-settings.json
|-script.py
```
3. Import normally to your scripts & make your changes
4. Under `LGPL` make sure to open-source your changes!
