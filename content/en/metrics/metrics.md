---
title: Metrics
description: 'Useful metrics built into blankly'
position: 4
category: Indicators & Metrics
---
# Metrics

## Overview

Metrics form the backbone of quantitative models and building good trading bots. It's how we measure performance at an individual model level and at a portfolio level. Whether it's as simple as what's the potential upside, vs measuring risk vs reward, we can use metrics to objectively determine which one to put our money on. 

**Note: We highly recommend backtesting and using the built-in Blankly metrics to measure performance before putting any amount of money towards your model**

This page details a little bit more about what metrics Blankly provides, what their purposes are, and how you can get up and using them as soon as possible. 

*As always, if you have any metrics that you'd like to be added, or an implementation for one, we'd love a PR!*

## Overall Return Metrics

Return metrics are as they sound: metrics that tell you how much your model actually made. We offer two primary return metrics including: `cagr(start_value, end_value, years)` and `cum_returns(start-value, end_value)`. 

### `cagr(start_value, end_value, years)`

Compound Annualized Growth Rate (CAGR) or otherwise known as the Annualized Return is a metric that is utilized to determine the average annual rate at which your money has increased over time. 

**Keep in mind that this is an average and not necessarily what you make every year**

The formula is calculated as follows: 
$$
CAGR = \big (\frac{end \ value}{start \ value}\big )^{1 / years}
$$
With this, you can get an accurate determination of how much money your model is expected to make over a period of time, annualized, and compare it to other models and assets. 

*Typically the S&P500 achives an 8% CAGR, so if you're able to beat that, then you're already beating the market.*

### `cum_returns(start_value, end_value)`

Cumulative returns calculates your total returns regardless of annualization. It simply takes the start and the end value and calculates your total percent return. 
$$
Cumulative \ Returns = \frac{(end \ value - start \ value)}{start \ value}
$$


## Risk vs Reward Ratios

Building models is all about risk vs reward, it's important to build models that not only win big, but also lose less than other ones. It's much better (on the heart at least) to have a model that makes a couple of small wins, than one big one (0.5% every day for 365 days is still a whopping 182.5% return). Let's take a look on how quants model this.

### `sharpe(returns, n=252, risk_free_rate=None)`

The sharpe ratio is perhaps one of the most often-used risk vs reward ratios out there. It takes the average returns over a given timespan, subtracts it by the risk free rate (i.e. the rate at which you're guaranteed a certain return, this is typically set at 0.15% for Treasury bills), and divides it by the standard deviation. You can think of it as "how much am I making" over "how much grit do I have to muster". A higher sharpe ratio, the more reward you get for your risk. 

In our implementation, we annualize the sharpe ratio depending on the frequency of your orders, defaulting to 252 (252 trading days for stocks). 
$$
Annualized \ Sharpe \ Ratio = \sqrt{n} \cdot \frac{avg \ return - risk \ free \ rate}{std \ of 
\ returns}
$$


### `sortino(returns, n=252, risk_free_rate=None)`

The sortino ratio is very similar to the sharpe ratio with one key difference: we only compare the volatility of the losing trades. The sortino ratio says "why penalize a model if it's making 2% on this trade and 120% on the next if it's losing only 2% on every bad trade". Thus instead of the standard deviation of all trades (both good and bad), the sortino ratio only looks at the standard deviation of losing trades (sold or covered at a loss). 

In our implementation, we annualize the sortino ratio depending on the frequency of your orders, defaulting to 252 (252 trading days for stocks). 
$$
Annualized \ Sortino \ Ratio = \sqrt{n} \cdot \frac{avg \ return - risk \ free \ rate}{std \ of \ negative  \ returns}
$$

### `calmar(returns, n=252, risk_free_rate=None)`

The calmar ratio takes the average returns and compares it to the worst case scenario (i.e. the maximum drawdown if you keep reading) of all the returns. Instead of analyzing all the trades, it primarily looks at the worst case scenario and bases risk on that. If the maximum drawdown is low, then the calmar ratio is fairly high. 
$$
Annualized \ Sortino \ Ratio = \sqrt{n} \cdot \frac{avg \ return - risk \ free \ rate}{|maximum \ drawdown|}
$$

### `var(initial_value, returns, alpha)`

Value at Risk attempts to measure how much capital (or value) is at risk at any given point in the portfolio. It is a metric that's dependent on a confidence interval (i.e. to what confidence do I know the answer to how much value is at risk). To do this, we take all your returns and make a normal distribution, then at the specified `alpha`, we determine how much value may be at risk based on that amount of return (positive returns and negative returns treated equally). 

For more information, check out [Investopedia](https://www.investopedia.com/terms/v/var.asp)

### `cvar(initial_value, returns, alpha)`

Conditional Value at Risk improves on Value at Risk by determining the expected short fall, i.e. what is the average loss upon exceeding a certain level of confidence (i.e. `alpha`). 

For more information, check out [Investopedia](https://www.investopedia.com/terms/c/conditional_value_at_risk.asp)

### `max_drawdown(returns)`

Max drawdown attempts to seek out the largest peak to trough across returns. It helps you determine how big of a swing you're expected to have while trading with your model and is used in calculations including the Calmar Ratio. We take your returns, and determine the largest peak to trough and return it to you. 
$$
Max \ Drawdown = \frac{Trough \ Value - Peak \ Value} {Peak \ Value}
$$


## General Statistics

Finally, we offer general statistics that can help you along your journey including variance, volatility and market beta.  

### `variance(returns, n=None)`

Variance is a measure of how "spread out" returns are relative to the mean, the higher the variance of returns, the more dispersed the returns are. The square root of the variance is the the standard deviation. 

We offer the ability to annualize the variance by passing in `n` as a parameter where `n` is the frequency of trades. 

### `volatility(returns, n=None)`

Volatility is the standard deviation of your returns and is a common measure to see how spread out your returns are, this can be coupled with the many ratios and variance from above. 

We offer the ability to annualize the variance by passing in `n` as a parameter where `n` is the frequency of trades. 

### `beta(returns, market_base_returns)`

Beta is a way to measure how volatile your model is relative to a base model of returns (i.e. something like the S&P500, a Vanguard Index, etc.), we give you full flexibility of choosing your return base as long as the values are consistent, we then calculate the beta, the beta is defined as the covariance between the returns and their standard deviation. For more information see [Investopedia](https://www.investopedia.com/terms/b/beta.asp)
$$
\beta = \frac{Cov(returns, market \ returns)}{Var(market \ returns)}
$$

## In Summary

We are continually adding more and more metrics as we go, but we'd love for your feedback and help in making more, if you have one that should be included, submit a PR and we'll take a look at it right away. 

We hope that these metrics provide a comprehensive method of determining which models to use and implement. 





