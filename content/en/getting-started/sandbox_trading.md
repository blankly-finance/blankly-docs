---
title: Sandbox Trading
description: 'Information on the construction & usage of a sandbox object'
position: 34
version: 1.0
category: Getting Started
---

The blankly package comes built-in with multiple options for sandbox/test trading.

# Option 1: Paper Trade Interface

The sandbox interface object allows users to realistically sandbox trade on any of our exchanges. By default, sandboxes allow:

- Accurate exchange specific fee rates which are checked and set during the object construction.
- Accurate account management through buy and sell orders using the fees.
- Multithreaded local monitoring of limit order price triggers using the correct websocket feeds.
- Custom initial account value injections.
- Correct order filter checking

This creates a very powerful & dynamic paper trading experience. Our goal was to make it almost impossible to distinguish the difference between live trading and paper trading.

<alert>
Note: We highly recommend sandbox trading for at least one to two weeks before going fully live with your algorithm. We make our sandbox trading as accurate as possible
</alert>

## Creation

To create a paper trading object simply wrap an existing exchange object with a paper trade constructor:

```python
import blankly

# Basic exchange construction
coinbase_pro = blankly.CoinbasePro()

# Create a paper trade exchange:
paper_trade = blankly.PaperTrade(coinbase_pro)

# Get the interface like usual:
interface = paper_trade.get_interface()

s = blankly.Strategy(paper_trade) # strategy that can now run on paper trade
s.start() # running live but paper trading
```

### Arguments

| Arg                    | Description                                                  | Examples                                                     | Type     |
| ---------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | -------- |
| authenticated_exchange | Fill this with an existing authenticated exchange object.    | `coinbase_pro = blankly.CoinbasePro()` `paper_trade = blankly.PaperTrade(coinbase_pro)` | exchange |
| initial_account_values | An optional account dictionary to write as the starting values for the paper trade exchange. If one is not provided, paper trade will duplicate the account values currently on the live account. | `{'BTC': 2389, 'USD': 1000000}`                              | dict     |

# Option 2: Keyless Exchange

<alert type="warning">

The keyless exchange only supports backtesting. Use the paper trade interface for testing on live prices.

</alert>

The keyless exchange is the best choice if you

- Want to backtest on symbols not supported by other exchanges
- Curious to just try out the blankly package before fully setting up
- Interested in algo trading but don't have any exchange accounts

The keyless exchange can be used like all other blankly exchanges, the only change is that it requires a `PriceReader` object so it knows where to get data. This is easy to do,  just reference a CSV with OHLCV data and give the symbol:

```python
exchange = blankly.KeylessExchange(price_reader=PriceReader('./price_examples.csv', 'BTC-USD'))
```

Where the CSV is formatted like this:

```[./price_examples.csv]
time,low,high,open,close,volume
0,1588377600,8762.01,9025.0,8829.42,8985.58,10539.26528999
1,1588464000,8731.01,9203.52,8984.69,8909.95,17147.65372312
```

Here is a full example where prices are downloaded and backtested on:

```python
if __name__ == "__main__":
    # This downloads an example CSV
    data = requests.get(
        'https://firebasestorage.googleapis.com/v0/b/blankly-6ada5.appspot.com/o/demo_data.csv?alt=media&token=acfa5c39-8f08-45dc-8be3-2033dc2b7b28').text
    with open('./price_examples.csv', 'w') as file:
        file.write(data)

    # Run on the keyless exchange, starting at 100k
    exchange = blankly.KeylessExchange(price_reader=PriceReader('./price_examples.csv', 'BTC-USD'))

    # Use our strategy helper
    strategy = blankly.Strategy(exchange)

    # Make the price event function above run every day
    strategy.add_price_event(price_event, symbol='BTC-USD', resolution='1d', init=init)

    # Backtest the strategy
    results = strategy.backtest(start_date=1588377600, end_date=1650067200, initial_values={'USD': 10000})
    print(results)
```

