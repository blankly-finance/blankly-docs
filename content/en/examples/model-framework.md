---
title: Model
description: 'Build advanced, flexible and event driven strategies'
position: 37
version: 1.0
category: Services
---

## Overview
We built the model framework to provide flexible backtesting for any model type. The framework allows backtesting integration for custom price data and custom event data.

## Examples

### Backtest on twitter data
The backtester can process & inject any type of json data directly into historical events. We will walk through constructing a model that can read tweets as they are created while also trading AAPL.

The `Model` framework is a class-based approach, we can inherit from Blankly's built in `Model` framework by constructing a basic class:

```python
import blankly


class TwitterBot(blankly.Model):
  def main(self, args):
    # Because everything is event based just create an empty main
    while self.has_data:
      self.sleep(3600)
     
  def event(self, type_: str, data: any):
    # This is where the events come in
    pass
```

Next we'll create a dataset. The backtester accepts input formats in this format:

```json
{
	"data type": {
    "data": ["some string to inject", "more strings"],
    "time": [1647513512, some epoch time that matches the data]
  }
}
```

In this case we will pull together three tweets from Elon Musk:

```json[tweets.json]
{
	"tweet": {
		"data": [
			"I have so much respect for the associates doing an honest day’s work at Tesla or SpaceX building & servicing cars, rockets, Starlinks, batteries, solar & many other things", 
			"Free speech is essential to a functioning democracy. Do you believe Twitter rigorously adheres to this principle?" ,
			"Given that Twitter serves as the de facto public town square, failing to adhere to free speech principles fundamentally undermines democracy. What should be done?"
		]
		"time": [1647513512, 1648204712, 1648291112]
	}
}
```

Now is extremely easy to write a model that will buy twitter whenever we see a tweet when its mentioned and evaluate performance against the twitter price.

In this case we'll use 1h bars for the last month, starting with 10k in USD and buy with 20% of our sitting cash every time `twitter` shows up in the message.

Here is the final code:

```python
import blankly


class TwitterBot(blankly.Model):
    def main(self, args):
        # Because everything is event based just create an empty main
        while self.has_data:
            self.sleep('1h')
            # Value the account every hour
            self.backtester.value_account()

    # New events are injected here
    def event(self, type_: str, data: str):
        # Now check if it's a tweet about twitter
        if type_ == "tweet":
            if 'twitter' in data.lower():
                price = self.interface.get_price("TWTR")
                # If it is then go ahead and buy with 20% of available cash
                print("Buying twitter...")
                self.interface.market_order('TWTR', 'buy', blankly.trunc(
                    (self.interface.cash/price) * .2, 2))
            else:
                print("Message did not contain twitter")


if __name__ == "__main__":
    exchange = blankly.Alpaca()

    model = TwitterBot(exchange)

    # Add the tweets json here
    model.backtester.add_custom_events(blankly.data.EventReader('./tweets.json'))
    # Now add some underlying prices at 1 month
    model.backtester.add_prices('TWTR', '1h', start_date='3/20/22', stop_date='4/15/22')

    print(model.backtest(args=None, initial_values={'USD': 10000}))

```

With some great performance:

```
Blankly Metrics: 
Calmar Ratio:                      16.62
Compound Annual Growth Rate (%):   300.0%
Conditional Value-at-Risk:         9.02
Cumulative Returns (%):            11.0%
Max Drawdown (%):                  6.0%
Resampled Time:                    86400.0
Risk Free Return Rate:             0.0
Sharpe Ratio:                      2.88
Sortino Ratio:                     4.86
Value-at-Risk:                     886.9
Variance (%):                      11.99%
Volatility:                        0.35
```

The model makes 11% between 3/20/22 and 4/15/22, which is on track for a 300% annualized return.

### Backtest with Custom Data

Instead of only downloading data from your exchange, you can use any custom data that contains the columns `open`, `high`, `low`, `close` `volume` and `time`.

Here is an example:

```[custom.csv]
time,low,high,open,close,volume
1618012800,57875.41,61218.97,58092.68,59778.6,12817.81106734
1618099200,59177.06,60658.89,59778.59,59985.26,7278.96516665
1618185600,59369.0,61199.0,59983.66,59839.82,11467.72752999
1618272000,59799.01,63774.39,59836.88,63588.22,17897.76603088
1618358400,61277.91,64899.0,63588.22,62971.8,22570.84113444
1618444800,62036.73,63831.82,62971.8,63229.04,11209.4505281
```

To use this data in the backtester just use this setup:

