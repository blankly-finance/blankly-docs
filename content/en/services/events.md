---
title: Events API
description: 'Detached events logging for non-platform users'
position: 36
version: 1.0
category: Services
---

​	The events API enables developers from any framework to send model events, logs, trades and notifications to the blankly platform for private, secure, but still sharable viewing & interaction. This is the missing frontend for developers who want to monetize their algorithms or investors that want to have a better view of how their money is used.

​	You can use these docs, or take advantage of one of our high-speed platform SDKs for your language.

## Base URL

```
https://events.blankly.finance
```

# V1

## Authentication



## Headers

### Required

| Arg       | Description                                   | Examples             | Type   |
| --------- | --------------------------------------------- | -------------------- | ------ |
| projectid | The project id of the model to push to        | `890f0b89e0vjops09d` | string |
| modelid   | The model id of the model to push to          | `9v9b089bokwekn93d2` | string |
| versionid | The version id of the model to push to        | `ke9bsj3jtn9b39fgbn` | string |
| token     | The given token for this version of the model | `******************` | string |

### Optional

| Arg           | Description                                                  | Examples                                | Type   |
| ------------- | ------------------------------------------------------------ | --------------------------------------- | ------ |
| time          | Optionally provide a time which will be used for every event timestamp. **If not provided then server time will be used**. Format in epoch seconds as a string or in some way compatible with `Date.parse()` | `'1644682832.742'`                      | string |
| backtesting   | A value specifying if the incoming request belongs to a backtest. Must be sent with `backtestingid` | `'1'` or `'0'` or `'true'` or `'false'` | string |
| backtestingid | Must be sent with `backtesting`. This is some identifier to  | `'8dv8bowjn39b9wh'`                     | string |

## Lifecycle

Send the lifecycle of your model to the platform so you can easily see which models are running, pending or stopped.

### `POST /v1/model/lifecycle`

Update the lifecycle of this particular model. This includes when the model starts & stops as well as if it's active & it's state. All keys here are optional, any key passed overrides the current value. Pass `undefined` or `null` values to each key to reset the status.

