---
title: Blankly Bot
description: 'Usage & Functions of the Blankly Bot class'
position: 4
category: User Objects
---

## What is it?

A `BlanklyBot` class is used for complex, multicore bots. The usage of this class is targeted towards those running hundreds or thousands of different bots on distributed computing systems. When a single process isn't fast enough to handle  the demands of a bot workflow - due to neural network usage, intense computation or high volume data aggregation, this is the structure that should be used.

## Motivation

The design of the `Blankly Bot` class is very exciting because it opens the door for incredibly complex trading logic. By design, code built in the class will be run on a seperate core of the computer. This allows complex and intensive logic to be created without lagging the other processes. Writing code in this module allows Blankly can take advantage of an unlimited number of cores. This gives access to data scientists to gather & interpret vast amounts of live data, or traders to create a diverse portfolio of bots.

Although they run independently, messages & updates can be sent between bots through the main thread. This opens the door to creating meshes of complex trading bots. Each one with custom and powerful logic. Models can be run not only on different currencies, but also on seperate exchanges. This can be advantage of in multiple ways. For example, arbitrage can be implmeneted betweent two bots, with very basic communication by reporting exchange price data, and transferring funds between wallets. Dictionaries of these can be created and all managed simultaneously.

## Components

### Creation

`BlanklyBot` inherits from the `Blankly.BlanklyBot` class. This inheritance is what makes the magic happen, and what is called when actually setting up the module.

