---
title: Setup
description: 'Description for how to setup and use Blankly'
position: 2
category: Usage
---

Check the [GitHub](https://github.com/Blankly-Finance/Blankly) for more information about develop & setup.

## Easy Installation

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
    "binance_tld": "us",
    "websocket_buffer_size": 10000
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
    }
}
```

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
import Blankly


def price_event(price, currency_pair):
    """
    This function will run every time we check for a new price - defined below
    """
    print("New price event: " + str(price) + " on " + str(currency_pair) + ".")


if __name__ == "__main__":
    # Authenticate coinbase pro strategy
    coinbase_pro = Blankly.Coinbase_Pro()

    # Define our interface in case we want to make our own API calls
    interface = coinbase_pro.get_interface()

    # Create a strategy on coinbase pro
    coinbase_strategy = Blankly.Strategy(coinbase_pro)

    # Run the price event function every time we check for a new price - in this case we specify 15 seconds
    coinbase_strategy.add_price_event(price_event, currency_pair='BTC-USD', resolution='15s')
    coinbase_strategy.add_price_event(price_event, currency_pair='LINK-USD', resolution='15s')
    coinbase_strategy.add_price_event(price_event, currency_pair='ETH-BTC', resolution='15s')

```

## Contributing

Interested in contributing or see a feature we need? The best way is to 
1. Fork the module on [GitHub](https://github.com/Blankly-Finance/Blankly)
2. Place it as a directory inside your project
```
Project
|-Blankly
|-keys.json
|-settings.json
|-script.py
```
3. Import normally to your scripts & make your changes
4. Under `lgpl` make sure to open-source your changes!
