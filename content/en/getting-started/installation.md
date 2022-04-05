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
- Python 3.8
- Python 3.9
- Python 3.10

### Blankly Slate

Blankly Slate is our platform offering that integrates directly with your local development so that you get benchmarking, additional metrics, visualization, backtest storing, and live deployments all in one place. It's super easy to get set up.

Want to learn more about [Blankly Slate](https://blankly.finance). Check out this [demo model](https://app.blankly.finance/5Z9MWfnUzwIyy9Qv385a/1Ss7zybwN8aMAbWb3lSH/overview)

### Initializing with Your Exchange

The blankly package comes in with a super easy CLI to initialize all the required files (you can see more below or in the config section). 
All you have to do is run: 

```bash
$ blankly init
```

This will ask you for information about your model and initialize the current directory with all the files you need to get started. 

From there, all you have to do is start building your algorithm! 

### Backtesting your model

Blankly makes it easy to backtest your models. After initializing your project, you can run

```bash
$ python bot.py
```

to run a backtest. To change backtest parameters like testing dates/times, you can change the `strategy.backtest()` line in `bot.py`.

```python
strategy.backtest(to='1y', initial_values={'USD': 10000})
```

### Deploying your model to Blankly Slate

Deploying your model is dead simple. Once you've written and backtested your algorithm, just run :

```bash
$ blankly deploy
```

This will deploy your model to the cloud and open a web page for you where you can check on the status of your model, see what trades it is making, compare different metrics, and more.

### Adding Exchange API Keys

`blankly init` will prompt you to add API Keys when you create your model, but in case you skipped that, you can add or remove keys at any time with the `blankly key` command.

```
$ blankly key add
? What exchange would you like to add a key for? Binance
? What TLD are you using? binance.us
? Give this key a name:  (Optional) blankly-test-key
? API Secret: ***************************************************************
? API Key: ***************************************************************
✔ Checked Binance API Key
✔ Your API key for Binance was added to this model
```

### Required Files

![required_files](https://firebasestorage.googleapis.com/v0/b/blankly-docs-images.appspot.com/o/strategy%2Fblankly-directory.png?alt=media&token=f4764ee6-ee2e-4c7e-96df-a4bbecf4bba8)

In the working directory of your project (normally the root), Blankly needs two files:
settings.json
```json[settings.json]
{
  "settings": {
    "account_update_time": 5000,
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
      "cash": "USD"
    }
  }
}
```
keys.json

Check out our YouTube Playlist here to get set up with your exchange

<iframe className="mx-auto m-10 rounded-md shadow-xl" width="560" height="315" src="https://www.youtube.com/embed/videoseries?list=PLH05sP51Q8g8uumn2mSphApnK9FLxIpPC" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

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

Also, check out our [CONTRIBUTING.md](https://github.com/blankly-finance/blankly/blob/main/CONTRIBUTING.md)