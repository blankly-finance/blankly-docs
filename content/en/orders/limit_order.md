---
title: Limit order
description: 'Order specific functions from market order.'
position: 10
category: Orders
order_docs: orders/order
---

The limit order response inherits from the `order` object, found [here](/orders/order). This means that all the functions described in that document will also work here.

# Functions

## `get_price() -> float`

Get the price that this limit order is set at.

### Response

| Description                                                  | Examples             | Type  |
| ------------------------------------------------------------ | -------------------- | ----- |
| The limit price describes the point at which the user wants to buy or sell. | `30000` or `'75000'` | float |

## `get_quantity() -> float`

Get the quantity (or size) of the limit order.

### Response

| Description                                                  | Examples        | Type  |
| ------------------------------------------------------------ | --------------- | ----- |
| Size describes the amount of base currency ("BTC" of "BTC-USD") which is being bought or sold. | `1.3` or `.001` | float |

