---
title: Sandbox Trading
description: 'Information on the construction & usage of a sandbox object'
position: 34
version: 1.0
category: Getting Started
---

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

