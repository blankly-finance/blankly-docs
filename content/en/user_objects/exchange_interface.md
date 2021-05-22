---
title: Exchange Interface
description: 'Information on the usage of the exchange interface class'
position: 1
category: User Objects
---

# Interface

## Theory

The interface class provides consistent access to the supported exchanges.

**The idea is that as long as scripts aren't using "exchange specific" information, if all calls are run through here, then it gives the developer the ability to** ***instantly switch between exchanges*****.**

This means a few things about the information through the Interface:

- **Pre-typed.** Information guaranteed by the interface comes pre-casted. Most information sent from API's comes as strings, but the interface class converts these for easy access.
- **Less Detailed.** Different exchanges give different data. We try to pick out the most important bits of information to conecrate on maintaining, but some of it will end up in the `exchange_specific` tag on the dictionary returned.
- **Multiple API Calls**. Sometimes to accumulate the data required to tell the user everything they need to know, it requires multiple API calls to be run in the background.

# Rest API Functions

## get_products()

The function minimally gives an array with dictionaries such as:

```json
[
    {
        "currency_id": "BTC-USD",
        "base_currency": "BTC",
        "quote_currency": "USD",
        "base_min_size": "0.0001",
        "base_max_size": "280",
        "base_increment": "base_increment"
    },
...
]
```

| Key            | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| currency_id    | The currency pair of this exchange's products                |
| base_currency  | The base currency in the trading pair                        |
| quote_currency | The quote currency in the trading pair                       |
| base_min_size  | Smallest amount of base currency that can be bought on the exchange |
| base_max_size  | Largest amount of base currency that can be bought on the exchange |

## get_account(currency=None, account_id=None)

‌

The function minimally gives an array with dictionaries or *just* a dictionary depending on arguments.

