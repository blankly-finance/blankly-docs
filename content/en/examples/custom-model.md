---
title: Integrating with Custom Models
description: 'Implementing the golden cross using Blankly'
position: 12
category: Examples
---

## Overview

Now that we've gone through many examples, this one is arguably one of the more important ones. Integrating with your custom model will be imperative if you want to devise an algorithm that is unique to you and can outperform the market. Whether it's using state of the art machine learning, deep learning, genetic algorithms, or one of the strategies we previously implemented, our goal with Blankly is to make it as seamless as possible to integrate your previous code with Blankly. 

### The Buy/Sell Condition

In this example, we're going to make a model that outputs three integer values (0, 1, 2) for buy sell or hold. Using this integer value, we'll determine if we want to buy or sell. We'll also use an additional model to determine how much we want to buy and how much we want to sell (this will return a float value)

<alert type="info">
In general, your models can return whatever value you'd like them to return. It's up to you to determine how you want to use your model information to make buy and sell conditions
</alert>

## Implementing in Blankly

### Boilerplate Code

<alert>
To get started, make sure you have already [set up](/getting-started/installation) your environment along with the necssary keys and settings. 
</alert>

To implement this, we want to first create the boilerplate code that runs just like any other Blankly Strategy

#### Create Strategy

```python
from Blankly import Strategy, StrategyState, Interface
from Blankly import Alpaca
from Blankly.indicators import sma

def price_event(price, currency_pair, state: StrategyState):
    # we'll come back to this soon
    pass

alpaca = Alpaca()
s = Strategy(alpaca)
s.add_price_event(price_event, 'MSFT', resolution='1d')
s.variables["has_bought"] = false
# ... Initialize any other variables
s.run()
```

### Implementing the Price Event

As we mentioned before, we'll have two models: a `OrderDecisionModel` that will determine when to buy and an `OrderPricingModel` that will determine how much to buy. The `OrderDecisionModel` will take in the `currency_pair`. And the `OrderPricingModel` will take in the `price`, `currency_pair`, available cash, and the position size of that `currency_pair` in our account `interface.account`.

```python
from models import OrderPricingModel, OrderDecisionModel

def price_event(price, currency_pair, state: StrategyState):
    interface: Interface = state.interface
    # allow the resolution to be any resolution: 15m, 30m, 1d, etc.
    resolution: str = state.resolution
    variables = state.variables

    decision = OrderDecisionModel(currency_pair)

    if decision == 0:
        curr_value = interface.account[currency_pair]['available'] * price
        amt_to_buy = OrderPricingModel(price, currency_pair, interface.cash, curr_value)
        interface.market_order('buy', currency_pair, amt_to_buy)
    elif decision == 1:
        curr_value = interface.account[currency_pair]['available'] * price
        amt_to_sell = OrderPricingModel(price, currency_pair, interface.cash, curr_value)
        interface.market_order('sell', currency_pair, amt_to_sell)
```

### Adding it All Together

Now that we've gotten everything, let's bring it all together

```python

from Blankly import Strategy, StrategyState, Interface
from Blankly import Alpaca
from Blankly.indicators import sma

from models import OrderPricingModel, OrderDecisionModel

def price_event(price, currency_pair, state: StrategyState):
    interface: Interface = state.interface
    # allow the resolution to be any resolution: 15m, 30m, 1d, etc.
    resolution: str = state.resolution
    variables = state.variables

    decision = OrderDecisionModel(currency_pair)

    if decision == 0:
        curr_value = interface.account[currency_pair]['available'] * price
        amt_to_buy = OrderPricingModel(price, currency_pair, interface.cash, curr_value)
        interface.market_order('buy', currency_pair, amt_to_buy)
    elif decision == 1:
        curr_value = interface.account[currency_pair]['available'] * price
        amt_to_sell = OrderPricingModel(price, currency_pair, interface.cash, curr_value)
        interface.market_order('sell', currency_pair, amt_to_sell)

alpaca = Alpaca()
s = Strategy(alpaca)
s.add_price_event(price_event, 'MSFT', resolution='1d')
s.variables["has_bought"] = false
# decision_model = OrderDecisionModel() <-- global state can also be accessed in price event functions 
# pricing_model = OrderPricingModel()
s.backtest(to='2y')

```