import { useState, useEffect } from "react";
import { BigNumber, Contract } from "ethers";
import MultiCall from "@indexed-finance/multicall";
import SBT_ABI from "../../abis/SBT.json";
import SBT_ABI_POLYGON from "../../abisPolygon/SBT.json";
import { useWeb3Contract } from "react-moralis";
import { SupportedChainId } from "constants/chains";

export const useSBTStats = (
  library: any,
  account: string,
  refresh: number,
  contractAddr: string,
  chainId: number | undefined = SupportedChainId.GOERLI
) => {
  console.log(account);

  const [stats, setStats] = useState({
    needWhitelist: Boolean(false),
    isWhitelisted: Boolean(false),
    balanceOf: BigNumber.from(0),
    contractName: "",
    currentIndex: BigNumber.from(0),
  });
  useEffect(() => {
    const fetch = async () => {
      console.log("test", !library, account == "", contractAddr == "");
      if (!library || account == "" || contractAddr == "") return;
      const multicall = new MultiCall(library);

      try {
        const calls = [
          {
            target: contractAddr,
            function: "balanceOf",
            args: [account],
          },
          {
            target: contractAddr,
            function: "name",
            args: [],
          },
          {
            target: contractAddr,
            function: "totalSupply",
            args: [],
          },
        ];

        const [, res] = await multicall.multiCall(
          chainId === SupportedChainId.POLYGON ? SBT_ABI_POLYGON : SBT_ABI,
          calls
        );

        setStats({
          needWhitelist: false,
          isWhitelisted: false,
          balanceOf: res[0],
          contractName: res[1],
          currentIndex: res[2],
        });
      } catch (e) {
        console.log("error occured", e);
      }
    };
    if (account && library && contractAddr != "") {
      fetch();
    }
  }, [library, account, refresh, contractAddr]);
  return { ...stats };
};

export const mintSBTtoken = async (
  sbtContract: Contract,
  account: string,
  mintPrice: string,
  referralCode: string
) => {
  if (sbtContract.signer) {
    try {
      const tx = await sbtContract.safeMint("", referralCode, {
        from: account,
        value: mintPrice,
      });
      return await tx.wait();
    } catch (e) {
      return { error: e };
    }
  }
  return false;
};

export const estimateGas = async (
  sbtContract: Contract,
  account: string,
  mintPrice: string,
  referralCode: string
) => {
  if (sbtContract.signer) {
    try {
      const tx = await sbtContract.estimateGas.safeMint("", referralCode, {
        from: account,
        value: mintPrice,
      });
      return tx;
    } catch (e) {
      return { error: e };
    }
  }
  return false;
};
