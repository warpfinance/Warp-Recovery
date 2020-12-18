import { ethers } from "ethers";
import { infuraKey } from "./config";
import { ERC20Service, StableCoinWarpVaultService, WarpControlService, WarpLPVaultService } from "./lib/contracts";
import { BlockOfInterest, getBlocksOfInterest } from "./lib/logic/blocksOfInterest";
import { formatBigNumber, getContractAddress, getTokensByNetwork, parseBigNumber, setTransactionCallBlockNumber, Token } from "./lib/util";
import { runMethodSafe } from "./lib/util/runner";

import * as fs from 'fs';


const doGetSnapshot = async () => {
  const account = "0xdf8bee861227ffc5eea819c332a1c170ae3dbacb";

  const context = {
    provider: new ethers.providers.InfuraProvider('homestead', infuraKey),
    networkId: 1,
  };
  const { provider, networkId } = context;


  const control = new WarpControlService(getContractAddress(networkId, 'warpControl'), provider, null);

  

  const scTokens = getTokensByNetwork(networkId, false);
  const lpTokens = getTokensByNetwork(networkId, true);

  interface Vault {
    lp: boolean,
    token: Token,
    vaultAddress: string
  }

  const startBlock = await provider.getBlock(11462161);
  const endBlock = await provider.getBlock(11473330);
  const blocksOfInterest = await getBlocksOfInterest(control, scTokens, lpTokens, startBlock, endBlock);

  let allAccounts: string[] = [];
  Object.values(blocksOfInterest).forEach((block: BlockOfInterest) => {
    Array.prototype.push.apply(allAccounts, block.accounts);
  });

  allAccounts = allAccounts.filter((v, i, a) => a.indexOf(v) === i);

  console.log(allAccounts);

  interface VaultBalance  {
    balance: string
  }

  interface AccountBalance {
    scVaults: { [symbol: string]: VaultBalance }
    lpVaults: { [symbol: string]: VaultBalance }
  }

  interface AccountBalances {
    [account: string]: AccountBalance
  }

  const balances: AccountBalances = {};

  setTransactionCallBlockNumber(11473329);

  for (const account of allAccounts) {
    const balance: AccountBalance = {
      scVaults: {},
      lpVaults: {}
    };

    for (const lpToken of lpTokens) {
      console.log(`${lpToken.symbol} ${account}`)
      const vaultAddress = await control.getLPVault(lpToken.address);
      const vault = new WarpLPVaultService(vaultAddress, control.provider, null);
      const bigBalance = await vault.collateralBalance(account);
      const erc = new ERC20Service(lpToken.address, provider, null);
      const decimals = await erc.decimals();

      balance.lpVaults[lpToken.symbol] = {
        balance: formatBigNumber(bigBalance, decimals, decimals)
      }
    }

    for (const scToken of scTokens) {
      console.log(`${scToken.symbol} ${account}`)
      const vaultAddress = await control.getStableCoinVault(scToken.address);
      const vault = new StableCoinWarpVaultService(vaultAddress, control.provider, null);
      const bigBalance = await vault.getBalance(account);
      const erc = new ERC20Service(scToken.address, provider, null);
      const decimals = await erc.decimals();

      balance.scVaults[scToken.symbol] = {
        balance: formatBigNumber(bigBalance, decimals, decimals)
      }
    }

    balances[account] = balance;
  }

  fs.writeFileSync('./balances.json', JSON.stringify(balances, undefined, 2));
}

runMethodSafe(doGetSnapshot);