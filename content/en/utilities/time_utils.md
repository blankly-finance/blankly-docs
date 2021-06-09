---
title: Time Utilities
description: 'Utilities for use with making epoch time conversions simpler.'
position: 3
category: Utilities
---

These are useful utility functions that allow users to more easily make time conversions in epoch units.

## `time_interval_to_seconds(interval) -> float`

Convert a string interval to a number time.

### Arguments

| Arg      | Description                                | Examples         | Type |
| -------- | ------------------------------------------ | ---------------- | ---- |
| interval | String with a scalar and a magnitude unit. | `'1m'` or `'2h'` | str  |

**Supported units:**

- 's' = seconds
- 'm' = minute
- 'h' = hour
- 'd' = day
- 'w' = week
- 'M' = month
- 'y' = year
- 'D' = decade
- 'c' = century
- 'l' = millennium

### Response

| Description                                                | Examples        | Type  |
| ---------------------------------------------------------- | --------------- | ----- |
| The seconds of the time interval passed into the function. | `3600` or `120` | float |

## `build_<unit>() -> int`

Build a time in seconds that matches the base unit specified

**Supported times**:

- `build_second() -> int`
- `build_minute() -> int`
- `build_hour() -> int`
- `build_day() -> int`
- `build_week() -> int`
- `build_month() -> int`
- `build_year() -> int`
- `build_decade() -> int`
- `build_century() -> int`
- `build_millennium() -> int`

### Response

| Description                                                | Examples        | Type  |
| ---------------------------------------------------------- | --------------- | ----- |
| The seconds of the time interval passed into the function. | `3600` or `120` | float |