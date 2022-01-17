---
title: blankly.json
description: 'Key/value descriptions for blankly.json'
position: 8
version: 1.0
category: Config
---

The `blankly.json` file is used to specify settings that are read by blankly when deploying on the cloud.

This file is only necessary if using blankly cloud.

This file can be placed in version control.

## Format

```json[blankly.json]
{
  "main_script": "./bot.py",
  "python_version": "3.7",
  "requirements": "./requirements.txt",
  "working_directory": ".",
  "ignore_files": [
    "price_caches"
  ],
  "backtest_args": {
    "to": "1y"
  },
  "project_id": "foPDexWK3aqFkLAD9iJw",
  "model_id": "159bc09d-805d-4efe-8a4c-3d3aef15bdd0",
  "model_name": "Simple MACD model"
}
```

| Key               | Description                                                  | Type |
| ----------------- | ------------------------------------------------------------ | ---- |
| main_script       | The path from the `working_directory` to start the script on the cloud | str  |
| python_version    | A valid python version to run your model on. This can be `3.7`, `3.8`, `3.9`, and `3.10`. | str  |
| requirements      | A path from the `working_drectory` to install requirements from on the cloud | str  |
| working_directory | Specify the path from `blankly.json` for all other paths to be referenced from | str  |
| ignore_files      | An array of file names. Both folder names and file names can be placed here. | list |
| backtest_args     | A dictionary of arguments to be passed as your backtest results. These arguments should match those found in `strategy.backtest()` | dict |
| project_id        | Added by the the CLI when you deploy for the first time. This is the project that the model is uploaded to | str  |
| model_id          | Added by the the CLI when you deploy for the first time. This is the model id that the model is uploaded to | str  |
| model_name        | Added by the the CLI when you deploy for the first time. This is the name shown on the platform | str  |