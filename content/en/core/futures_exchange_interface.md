---
title: Exchange Interface
description: 'Information on the usage of the futures exchange interface class'
position: 15
version: 1.0
category: Framework
---

The Futures Exchange Interface object is similar to the Exchange object, except it is designed to work with exchanges or brokerages
that trade perpetual futures. 


## Creation

Interfaces are pre-generated when an `exchange` object is created. They can then be accessed by using `.get_interface()`
on an exchange:

```python
import blankly
from blankly import futures

exchange = futures.BinanceFutures()

interface = exchange.get_interface()  # Use the getter

print(interface.get_account())
```

# Functions

### `get_exchange_type()`

Determine which exchange an interface is running on.

#### Response

| Possible Response | Description                              | Type |
| ----------------- | ---------------------------------------- | ---- |
| `coinbase_pro`    | The interface is running on Coinbase Pro | str  |
| `binance`         | The interface is running on Binance      | str  |
| `alpaca`          | The interface is running on Alpaca       | str  |

### `get_products()`

Get all trading pairs currently on the exchange.

#### Response

```python
[
    {
        "symbol": "BTC-USD",
        "base_asset": "BTC",
        "quote_asset": "USD",
        "price_precision": 2,
        "size_precision": 4,
    },
    ...
]
```

| Key             | Description                                    | Type |
|-----------------|------------------------------------------------|------|
| symbol          | The currency pair of this future               | str  |
| base_asset      | The base asset in the trading pair             | str  |
| quote_asset     | The quote asset in the trading pair            | str  |
| price_precision | Precision that should be used for limit prices | int  |
| size_precision  | Precision that should be used for order sizing | int  |

### `get_account(symbol=None)`

Gets the current account holdings if symbol is None, otherwise will return the symbol holdings.
**Important**: If you're using futures you may want `.get_positions()`. The positions you take when you buy or sell contracts will show up there, `.get_account()` is not very useful in FuturesExchangeInterface.

#### Arguments

| Arg    | Description                                                  | Examples       | Type |
| ------ | ------------------------------------------------------------ | -------------- | ---- |
| symbol | Optionally fill with a specific account value to filter for. This should be a base asset. | "BTC" or "USD" | str  |

#### Response

If `symbol='USD'`:

```python
{
    "available": 1000.23,
    "hold": 0.0
}
```

If `symbol=None`:

```python
{
  "USD": {
      "available": 1000.23,
      "hold": 0.0
  }
}
```

| Key             | Description                                                  | Type  |
|-----------------| ------------------------------------------------------------ | ----- |
| `USD` (example) | Currency or asset this account is associated with            | str   |
| available       | Amount of account asset that is free to be placed on orders or sold | float |
| hold            | Amount of account asset that is currently on orders, or generally unavailable | float |

### `market_order(symbol, side, size) -> MarketOrder`

Create a new live market order.

#### Arguments

| Arg    | Description                                                     | Examples               | Type  |
| ------ |-----------------------------------------------------------------|------------------------| ----- |
| symbol | Identifier for the product to order                             | "BTC-USD" or "XLM-EUR" | str   |
| side   | Buy or sell your position. Sell to go short and buy to go long. | "buy" or "sell"        | str   |
| size   | Amount of **base** to buy or sell.                              | 2.3, 0.03              | float |

#### Response

A `FuturesOrder` object. Documentation can be found [here](/orders/futures_order)

### `limit_order(symbol, side, price, size) -> LimitOrder`

Create a new live limit order on your exchange.

#### Arguments

| Arg    | Description                                                     | Examples               | Type  |
| ------ |-----------------------------------------------------------------|------------------------| ----- |
| symbol | Identifier for the product to order                             | "BTC-USD" or "XLM-EUR" | str   |
| side   | Buy or sell your position. Sell to go short and buy to go long. | "buy" or "sell"        | str   |
| price  | Price to place the order at.                                    | 32000 or 15000         | float |
| size   | Amount of **base** to buy or sell.                              | 2.3, 0.03              | float |

#### Response

A `FuturesOrder` object. Documentation can be found [here](/orders/futures_order)

### `take_profit_order(symbol, price, size) -> TakeProfitOrder`

Create a new live take-profit order on your exchange. This is a market sell order that will execute when the price reaches a certain high.

#### Arguments

| Arg    | Description                                                                       | Examples               | Type  |
| ------ |-----------------------------------------------------------------------------------|------------------------| ----- |
| symbol | Identifier for the product to order                                               | "BTC-USD" or "XLM-EUR" | str   |
| side   | Sell to go short and buy to go long.                                              | "buy" or "sell"        | str   |
| price  | Price to place the order at. This should be greater than the current asking price | 32000 or 15000         | float |
| size   | Amount of **base** to sell. This means "BTC" or "XLM."                            | 0.1185                 | float |