```python
import blankly


if __name__ == "__main__":
    # Use this
	  exchange = blankly.Alpaca()
    model = Strategy(exchange)
    reader = blankly.data.PriceReader('./custom.csv', 'CUSTOM-USD')
    model.backtester.add_custom_prices(reader)
    
    model.backtest(args={}, initial_values={
      "USD": 10000
    })
```

Here is an example of how to interact with buying and selling `CUSTOM-USD`

```python
import blankly


class Strategy(Model):
    def main(self, args):
        while self.has_data:
            self.backtester.value_account()
            self.sleep('1h')
            self.interface.market_order('CUSTOM-USD', 'buy', 1000)
```

Here is the full code:

```python
impport blankly


class Strategy(Model):
    def main(self, args):
        while self.has_data:
            self.backtester.value_account()
            self.sleep('1h')
            self.interface.market_order('CUSTOM-USD', 'buy', 1000)
            
            
if __name__ == "__main__":
    # Use this
	  exchange = blankly.Alpaca()
    model = Strategy(exchange)
    reader = blankly.data.PriceReader('./custom.csv', 'CUSTOM-USD')
    model.backtester.add_custom_prices(reader)
    
    model.backtest(args={}, initial_values={
      "USD": 10000
    })
```

### Backtest with Tick-By-Tick Data

If you don't have tick by tick data don't worry you can gather it with blankly:

#### Gathering Tick Data

Directly interface with our websockets for each exchange to download. You can send results directly to a log file:

```python
import blankly


def update(message):
    print(message)


if __name__ == "__main__":
    manager = blankly.TickerManager('coinbase_pro', 'BTC-USD')

    manager.create_ticker(update, log='./tick-by-tick.csv')
```

In this case that code will download tick data from coinbase pro into a log file named `./tick-by-tick.csv`.

Here is an example of the data:

```[tick-by-tick.csv]
time,system_time,price,open_24h,volume_24h,low_24h,high_24h,volume_30d,best_bid,best_ask,last_size
1649515486.502912,1649515487.2905369,42422.4,43768.47,8783.43702598,42112,43976.44,413540.52953779,42422.40,42423.00,0.00053073
1649515487.73269,1649515487.6991239,42422.76,43768.47,8783.43711356,42112,43976.44,413540.52962537,42422.76,42423.00,0.00008758
1649515487.983084,1649515487.9505222,42423,43768.47,8783.43938878,42112,43976.44,413540.53190059,42422.84,42423.00,0.00227522
1649515488.331433,1649515488.2990131,42423,43768.47,8783.43941188,42112,43976.44,413540.53192369,42422.99,42423.00,0.0000231
```

#### Using Tick Data

Simply add a tick reader to your backtester. Events will be passed into `websocket_udpate`. Now you can backtest over each trade as an event.

```python
import blankly


class TickModel(blankly.Model):
    def main(self, args):
        while self.has_data:
            self.backtester.value_account()
            self.sleep('1h')

    def websocket_update(self, data):
        print(data)


if __name__ == "__main__":
    exchange = blankly.CoinbasePro()
    model = TickModel(exchange)

    model.backtester.add_tick_events(blankly.data.TickReader('./tick-by-tick.csv', 'BTC-USD'))

    model.backtest(args={}, initial_values={
        'USD': 1000000
    })
    
```

Some log output:

```
Backtesting...
{'time': 1649515486.5029118, 'system_time': 1649515487.2905366, 'price': 42422.4, 'open_24h': 43768.47, 'volume_24h': 8783.43702598, 'low_24h': 42112, 'high_24h': 43976.44, 'volume_30d': 413540.52953779, 'best_bid': 42422.4, 'best_ask': 42423.0, 'last_size': 0.00053073}
{'time': 1649515487.73269, 'system_time': 1649515487.699124, 'price': 42422.76, 'open_24h': 43768.47, 'volume_24h': 8783.43711356, 'low_24h': 42112, 'high_24h': 43976.44, 'volume_30d': 413540.52962537, 'best_bid': 42422.76, 'best_ask': 42423.0, 'last_size': 8.758e-05}
{'time': 1649515487.983084, 'system_time': 1649515487.9505222, 'price': 42423.0, 'open_24h': 43768.47, 'volume_24h': 8783.43938878, 'low_24h': 42112, 'high_24h': 43976.44, 'volume_30d': 413540.53190059, 'best_bid': 42422.84, 'best_ask': 42423.0, 'last_size': 0.00227522}
```

