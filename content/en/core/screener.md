---
title: Screener
description: 'High level class for running functions across stocks'
position: 16
version: 1.0
category: Framework
---

The Screener class is designed for algorithms that run on a "set" of assets. Some useful use cases include: 

1. Long term and reliable marketing abilities. Instead of running on a single symbol, a Screener will provide logic for a large number of symbols.
2. Portfolio Balancing (Useful if you already know what's in your portfolio and you simply want to use Blankly to do portfolio optimization each month)
3. Stock Screeners and Screener-Based Investing (Magic Formula Investing is one example)

<alert>

The main difference between a strategy and a Screener is the fact that a strategy runs on one single stock and on a given price resolution. In contrast, a Screener runs on a universe of stocks at a given time resolution. This gives you the freedom and flexibility to do a lot more than the traditional price-based strategy. 

</alert>

When contrasted with a strategy, a Screener is designed to be stopped and started by external processes. When run locally, a separate thread attempts to closely replicate the starting/stopping behavior experienced by chron scheduling. When deployed live on blankly cloud, models are fully stopped and started.

## Creation

All Screener behaviors & execution occurs in the object creation. Any consecutive logic is used to handle the output from the Screener. **The Screener will execute on construction.**

Control the resolution or how frequently the screener runs using the `blankly.json` file. Change the cron job inside the `schedule` tag. 

### Arguments

| Arg        | Description                                                  | Examples                                                     | Type         |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------ |
| exchange   | An [`exchange`](/core/exchange) object. This is what the Screener will run on. | `exchange = blankly.CoinbasePro()`                           | Exchange     |
| evaluator  | A function with signature `(symbol: str, screener_state: blankly.ScreenerState)` used to perform user logic on that symbol. The function should return the user defined result (`return {'price': Screener_state.interface.get_price(symbol)}`). | `def evaluator(symbol, screener_state: blankly.ScreenerState)`   | Callable     |
| symbols    | A list of Screeners to evaluate in the evaluator function.     | `['BTC-USD', 'ETH-USD']`                                     | list         |
| init       | Optional setup code to run when the program starts. This should modify the passed Screener state. | `def init(screener_state: blankly.ScreenerState)`                | Callable     |
| final      | Optional teardown code to run before the program finishes. This will be run every time the  Screener finishes a cycle (i.e. it evaluates and formats all results on all the `symbols`). Note this is different from `init` that only runs during the start | `def final(state: blankly.ScreenerState)`                | Callable     |
| formatter  | Optional formatting function that pretties the results form all evaluator calls (i.e. across all stock tickers found in `symbols`). The user function should return a formatted string. | `def formatter(raw_results: dict, screener_state: blankly.ScreenerState)` | Callable     |

## ScreenerState

Screener State is the state of the overall Screener. **Note again, this is different from a Strategy that has state on a per symbol basis**. Instead, state is shared across all symbols and functions. 

<alert type="danger">

Note that Screeners DO NOT store state across cycles (i.e. it's as if the entire process is completely restarted again). This means that we can't actually store things like price history over runs. This is intentional as it allows both your algorithm locally and in the cloud to sleep and not use computing resources. 

</alert>

### Properties

| Property   | Description                                                  | Examples                        | Type              |
| ---------- | ------------------------------------------------------------ | ------------------------------- | ----------------- |
| interface  | Pulls the interface stored in the strategy object            | `interface = state.interface`   | blankly.Interface |
| variables  | Access to all underlying user-defined state variables. This is a modular dictionary used for general storage. | `variables = state.variables`   | dict              |
| resolution | Specific Strategy Event Resolution (`None` for Orderbook Event). This is the number of seconds between runs if defined. | `resolution = state.resolution` | float             |
| symbols    | The symbols that this Screener runs on                         | `symbols = state.symbols`       | str[]             |
| time       | The current epoch time (if in backtest mode or in real-time) | `time = state.time`             | Int               |
| raw_results    |  The results returned by the filter "raw" so not done through format function | `results = screener.raw_results` | dict | 
| formatted_results | The results returned by the formatter (i.e. the format function) | `results = screener.formatted_results` | dict |
| notify     | A function that allows users to send notification emails on a per symbol basis (you can use this in your evaluator function) | `state.notify(message)`         | Function          |

### Common Use Cases

#### Storing Top X Stocks

This is very similar to the strategy where you can access `state.variables` and store any specific variables you may want in there. For example, I could store `state.variables['<ticker>_data']` where I store the data for each ticker if needed.

In this case, however, say that we are evaluating each stock and ultimately only want to store the Top X stocks, well we can ues a priority queue for this

```python
from blankly import Screener, ScreenerState
from queue import PriorityQueue


def init(state: ScreenerState):
    # add stock results into this as a tuple (result, ticker)
    # note you would want to input negative the value if you want a max priority queue vs a min
    state.variables["top_stocks"] = PriorityQueue(maxsize=20)
```

#### Storing Start/Current Positions

If we want to know which positions we are currently in, we can create a variable called `state.variables['positions']` that can hold all order size and amounts. We can then update this in our `evaluator` function. 

```python
from blankly import Screener, ScreenerState
from collections import deque


def init(state: ScreenerState):
    state.variables["positions"] = {}  # make an account here using interface.account
```



## Functions

### `notify(message: str = None)`

Send the formatted string to the user over both text and email. This requires configuration of the `notify.json` with both a user phone number and email.

| Arg     | Description                                                  | Examples            | Type |
| ------- | ------------------------------------------------------------ | ------------------- | ---- |
| message | An optional string to override the formatted message (if not filled it sends the formatted string created during the Screener) | `'Output Override'` | str  |

## Example

We've developed Screeners to do a multitude of things that Strategies can't do. One of these things is the ability to actively send out notifications of new opportuniites, update users of specific trades that are made or potential opportunities that can be sent to an email list of some sort. 

### Setting up our Development File

This is pretty straightforward as we will see: 

```python
from blankly import Screener, Alpaca, ScreenerState

tickers = ["AAPL", "GME", "MSFT"]  # any stocks that you may want
# This function is our evaluator and runs per stock
def is_stock_buy(symbol, state: ScreenerState):
    # in here we can get the price data, do anything else that we may need
    pass


def init(state):
    # initialize price data for example (so price queries are faster)
    pass


def formatter(results, state: ScreenerState):
    # here we can format the results on a per ticker basis
    pass


exchange = Alpaca()  # initialize our interface
screener = Screener(exchange, is_stock_buy, symbols=tickers, init=init)
# Screener.notify() send notification by email
print(screener.formatted_results)
```

### Find All Stocks that Are Oversold using RSI

To do this, we use our RSI indicator that is built into Blankly. First, let's get the data for each stock to calculate RSI. 

```python
def is_stock_buy(symbol, state: ScreenerState):
    # get the most recent price from the exchange
    prices = state.interface.history(
        symbol, 40, resolution=state.resolution, return_as="list"
    )  # get past 40 data points
    # ...
```

Okay, now that's set up. Let's actually do the evaluator and see if the stocks are oversold or not. In order to do this, we need to get the most recent price each time, add it to the `deque` and calculate the RSI on the new price data. 

```python
from blankly.indicators import rsi


def is_stock_buy(symbol, state: ScreenerState):
    # This runs per stock
    prices = state.interface.history(
        symbol, 40, resolution=state.resolution, return_as="list"
    )  # get past 40 data points
    price = state.interface.get_price(symbol)
    rsi_values = rsi(prices["close"], 14)
    return {"is_oversold": rsi_values[-1] < 30, "price": price, "symbol": symbol}
```

We can now use this to format output and notify the people that are connected to this Screener. 

### Formatting Results

Now that we have the function that is continually checking if the stocks in our universe are oversold. Now we just need to format our results. 

```python
def formatter(results, state: ScreenerState):
    # results is a dictionary on a per symbol basis
    email_str = "These are all the stocks that are currently oversold: \n"
    for symbol in results:
        if result[symbol]["is_oversold"]:
            email_str += "{} is currently oversold at a price of {}\n\n".format(
                symbol, result[symbol]["price"]
            )
    return email_str
```

Now that we have our results formatted, we now can just run our Screener and that's all we have to do! 

Running the file that we just created will start the Screener and Blankly will now handle the rest: 

```
These are all the stocks that are currently oversold: 
AAPL is currently oversold at a price of $143
```

