---
title: Deployment API
description: 'Docs for sending to the deployment API without the CLI'
position: 35
version: 1.0
category: Services
---

​	Take a look at the python implementation of the API [here](https://github.com/Blankly-Finance/Blankly/blob/main/blankly/deployment/api.py#L114)!

​	The deployment API acts as a service to allow users or developers to send models to the cloud. Writing wrappers or directly calling the deployment API is a way to remove any interaction with the blankly Command Line Interface (CLI).

​	This API allows the uploading & running but no aspect of monitoring the trades. Those queries must be routed through the frontend API.

## Base URL

```
https://deploy.blankly.finance
```

## Authentication

Easily retrieve your API token by simply providing your blankly credentials to the platform.

1. Simply open this url: [https://app.blankly.finance/auth/signin?redirectUrl=/deploy](https://app.blankly.finance/auth/signin?redirectUrl=/deploy)

2. Log in normally using blankly credentials

3. Hit "Sign In." Your login token is provided in the URL that the page navigates to:

   ```
   http://localhost:9082/?token=****_******************_********_*************-***********_**********-******
   ```

4. The token in this case would be `****_******************_********_*************-***********_**********-******`
5. This token is used to generate new and disposable valid tokens



Grab the token you need by using this endpoint

### `POST /auth/token`

Exchange the above token for a token that can be used for more API calls

#### Arguments

| Arg          | Description                                 | Examples                                                     | Type |
| ------------ | ------------------------------------------- | ------------------------------------------------------------ | ---- |
| refreshToken | The token that was taken from the URL above | `****_******************_********_*************-***********_**********-******` | str  |

#### Response

```python
{
  "idToken": '*********'
}
```

| Key     | Description                                                  | Type |
| ------- | ------------------------------------------------------------ | ---- |
| idToken | The token used to make the remainder of the API calls. This will always be passed in the headers of each request | str  |

## Project Endpoints

### `POST /project/create`

Create a new project

#### Arguments

| Arg         | Description                    | Examples                             | Type |
| ----------- | ------------------------------ | ------------------------------------ | ---- |
| name        | The name of the project        | `"RSI Models"`                       | str  |
| description | The description of the project | "`Bots that buy < 30 and sell > 70`" | str  |

### `GET /project/list`

Returns an array of details about the current projects

## Model Endpoints

### `POST /model/deploy`

Post a blankly model to our services to be run

#### Arguments

**This endpoint requires a zipfile to be attached to the request.**

| Arg                | Description                                                  | Examples                                        | Type |
| ------------------ | ------------------------------------------------------------ | ----------------------------------------------- | ---- |
| plan               | Which plan (ram/cpu) the model should use when deployed      | `'nano'`                                        | str  |
| name               | The name of the model when deployed                          | `'RSI Model'`                                   | str  |
| modelId            | The identifier for the model that it is incrementing the version of. This upload will be placed as a new version on this modelId | `'aikglemvk94b'`                                | str  |
| projectId          | The projectId that this model was created under              | `'9vobjnoi8ud8uvu'`                             | str  |
| generalDescription | This is the description that acts as a root describer and doesn't necessarily change with version increments | `'This model buys below 30 and sells above 70'` | str  |
| versionDescription | Similar to a commit message. Specify this when deploying a new version. | `'Improve buy logic'`                           | str  |
| createNew          | Enable this if you want to write this as a new model into the project | `'true'`                                        | bool |
| pythonVersion      | The major version of python to use                           | `'3.7'`, `'3.8'`, `'3.9'`, `'3.10'`             | str  |

## Model Endpoints

### `POST /model/backtest`

Post a blankly model to our services to be run

#### Arguments

**This endpoint requires a zipfile to be attached to the request.**

| Arg                 | Description                                                  | Examples                            | Type |
| ------------------- | ------------------------------------------------------------ | ----------------------------------- | ---- |
| plan                | Which plan (ram/cpu) the model should use when deployed      | `'nano'`                            | str  |
| name                | The name of the model when deployed                          | `'RSI Model'`                       | str  |
| modelId             | The identifier for the model that it is incrementing the version of. This upload will be placed as a new version on this modelId | `'aikglemvk94b'`                    | str  |
| projectId           | The projectId that this model was created under              | `'9vobjnoi8ud8uvu'`                 | str  |
| backtestArgs        | A stringified dictionary that contains the backtest arguments. These are the arguments passed into the `.backtest()` function. | `'{"to": "1y"}'`                    | str  |
| backtestDescription | Specify a message that describes what this backtest is testing | `'Changed RSI to buy at 20'`        | str  |
| createNew           | Enable this if you want to write this as a new model into the project | `'true'`                            | bool |
| pythonVersion       | The major version of python to use                           | `'3.7'`, `'3.8'`, `'3.9'`, `'3.10'` | str  |

## Zipfile Format

​	Attaching the model itself to the requests is easy. When unpacked, the zip file should contain a root named `model`. Directly inside there should be a valid `blankly.json` file:

```
/model
| - blankly.json   # The blankly.json can reference the main script and requirements.txt
```

See a python implementation of this [here](https://github.com/Blankly-Finance/Blankly/blob/6e84c82ee4d7a0a90eaa5fcdee0bdc27b3537f97/blankly/deployment/api.py#L114).