#### Response

A `FuturesOrder` object. Documentation can be found [here](/orders/futures_order)

### `stop_loss_order(symbol, price, size) -> StopLossOrder`

Create a new live stop-loss order on your exchange. This is a market sell order that will execute when the price reaches a certain low.

#### Arguments

| Arg    | Description                                                                     | Examples               | Type  |
| ------ |---------------------------------------------------------------------------------|------------------------| ----- |
| symbol | Identifier for the product to order                                             | "BTC-USD" or "XLM-EUR" | str   |
| side   | Sell to go short and buy to go long.                                            | "buy" or "sell"        | str   |
| price  | Price to place the order at. This should be lower than the current asking price | 32000 or 15000         | float |
| size   | Amount of **base** to sell. This means "BTC" or "XLM."                          | 0.1185                 | float |

#### Response

A `FuturesOrder` object. Documentation can be found [here](/orders/futures_order)

### `cancel_order(symbol, order_id) -> dict`

Cancel a particular order.

#### Arguments

| Arg      | Description                                                                                          | Examples                             | Type |
| -------- |------------------------------------------------------------------------------------------------------| ------------------------------------ | ---- |
| symbol   | The identifier for the product to order                                                              | "BTC-USD" or "XLM-USD"               | str  |
| order_id | The unique identifier for the order. This can be found in the `.id` field of a `FuturesOrder` object | b6d2f951-dae0-89e8-3e79-b460b1e9eead | str  |

#### Response

A `FuturesOrder` object. Documentation can be found [here](/orders/futures_order)

### `get_open_orders(symbol=None)`

Get a full list of open orders.

#### Arguments

| Key    | Description                                                 | Examples               | type |
| ------ | ----------------------------------------------------------- | ---------------------- | ---- |
| symbol | Optionally fill with an identifier for the product to order | "BTC-USD" or "XLM-USD" | str  |

### Response

A list of `FuturesOrder` objects, each representing one open order. Documentation can be found [here](/orders/futures_order)

### `get_order(symbol, order_id) -> dict`

Get info about a particular order.

#### Arguments

| Arg      | Description                                                  | Examples                             | Type |
| -------- | ------------------------------------------------------------ | ------------------------------------ | ---- |
| symbol   | The identifier for the product to order                      | "BTC-USD" or "XLM-USD"               | str  |
| order_id | The exchange-given unique identifier for the order. This can be found using an `order` object. With `.get_id()` | b6d2f951-dae0-89e8-3e79-b460b1e9eead | str  |

#### Response

A `FuturesOrder` object. Documentation can be found [here](/orders/futures_order)

### `get_fees() -> dict`

Get the maker and taker fee rates of a particular exchange.

#### Response

```python
{
    "maker": 0.0050,
    "taker": 0.0050
}
```

| Key            | Description                           | Type  |
| -------------- | ------------------------------------- | ----- |
| maker_fee_rate | Exchange maker fee rate. (89% = 0.89) | float |
| taker_fee_rate | Exchange taker fee rate. (89% = 0.89) | float |

### `get_leverage(symbol=None) -> leverage, set_leverage(leverage, symbol=None)`

Used for getting and setting leverage. If symbol is `None`, this will set account-wide leverage. Note that not all
exchanges support this.

#### Arguuments

| Arg      | Description                             | Examples               | Type  |
|----------|-----------------------------------------|------------------------|-------|
| symbol   | The identifier for the product to order | "BTC-USD" or "XLM-USD" | str   |
| leverage | The amount of leverage.                 | 3, 20                  | float |

#### Response

`get_leverage(symbol=None)` will return the leverage for `symbol`, or account wide leverage if `symbol` is None.

### `history(symbol, to = 200, resolution = '1d', start_date = None, end_date = None, return_as = 'df') -> pandas.DataFrame`

Download historical data with rows of *at least* `time (epoch seconds)`, `low`', `high`, `open`, `close`, `volume` as
columns. This is a wrapper for `get_product_history()`, and exists to allow users to more easily download OHCLV data

#### Arguments

