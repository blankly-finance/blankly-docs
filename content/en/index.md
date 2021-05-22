---
title: Introduction
description: ''
position: 1
category: Introduction
---

[comment]: <> (<img src="./icon.svg" width="100" height="100" alt=""/>)

[comment]: <> ([Module]&#40;&#41; for [NuxtJS]&#40;https://nuxtjs.org&#41;.)

<alert type="success">

Welcome to the Blankly documentation

</alert>

# We're in the business of making professional tools available to everyone.

We originally started the Blankly trading module in December 2020. Far before it took the form as it is today, it was just a way of learning how to make requests to API endpoints and mess with the outputs. Today it's a complete development platform with hundreds of users.

We try to avoid complex docker configurations, Gradle scripts, or complex configurations. We want our modules to be usable out of the box but still provide infinite customization and powerful abilities. Our goal is to write code so simple and powerful that anyone - from the python beginner to the professional developer - can take advantage of features previously inaccessible.

[comment]: <> (<list :items="features"></list>)

[comment]: <> (<p class="flex items-center">Enjoy light and dark mode:&nbsp;<app-color-switcher class="inline-flex ml-2"></app-color-switcher></p>)

## Features
- Full REST API support for non-margin accounts on listed exchanges

- Ticker websocket support

- Order book websocket support

- Fully multiprocessed bots with flexible arguments.

- Quickstart access for interacting with exchanges

- Support for multiple portfolios on multiple exchanges, all independently

- Multi-process communication

- Long term and high resolution historical data downloads as pandas dataframes

- Single pip module (`pip install Blankly`)

- Asynchronous callbacks from ticker feeds

- ZeroRPC server to report to Javascript or React **

- Easy access to raw API calls

- Customizable circular buffer websocket feeds

- Support for coinbase pro's sandbox mode

- Run scheduled functions natively

- Logs for websocket feeds

- Status management for purchases

- Interface that allows calls to each supported exchange to be identical