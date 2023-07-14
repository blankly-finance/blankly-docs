---
title: Strategy Overview
description: 'Develop, backtest, paper trade, and run with the same code.'
position: 10
version: 1.1
category: Blankly Strategy
---

The strategy class is built on top of the blankly model class. The goal when developing this class was to create something that could seamlessly integrate with the powerful user-objects that Blankly provides, while also giving an experience that barely goes beyond basic python. This means that functions can be asynchronous and multithreaded without the user ever noticing, while taking advantage of highly integrated exchange interfaces to make model development incredibly clean & simple.

Similar to many modern packages that follow more of a functional and declarative format such as [Keras](https://keras.io/), we wanted to model our Strategy class so that anyone can easily [integrate their models](https://docs.blankly.finance/examples/custom-model) and custom price events. 

Strategies created using the class can be instantly ***backtested, paper traded, sandbox tested, and deployed by only changing a single line*.**

<alert>

Strategies can have as many price events and combinations as you'd like. You're able to run a single price event on multiple resolutions and symbols and or run many-to-many. Keep in mind that the more price events you have, the more CPU usage there will be. 

</alert>

## The Strategy Object

![Strategy Visually](https://firebasestorage.googleapis.com/v0/b/blankly-docs-images.appspot.com/o/strategy%2Fblankly-strategy.png?alt=media&token=e5d7879e-ece3-4ee7-bf9d-b5adb8220994)

The object requires an authenticated [`exchange`](/core/exchange) object to function:

```python
from blankly import CoinbasePro, Strategy

def custom_price_event(price, symbol, state):
  	# do something here
   
def custom_bar_event(bar, symbol, state):
  	# do something with OHLCV data

def orderbook_event(orderbook, symbol, state):
  	# do something at the orderbook level

# Authenticate coinbase pro strategy
exchange = blankly.CoinbasePro()

# Use our strategy helper on coinbase pro
strategy = blankly.Strategy(exchange)
strategy.add_price_event(custom_price_event, 'BTC-USD', resolution='1h')
strategy.add_bar_event(custom_bar_event, 'BTC-USD', resolution='1d')
strategy.add_orderbook_event(custom_bar_event, 'ETH-USD')

strategy.start()
```

### Motivation 

Now let's dive deeper into this. We can see that we offer an extremely sequential approach to creating a strategy. This approach allows for an insane amount of flexibility when it comes to defining what you want to do with the data, and how you want to execute orders. Why? Because it allows you to literally implement whatever code in the function as long as you have the proper parameters (shoutout functional programming paradigms). A great example is say integrating a [custom model](/examples/custom-model), where we're able to take any existing model (say a machine learning model), and integrate it directly with blankly. You can see an example that we made [here](https://package.blankly.finance/build-a-neural-network-for-trading). 

As a result of this functional approach, you're able to add price events that have separate states and are able to run at different resolutions *without* having to create separate files, initializations for each and every one. 

### Arguments

| Arg           | Description                                                  | Examples                   | Type     |
| ------------- | ------------------------------------------------------------ | -------------------------- | -------- |
| exchange      | An [`exchange`](/core/exchange) object                 | `exchange = blankly.CoinbasePro()`     | Exchange |
| symbol | Optionally fill this to create a default for the websocket managers. Generally this should be ignored. | `'BTC-USD'` or `'XLM-USD'` | str      |

### Response

| Description       | Examples                                    | Type     |
| ----------------- | ------------------------------------------- | -------- |
| A strategy object | `strategy = blankly.Strategy(coinbase_pro)` | Strategy |
