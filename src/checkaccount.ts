import { ethers } from "ethers";
import { infuraKey } from "./config";
import { WarpControlService } from "./lib/contracts";
import { getContractAddress, getTokensByNetwork, parseBigNumber, Token } from "./lib/util";
import { runMethodSafe } from "./lib/util/runner";


const doCheckAccount = async () => {
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

  const tvlc = await control.getTotalCollateralValue(account);
  const bamount = await control.getBorrowAmount(account);
  const bl = await control.getBorrowLimit(account);
  
  console.log(parseBigNumber(tvlc, 6));
  console.log(parseBigNumber(bamount, 6));
  console.log(parseBigNumber(bl, 6));
}

runMethodSafe(doCheckAccount);