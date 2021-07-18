---
title: Exchange Interface
description: 'Information on the usage of the exchange interface class'
position: 21
version: 1.0
category: Framework
---

## Theory

The interface class provides a consistent way of interacting with the supported exchanges.

**The idea is that as long as scripts aren't using "exchange specific" information, if all calls are run through here, then it gives the developer the ability to** ***instantly switch between exchanges***. The backtesting framework also requires that the calls are made through the interface.

This means a few things about the information through the Interface:

- **Pre-typed.** Information guaranteed by the interface comes pre-casted. Most information sent from API's comes as strings, but the interface class converts these for easy access.
- **Less Detailed.** Different exchanges give different data. We try to pick out the most important bits of information to conecrate on maintaining, but some of it will end up in the `exchange_specific` tag on the dictionary returned.
- **Multiple API Calls**. Sometimes to accumulate the data required to tell the user everything they need to know, it requires multiple API calls to be run in the background.
- **Supports Paper Trading & Backtesting**. To use paper trading & backtesting features all calls must be run through the interface. 

The interface can grow and change based on user feedback - if you see an important feature we're missing, tell us in the GitHub issues page.

## Creation

Interfaces are pre-generated when an `exchange` object is created. They can then be accessed by using `.get_interface()` on an exchange:

```python
import blankly

exchange = blankly.CoinbasePro()  # This can be .Binance() or .Alpaca() or anything else supported

interface = exchange.get_interface()  # Use the getter

print(interface.get_account())
```

## Rest API Functions

### `get_calls()`

Get the direct RESTful exchange object that the interface is using. 

**Where is my IDE linting (autocomplete)?**

If you want **easy linting**, its better to use an exchange object and use `.get_direct_calls()`

You can also create linting by assigning it one of these types depending on which is accurate context:

