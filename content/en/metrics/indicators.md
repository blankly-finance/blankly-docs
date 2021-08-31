---
title: Indicators
description: 'Indicators to quickly develop better price events'
position: 18
version: 1.0
category: Metrics & Indicators
---

## Overview

Indicators are a central part of developing strong quantitative models. As we know, price data is noisy, unpredictable, and constantly changing. Using indicators that have been backed by years of research have shown to improve performance and ultimately have become the backbone of many modern quantitative models. Whether it's starting with the most basic [golden cross](https://www.investopedia.com/terms/g/goldencross.asp#:~:text=Key%20Takeaways,indicating%20a%20bearish%20price%20movement.), or using deep learning with inputs including RSI, TEMA, and more, indicators are extremely useful to know about and to learn. 

Blankly has implemented a multitude of indicators for your own use and development. Specifically, we take the [`tulipy`](https://pypi.org/project/newtulipy/) library and wrap it with Blankly data and Strategies for backtest.

*As always, if you have any indicators that you'd like to be added, or an implementation for one, we'd love a PR!*

## Moving Averages

Moving averages are just as they sound: they are moving ("rolling window") averages ("aggregating data points together"). The point of moving averages is to greatly improve the quality of data points. As we mentioned before, price data is extremely noisy, with constant ups and downs, moving averages "smooth" out the data so it's very clear to see a specific trend. In Blankly, we offer a multitude of various types of moving averages. We describe them below. 

### `sma(data, period=50, use_series=False)`

#### Arguments

| Arg        | Description                               | Examples           | Type                       |
| ---------- | ----------------------------------------- | ------------------ | -------------------------- |
| data       | Data to pass                              | BTC-USD Price Data | Float[], np.arr, pd.Series |
| period     | The period/window of the moving average   | 50, 100            | int                        |
| use_series | Whether or not to return as a `pd.Series` | True, False        | bool                       |

#### Returns

| Description                       | Examples               | Type                       |
| --------------------------------- | ---------------------- | -------------------------- |
| Array-Like of The Rolling Average | [2.25, 2.35, 2.45 ...] | Float[], np.arr, pd.Series |

The simple moving average (SMA) is the simplest type of moving average, it takes a time series (f.e. price data) and divides it up into windows defined by the period. Then it averages all of those points to produce one point. Thus, if you have 250 total data points, you will be returned $250 / 5 = 5$ data points. A common use-case for the SMA is the golden cross or the MACD strategies where we look fro the crossing of various simple moving averages (for example the 50 day SMA and the 100 day SMA) to see trend changes. The longer the period, the "harder" it is to change (the less it follows local market changes). 

### `ema(data, period=50, use_series=False)`

#### Arguments

| Arg        | Description                               | Examples           | Type                       |
| ---------- | ----------------------------------------- | ------------------ | -------------------------- |
| data       | Data to pass                              | BTC-USD Price Data | Float[], np.arr, pd.Series |
| period     | The period/window of the moving average   | 50, 100            | int                        |
| use_series | Whether or not to return as a `pd.Series` | True, False        | bool                       |

#### Returns

| Description                                  | Examples               | Type                       |
| -------------------------------------------- | ---------------------- | -------------------------- |
| Array-Like of The Exponential Moving Average | [2.25, 2.35, 2.45 ...] | Float[], np.arr, pd.Series |

Exponential moving average (EMA) is calculated a little differently than the SMA, the key difference between the SMA and the EMA is that the EMA places greater weight and value to more recent data points in the dataset. However, the premise for looking at crossovers and divergences with moving averages stays the same. 

<alert type="info">Note, we default to using a smoothing factor of 2 for all EMA calculations</alert>

For more information, check out [investopedia](https://www.investopedia.com/terms/e/ema.asp)

### `vwma(data, volume_data, period=50, use_series=False)`

#### Arguments

| Arg         | Description                               | Examples            | Type                       |
| ----------- | ----------------------------------------- | ------------------- | -------------------------- |
| data        | Data to pass                              | BTC-USD Price Data  | Float[], np.arr, pd.Series |
| volume_data | Volume Data                               | BTC-USD Volume Data | Float[], np.arr, pd.Series |
| period      | The period/window of the moving average   | 50, 100             | int                        |
| use_series  | Whether or not to return as a `pd.Series` | True, False         | bool                       |

#### Returns

| Description                                      | Examples               | Type                       |
| ------------------------------------------------ | ---------------------- | -------------------------- |
| Array-Like of The Volume Weighted Moving Average | [2.25, 2.35, 2.45 ...] | Float[], np.arr, pd.Series |

This is a moving average that makes more weight for the days that have higher volume than others. Check out [Investopedia](https://www.investopedia.com/terms/v/vwap.asp)

### `wma(data, period=50, use_series=False)`

#### Arguments

| Arg        | Description                               | Examples           | Type                       |
| ---------- | ----------------------------------------- | ------------------ | -------------------------- |
| data       | Data to pass                              | BTC-USD Price Data | Float[], np.arr, pd.Series |
| period     | The period/window of the moving average   | 50, 100            | int                        |
| use_series | Whether or not to return as a `pd.Series` | True, False        | bool                       |

#### Returns

| Description                               | Examples               | Type                       |
| ----------------------------------------- | ---------------------- | -------------------------- |
| Array-Like of The Weighted Moving Average | [2.25, 2.35, 2.45 ...] | Float[], np.arr, pd.Series |

A weighted moving average is very similar to the EMA, however their weighting function for recent points is different. Namely WMAs are linear weighting and EMA is exponential weighting. Check out this great article by [Investopedia](https://www.investopedia.com/ask/answers/071414/whats-difference-between-moving-average-and-weighted-moving-average.asp)

### `zlema(data, period=50, use_series=False)`

#### Arguments

| Arg        | Description                               | Examples           | Type                       |
| ---------- | ----------------------------------------- | ------------------ | -------------------------- |
| data       | Data to pass                              | BTC-USD Price Data | Float[], np.arr, pd.Series |
| period     | The period/window of the moving average   | 50, 100            | int                        |
| use_series | Whether or not to return as a `pd.Series` | True, False        | bool                       |

#### Returns

| Description                    | Examples               | Type                       |
| ------------------------------ | ---------------------- | -------------------------- |
| Array-Like of The Zero-Lag EMA | [2.25, 2.35, 2.45 ...] | Float[], np.arr, pd.Series |

The zero-lag exponential moving average reduces aspects of "lag", check out these [docs](https://tulipindicators.org/zlema)

### `hma(data, period=50, use_series=False)`

#### Arguments

| Arg        | Description                               | Examples           | Type                       |
| ---------- | ----------------------------------------- | ------------------ | -------------------------- |
| data       | Data to pass                              | BTC-USD Price Data | Float[], np.arr, pd.Series |
| period     | The period/window of the moving average   | 50, 100            | int                        |
| use_series | Whether or not to return as a `pd.Series` | True, False        | bool                       |

#### Returns

| Description           | Examples               | Type                       |
| --------------------- | ---------------------- | -------------------------- |
| Array-Like of The HMA | [2.25, 2.35, 2.45 ...] | Float[], np.arr, pd.Series |

Similar to the ZLEMA, the Hull Moving Average (HMA) modifies the Weighted Moving Average, check out these [docs](https://tulipindicators.org/hma)

### `trima(data, period=50, use_series=False)`

#### Arguments

| Arg        | Description                               | Examples           | Type                       |
| ---------- | ----------------------------------------- | ------------------ | -------------------------- |
| data       | Data to pass                              | BTC-USD Price Data | Float[], np.arr, pd.Series |
| period     | The period/window of the moving average   | 50, 100            | int                        |
| use_series | Whether or not to return as a `pd.Series` | True, False        | bool                       |

#### Returns

| Description             | Examples               | Type                       |
| ----------------------- | ---------------------- | -------------------------- |
| Array-Like of The TRIMA | [2.25, 2.35, 2.45 ...] | Float[], np.arr, pd.Series |

The Triangle Moving Average (TRIMA) puts more weight on the middle items in the dataset and less weight on the new and old data within a single period. Info [here](https://tulipindicators.org/trima)

### `kaufman_adaptive_ma(data, period=50, use_series=False)`

#### Arguments

| Arg        | Description                               | Examples           | Type                       |
| ---------- | ----------------------------------------- | ------------------ | -------------------------- |
| data       | Data to pass                              | BTC-USD Price Data | Float[], np.arr, pd.Series |
| period     | The period/window of the moving average   | 50, 100            | int                        |
| use_series | Whether or not to return as a `pd.Series` | True, False        | bool                       |

#### Returns

| Description            | Examples               | Type                       |
| ---------------------- | ---------------------- | -------------------------- |
| Array-Like of The KAMA | [2.25, 2.35, 2.45 ...] | Float[], np.arr, pd.Series |

The KAMA adjusts its weighting relative to the current market conditions of noise. Check out [this](https://tulipindicators.org/kama)

### `macd(data, short_period=12, long_period=26, signal_period=9)`

#### Arguments

| Arg           | Description                                    | Examples           | Type                       |
| ------------- | ---------------------------------------------- | ------------------ | -------------------------- |
| data          | Data to pass                                   | BTC-USD Price Data | Float[], np.arr, pd.Series |
| short_period  | The period/window of the short moving average  | 50, 100            | int                        |
| long_period   | The period/window of the longer moving average | 150, 200           | Int                        |
| signal_period | The period/window to use as the signal         | 9                  | int                        |
| use_series    | Whether or not to return as a `pd.Series`      | True, False        | bool                       |

#### Returns

| Description                    | Examples                   | Type                       |
| ------------------------------ | -------------------------- | -------------------------- |
| Array-Like of The MACD signals | [-2.25, 0, 2.25, 1.25 ...] | Float[], np.arr, pd.Series |

The MACD (Moving Average Convergence and Divergence) is a way of looking at two different moving averages and identifying key characteristics of price movements relative to the crossing and diverging of the two moving averages. It utilizes the exponential moving average, subtracting the `long_period` from the `short_period` and using that to compare against the `signal_period`. Check out this in [Investopedia](https://www.investopedia.com/terms/m/macd.asp).

## Oscillators

Oscillators vary in moving averages in that instead of trying to smooth out the data, they attempt to capture the noise and volatility in the price data. Just as the name states, these indicators attempt to capture how much prices oscillates. 

### `rsi(data, period = 14, round_rsi = False, use_series=False)`

#### Arguments

| Arg        | Description                               | Examples           | Type                       |
| ---------- | ----------------------------------------- | ------------------ | -------------------------- |
| data       | Data to pass                              | BTC-USD Price Data | Float[], np.arr, pd.Series |
| period     | The period/window to use                  | 14, 50, 100        | int                        |
| round_rsi  | Whether to round to two decimal places    | True, False        | Bool                       |
| use_series | Whether or not to return as a `pd.Series` | True, False        | bool                       |

#### Returns

| Description           | Examples         | Type                       |
| --------------------- | ---------------- | -------------------------- |
| Array-Like of The RSI | [30, 45.5, 55.5] | Float[], np.arr, pd.Series |

The Relative Strength Index is perhaps one of the most commonly used oscillators. The RSI attempts to capture the momentum of recent price changes (how strong is the current uptrend and or how week is the downtrend). The RSI is calculated as shown here by [Investopedia](https://www.investopedia.com/terms/r/rsi.asp)

### `aroon_oscillator(high_data, low_data, period=14, use_series=False)`

#### Arguments

| Arg        | Description                               | Examples           | Type                       |
| ---------- | ----------------------------------------- | ------------------ | -------------------------- |
| high_data  | Price Data Highs                          | BTC-USD Price Data | Float[], np.arr, pd.Series |
| low_data   | Price Data Lows                           | BTC-USD Price Data | Float[], np.arr, pd.Series |
| period     | The period/window to use                  | True, False        | Bool                       |
| use_series | Whether or not to return as a `pd.Series` | True, False        | bool                       |

#### Returns

| Description                        | Examples         | Type                       |
| ---------------------------------- | ---------------- | -------------------------- |
| Array-Like of The Aroon Oscillator | [30, 45.5, 55.5] | Float[], np.arr, pd.Series |

The aroon oscillator utilizes the aroon indicator to determine the current strength of a given trend. A value greater than zero signifies an uptrend and a value less than 0 signifies a downtrend. For more info, see [here](https://www.investopedia.com/terms/a/aroonoscillator.asp).

<alert>Blankly makes it extremely easy to get OHLCV data at your prescribed resolution, recall that `interface.history()` returns a dataframe with `open, close, high, low, volume` that users can grab and utilize for these oscillators and moving averages.</alert>

#### Example Use

```python
from blankly.strategy import Strategy
from blankly import Alpaca, Interface
from blankly.metrics import aroon_oscillator

def price_event(price, symbol, state):
  interface: Interface = state.interface
  history = interface.history(symbol, 500, resolution=state.resolution)
  h = history['high']
  l = history['low']
  oscillation = aroon_oscillator(h, l)
  ...
a = Alpaca()
s = Strategy(a)
s.add_price_event(price_event, resolution='30m')
```

### `chande_momentum_oscillator(data, period=14, use_series=False)` 

#### Arguments

| Arg        | Description                               | Examples           | Type                       |
| ---------- | ----------------------------------------- | ------------------ | -------------------------- |
| data       | Price Data                                | BTC-USD Price Data | Float[], np.arr, pd.Series |
| period     | The period/window to use                  | True, False        | Bool                       |
| use_series | Whether or not to return as a `pd.Series` | True, False        | bool                       |

#### Returns

| Description                                  | Examples         | Type                       |
| -------------------------------------------- | ---------------- | -------------------------- |
| Array-Like of The Chande Momentum Oscillator | [30, 45.5, 55.5] | Float[], np.arr, pd.Series |

The chande momentum oscillator takes the sum of all recent gains, the sum of all recent losses and then divides that by the sum of all recent price movements (sum of all gains + losses). The formula is described by [Investopedia](https://www.investopedia.com/terms/c/chandemomentumoscillator.asp)

### `absolute_price_oscillator(data, short_period=12, long_period=26, use_series=False)`

#### Arguments

| Arg          | Description                               | Examples           | Type                       |
| ------------ | ----------------------------------------- | ------------------ | -------------------------- |
| data         | Price Data                                | BTC-USD Price Data | Float[], np.arr, pd.Series |
| short_period | Short Period EMA                          | 25, 50             | int                        |
| long_period  | Long Period EMA                           | 75, 100            | int                        |
| use_series   | Whether or not to return as a `pd.Series` | True, False        | bool                       |

#### Returns

| Description                                 | Examples         | Type                       |
| ------------------------------------------- | ---------------- | -------------------------- |
| Array-Like of The Absolute Price Oscillator | [30, 45.5, 55.5] | Float[], np.arr, pd.Series |

The absolute price oscillator helps detect the difference between two EMAs and expresses the results as an absolute value. More information can be seen [here](https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/apo)

### `percentage_price_oscilator(data, short_period=12, long_period=26, use_series=False)`

#### Arguments

| Arg          | Description                               | Examples           | Type                       |
| ------------ | ----------------------------------------- | ------------------ | -------------------------- |
| data         | Price Data                                | BTC-USD Price Data | Float[], np.arr, pd.Series |
| short_period | Short Period EMA                          | 25, 50             | int                        |
| long_period  | Long Period EMA                           | 75, 100            | int                        |
| use_series   | Whether or not to return as a `pd.Series` | True, False        | bool                       |

#### Returns

| Description                                   | Examples         | Type                       |
| --------------------------------------------- | ---------------- | -------------------------- |
| Array-Like of The Percentage Price Oscillator | [30, 45.5, 55.5] | Float[], np.arr, pd.Series |

The same as the absolute price, but returns values as a percentage difference.

### `stochastic_oscillator(high_data, low_data, close_data, pct_k_period=14, pct_k_slowing_period=3, pct_d_period=3, use_series=False)`

#### Arguments

| Arg                  | Description                               | Examples           | Type                       |
| -------------------- | ----------------------------------------- | ------------------ | -------------------------- |
| high_data            | High Price Data                           | BTC-USD Price Data | Float[], np.arr, pd.Series |
| low_data             | Low Price Data                            | BTC-USD Price Data | Float[], np.arr, pd.Series |
| close_data           | Close Price Data                          | BTC-USD Price Data | Float[], np.arr, pd.Series |
| pct_k_period         | %K Period to Choose                       | 10, 15             | int                        |
| pct_k_slowing_period | %K Slowing Period                         | 75, 100            | int                        |
| pct_d_period         | %D Period                                 | 14, 23             | int                        |
| use_series           | Whether or not to return as a `pd.Series` | True, False        | bool                       |

#### Returns

| Description                             | Examples         | Type                       |
| --------------------------------------- | ---------------- | -------------------------- |
| Array-Like of The Stochastic Oscillator | [30, 45.5, 55.5] | Float[], np.arr, pd.Series |

The stochastic oscillator compares the closing data of a security to a range of varying prices over a specific time period. More information can be found on [Investopedia](https://www.investopedia.com/terms/s/stochasticoscillator.asp)

### `stochastic_rsi(data, period=14, smooth_pct_k=3, smooth_pct_d=3, use_series=False)`

#### Arguments

| Arg          | Description                               | Examples           | Type                       |
| ------------ | ----------------------------------------- | ------------------ | -------------------------- |
| data         | Price Data                                | BTC-USD Price Data | Float[], np.arr, pd.Series |
| period       | RSI Period                                | 10, 15             | Int                        |
| smooth_pct_k | %K Smoothing Period                       | 10, 15             | Int                        |
| smooth_pct_d | %D Smoothing Period                       | 10, 15             | int                        |
| use_series   | Whether or not to return as a `pd.Series` | True, False        | bool                       |

#### Returns

| Description                             | Examples         | Type                       |
| --------------------------------------- | ---------------- | -------------------------- |
| Array-Like of The Stochastic Oscillator | [30, 45.5, 55.5] | Float[], np.arr, pd.Series |

The stochastic RSI combines the RSI with the stochastic oscillators. More info can be found [here](https://www.investopedia.com/terms/s/stochrsi.asp).

## Other Indicators

### `bbands(data, period=14, stddev=2)`

#### Arguments

| Arg        | Description                                       | Examples           | Type                       |
| ---------- | ------------------------------------------------- | ------------------ | -------------------------- |
| data       | Price Data                                        | BTC-USD Price Data | Float[], np.arr, pd.Series |
| period     | SMA Period                                        | 20                 | int                        |
| stddev     | # of Standard Deviations Away from Moving Average | 2, 3               | int                        |
| use_series | Whether or not to return as a `pd.Series`         | True, False        | bool                       |

#### Returns

| Description                          | Examples             | Type                       |
| ------------------------------------ | -------------------- | -------------------------- |
| 2D Array-Like of The Bollinger Bands | [[30, 25], [75, 55]] | Float[], np.arr, pd.Series |

Bollinger Bands are a very popular technical indicator to measure the strength of an uptrend or downtrend. It is also a way to help determine trend reversals. View [Investopedia's Explanation](https://www.investopedia.com/terms/b/bollingerbands.asp).

### `wad(high_data, low_data, close_data, use_series=False)`

#### Arguments

| Arg        | Description                               | Examples           | Type                       |
| ---------- | ----------------------------------------- | ------------------ | -------------------------- |
| high_data  | High Price Data                           | BTC-USD Price Data | Float[], np.arr, pd.Series |
| low_data   | Low Price Data                            | BTC-USD Price Data | Float[], np.arr, pd.Series |
| close_data | Close Price Data                          | BTC-USD Price Data | Float[], np.arr, pd.Series |
| use_series | Whether or not to return as a `pd.Series` | True, False        | bool                       |

#### Returns

| Description       | Examples             | Type                       |
| ----------------- | -------------------- | -------------------------- |
| Array-Like of WAD | [[30, 25], [75, 55]] | Float[], np.arr, pd.Series |

The Williams accumulation/distribution helps determine a trend direction. View [this](https://www.barchart.com/education/technical-indicators/accumulation_distribution_williams) for more info.

### `wilders(data, period=50, use_series=False)`

#### Arguments

| Arg        | Description                               | Examples           | Type                       |
| ---------- | ----------------------------------------- | ------------------ | -------------------------- |
| data       | High Price Data                           | BTC-USD Price Data | Float[], np.arr, pd.Series |
| period     | Period to Use                             | 50, 100            | Int                        |
| use_series | Whether or not to return as a `pd.Series` | True, False        | bool                       |

#### Returns

| Description           | Examples     | Type                       |
| --------------------- | ------------ | -------------------------- |
| Array-Like of Wilders | [20, 25, 30] | Float[], np.arr, pd.Series |

### `willr(high_data, low_data, close_data, period=50, use_series=False)`

#### Arguments

| Arg        | Description                               | Examples           | Type                       |
| ---------- | ----------------------------------------- | ------------------ | -------------------------- |
| high_data  | High Price Data                           | BTC-USD Price Data | Float[], np.arr, pd.Series |
| low_data   | Low Price Data                            | BTC-USD Price Data | Float[], np.arr, pd.Series |
| close_data | Close Price Data                          | BTC-USD Price Data | Float[], np.arr, pd.Series |
| use_series | Whether or not to return as a `pd.Series` | True, False        | bool                       |

#### Returns

| Description           | Examples     | Type                       |
| --------------------- | ------------ | -------------------------- |
| Array-Like of Wilders | [20, 25, 30] | Float[], np.arr, pd.Series |

The Williams %R is a measure similar to RSI and the stochastic oscillator where it measures overbought and oversold territory. More information is on [Investopedia](https://www.investopedia.com/terms/w/williamsr.asp)

### `true_range(high_data, low_data, close_data, use_series=False)`

#### Arguments

| Arg        | Description                               | Examples           | Type                       |
| ---------- | ----------------------------------------- | ------------------ | -------------------------- |
| high_data  | High Price Data                           | BTC-USD Price Data | Float[], np.arr, pd.Series |
| low_data   | Low Price Data                            | BTC-USD Price Data | Float[], np.arr, pd.Series |
| close_data | Close Price Data                          | BTC-USD Price Data | Float[], np.arr, pd.Series |
| use_series | Whether or not to return as a `pd.Series` | True, False        | bool                       |

#### Returns

| Description              | Examples     | Type                       |
| ------------------------ | ------------ | -------------------------- |
| Array-Like of True Range | [20, 25, 30] | Float[], np.arr, pd.Series |

The true range takes the greatest of `high - close` and `low - close` for every data point

### `average_true_range(high_data, low_data, close_data, period=50, use_series=False)`

#### Arguments

| Arg        | Description                               | Examples           | Type                       |
| ---------- | ----------------------------------------- | ------------------ | -------------------------- |
| high_data  | High Price Data                           | BTC-USD Price Data | Float[], np.arr, pd.Series |
| low_data   | Low Price Data                            | BTC-USD Price Data | Float[], np.arr, pd.Series |
| close_data | Close Price Data                          | BTC-USD Price Data | Float[], np.arr, pd.Series |
| period     | Moving Average Period                     | 50, 100            | Int                        |
| use_series | Whether or not to return as a `pd.Series` | True, False        | bool                       |

#### Returns

| Description              | Examples     | Type                       |
| ------------------------ | ------------ | -------------------------- |
| Array-Like of True Range | [20, 25, 30] | Float[], np.arr, pd.Series |

The average true range takes the greatest of `high - close` and `low - close` for every data point and then takes a moving average of the points. More information can be found [here](https://www.investopedia.com/terms/a/atr.asp).

## Statistics

We offer a variety of general statistics as part of our indicators. All of our statistics are implemented so that they work on a period of data (i.e. they're rolling and return an Array-Like). 

### `stddev_period(data, period=14, use_series=False)`

#### Arguments

| Arg        | Description                               | Examples           | Type                       |
| ---------- | ----------------------------------------- | ------------------ | -------------------------- |
| data       | Any Type of Array Data                    | BTC-USD Price Data | Float[], np.arr, pd.Series |
| period     | Rolling Window                            | 50, 100            | Int                        |
| use_series | Whether or not to return as a `pd.Series` | True, False        | bool                       |

#### Returns

| Description                      | Examples     | Type                       |
| -------------------------------- | ------------ | -------------------------- |
| Array-Like of Standard Deviation | [20, 25, 30] | Float[], np.arr, pd.Series |

### `var_period(data, period=14, use_series=False)`

#### Arguments

| Arg        | Description                               | Examples           | Type                       |
| ---------- | ----------------------------------------- | ------------------ | -------------------------- |
| data       | Any Type of Array Data                    | BTC-USD Price Data | Float[], np.arr, pd.Series |
| period     | Rolling Window                            | 50, 100            | Int                        |
| use_series | Whether or not to return as a `pd.Series` | True, False        | bool                       |

#### Returns

| Description            | Examples     | Type                       |
| ---------------------- | ------------ | -------------------------- |
| Array-Like of Variance | [20, 25, 30] | Float[], np.arr, pd.Series |

### `stderr_period(data, period=14, use_series=False)`

#### Arguments

| Arg        | Description                               | Examples           | Type                       |
| ---------- | ----------------------------------------- | ------------------ | -------------------------- |
| data       | Any Type of Array Data                    | BTC-USD Price Data | Float[], np.arr, pd.Series |
| period     | Rolling Window                            | 50, 100            | Int                        |
| use_series | Whether or not to return as a `pd.Series` | True, False        | bool                       |

#### Returns

| Description                  | Examples     | Type                       |
| ---------------------------- | ------------ | -------------------------- |
| Array-Like of Standard Error | [20, 25, 30] | Float[], np.arr, pd.Series |

### `min_period(data, period, use_series=False)`

#### Arguments

| Arg        | Description                               | Examples           | Type                       |
| ---------- | ----------------------------------------- | ------------------ | -------------------------- |
| data       | Any Type of Array Data                    | BTC-USD Price Data | Float[], np.arr, pd.Series |
| period     | Rolling Window                            | 50, 100            | Int                        |
| use_series | Whether or not to return as a `pd.Series` | True, False        | bool                       |

#### Returns

| Description            | Examples     | Type                       |
| ---------------------- | ------------ | -------------------------- |
| Array-Like of Minimums | [20, 25, 30] | Float[], np.arr, pd.Series |

### `max_period(data, period, use_series=False)`

#### Arguments

| Arg        | Description                               | Examples           | Type                       |
| ---------- | ----------------------------------------- | ------------------ | -------------------------- |
| data       | Any Type of Array Data                    | BTC-USD Price Data | Float[], np.arr, pd.Series |
| period     | Rolling Window                            | 50, 100            | Int                        |
| use_series | Whether or not to return as a `pd.Series` | True, False        | bool                       |

#### Returns

| Description            | Examples     | Type                       |
| ---------------------- | ------------ | -------------------------- |
| Array-Like of Maximums | [20, 25, 30] | Float[], np.arr, pd.Series |

