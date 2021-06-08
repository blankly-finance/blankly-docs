---
title: Order
description: 'General order type which other orders inherit from'
position: 1
category: Orders
---

Order types are returned when placing or creating new orders on Blankly. This object can be used to monitor the status of an order on the exchange after being placed.

`LimitOrder`, `MarketOrder` and `StopOrder` all inherit from this class.

## Creation

Assign the object returned from an interface order to a variable:

`order = interface.market_order('BTC-USD', 'buy', 10)`

## Utility Functions

## `get_response() -> dict`

Get the original but parsed response from the exchange

### Response

**Limit Order**

```python
{
  'id': '5839dc4f-78f9-4c55-bb42-6d42ec92b4aa', 
  'price': 10000.0, 
  'size': 0.001, 
  'product_id': 'BTC-USD', 
  'side': 'buy', 
  'type': 'limit', 
  'time_in_force': 'GTC', 
  'created_at': 1623122811.275972, 
  'status': 'pending'
}
```

| Key           | Description                                                  | Type  |
| ------------- | ------------------------------------------------------------ | ----- |
| id            | The exact order id returned by the exchange                  | str   |
| price         | The price the limit order was created at                     | float |
| size          | The amount of base currency ordered in the limit order       | float |
| product_id    | The trading pair that the limit order is placed on           | str   |
| side          | The side of the order, buying or selling                     | str   |
| type          | The order type - can be limit, market, and potentially stop  | str   |
| time_in_force | Defaults to GTC (good till canceled). This describes how the limit order should behave or if it should self-cancel in the trading day. | str   |
| created_at    | The exchange's time in which the order was created at        | float |
| status        | Where the order is in the order lifecycle                    | str   |

**Market Order**

```python
{
  'id': 'ada612f8-cd1e-46b8-bc6f-5b43114c4f57', 
  'product_id': 'BTC-USD', 
  'side': 'buy', 
  'funds': 9.98502246, 
  'type': 'market', 
  'created_at': 1623123324.471316, 
  'status': 'pending'
}

```

| Key        | Description                                                 | Type  |
| ---------- | ----------------------------------------------------------- | ----- |
| id         | The exact order id returned by the exchange                 | str   |
| product_id | The trading pair that the limit order is placed on          | str   |
| side       | The side of the order, buying or selling                    | str   |
| funds      | The amount of quote currency ordered in the market order    | float |
| type       | The order type - can be limit, market, and potentially stop | str   |
| created_at | The exchange's time in which the order was created at       | float |
| status     | Where the order is in the order lifecycle                   | str   |

## `get_id() -> str`

Get the id corresponding to the order.

