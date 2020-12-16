import { Contract, ethers, Wallet } from "ethers";
import { capitalize } from "../util/tools";

const contractAbi: string[] = [
  'function claimNFTs() public',
  'function hasEpic(address _account) public view returns(bool)',
  'function hasLegendary(address _account) public view returns(bool)',
  'function hasRare(address _account) public view returns(bool)',
  'function hasSocial(address _account) public view returns(bool)',
  'function canClaim(address _account) public view returns(bool)',
  'function rareWhiteList(address _account) public view returns(bool)',
  'function epicWhiteList(address _account) public view returns(bool)',
  'function legendaryWhiteList(address _account) public view returns(bool)',
  'function socialWhiteList(address _account) public view returns(bool)',
  'function rareClaimed(address _account) public view returns(bool)',
  'function epicClaimed(address _account) public view returns(bool)',
  'function legendaryClaimed(address _account) public view returns(bool)',
  'function socialClaimed(address _account) public view returns(bool)',
]

export const launchNftTypes = ["legendary", "epic", "rare", "social"];

export class WarpLaunchNftService {
  provider: any
  contract: Contract

  constructor(address: string, provider: any, signerAddress: Maybe<string>) {
    this.provider = provider;
    if (signerAddress) {
      const signer: Wallet = provider.getSigner()
      this.contract = new ethers.Contract(address, contractAbi, provider).connect(signer)
    } else {
      this.contract = new ethers.Contract(address, contractAbi, provider)
    }
  }

  hasEpicNft = async (account: string): Promise<boolean> => {
    return await this.hasNftType(account, 'epic');
  }

  hasLegendaryNft = async (account: string): Promise<boolean> => {
    return await this.hasNftType(account, 'legendary');
  }

  hasRareNft = async (account: string): Promise<boolean> => {
    return await this.hasNftType(account, 'rare');
  }

  hasSocialNft = async (account: string): Promise<boolean> => {
    return await this.hasNftType(account, 'social');
  }

  hasNftType = async (account: string, type: string) => {
    return await this.contract[`has${capitalize(type)}`](account);
  }

  canClaimNfts = async (account: string): Promise<boolean> => {
    return await this.contract.canClaim(account);
  }

  canClaimType = async (account: string, type: string) => {
    const onWhiteList = await this.contract[`${type}WhiteList`](account);
    const canClaim = onWhiteList && !(await this.contract[`${type}Claimed`](account));
    return canClaim
  }

  canClaimRare = async (account: string): Promise<boolean> => {
    return await this.canClaimType(account, 'rare');
  }

  canClaimEpic = async (account: string): Promise<boolean> => {
    return await this.canClaimType(account, 'epic');
  }

  canClaimLegendary = async (account: string): Promise<boolean> => {
    return await this.canClaimType(account, 'legendary');
  }

  canClaimSocial = async (account: string): Promise<boolean> => {
    return await this.canClaimType(account, 'social');
  }
}
