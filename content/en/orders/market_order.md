---
title: Market Order
description: 'Order specific functions from market order.'
position: 9
category: Orders
order_docs: orders/order
---

The market order response inherits from the `order` object, found [here](/orders/order). This means that all the functions described in that document will also work here.

# Functions

## `get_funds() -> float`

Get the amount of funds exchanged in the order. This will include fees.

### Response

| Description                                       | Examples     | Type  |
| ------------------------------------------------- | ------------ | ----- |
| The funds exchanged after fees in a market order. | `9.98502246` | float |

