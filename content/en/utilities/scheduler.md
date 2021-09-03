---
title: Scheduler
description: 'Use scheduler to run event-based functions with saved arguments.'
position: 26
version: 1.0
category: Utilities
---

The scheduler class is used to run functions with a low-overhead CPU cost, as well as pass cached arguments & data. 
This allows single functions to double as asynchronous logic that can be used across exchanges & currencies.

## Creation

A scheduler can be created by calling `blankly.Scheduler`:

### Arguments

| Arg               | Description                                                  | Examples             | Type             |
| ----------------- | ------------------------------------------------------------ | -------------------- | ---------------- |
| callback          | Fill with a function reference to be called in the scheduler thread. | `price_event`        | callable         |
| interval          | Time interval for the given function to run.                 | `'2m'` or `'3h'`     | str or int/float |
| initially_stopped | Optional boolean. If set to `True`, the scheduler will not start until `.start()` is run. | `True`               | bool             |
| synced            | Align the scheduler with intervals in UTC. ex: if the interval is '1h' then with sync it will only   run at *:00 | `True`               | bool             |
| **kwargs          | Arguments to pass into the callback function. This can be used to distinguish what the logic in the callback should do. | `'asset_id='BTC-USD` | Any              |

### Response

| Description        | Examples                                           | Type      |
| ------------------ | -------------------------------------------------- | --------- |
| A scheduler object | `scheduler = blankly.Scheduler(price_event, '2m')` | Scheduler |

# Functions

## `start(force=False)`

Start a scheduler. This only needs to be used if `initially_stopped` is set to `True`.

### Arguments

| Arg   | Description                                                  | Examples | Type |
| ----- | ------------------------------------------------------------ | -------- | ---- |
| force | Optional argument to override any duplicate thread protection. | `True`   | bool |

## `get_interval()`

Get the interval in seconds that the scheduler is running on.

### Response

| Description                       | Examples                | Type |
| --------------------------------- | ----------------------- | ---- |
| The scheduler interval in seconds | `120`, `3600`,  `86400` | str  |

## `get_kwargs()`

Get the custom arguments that were passed during construction.

### Response

| Description                                                  | Examples                  | Type |
| ------------------------------------------------------------ | ------------------------- | ---- |
| A dictionary containing all the key/value pairs that were added during construction. | `{'asset_id': 'BTC-USD'}` | dict |

## `stop_scheduler()`

Raise a stop flag that will be checked on the next scheduler run & stop the thread.

## `get_callback()`

Get the callback function that the scheduler is attached to.

### Response

| Description                                               | Examples               | Type     |
| --------------------------------------------------------- | ---------------------- | -------- |
| The callable object passed in during object construction. | `price_event` callable | callable |

