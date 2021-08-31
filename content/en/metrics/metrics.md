---
title: Metrics
description: 'Useful metrics built into blankly'
position: 16
version: 1.0
category: Metrics & Indicators
---

## Overview

Metrics form the backbone of quantitative models and building good trading bots. It's how we measure performance at an individual model level and at a portfolio level. Whether it's as simple as what's the potential upside, vs measuring risk vs reward, we can use metrics to objectively determine which one to put our money on. 

<alert type="warning">

**Note: We highly recommend backtesting and using the built-in Blankly metrics to measure performance before putting any amount of money towards your model**

</alert>

This page details a bit more about what metrics Blankly provides, what their purposes are, and how you can get up and using them as soon as possible. 

*As always, if you have any metrics that you'd like to be added, or an implementation for one, we'd love a PR!*



## Metrics Use Cases

We offer metrics because we know the importance of testing our models. That's why we've made it extremely easy for you to not only create your own metrics (as we discuss later), but also utilizing our built-in Blankly metrics. Calling `strategy.backtest()` automatically has a wide variety of metrics and built-in ratios including Sharpe, Sortino, Maximum Drawdown, and Cagr to name a few. However, we also provide you the ability to add your own callbacks by simply passing in a callbacks array like so:

<alert type="danger"> We have already included many metrics built into backtesting (sharpe, sortino, and many more), if you are to add any additional built-in metrics, please wrap them like so. This is to allow for proper integration with all of the backtesting data. </alert> 

<code-block label="Python">

```python
# Use Blanky.backesting.metrics and NOT Blankly.metrics
# DON'T DO THIS: from blankly.metrics import sharpe, sortino
import blankly
from blankly.metrics import sharpe, sortino
def price_event(price, interface):
  ... 
  
def weighted_sharpe_sortino_metric(backtest_data): 
	returns =	backtest_data['returns']['value']
  sharpe_value = sharpe(returns, risk_free_rate=0.5)
  sortino_value = sortino(returns, risk_free_rate=0.3)
  return sharpe_value * 0.2 + sortino_value * 0.8 
alpaca = blankly.Alpaca() 
s = blankly.Strategy(alpaca)
s.add_price_event(price_event)

s.backtest(callbacks=[weighted_sharpe_sortino_metric])
```
</code-block>


## Overall Return Metrics

Return metrics are as they sound: metrics that tell you how much your model actually made. We offer two primary return metrics including: `cagr(start_value, end_value, years)` and `cum_returns(start-value, end_value)`. 

### `cagr(start_value, end_value, years)`

#### Arguments

| Arg         | Description                                | Examples          | Type  |
| ----------- | ------------------------------------------ | ----------------- | ----- |
| start_value | Start Value of Portfolio                   | $100,000, 1 BTC   | Float |
| end_value   | End Value of Portfolio                     | $250,500, 0.5 BTC | Float |
| years       | Number of Years Portfolio was Evaluated on | 5 years, 10 years | int   |

#### Returns

| Description                     | Examples | Type  |
| ------------------------------- | -------- | ----- |
| Compound Annualized Growth Rate | 25%, 35% | Float |

Compound Annualized Growth Rate (CAGR) or otherwise known as the Annualized Return is a metric that is utilized to determine the average annual rate at which your money has increased over time. 

**Keep in mind that this is an average and not necessarily what you make every year**

The formula is calculated as follows: 
$$
CAGR = \big (\frac{end \ value}{start \ value}\big )^{1 / years}
$$
With this, you can get an accurate determination of how much money your model is expected to make over a period of time, annualized, and compare it to other models and assets. 

<alert>

*Typically the S&P500 achieves an 8% CAGR, so if you're able to beat that, then you're already beating the market.*

</alert>

### `cum_returns(start_value, end_value)`

#### Arguments

| Arg         | Description              | Examples          | Type  |
| ----------- | ------------------------ | ----------------- | ----- |
| start_value | Start Value of Portfolio | $100,000, 1 BTC   | Float |
| end_value   | End Value of Portfolio   | $250,500, 0.5 BTC | Float |

#### Returns

| Description                         | Examples | Type  |
| ----------------------------------- | -------- | ----- |
| Accumulated returns (as a % change) | 25%, 35% | Float |

Cumulative returns calculates your total returns regardless of annualization. It simply takes the start and the end value and calculates your total percent return. 
$$
Cumulative \ Returns = \frac{(end \ value - start \ value)}{start \ value}
$$

<code-block label="Python">
```python
from blankly.metrics import cum_returns
start_value = 100000
...
final_portfolio_value = portfolio_history[-1] # last value in portfolio history
cum_returns(start_value, final_portfolio_value)
```
</code-block>

## Risk vs Reward Ratios

Building models is all about risk vs reward, it's important to build models that not only win big, but also lose less than other ones. It's much better (on the heart at least) to have a model that makes a couple of small wins, than one big one (0.5% every day for 365 days is still a whopping 182.5% return). Let's take a look on how quants model this.

