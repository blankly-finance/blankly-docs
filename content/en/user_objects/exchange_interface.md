---
title: Exchange Interface
description: 'Information on the usage of the exchange interface class'
position: 1
category: User Objects
---

# Interface

## Theory

The interface class provides a consistent way of interacting with the supported exchanges.

**The idea is that as long as scripts aren't using "exchange specific" information, if all calls are run through here, then it gives the developer the ability to** ***instantly switch between exchanges***. The backtesting framework also requires that the calls are made through the interface.

This means a few things about the information through the Interface:

- **Pre-typed.** Information guaranteed by the interface comes pre-casted. Most information sent from API's comes as strings, but the interface class converts these for easy access.
- **Less Detailed.** Different exchanges give different data. We try to pick out the most important bits of information to conecrate on maintaining, but some of it will end up in the `exchange_specific` tag on the dictionary returned.
- **Multiple API Calls**. Sometimes to accumulate the data required to tell the user everything they need to know, it requires multiple API calls to be run in the background.

# Rest API Functions

## get_calls()

Get the direct RESTful exchange object that the interface is using. 

**Where is my IDE linting (autocomplete)?**

If you want **easy linting**, its better to use an exchange object and use `.get_direct_calls()`

You can also create linting by assigning it one of these types depending on which is accurate context:

- `from Blankly.exchanges.Coinbase_Pro.Coinbase_Pro_API import API	`
- `from Blankly.exchanges.Binance.Binance_API import API	`
- `from Blankly.exchanges.Alpaca.Alpaca_API import API`

## get_exchange_type()

Determine which exchange an interface is running on.

### Response

| Possible Response | Description                              | Type |
| ----------------- | ---------------------------------------- | ---- |
| `coinbase_pro`    | The interface is running on Coinbase Pro | str  |
| `binance`         | The interface is running on Binance      | str  |
| `alpaca`          | The interface is running on Alpaca       | str  |

## get_products()

Get all trading pairs currently on the exchange.

### Response

```python
[
  {
    "currency_id": "BTC-USD",
    "base_currency": "BTC",
  	"quote_currency": "USD",
  	"base_min_size": 0.0001,
  	"base_max_size": 280,
  	"base_increment": .01
  },
	...
]
```

| Key            | Description                                                  | Type  |
| -------------- | ------------------------------------------------------------ | ----- |
| currency_id    | The currency pair of this exchange's products                | str   |
| base_currency  | The base currency in the trading pair                        | str   |
| quote_currency | The quote currency in the trading pair                       | str   |
| base_min_size  | Smallest amount of base currency that can be bought on the exchange | float |
| base_max_size  | Largest amount of base currency that can be bought on the exchange | float |
| base_increment | The finest resolution the base currency can be ordered in    | float |

## get_account(currency=None)

### Arguments

| Arg      | Description                                                  | Examples       | Type |
| -------- | ------------------------------------------------------------ | -------------- | ---- |
| currency | Optionally fill with a specific account value to filter for. | "BTC" or "USD" | str  |

### Response

If `currency='BTC'`:

```python
[
  {
    "currency": "BTC",
    "available": 2.3,
    "hold": 0.2
  },
  ...
]
```

‌If `currency=None`:

```python
{
  "currency": "BTC",
  "available": 2.3,
  "hold": 0.2
}
```

| Key       | Description                                                  | Type  |
| --------- | ------------------------------------------------------------ | ----- |
| currency  | Currency or asset this account is associated with            | str   |
| available | Amount of account asset that is free to be placed on orders or sold | float |
| hold      | Amount of account asset that is currently on orders, or generally unavailable. | float |

## market_order(product_id, side, funds) -> MarketOrder

Create a new live market order.

### Arguments

| Arg        | Description                                                  | Examples               | Type  |
| ---------- | ------------------------------------------------------------ | ---------------------- | ----- |
| product_id | Identifier for the product to order                          | "BTC-USD" or "XLM-EUR" | str   |
| side       | Buy or sell your position                                    | "buy" or "sell"        | str   |
| funds      | Amount of **quote** to buy or sell. This means "USD" or "EUR." <br />Note that this is opposite of limit order, which uses size. <br / <br />Buying 10 dollars of "BTC-USD" would have args: ("BTC-USD", "buy", 10) | 10.5 or 351.2          | float |

