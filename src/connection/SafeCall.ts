// @ts-nocheck
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import Safe from "@gnosis.pm/safe-core-sdk";
import SafeServiceClient from "@gnosis.pm/safe-service-client";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { GNOSIS_SAFE_BASE_URLS } from 'constants/chains'

export const ImportSafe = async (provider: any, safeAddress: string) => {
  const safeOwner = provider?.getSigner(0);

  const ethAdapter = new EthersAdapter({
    ethers,
    signer: safeOwner as any,
  });

  const safeSDK: Safe = await Safe.create({
    ethAdapter: ethAdapter,
    safeAddress,
  });
  return safeSDK;
};

export const safeService = async (provider: any, chainId: string) => {
  const safeOwner = provider?.getSigner(0);
  const ethAdapter = new EthersAdapter({
    ethers,
    signer: safeOwner as any,
  });
  const txServiceUrl = GNOSIS_SAFE_BASE_URLS[chainId];
  const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter });
  return safeService;
};
