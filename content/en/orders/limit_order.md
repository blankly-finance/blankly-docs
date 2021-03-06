---
title: Limit Order
description: 'Order specific functions from market order.'
position: 17
version: 1.0
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

## `get_time_in_force() -> str`

Get the time in force setting for the order.	

### Response

| Description                                                  | Examples | Type |
| ------------------------------------------------------------ | -------- | ---- |
| The time in force represents how the exchange should treat the order lifecycle | `GTC`    | str  |
