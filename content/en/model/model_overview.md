---
title: Model Overview
description: 'Backtest anything.'
position: 11
version: 1.1
category: Blankly Model
---

The blankly model is a powerful class used for creating extraordinarily accurate event driven backtests. The model class is compatible with custom price data, event data or tick by tick websocket data. 

The first thing to understand when using the class is that **where in most cases the backtester calls the user code, in this case the user calls the backtester.** This allows custom definitions about how quickly or slowly the user should move through time.

Here is a simple example of the model

```python
import blankly

class ModelDemo(blankly.Model):
  def main(args):
    # Exit when we run out of data
    while self.has_data:
      # Print the price every hour
      print(self.interface.get_price('BTC-USD'))
      self.sleep('1h')
      
      # Also choose when to value the account
      self.backtester.value_account()
```

The entry point of the backtester is a simple main function which takes a single parameter `args`. Args can be any python object and you can choose to handle it however. The most interesting portion of this code is the `self.sleep('1h')` call.  While backtesting, this will make the backtester skip 1 hour of data.

This is exciting because it enables the user to define everything about the backtest all the way down to the simulated latency of the API calls (shown below).

Another interesting aspect is that because you have complete control, you choose when to value the account. In this case the call to value the account is made every hour.

### Simulate Latency

Before exploring even more advanced parts of the model class, the ability to sleep is interesting to take a moment to study

Here is the same example as above, but changed so that it contains a market order. Directly above the market order we call the price and then sleep for 1 second. With high resolution data, this 1 second sleep be accurately reflected in the backtester:

```python
import blankly

class ModelDemo(blankly.Model):
  def main(args):
    # Exit when we run out of data
    while self.has_data:
      self.sleep('1h')
      # Print the price every hour
      print(self.interface.get_price('BTC-USD'))
			
      # Inject latency
      self.sleep('1s')
      self.interface.market_order('BTC-USD', 'buy', 0.01)
      
      # Also choose when to value the account
      self.backtester.value_account()
```

This is especially exciting for arbitrage or tick by tick data. Finally having access to timing this accurate is essential for well tested strategies.

We are adding a `self.backtester.latency('.01s')` to allow global latency.

### Injecting Data

The model class accepts a few different types of data:

1. **Exchange Bars** - These are bars downloaded directly from your exchange. The highest resolution here is generally 1 minute and it works out of the box if you create the model using a real exchange like `blankly.CoinbasePro()`
2. **Custom Bars** - Any custom data or `OHLCV` data that you have access to that you want to backtest on. Generally this should be used on a `Keyless` exchange. The keyless exchange will simulate trading without linking directly to an exchange and fees can be controlled in the constructor.
3. **Custom Events** - These are injected data events - generally json serializable data that have an associated timestamp. These are injected through the `def event(self, type_, data)` handler in the `Model` class.
4. **Websocket Data** - Similar to custom event data but accepts a .CSV with a time column and any other keys. These are injected through the `def websocket_update(self, data)` handler.

Here are some example that show the use of all of the above:

```python
import blankly

class ModelDemo(blankly.Model):
  def main(args):
    # Exit when we run out of data
    while self.has_data:
      self.sleep('1h')
      # Print the price every hour
      print(self.interface.get_price('BTC-USD'))
			
      # Inject latency
      self.sleep('1s')
      self.interface.market_order('BTC-USD', 'buy', 0.01)
      
      # Also choose when to value the account
      self.backtester.value_account()
      
	def event(self, type_: str, data: any):
    	# Print custom events here
      print(data)
      
  def websocket_update(self, data):
      # Print websocket data here
      print(data)
      
      
if __name__ == "__main__":
  exchange = blankly.CoinbasePro()
  model = ModelDemo(exchange)
  
  # Add all the bitcoin prices for one year @ 1 hour
  model.backtester.add_prices('BTC-USD', '1h', '1y')
  
  # Read in our custom data using the price reader object
  price_reader = blankly.data.PriceReader('./btc_data.csv', 'BTC-USD')
  model.backtester.add_custom_prices(price_reader)
  
  # Read in our custome vents using the event reader object
  events_reader = blankly.data.EventReader('./events.json')
  model.backtester.add_custom_events(events_reader)
  
  # Read in our websocket data through the Tick reader
  tick_reader = blankly.data.TickReader('./ticks.json', 'BTC-USD')
  blankly.backtester.add_tick_events(tick_reader)
  
```

