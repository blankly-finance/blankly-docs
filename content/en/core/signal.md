---
title: Signal
description: 'High level class for running functions across stocks'
position: 14
version: 1.0
category: Framework
---

The signal class is designed for algorithms that run on a "set" of stocks. Some useful use cases include: 

1. Long term and reliable marketing abilities. Instead of running on a single symbol, a signal will provide logic for a large number of symbols.
2. Portfolio Balancing (Useful if you already know what's in your portfolio and you simply want to use Blankly to do portfolio optimization each month)
3. Stock Screeners and Screener-Based Investing (Magic Formula Investing is one example)

<alert>

The main difference between a strategy and a signal is the fact that a strategy runs on one single stock and on a given price resolution. In contrast, a signal runs on a universe of stocks at a given time resolution. This gives you the freedom and flexibility to do a lot more than the traditional price-based strategy. 

</alert>

When contrasted with a strategy, a signal is designed to be stopped and started by external processes. When run locally, a separate thread attempts to closely replicate the starting/stopping behavior experienced by chron scheduling. When deployed live on blankly cloud, models are fully stopped and started.

## Creation

All signal behaviors & execution occurs in the object creation. Any consecutive logic is used to handle the output from the signal. **The signal will execute on construction.**

### Arguments

| Arg        | Description                                                  | Examples                                                     | Type         |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------ |
| exchange   | An [`exchange`](/core/exchange) object. This is what the signal will run on. | `exchange = blankly.CoinbasePro()`                           | Exchange     |
| evaluator  | A function with signature `(symbol: str, signal_state: blankly.SignalState)` used to perform user logic on that symbol. The function should return the user defined result (`return {'price': signal_state.interface.get_price(symbol)}`). | `def evaluator(symbol, signal_state: blankly.SignalState)`   | Callable     |
| symbols    | A list of signals to evaluate in the evaluator function.     | `['BTC-USD', 'ETH-USD']`                                     | list         |
| resolution | The time interval between signal runs.                       | `'1w'`, `'3d'` or `86400`                                    | str or float |
| init       | Optional setup code to run when the program starts. This should modify the passed signal state. | `def init(signal_state: blankly.SignalState)`                | Callable     |
| final      | Optional teardown code to run before the program finishes. This will be run every time the  signal finishes a cycle (i.e. it evaluates and formats all results on all the `symbols`). Note this is different from `init` that only runs during the start | `def final(signalState: blankly.SignalState)`                | Callable     |
| formatter  | Optional formatting function that pretties the results form all evaluator calls (i.e. across all stock tickers found in `symbols`). The user function should return a formatted string. | `def formatter(raw_results: dict, signal_state: blankly.SignalState)` | Callable     |

## SignalState

Signal State is the state of the overall signal. **Note again, this is different from a Strategy that has state on a per symbol basis**. Instead, state is shared across all symbols and functions. 

### Properties

| Property   | Description                                                  | Examples                        | Type              |
| ---------- | ------------------------------------------------------------ | ------------------------------- | ----------------- |
| interface  | Pulls the interface stored in the strategy object            | `interface = state.interface`   | blankly.Interface |
| variables  | Access to all underlying user-defined state variables. This is a modular dictionary used for general storage. | `variables = state.variables`   | dict              |
| resolution | Specific Strategy Event Resolution (`None` for Orderbook Event). This is the number of seconds between runs if defined. | `resolution = state.resolution` | float             |
| symbols    | The symbols that this signal runs on                         | `symbols = state.symbols`       | str[]             |
| time       | The current epoch time (if in backtest mode or in real-time) | `time = state.time`             | Int               |
| notify     | A function that allows users to send notification emails on a per symbol basis (you can use this in your evaluator function) | `state.notify(message)`         | Function          |

### Common Use Cases

#### Storing Symbol Data 

This is very similar to the strategy where you can access `state.variables` and store any specific variables you may want in there. For example, I could store `state.variables['<ticker>_data']` where I store the data for each ticker.

<alert> Note, similar to the `Strategy` examples. We do recommend using a `deque` instead of an array to store values as having this run multiple times can make array sizes extremely large </alert>

```python
from blankly import Signal, SignalState
from collections import deque

def init(state: SignalState):
  for symbol in state.symbols:
    # get data needed
	  state.variables[symbol] = state.interface.history(symbol, 150, as='deque')
```



#### Storing Start/Current Positions

If we want to know which positions we are currently in, we can create a variable called `state.variables['positions']` that can hold all order size and amounts. We can then update this in our `evaluator` function. 

```python
from blankly import Signal, SignalState
from collections import deque

def init(state: SignalState):
	state.variables['positions'] = { } # make an account here using interface.account
```



## Functions

### `notify(message: str = None)`

Send the formatted string to the user over both text and email. This requires configuration of the `notify.json` with both a user phone number and email.

| Arg     | Description                                                  | Examples            | Type |
| ------- | ------------------------------------------------------------ | ------------------- | ---- |
| message | An optional string to override the formatted message (if not filled it sends the formatted string created during the signal) | `'Output Override'` | str  |

## Example

We've developed Signals to do a multitude of things that Strategies can't do. One of these things is the ability to actively send out notifications of new opportuniites, update users of specific trades that are made or potential opportunities that can be sent to an email list of some sort. 

### Setting up our Development File

This is pretty straightforward as we will see: 

```python
from blankly import Signal, Alpaca, SignalState

tickers = ['AAPL', 'GME', 'MSFT' ... ] # any stocks that you may want
# This function is our evaluator and runs per stock
def is_stock_buy(symbol, state: SignalState):
  # in here we can get the price data, do anything else that we may need
def init(state):
  # initialize price data for example (so price queries are faster)
def formatter(results, state: SignalState):
  # here we can format the results on a per ticker basis
alpaca = Alpaca() # initialize our interface
signal = Signal(alpaca, is_stock_buy, symbols=tickers, init=init)
signal.notify()
```

### Find All Stocks that Are Oversold using RSI

To do this, we use our RSI indicator that is built into Blankly. However, we need to first initialize our price data and set that all up: 

```python
def init(state: SignalState):
  # get all data setup
  for symbol in state.symbols:
    state.variables['data_' + symbol] = state.interface.history(symbol, 150, as='deque')
```

Okay, now that's set up. Let's actually do the evaluator and see if the stocks are oversold or not. In order to do this, we need to get the most recent price each time, add it to the `deque` and calculate the RSI on the new price data. 

```python
from blankly.indicators import rsi
def is_stock_buy(symbol, state: SignalState):
  # get the most recent price from the exchange
  price = state.interface.get_price(symbol)
  state.variables['data_' + symbol].append()
  rsi_values = rsi(state.variables['data_' + symbol], 14)
  if rsi_values[-1] < 30: 
    # the stock is oversold
    return { 'is_oversold': True, 'price': price, 'symbol': symbol }
```

We can now use this to format output and notify the people that are connected to this Signal. 

### Formatting Results

Now that we have the function that is continually checking if the stocks in our universe are oversold. Now we just need to format our results. 

```python
def formatter(results, state: SymbolState):
  # results is a dictionary on a per symbol basis
  email_str = 'These are all the stocks that are currently oversold: \n'
  for result in results:
		if result['is_oversold']:
      email_str += '{} is currently oversold at a price of {}\n\n'.format(symbol, price)
  return email_str
```

Now that we have our results formatted, we now can just run our signal and that's all we have to do! 

Running the file that we just created will start the signal and Blankly will now handle the rest: 

```
These are all the stocks that are currently oversold: 
AAPL is currently oversold at a price of $143
```

