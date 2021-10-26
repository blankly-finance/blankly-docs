---
title: Order
description: 'General order type which other orders inherit from'
position: 16
version: 1.0
category: Orders
---

Order types are returned when placing or creating new orders on Blankly. This object can be used to monitor the status of an order on the exchange after being placed.

`LimitOrder`, `MarketOrder` and `StopOrder` all inherit from this class.

Every order type can be printed to yield a unique string. This allows an easy overview of each order type and the parameters that they need.

## Creation

Assign the object returned from an interface order to a variable:

`order = interface.market_order('BTC-USD', 'buy', 10)`

# Functions

## `get_response() -> dict`

Get the original but parsed response from the exchange

### Response

**Limit Order**

```python
{
  'id': '5839dc4f-78f9-4c55-bb42-6d42ec92b4aa', 
  'price': 10000.0, 
  'size': 0.001, 
  'symbol': 'BTC-USD', 
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
  'symbol': 'BTC-USD', 
  'side': 'buy', 
  'size': .533, 
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
| size       | The amount of base currency ordered in the market order     | float |
| type       | The order type - can be limit, market, and potentially stop | str   |
| created_at | The exchange's time in which the order was created at       | float |
| status     | Where the order is in the order lifecycle                   | str   |

## `get_product_id() -> str`

Get the id corresponding to the order.

### Response

| Description                                     | Examples               | Type |
| ----------------------------------------------- | ---------------------- | ---- |
| Get the asset id that the order is attached to. | "BTC-USD" or "XLM-USD" | str  |

## `get_id() -> str`

Get the id corresponding to the order.

### Response

| Description                 | Examples                               | Type |
| --------------------------- | -------------------------------------- | ---- |
| The unique order identifier | `ada612f8-cd1e-46b8-bc6f-5b43114c4f57` | str  |

## `get_purchase_time() -> str`

Get the time in which the order was created on the exchange.

### Response

| Description                                         | Examples            | Type  |
| --------------------------------------------------- | ------------------- | ----- |
| The epoch representation of the order creation time | `1623123324.471316` | float |

## `get_status(full=False) -> dict`

Query the exchange for the order status.

### Arguments

| Arg  | Description                         git         | Examples       | Type |
| ---- | ------------------------------------------- | -------------- | ---- |
| full | Get the full order order response, not just "pending" or "filled" | True or False | bool  |

### Response

**`full=False`**

| Description                                                  | Examples                | Type |
| ------------------------------------------------------------ | ----------------------- | ---- |
| Not setting full to true will return where the order currently is in its lifecycle. | `{'status': 'pending'}` | dict |

**`full=True`**

**Example with a *market order***

```python
{
  'id': 'cfe77aff-20f9-420c-9bbe-d127fcd26649', 
  'symbol': 'BTC-USD', 
  'side': 'buy', 
  'size': .533, 
  'type': 'market', 
  'status': 'done', 
}

```

| Key        | Description                                                  | Type  |
| ---------- | ------------------------------------------------------------ | ----- |
| id         | The exchange unique order identifier                         | str   |
| product_id | The asset id that the order was created on                   | str   |
| side       | Determine if the order is buying or selling                  | str   |
| size       | Pre-fees size exchanged in the order                         | float |
| type       | The order type. Note that this is an example market order, which contains different keys than a limit order. | str   |
| status     | Where the order is in the exchange lifecycle                 | str   |

## `get_type() -> str`

Get which type of order was placed.

### Response

| Description                                                  | Examples              | Type |
| ------------------------------------------------------------ | --------------------- | ---- |
| Describe the order type which describes how the order behaves | `'market'`, `'limit'` | str  |

## `get_side() -> str`

Get if the order is a buy or sell.

### Response

| Description                                                 | Examples          | Type |
| ----------------------------------------------------------- | ----------------- | ---- |
| Describes the purchasing side of the order that was placed. | `'buy'`, `'sell'` | str  |

## `get_size() -> float`

Get the size (or quantity) of the market or limit order.

### Response

| Description                                                  | Examples        | Type  |
| ------------------------------------------------------------ | --------------- | ----- |
| Size describes the amount of base currency ("BTC" of "BTC-USD") which is being bought or sold. | `1.3` or `.001` | float |
