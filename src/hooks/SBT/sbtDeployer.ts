import { BigNumber } from "@ethersproject/bignumber";
import { Contract, ethers } from "ethers";

type SBTContructor = {
  name: String;
  supply: String;
  symbol: string;
  url: any;
  img: string;
  owner: string;
  treasury: string;
  whitelisted: boolean;
  mintPrice: string;
};

type Member = {
  name: string;
  address: string;
};

export const getCurrentId = async (sbtDeployerContract: Contract) => {
  if (sbtDeployerContract.signer) {
    try {
      const sbtId: BigNumber = await sbtDeployerContract.counter();
      return sbtId;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  return false;
};

export const createNewSBT = async (
  sbtDeployerContract: Contract,
  SBTConstructor: SBTContructor,
  newWhitelistedMembers: Array<Member>,
  daoName: String
) => {
  console.log(
    "31 : ",
    sbtDeployerContract,
    SBTConstructor,
    newWhitelistedMembers
  );
  const needWhitelist = newWhitelistedMembers.length > 0 ? true : false;
  let memberAddr: Array<string> = [];
  if (needWhitelist) {
    for (let i = 0; i < newWhitelistedMembers.length; i++) {
      memberAddr.push(newWhitelistedMembers[i].address);
    }
  }
  if (sbtDeployerContract.signer) {
    try {
      const { name, symbol, owner, treasury, mintPrice, whitelisted } =
        SBTConstructor;
      const tx = await sbtDeployerContract.deployNewSBT(
        name,
        symbol,
        owner,
        treasury,
        ethers.utils.parseEther(mintPrice),
        whitelisted ? 1 : 0,
        [],
        [],
        []
      );
      return await tx.wait();
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  return false;
};

export const getContractById = async (
  sbtDeployerContract: Contract,
  id: BigNumber
) => {
  if (sbtDeployerContract.signer || sbtDeployerContract.provider) {
    try {
      const contractAddr = await sbtDeployerContract.getContractByIndex(
        BigNumber.from(parseInt(id.toString()))
      );
      return contractAddr;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  return false;
};