- `from blankly.exchanges.interfaces.coinbase_pro.coinbase_pro_api import API`
- `from blankly.exchanges.interfaces.binance.binance_api import API	`
- `from blankly.exchanges.interfaces.alpaca.alpaca_api import API`

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
  	"base_min_size": 0.0001,
  	"base_max_size": 280,
  	"base_increment": .01
  },
	...
]
```

| Key            | Description                                                  | Type  |
| -------------- | ------------------------------------------------------------ | ----- |
| symbol         | The currency pair of this exchange's products                | str   |
| base_asset     | The base asset in the trading pair                           | str   |
| quote_asset    | The quote asset in the trading pair                          | str   |
| base_min_size  | Smallest amount of base currency that can be bought on the exchange | float |
| base_max_size  | Largest amount of base currency that can be bought on the exchange | float |
| base_increment | The finest resolution the base currency can be ordered in    | float |

### `get_account(currency=None)`

#### Arguments

| Arg      | Description                                                  | Examples       | Type |
| -------- | ------------------------------------------------------------ | -------------- | ---- |
| currency | Optionally fill with a specific account value to filter for | "BTC" or "USD" | str  |

#### Response

If `currency='BTC'`:

```python
{
  "available": 2.3,
  "hold": 0.2
}
```

‌If `currency=None`:

```python
"BTC": {
	"available": 2.3,
  "hold": 0.2
},
"USD": {
  "available": 4352,
  "hold": 23
}
```

| Key                      | Description                                                  | Type  |
| ------------------------ | ------------------------------------------------------------ | ----- |
| `BTC` or `USD` (example) | Currency or asset this account is associated with            | str   |
| available                | Amount of account asset that is free to be placed on orders or sold | float |
| hold                     | Amount of account asset that is currently on orders, or generally unavailable | float |

### `market_order(symbol, side, funds) -> MarketOrder`

Create a new live market order.

#### Arguments

| Arg    | Description                                                  | Examples               | Type  |
| ------ | ------------------------------------------------------------ | ---------------------- | ----- |
| symbol | Identifier for the product to order                          | "BTC-USD" or "XLM-EUR" | str   |
| side   | Buy or sell your position                                    | "buy" or "sell"        | str   |
| funds  | Amount of **quote** to buy or sell. This means "USD" or "EUR." Note that this is opposite of limit order, which uses size. Buying 10 dollars of "BTC-USD" would have args: ("BTC-USD", "buy", 10). | 10.5 or 351.2          | float |

#### Response

A `market_order` object. Documentation is pending.

### `limit_order(symbol, side, price, size) -> LimitOrder`

Create a new live limit order on your exchange.

#### Arguments

| Arg    | Description                                                  | Examples               | Type  |
| ------ | ------------------------------------------------------------ | ---------------------- | ----- |
| symbol | Identifier for the product to order                          | "BTC-USD" or "XLM-EUR" | str   |
| side   | Create a buy or sell position                                | "buy" or "sell"        | str   |
| price  | Price to place the order at. In general, be careful to place your order on the correct side of the order book | 32000 or 15000         | float |
| size   | Amount of **base** to buy or sell. This means "BTC" or "XLM." Note that this is opposite of market order, which uses funds.<br />Buying 2.3 bitcoin at 20k dollars would have args: ("BTC-USD", "buy", 20000, 2.3) | 2.3 or .001            | float |

#### Response

A `limit_order` object. Documentation is pending.

### `cancel_order(symbol, order_id) -> dict`

Cancel a particular order.

### Arguments

| Arg      | Description                                                  | Examples                             | Type |
| -------- | ------------------------------------------------------------ | ------------------------------------ | ---- |
| symbol   | The identifier for the product to order                      | "BTC-USD" or "XLM-USD"               | str  |
| order_id | The exchange-given unique identifier for the order. This can be found using an `order` object. With `.get_id()` | b6d2f951-dae0-89e8-3e79-b460b1e9eead | str  |

### Response

```python
{
	"order_id": "b6d2f951-dae0-89e8-3e79-b460b1e9eead"
}
```

| Key      | Description                  | Type |
| -------- | ---------------------------- | ---- |
| order_id | The id of the canceled order | str  |

## `get_open_orders(symbol=None)`

Get a full list of open orders.

### Arguments

| Key    | Description                                                 | Examples               | type |
| ------ | ----------------------------------------------------------- | ---------------------- | ---- |
| symbol | Optionally fill with an identifier for the product to order | "BTC-USD" or "XLM-USD" | str  |

### Response

```python
[
	{
		'id': 'dfa936a4-ea8b-4dbf-bb99-b2b632a5370a', 
		'price': 10000.0, 
		'size': 1.0, 
		'symbol': 'BTC-USD', 
		'side': 'buy', 
		'type': 'limit', 
		'status': 'open'
	},
	...
]
```

| Key    | Description                                                  | Type  |
| ------ | ------------------------------------------------------------ | ----- |
| id     | Exchange-specific order identifier                           | str   |
| price  | Price the limit is set at                                    | float |
| size   | Size of the limit (in base currency)                         | float |
| symbol | Identifier for the product the order is on                   | str   |
| side   | Describes if the order is buying or selling                  | str   |
| type   | Open orders can be "market," "limit," or "stop." This shows which of those types is valid. | str   |
| status | Order status can be "open" "pending" or "closed"             | str   |

### `get_order(symbol, order_id) -> dict`

Get info about a particular order. If the objects returned by placing orders are saved, this function shouldn't need to be used.

#### Arguments

| Arg      | Description                                                  | Examples                             | Type |
| -------- | ------------------------------------------------------------ | ------------------------------------ | ---- |
| symbol   | The identifier for the product to order                      | "BTC-USD" or "XLM-USD"               | str  |
| order_id | The exchange-given unique identifier for the order. This can be found using an `order` object. With `.get_id()` | b6d2f951-dae0-89e8-3e79-b460b1e9eead | str  |

#### Response

```python
{
  'id': 'dfa936a4-ea8b-4dbf-bb99-b2b632a5370a', 
  'price': 10000.0, 
  'size': 1.0, 
  'symbol': 'BTC-USD', 
  'side': 'buy', 
  'type': 'limit', 
  'status': 'open'
}
```

| Key    | Description                                                  | Type  |
| ------ | ------------------------------------------------------------ | ----- |
| id     | Exchange-specific order identifier                           | str   |
| price  | Price the limit is set at                                    | float |
| size   | Size of the limit (in base currency)                         | float |
| symbol | Identifier for the product the order is on                   | str   |
| side   | Describes if the order is buying or selling                  | str   |
| type   | Open orders can be "market," "limit," or "stop." This shows which of those types is valid | str   |
| status | Order status can be "open" "pending" or "closed"             | str   |

### `get_fees() -> dict`

Get the maker and taker fee rates of a particular exchange.

#### Response

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

### `history(symbol, to=200, resolution='1d', start_date=None, end_date=None) -> pandas.DataFrame`

Download historical data with rows of *at least* `time (epoch seconds)`, `low`', `high`, `open`, `close`, `volume` as columns. This is a wrapper for `get_product_history()`, and exists to allow users to more easily download OHCLV data

#### Arguments

| Arg        | Description                                                  | Examples                  | Type                 |
| ---------- | ------------------------------------------------------------ | ------------------------- | -------------------- |
| symbol     | The identifier for the product to order                      | "BTC-USD" or "XLM-USD"    | str                  |
| to         | Time from exactly now to begin downloading from (`'1y'` would download the last year of data at the granularity resolution). | 86453 or `'1y'` or '`2h`' | float or str         |
| resolution | Resolution as a time string (`1m`, `4h`, `1d`, `1y`)         | `1m`, `1d`, `4h`          | str                  |
| start_date | Starts history collection at a given start date (must have an `end_date` associated with it). This can be a datetime, a date string or an epoch timestamp | `'2018-05-02'`, `123849`  | str, float, datetime |
| end_date   | End Date for history collection, can be used in conjunction with `start_date` or `to` | `'2018-05-02'`, `123849`  | str, float, datetime |

#### Response

Pandas dataframe with at least these columns.

| time       | low     | high    | open    | close   | volume        |
| ---------- | ------- | ------- | ------- | ------- | ------------- |
| 1591110000 | 9270.0  | 9602.0  | 9583.36 | 9464.46 | 5979.77327365 |
| 1591113600 | 9417.38 | 9510.94 | 9464.44 | 9478.95 | 1185.12835638 |

#### Example Use Case

```python
a = Alpaca()
interface = a.Interface
interface.history('MSFT', to=300, resolution='15m', end_date='2020-05-03') # get 300 points from May 3rd, 2020
```

### `get_product_history(symbol, epoch_start, epoch_stop, granularity) -> pandas.DataFrame`

Download historical data with rows of *at least* `time (epoch seconds)`, `low`', `high`, `open`, `close`, `volume` as columns.

### Arguments

| Arg         | Description                                                  | Examples               | Type  |
| ----------- | ------------------------------------------------------------ | ---------------------- | ----- |
| symbol      | The identifier for the product to order                      | "BTC-USD" or "XLM-USD" | str   |
| epoch_start | Starting download time in epoch                              | 1591389962             | float |
| epoch_stop  | Ending download time in epoch                                | 1622925962             | float |
| granularity | Resolution in seconds in each candle (ex: 60 = 1 per minute, 3600 = 1 per hour) | 3600                   | int   |

#### Response

Pandas dataframe with at least these columns.

| time       | low     | high    | open    | close   | volume        |
| ---------- | ------- | ------- | ------- | ------- | ------------- |
| 1591110000 | 9270.0  | 9602.0  | 9583.36 | 9464.46 | 5979.77327365 |
| 1591113600 | 9417.38 | 9510.94 | 9464.44 | 9478.95 | 1185.12835638 |

### `get_asset_limits(symbol)`

Find the limits that the exchange puts on purchases for a specific asset.

#### Arguments

| Arg    | Description                             | Examples               | Type |
| ------ | --------------------------------------- | ---------------------- | ---- |
| symbol | The identifier for the product to order | "BTC-USD" or "XLM-USD" | str  |

#### Response

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

### `get_price(currency_pair) -> float`

Get the quoted price of the trading pair.

### Arguments

| Arg    | Description                             | Examples               | Type |
| ------ | --------------------------------------- | ---------------------- | ---- |
| symbol | The identifier for the product to order | "BTC-USD" or "XLM-USD" | str  |

#### Response

- Returns a `float` which is the price of the trading pair, such as `53000` or `35000`.

## Rest API Properties

These properties can be used as shortcuts for making API calls. These are built-in abstractions of the previous methods that provide functionality that is common when developing bots & models.

*Each of these performs API requests*

### `.account -> dict`

The equivalent of performing `.get_account()` with no arguments,

### Response

```python
"BTC": {
	"available": 2.3,
  "hold": 0.2
},
"USD": {
  "available": 4352,
  "hold": 23
}
```

| Key                      | Description                                                  | Type  |
| ------------------------ | ------------------------------------------------------------ | ----- |
| `BTC` or `USD` (example) | Currency or asset this account is associated with            | str   |
| available                | Amount of account asset that is free to be placed on orders or sold | float |
| hold                     | Amount of account asset that is currently on orders, or generally unavailable | float |

### `.orders -> list`

The equivalent of performing a `get_open_orders()` request with no arguments.

### Response

```python
[
	{
		'id': 'dfa936a4-ea8b-4dbf-bb99-b2b632a5370a', 
		'price': 10000.0, 
		'size': 1.0, 
		'symbol': 'BTC-USD', 
		'side': 'buy', 
		'type': 'limit', 
		'status': 'open'
	},
	...
]
```

| Key    | Description                                                  | Type  |
| ------ | ------------------------------------------------------------ | ----- |
| id     | Exchange-specific order identifier                           | str   |
| price  | Price the limit is set at                                    | float |
| size   | Size of the limit (in base currency)                         | float |
| symbol | Identifier for the product the order is on                   | str   |
| side   | Describes if the order is buying or selling                  | str   |
| type   | Open orders can be "market," "limit," or "stop." This shows which of those types is valid. | str   |
| status | Order status can be "open" "pending" or "closed"             | str   |

### `.cash -> float`

Get the amount of cash (generally the quote currency) inside the portfolio. This default quote can be set in the `settings.json` file for each exchange independently. This is used as a shortcut for easily determining buying power when making a transaction. This property is configurable because users may be using a variety of cash quotes such as `USD`, `USDT`, `USDC` or `EUR`. See [here](/usage/settings.json#format)

### Response

A single float which represents the size value of the account defined in `settings.json`.

```python
5931.533
```
