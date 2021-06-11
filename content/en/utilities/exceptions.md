---
title: Exceptions
description: 'Exceptions raised in the Blankly module'
position: 4
category: Utilities
---

Blankly exceptions are created to homogenize relationships & interactions between exchanges as well as describe behaviors & errors in the module.

## `InvalidOrder`

This will be raised exclusively by interface classes. If the user places an order that doesn't fill all limits that an exchange has, such as minimum size, funds or doesn't specify necessary parameters, this can be raised.

## `APIException`

This is also raised exclusively by interfaces. This will be raised any time the exchange responds with a message rather than filling the request it was sent. The exception will contain the message from the exchange.

Quite literally raised in this instance:

```python
if isinstance(response, dict):
	raise APIException(response['message'])
```
