---
title: Reporter
description: 'Report model status on deployment'
position: 29
version: 1.0
category: Utilities

---

The reporter class is globally linked to the blankly module import. The class is generally used to show the headers that are available to the user when they have deployed their model. There are also valid implementations of some functions that they also run locally.

# Functions

## `export_live_var(var: Any, name: str, description: str = None)`

Create a variable that can be read and updated externally. You can fetch any updated value by using the `update_live_var()` function.

### Arguments

| Arg         | Description                                                  | Examples                                                 | Type                                 |
| ----------- | ------------------------------------------------------------ | -------------------------------------------------------- | ------------------------------------ |
| var         | Any variable                                                 | `rsi_min`                                                | Any - recommended int, float, or str |
| name        | An identifier for the live variable                          | `"RSI Min"`                                              | str                                  |
| description | An optional longer description to show what the variable is used for | `"Used to specify at what RSI level the bot should buy"` | str                                  |

## `update_live_var(var)`

Read an exported live variable.

### Arguments

| Arg  | Description                                             | Examples  | Type                                 |
| ---- | ------------------------------------------------------- | --------- | ------------------------------------ |
| var  | The same variable reference used to export the live var | `rsi_min` | Any - recommended int, float, or str |

### Response

| Description                                                  | Examples      | Type |
| ------------------------------------------------------------ | ------------- | ---- |
| The updated live variable. This will always be the same value that was exported unless an update occurred. | `3` or `2.53` | Any  |

## `text(message_str: str)`

Send a text message with a given string input. This requires valid SMTP & text information in `notify.json`.

### Arguments

| Arg         | Description                                                  | Examples                        | Type |
| ----------- | ------------------------------------------------------------ | ------------------------------- | ---- |
| message_str | The message to text to the phone number in the `notify.json`. | `'Top Buys this hour: BTC-USD'` | str  |

## `email(email_str: str, override_receiver: str = None)`

Send an email with a given `email_str` input based on `notify.json`. The receiver can also be overridden directly using `override_receiver`.

### Arguments

| Arg               | Description                                                  | Examples                        | Type |
| ----------------- | ------------------------------------------------------------ | ------------------------------- | ---- |
| email_str         | The email to send to the receiver specified in `notify.json`. | `'Top Buys this hour: BTC-USD'` | str  |
| override_receiver | Manually override the receiver email used in `notify.json`. This is added because text messages | `'newEmail@gmail.com'`          | str  |

