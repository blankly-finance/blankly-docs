---
title: Sandbox Trading
description: 'Information on the construction & usage of a sandbox object'
position: 22
version: 1.0
category: API
---

The sandbox interface object allows users to realistically sandbox trade on any exchange. By default, sandboxes allow:

- Accurate exchange specific fee rates which are checked and set during the object construction.
- Accurate account management through buy and sell orders using the fees.
- Multithreaded local monitoring of limit order price triggers using the correct websocket feeds.
- Custom initial account value injections.

This creates a very powerful & dynamic paper trading experience. Our goal was to make it almost impossible to distinguish the difference between live trading and paper trading.

## Creation

To create a paper trading object simply wrap an existing exchange object with a paper trade constructor:

```python
import Blankly

# Basic exchange construction
coinbase_pro = Blankly.Coinbase_Pro()

# Create a paper trade exchange:
paper_trade = Blankly.PaperTrade(coinbase_pro)

# Get the interface like usual:
interface = paper_trade.get_interface()
```

### Arguments

| Arg                    | Description                                                  | Examples                                                     | Type     |
| ---------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | -------- |
| authenticated_exchange | Fill this with an existing authenticated exchange object.    | `coinbase_pro = Blankly.Coinbase_Pro()` `paper_trade = Blankly.PaperTrade(coinbase_pro)` | exchange |
| initial_account_values | An optional account dictionary to write as the starting values for the paper trade exchange. If one is not provided, paper trade will duplicate the account values currently on the live account. | `{'BTC': 2389, 'USD': 1000000}`                              | dict     |