### `sharpe(returns, n=252, risk_free_rate=None)`

#### Arguments

| Arg                   | Description                                                  | Examples              | Type    |
| --------------------- | ------------------------------------------------------------ | --------------------- | ------- |
| returns               | Returns of the Portfolio at the specified interval n         | `[0.015, 0.075, ...]` | Float[] |
| n = 252               | Trade resolution (defaults to 252 days for the stock market) | 365, 6035             | Float   |
| risk_free_rate = None | The risk free rate (see the info below)                      | 0.02, 0.05            | Float   |

#### Returns

| Description  | Examples   | Type  |
| ------------ | ---------- | ----- |
| Sharpe Ratio | 2.10, 1.75 | Float |

The sharpe ratio is perhaps one of the most often-used risk vs reward ratios out there. It takes the average returns over a given timespan, subtracts it by the risk free rate (i.e. the rate at which you're guaranteed a certain return, this is typically set at 0.15% for Treasury bills), and divides it by the standard deviation. You can think of it as "how much am I making" over "how much grit do I have to muster". A higher sharpe ratio, the more reward you get for your risk. 

In our implementation, we annualize the sharpe ratio depending on the frequency of your orders, defaulting to 252 (252 trading days for stocks). 
$$
Annualized \ Sharpe \ Ratio = \sqrt{n} \cdot \frac{avg \ return - risk \ free \ rate}{std \ of 
\ returns}
$$

### `sortino(returns, n=252, risk_free_rate=None)`

#### Arguments

| Arg                   | Description                                                  | Examples              | Type    |
| --------------------- | ------------------------------------------------------------ | --------------------- | ------- |
| returns               | Returns of the Portfolio at the specified interval n         | `[0.015, 0.075, ...]` | Float[] |
| n = 252               | Trade resolution (defaults to 252 days for the stock market) | 365, 6035             | Float   |
| risk_free_rate = None | The risk free rate (see the info below)                      | 0.02, 0.05            | Float   |

#### Returns

| Description   | Examples   | Type  |
| ------------- | ---------- | ----- |
| Sortino Ratio | 2.10, 1.75 | Float |

The sortino ratio is very similar to the sharpe ratio with one key difference: we only compare the volatility of the losing trades. The sortino ratio says "why penalize a model if it's making 2% on this trade and 120% on the next if it's losing only 2% on every bad trade". Thus instead of the standard deviation of all trades (both good and bad), the sortino ratio only looks at the standard deviation of losing trades (sold or covered at a loss). 

In our implementation, we annualize the sortino ratio depending on the frequency of your orders, defaulting to 252 (252 trading days for stocks). 
$$
Annualized \ Sortino \ Ratio = \sqrt{n} \cdot \frac{avg \ return - risk \ free \ rate}{std \ of \ negative  \ returns}
$$

### `calmar(returns, n=252, risk_free_rate=None)`

#### Arguments

| Arg                   | Description                                                  | Examples              | Type    |
| --------------------- | ------------------------------------------------------------ | --------------------- | ------- |
| returns               | Returns of the Portfolio at the specified interval n         | `[0.015, 0.075, ...]` | Float[] |
| n = 252               | Trade resolution (defaults to 252 days for the stock market) | 365, 6035             | Float   |
| risk_free_rate = None | The risk free rate (see the info below)                      | 0.02, 0.05            | Float   |

#### Returns

| Description  | Examples   | Type  |
| ------------ | ---------- | ----- |
| Calmar Ratio | 2.10, 1.75 | Float |

The calmar ratio takes the average returns and compares it to the worst case scenario (i.e. the maximum drawdown if you keep reading) of all the returns. Instead of analyzing all the trades, it primarily looks at the worst case scenario and bases risk on that. If the maximum drawdown is low, then the calmar ratio is fairly high. 
$$
Annualized \ Sortino \ Ratio = \sqrt{n} \cdot \frac{avg \ return - risk \ free \ rate}{|maximum \ drawdown|}
$$

### `var(initial_value, returns, alpha)`

#### Arguments

| Arg           | Description                       | Examples            | Type    |
| ------------- | --------------------------------- | ------------------- | ------- |
| initial_value | Starting value of the portfolio   | $100,000, 1 BTC     | Float   |
| returns       | Returns of the portfolio          | [0.015, 0.075, ...] | Float[] |
| alpha         | The specified level of confidence | 0.95, 0.90          | Float   |

#### Returns

| Description                                | Examples | Type  |
| ------------------------------------------ | -------- | ----- |
| Value at Risk (at specified `alpha` level) | $25,000  | Float |

Value at Risk attempts to measure how much capital (or value) is at risk at any given point in the portfolio. It is a metric that's dependent on a confidence interval (i.e. to what confidence do I know the answer to how much value is at risk). To do this, we take all your returns and make a normal distribution, then at the specified `alpha`, we determine how much value may be at risk based on that amount of return (positive returns and negative returns treated equally). 

For more information, check out [Investopedia](https://www.investopedia.com/terms/v/var.asp)

### `cvar(initial_value, returns, alpha)`

#### Arguments

| Arg           | Description                       | Examples            | Type    |
| ------------- | --------------------------------- | ------------------- | ------- |
| initial_value | Starting value of the portfolio   | $100,000, 1 BTC     | Float   |
| returns       | Returns of the portfolio          | [0.015, 0.075, ...] | Float[] |
| alpha         | The specified level of confidence | 0.95, 0.90          | Float   |

#### Returns

| Description                                            | Examples | Type  |
| ------------------------------------------------------ | -------- | ----- |
| Conditioanl Value at Risk (at specified `alpha` level) | $25,000  | Float |

Conditional Value at Risk improves on Value at Risk by determining the expected short fall, i.e. what is the average loss upon exceeding a certain level of confidence (i.e. `alpha`). 

For more information, check out [Investopedia](https://www.investopedia.com/terms/c/conditional_value_at_risk.asp)

### `max_drawdown(returns)`

#### Arguments

| Arg     | Description              | Examples            | Type    |
| ------- | ------------------------ | ------------------- | ------- |
| returns | Returns of the portfolio | [0.015, 0.075, ...] | Float[] |

#### Returns

| Description          | Examples | Type  |
| -------------------- | -------- | ----- |
| The Maximum Drawdown | -0.25    | Float |

Max drawdown attempts to seek out the largest peak to trough across returns. It helps you determine how big of a swing you're expected to have while trading with your model and is used in calculations including the Calmar Ratio. We take your returns, and determine the largest peak to trough and return it to you. 
$$
Max \ Drawdown = \frac{Trough \ Value - Peak \ Value} {Peak \ Value}
$$


## General Statistics

Finally, we offer general statistics that can help you along your journey including variance, volatility and market beta.  

### `variance(returns, n=None)`

#### Arguments

| Arg     | Description                                       | Examples            | Type    |
| ------- | ------------------------------------------------- | ------------------- | ------- |
| returns | Returns of the portfolio                          | [0.015, 0.075, ...] | Float[] |
| n=None  | Interval of portfolio returns (For annualization) | 365, 252            | int     |

#### Returns

| Description         | Examples | Type  |
| ------------------- | -------- | ----- |
| Variance of Returns | 0.85     | Float |

Variance is a measure of how "spread out" returns are relative to the mean, the higher the variance of returns, the more dispersed the returns are. The square root of the variance is the the standard deviation. 

We offer the ability to annualize the variance by passing in `n` as a parameter where `n` is the frequency of trades. 

### `volatility(returns, n=None)`

#### Arguments

| Arg     | Description                                       | Examples            | Type    |
| ------- | ------------------------------------------------- | ------------------- | ------- |
| returns | Returns of the portfolio                          | [0.015, 0.075, ...] | Float[] |
| n=None  | Interval of portfolio returns (For annualization) | 365, 252            | int     |

Volatility is the standard deviation of your returns and is a common measure to see how spread out your returns are, this can be coupled with the many ratios and variance from above. 

We offer the ability to annualize the variance by passing in `n` as a parameter where `n` is the frequency of trades. 

### `beta(returns, market_base_returns)`

| Arg                 | Description                                             | Examples                                  | Type    |
| ------------------- | ------------------------------------------------------- | ----------------------------------------- | ------- |
| returns             | Returns of the portfolio                                | [0.015, 0.075, ...]                       | Float[] |
| market_base_returns | Market base returns to compare the portfolio returns to | [0.015, 0.075, ...], SP500 Data, BTC Data | Float[] |

#### Arguments

Beta is a way to measure how volatile your model is relative to a base model of returns (i.e. something like the S&P500, a Vanguard Index, etc.), we give you full flexibility of choosing your return base as long as the values are consistent, we then calculate the beta, the beta is defined as the covariance between the returns and their standard deviation. For more information see [Investopedia](https://www.investopedia.com/terms/b/beta.asp)
$$
\beta = \frac{Cov(returns, market \ returns)}{Var(market \ returns)}
$$



## Building Your Own Metrics

It's pretty easy to build your own metrics to integrate with our backtesting framework. We will pass you all data related to the backtest in a `pd.DataFrame`. Thus, create your metric as shown below:

<code-block label="Python">

```python
def your_custom_metric(backtest_data: pd.DataFrame):
  	# See Backtesting Docs for Arguments
    # Do something here
    # You can return whatever you'd like
    return your_metric_value
...
s.backtest(callbacks=[your_custom_metric])
```

</code-block>

## In Summary

We are continually adding more and more metrics as we go, but we'd love for your feedback and help in making more, if you have one that should be included, submit a PR and we'll take a look at it right away. 

We hope that these metrics provide a comprehensive method of determining which models to use and implement. 
