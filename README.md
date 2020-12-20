# Warp Utilities

This project is dedicated towards interacting with the Warp Finance contracts independent via CLI.

## Install / Getting Started

Node v12 or greater is needed. 

Run `yarn` to install needed packages.

You will also need `ts-node` installed globally on your machine.
You can do this by running `npm i -g ts-node`

## Get Snapshot of Balances

To get a snapshot of all the account balances on Warp Finance at a specific block you can run the `getSnapshot.ts` file.

Running it can be done via `tsnode --files ./src/getSnapshot.ts`

The block # can be configured inside the file on line 12.  
It will output a `balances.json` file.

Note: The block of the attack was `11473330`  
The snapshot was taken at block `11479000`

## Get distribution amounts

To get the amount of recovered LP each account you can run the `getDistribution.ts` file.

Running it can be done via `ts-node --files ./src/getDistribution.ts`

The input balances json file can be adjusted on line 6.  
The amount of recovered LP can be configured on line 7.