| Arg        | Description                                                  | Examples                        | Type                 |
| ---------- | ------------------------------------------------------------ | ------------------------------- |----------------------|
| symbol     | The identifier for the product to order                      | "BTC-USD" or "XLM-USD"          | str                  |
| to         | Time from exactly now to begin downloading from (`'1y'` would download the last year of data at the granularity resolution). If passed an integer that will be the number of bars instead of a length of time. | 86453 or `'1y'` or '`2h`'       | int or str            |
| resolution | Resolution as a time string (`1m`, `4h`, `1d`, `1y`)         | `1m`, `1d`, `4h`                | str                  |
| start_date | Starts history collection at a given start date (must have an `end_date` associated with it). This can be a datetime, a date string or an epoch timestamp | `'2018-05-02'`, `123849`        | str, float, datetime |
| end_date   | End Date for history collection, can be used in conjunction with `start_date` or `to` | `'2018-05-02'`, `123849`        | str, float, datetime |
| return_as  | Choose if the return type should be a dataframe with columns or a dictionary with keys that match the columns. It also allows pandas orient values of `'dict', 'list', 'series', 'split', 'records', 'index'`. We highly recommned `'deque'` for any operations with technical indicators | `'list'` or `'df'` or `'deque'` | str                  |

#### Response

Pandas dataframe with at least these columns.

| time       | low     | high    | open    | close   | volume        |
| ---------- | ------- | ------- | ------- | ------- | ------------- |
| 1591110000 | 9270.0  | 9602.0  | 9583.36 | 9464.46 | 5979.77327365 |
| 1591113600 | 9417.38 | 9510.94 | 9464.44 | 9478.95 | 1185.12835638 |

Or if `return_as` is set to `list`:

```python
{
    'time': [1591110000, 1591113600],
    'low': [9270.0, 9417.38],
    'open': [9583.36, 9464.44],
    'close': [9464.46, 9478.95],
    'volume': [5979.77327365, 1185.12835638]
}
```

#### Example Use Case

```python
a = Alpaca()
interface = a.Interface
interface.history('MSFT', to=300, resolution='15m',
                  end_date='2020-05-03')  # get 300 points from May 3rd, 2020 as a dataframe
interface.history('MSFT', to=300, resolution='15m', end_date='2020-05-03', return_as='list')[
    'close']  # get 300 points from May 3rd, 2020 as a dictionary of np.arrays
```

### `get_product_history(symbol, epoch_start, epoch_stop, resolution) -> pandas.DataFrame`

Download historical data with rows of *at least* `time (epoch seconds)`, `low`', `high`, `open`, `close`, `volume` as
columns.

### Arguments

| Arg         | Description                                                  | Examples               | Type       |
| ----------- | ------------------------------------------------------------ | ---------------------- | ---------- |
| symbol      | The identifier for the product to order                      | "BTC-USD" or "XLM-USD" | str        |
| epoch_start | Starting download time in epoch                              | 1591389962             | float      |
| epoch_stop  | Ending download time in epoch                                | 1622925962             | float      |
| resolution  | Resolution in seconds in each candle (ex: 60 = 1 per minute, 3600 = 1 per hour) | 3600                   | str or int |

#### Response

Pandas dataframe with at least these columns.

| time       | low     | high    | open    | close   | volume        |
| ---------- | ------- | ------- | ------- | ------- | ------------- |
| 1591110000 | 9270.0  | 9602.0  | 9583.36 | 9464.46 | 5979.77327365 |
| 1591113600 | 9417.38 | 9510.94 | 9464.44 | 9478.95 | 1185.12835638 |

### `get_price(symbol) -> float`

Get the quoted price of the trading pair.

### Arguments

| Arg    | Description                    | Examples               | Type |
| ------ |--------------------------------| ---------------------- | ---- |
| symbol | The identifier for the product | "BTC-USD" or "XLM-USD" | str  |

#### Response

Returns a `float` which is the price of the trading pair, such as `53000` or `35000`.

### `get_funding_rate(symbol) -> float`

Get the current funding rate of the symbol.

### Arguments

| Arg    | Description                    | Examples               | Type |
| ------ |--------------------------------| ---------------------- | ---- |
| symbol | The identifier for the product | "BTC-USD" or "XLM-USD" | str  |

#### Response

Returns a `float` which is the current funding rate of the trading pair, such as `0.0001` or `-0.0001`.

### `.cash -> float`

Get the amount of cash (generally the quote currency) inside the portfolio. This default quote can be set in
the `settings.json` file for each exchange independently. This is used as a shortcut for easily determining buying power
when making a transaction. This property is configurable because users may be using a variety of cash quotes such
as `USD`, `USDT`, `USDC` or `EUR`. See [here](/usage/settings.json#format).

### Response

A single float which represents the size value of the account defined in `settings.json`.

```python
5931.533
```