### Response

A `market_order` object. Documentation is pending.

## limit_order(product_id, side, price, size) -> LimitOrder

Create a new live limit order on your exchange.

### Arguments

| Arg        | Description                                                  | Examples               | Type  |
| ---------- | ------------------------------------------------------------ | ---------------------- | ----- |
| product_id | Identifier for the product to order                          | "BTC-USD" or "XLM-EUR" | str   |
| side       | Create a buy or sell position                                | "buy" or "sell"        | str   |
| price      | Price to place the order at. In general, be careful to place your order on the correct side of the order book. | 32000 or 15000         | float |
| size       | Amount of **base** to buy or sell. This means "BTC" or "XLM." Note that this is opposite of market order, which uses funds.<br />Buying 2.3 bitcoin at 20k dollars would have args: ("BTC-USD", "buy", 20000, 2.3) | 2.3 or .001            | float |

### Response

A `limit_order` object. Documentation is pending.

## cancel_order(currency_id, order_id) -> dict

Cancel a particular order.

### Arguments

| Arg         | Description                                                  | Examples                             | Type |
| ----------- | ------------------------------------------------------------ | ------------------------------------ | ---- |
| currency_id | The identifier for the product to order                      | "BTC-USD" or "XLM-USD"               | str  |
| order_id    | The exchange-given unique identifier for the order. This can be found using an `order` object. With `.get_id()` | b6d2f951-dae0-89e8-3e79-b460b1e9eead | str  |
|             |                                                              |                                      |      |

### Response

```python
{
	"order_id": "b6d2f951-dae0-89e8-3e79-b460b1e9eead"
}
```

| Key      | Description                  | Type |
| -------- | ---------------------------- | ---- |
| order_id | The id of the canceled order | str  |

## get_open_orders(product_id=None)

Get a full list of open orders

### Arguments

| Key        | Description                                                 | Examples               | type |
| ---------- | ----------------------------------------------------------- | ---------------------- | ---- |
| product_id | Optionally fill with an identifier for the product to order | "BTC-USD" or "XLM-USD" | str  |

### Response

```python
[
	{
		'id': 'dfa936a4-ea8b-4dbf-bb99-b2b632a5370a', 
		'price': 10000.0, 
		'size': 1.0, 
		'product_id': 'BTC-USD', 
		'side': 'buy', 
		'type': 'limit', 
		'status': 'open'
	},
	...
]
```

| Key        | Description                                                  | Type  |
| ---------- | ------------------------------------------------------------ | ----- |
| id         | Exchange-specific order identifier                           | str   |
| price      | Price the limit is set at                                    | float |
| size       | Size of the limit (in base currency)                         | float |
| product_id | Identifier for the product the order is on                   | str   |
| side       | Describes if the order is buying or selling                  | str   |
| type       | Open orders can be "market," "limit," or "stop." This shows which of those types is valid | str   |
| status     | Order status can be "open" "pending" or "closed"             | str   |

## get_order(currency_id, order_id) -> dict

Get info about a particular order. If the objects returned by placing orders are saved, this function shouldn't need to be used.

### Arguments

| Arg         | Description                                                  | Examples                             | Type |
| ----------- | ------------------------------------------------------------ | ------------------------------------ | ---- |
| currency_id | The identifier for the product to order                      | "BTC-USD" or "XLM-USD"               | str  |
| order_id    | The exchange-given unique identifier for the order. This can be found using an `order` object. With `.get_id()` | b6d2f951-dae0-89e8-3e79-b460b1e9eead | str  |

### Response

```python
{
  'id': 'dfa936a4-ea8b-4dbf-bb99-b2b632a5370a', 
  'price': 10000.0, 
  'size': 1.0, 
  'product_id': 'BTC-USD', 
  'side': 'buy', 
  'type': 'limit', 
  'status': 'open'
}
```