| Arg     | Description                                                  | Examples                                              | Type    |
| ------- | ------------------------------------------------------------ | ----------------------------------------------------- | ------- |
| message | Optional key to override the message of the model status`    | `'Running'`, `'Stopped'`, `'Installing Dependencies'` | string  |
| startAt | Optional key to override the start time of the model in epoch seconds | `1644682832.742`                                      | float   |
| endAt   | Optional key to override the end time of the model in epoch seconds | `1644682832.742`                                      | float   |
| running | Optional boolean to specify if the model is running or not   | `true` or `false`                                     | boolean |

## Monitoring

Post a wide variety of attributes of your model to the platform for a more complete & accurate view

### `POST /v1/model/used-symbol`

| Arg    | Description                                  | Examples              | Type   |
| ------ | -------------------------------------------- | --------------------- | ------ |
| symbol | Symbol to add to the platform for this model | `'BTC-USD'`, `'AAPL'` | string |

### `POST /v1/model/used-exchange`

| Arg      | Description                                    | Examples                     | Type   |
| -------- | ---------------------------------------------- | ---------------------------- | ------ |
| exchange | Exchange to add to the platform for this model | `'alpaca'`, `'coinbase_pro'` | string |

## Event

### `POST /v1/live/event`

This is any generic event - generally a function call - to export to the platform. This will not be visualized on any chart but will be shown inside an event log.

| Arg        | Description                                                  | Examples                                         | Type   |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------ | ------ |
| args       | Any arguments that are relevant to the event (normally function args) as a dictionary | `{'testing_enabled': true, 'symbol': 'BTC-USD'}` | dict   |
| response   | The response to register into the event                      | `{'message': 'Event success'}`                   | dict   |
| type       | Any custom category to log as the event                      | `get_price` or `exchange_callback`               | string |
| annotation | An optional reasoning or context for this action             | `'RSI low'`                                      | string |

## Orders

### `POST /v1/live/spot-market`

A basic market order done on a spot exchange (no leverage, margin, or shorting).The trade will be graphed for visualization & added to PNL calculation.

| Arg        | Description                                                  | Examples                                 | Type   |
| ---------- | ------------------------------------------------------------ | ---------------------------------------- | ------ |
| symbol     | The order symbol                                             | `'BTC-USD'` or `'AAPL'`                  | string |
| size       | The quantity of the order (2 BTC). Cannot be sent with `funds`. | `2` or `8.3`                             | float  |
| funds      | The amount of quote currency used in the order (183 dollars). Cannot be sent with `size`. | `129.32` or `542.22`                     | float  |
| id         | The exchange-given order id                                  | `'2ebbda7c-5ce1-4b1d-81fd-b1beab7553a7'` | string |
| side       | The order side - buy or sell                                 | `'buy'` or `'sell'`                      | string |
| annotation | An optional reasoning or context for this action             | `'RSI low'`                              | string |

### `POST /v1/live/spot-limit`

A basic limit order done on a spot exchange (no leverage, margin, or shorting).The trade will be graphed for visualization & added to PNL calculation.

| Arg        | Description                                                  | Examples                                 | Type   |
| ---------- | ------------------------------------------------------------ | ---------------------------------------- | ------ |
| symbol     | The order symbol                                             | `'BTC-USD'` or `'AAPL'`                  | string |
| size       | The quantity of the order (2 BTC). Cannot be sent with `funds`. | `2` or `8.3`                             | float  |
| funds      | The amount of quote currency used in the order (183 dollars). Cannot be sent with `size`. | `129.32` or `542.22`                     | float  |
| id         | The exchange-given order id                                  | `'2ebbda7c-5ce1-4b1d-81fd-b1beab7553a7'` | string |
| side       | The order side - buy or sell                                 | `'buy'` or `'sell'`                      | string |
| price      | The price the limit order is set for execution               | `2532.43`                                | float  |
| annotation | An optional reasoning or context for this action             | `'RSI low'`                              | string |

### `POST /v1/live/spot-stop`

A basic limit order done on a spot exchange (no leverage, margin, or shorting).The trade will be graphed for visualization & added to PNL calculation.

| Arg        | Description                                                  | Examples                                 | Type   |
| ---------- | ------------------------------------------------------------ | ---------------------------------------- | ------ |
| symbol     | The order symbol                                             | `'BTC-USD'` or `'AAPL'`                  | string |
| size       | The quantity of the order (2 BTC). Cannot be sent with `funds`. | `2` or `8.3`                             | float  |
| funds      | The amount of quote currency used in the order (183 dollars). Cannot be sent with `size`. | `129.32` or `542.22`                     | float  |
| id         | The exchange-given order id                                  | `'2ebbda7c-5ce1-4b1d-81fd-b1beab7553a7'` | string |
| side       | The order side - buy or sell                                 | `'buy'` or `'sell'`                      | string |
| active     | The stop activation price of the order                       | `53532.24`                               | float  |
| price      | The price the limit order is set for execution               | `2532.43`                                | float  |
| annotation | An optional reasoning or context for this action             | `'RSI low'`                              | string |

## Logs

Send typed logs to the platform so you can monitor your model remotely

### `POST /v1/live/log`

| Arg  | Description                        | Examples                            | Type   |
| ---- | ---------------------------------- | ----------------------------------- | ------ |
| line | The data to write                  | `'Executed market buy for 2.1 BTC'` | string |
| type | Any type specification for the log | `'stdout'`, `'stderr'`, `'warning'` | string |

## Backtests

Blankly supports viewing for multi symbol backtest orders, account values, metrics and custom events and indicator time series to make understanding, improving and sharing your model even easier.

### `POST /v1/backtest/backtest-result`

#### Example

```json
{
  "symbols": ["BTC-USD", "ETH-USD"], // A list of symbols used in the backtest
  "quote_asset": "USD", // The asset to quote from, what is you account value in?
  "start_time": 1577836800, // When the backtest started
  "stop_time": 1609459200, // When the backtest ended
  "account_values": [ // The total value of the account over time
    {"time": 1613174400.0, "value": 10000.0},
    {"time": 1621209600.0, "value": 9952.061}
  ],
  "trades": [ // The trades that occured in the same format as the orders above
  	{
      "symbol": "BTC-USD", 
      "size": 1.0,
      "side": "buy",
      "id": "009dad9b-b753-24d5-77d5-679e476b0277", 
      "time": 1609459200,
      "annotation": "RSI Low"
    }
  ],
  "metrics": { // Any single point metrics such as cagr
    "cagr": {
      "value": 14,
      "display_name": "Compound annual growth rate",
      "type": "percent"
    },
    "drawdown": {
      "value": 130.53,
      "display_name": "Drawdown",
      "type": "number"
    }
  },
  "indicators": { // Time series indicators used by your models for visualization
    "rsi": {
      "values": [
      	{"time": 1613174400.0, "value": .52},
    		{"time": 1621209600.0, "value": .53}
      ],
      "display_name": "Relative Strength Index",
      "type": "percent"
    }
  }
}
```

### `POST /v1/backtest/backtest-status`

This route is used to specify the lifecycle of the current  backtest runner.

```json
{
  "successful": true,
  "status_summary": "Completed",
  "status_details": "",
  "time_elapsed": 5.3,
  "backtest_id": "4j4n2399vh23kfjijk"
}
```

# Base Routes

Generic API routes that require no authentication and are used for utility

## Public

### `GET /time`

Get server time in epoch seconds

