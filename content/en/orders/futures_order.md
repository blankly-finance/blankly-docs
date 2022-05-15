---
title: Futures Order
description: 'Order type for futures exchanges'
position: 16
version: 1.0
category: Orders
---

This order type is returned when placing or creating new orders on Perpetual Futures contracts on Blankly.

This can be printed to yield a unique string. This allows an easy overview of the order.

## Creation

Assign the object returned from an interface order to a variable:

```python
order = interface.market_order('BTC-USD', 'buy', 10)
print(order.id, order.price)
```

# Fields

| Field         | Description                                                                 | Type                     |
|---------------|-----------------------------------------------------------------------------|--------------------------|
| symbol        | The trading pair for the order                                              | str                      |
| id            | The order ID returned by the exchange                                       | int                      |
| size          | The size of the order. This is negative for a short position.               | float                    |
| status        | The order status. (ex: 'open', 'filled', 'canceled')                        | OrderStatus              |
| type          | The order type. (ex: 'market', 'limit', 'take_profit', etc)                 | OrderType                |
| side          | The side of the order. (ex: 'sell', 'buy')                                  | Side                     |
| price         | The price at which the order executed at, or 0 if it hasn't yet.            | float                    |
| limit_price   | For limit, take profit, and stop loss orders, the limit or execution price. | float                    |
| time_in_force | Time in Force value for non-market orders.                                  | TimeInForce              |
| response      | The response object from the exchange.                                      | dict                     |
| interface     | The interface this order was placed or queried from.                        | FuturesExchangeInterface |