| Key        | Description                                                  | Type  |
| ---------- | ------------------------------------------------------------ | ----- |
| id         | Exchange-specific order identifier                           | str   |
| price      | Price the limit is set at                                    | float |
| size       | Size of the limit (in base currency)                         | float |
| product_id | Identifier for the product the order is on                   | str   |
| side       | Describes if the order is buying or selling                  | str   |
| type       | Open orders can be "market," "limit," or "stop." This shows which of those types is valid | str   |
| status     | Order status can be "open" "pending" or "closed"             | str   |

## get_fees() -> dict

Get the maker and taker fee rates of a particular exchange.

### Response

```python
{
  "maker_fee_rate": 0.0050,
  "taker_fee_rate": 0.0050
}
```

| Key            | Description                           | Type  |
| -------------- | ------------------------------------- | ----- |
| maker_fee_rate | Exchange maker fee rate. (89% = 0.89) | float |
| taker_fee_rate | Exchange taker fee rate. (89% = 0.89) | float |

## get_product_history(product_id, epoch_start, epoch_stop, granularity) -> pandas.DataFrame

Download historical data with rows of *at least* `time (epoch seconds)`, `low`', `high`, `open`, `close`, `volume` as columns.

### Arguments

| Arg         | Description                                                  | Examples               | Type  |
| ----------- | ------------------------------------------------------------ | ---------------------- | ----- |
| product_id  | The identifier for the product to order                      | "BTC-USD" or "XLM-USD" | str   |
| epoch_start | Starting download time in epoch                              | 1591389962             | float |
| epoch_stop  | Ending download time in epoch                                | 1622925962             | float |
| granularity | Resolution in seconds in each candle (ex: 60 = 1 per minute, 3600 = 1 per hour) | 3600                   | int   |

### Response

Pandas dataframe with at least these columns.

| time       | low     | high    | open    | close   | volume        |
| ---------- | ------- | ------- | ------- | ------- | ------------- |
| 1591110000 | 9270.0  | 9602.0  | 9583.36 | 9464.46 | 5979.77327365 |
| 1591113600 | 9417.38 | 9510.94 | 9464.44 | 9478.95 | 1185.12835638 |

## get_market_limits(product_id)

Find the limits that the exchange puts on purchases.

### Arguments

| Arg        | Description                             | Examples               | Type |
| ---------- | --------------------------------------- | ---------------------- | ---- |
| product_id | The identifier for the product to order | "BTC-USD" or "XLM-USD" | str  |

### Response

```python
{
	'base_currency': 'BTC',
  'quote_currency': 'USD',
  'base_min_size': 0.001,
  'base_max_size': 10000.0,
  'quote_increment': 0.01,
  'base_increment': 1e-08,
  'market': 'BTC-USD',
  'min_price': 0.0,
  'max_price': -1.0,
  'max_orders': -1,
}
```

| Key             | Description                                                  | Type  |
| --------------- | ------------------------------------------------------------ | ----- |
| base_currency   | The base currency of this market                             | str   |
| quote_currency  | The quote currency of this market                            | str   |
| base_min_size   | The minimum size to buy of base                              | float |
| base_max_size   | The maximum amount of base currency to buy                   | float |
| quote_increment | The resolution of the quote currency when placing orders     | float |
| base_increment  | The resolution of the base increment when placing orders     | float |
| market          | The trading pair that the market limits correspond to        | str   |
| min_price       | The minimum limit price that can be set                      | float |
| max_price       | The maximum price that the limit can be set                  | float |
| max_orders      | The maximum number of orders that the exchange allows on a currency pair | float |

## get_price(currency_pair) -> float

Get the quoted price of the trading pair.

### Arguments

| Arg        | Description                             | Examples               | Type |
| ---------- | --------------------------------------- | ---------------------- | ---- |
| product_id | The identifier for the product to order | "BTC-USD" or "XLM-USD" | str  |

### Response

- Returns a `float` which is the price of they trading pair, such as `53000` or `35000`.
