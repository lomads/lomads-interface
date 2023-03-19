import { get as _get, find as _find } from "lodash";
import { useWeb3React } from "@web3-react/core";
import { useContract } from "hooks/useContract";
import { SupportedChainId } from "constants/chains";
import { ethers } from "ethers";
import MultiCall from "@indexed-finance/multicall";
import axiosHttp from "api";
import { USDC } from "constants/tokens";
import { USDC_GOERLI, USDC_POLYGON } from "constants/tokens";
import { useCallback } from "react";
import useMeta, { getMintParams, getBiconomy } from "./useMeta";

export type SBTParams = {
  name: string;
  tokenSymbol: string;
  supply: number;
  baseUrl: string;
  whitelisted: number;
};

// gsf : verify version from hook is correct current version is one

const useMintSBT = (
  contractAddress: string | undefined,
  version: string | undefined = "0"
) => {
  console.log("useMintSBT", contractAddress, version);
  const { account, chainId, provider } = useWeb3React();
  const { signer, biconomySecret, sendMetaTransaction } = useMeta();

  const mintContract = useContract(
    contractAddress,
    version === "1"
      ? chainId === SupportedChainId.GOERLI
        ? require("abis/SBT.json")
        : chainId === SupportedChainId.POLYGON
        ? require("abisPolygon/SBT.json")
        : ""
      : chainId === SupportedChainId.GOERLI
      ? require("abis/SBTv0.json")
      : chainId === SupportedChainId.POLYGON
      ? require("abisPolygon/SBTv0.json")
      : chainId === SupportedChainId.POLYGON_MUMBAI
      ? require("abisPolygon/MetaSBTDeployer.json")
      : "",
    true
  );

  const weth = (price: string, token: string): any => {
    if (!chainId) return;
    const tokens = [
      {
        label: "ETH",
        value: "0x0000000000000000000000000000000000000000",
        decimals: 18,
      },
      {
        label: _get(USDC, `[${chainId}].symbol`),
        value: _get(USDC, `[${chainId}].address`),
        decimals: _get(USDC, `[${chainId}].decimals`),
      },
    ];
    const payToken = _find(tokens, (t: any) => t.value === token);
    return ethers.utils.parseUnits(price, payToken?.decimals);
  };

  const getStats = useCallback(async () => {
    if (account) {
      const calls: any = [
        {
          target: contractAddress,
          function: "balanceOf",
          args: [account],
        },
        ...(version === "1"
          ? [
              {
                target: contractAddress,
                function: "MINTED",
                args: [],
              },
              {
                target: contractAddress,
                function: "mintPrice",
                args: [],
              },
              {
                target: contractAddress,
                function: "mintToken",
                args: [],
              },
              {
                target: contractAddress,
                function: "mustBeWhitelisted",
                args: [],
              },
            ]
          : [
              {
                target: contractAddress,
                function: "currentIndex",
                args: [],
              },
            ]),
      ];
      console.log("useMintSBT-calls", calls);
      const multicall = new MultiCall(provider);
      const [, res] = await multicall.multiCall(
        version === "1"
          ? chainId === SupportedChainId.GOERLI
            ? require("abis/SBT.json")
            : chainId === SupportedChainId.POLYGON
            ? require("abisPolygon/SBT.json")
            : ""
          : chainId === SupportedChainId.GOERLI
          ? require("abis/SBTv0.json")
          : chainId === SupportedChainId.POLYGON
          ? require("abisPolygon/SBTv0.json")
          : chainId === SupportedChainId.POLYGON_MUMBAI
          ? require("abisPolygon/MetaSBTDeployer.json")
          : "",
        calls
      );
      console.log("useMintSBT-calls", res);
      return res;
    }
    return [null, null, null, null];
  }, [version, contractAddress, provider, account]);

  const mint = async (
    tokenURI: string | null | undefined,
    tokenContract: any
  ) => {
    try {
      const stats = await getStats();
      let tokenId = parseFloat(stats[1].toString());
      const mintPrice = (stats[2] ? stats[2] : 0).toString();
      const mintToken = (
        stats[3] ? stats[3] : process.env.REACT_APP_MATIC_TOKEN_ADDRESS
      ).toString();
      const isWhitelisted = stats[4] ? stats[4] : 0;
      let signature = await axiosHttp
        .post(`contract/whitelist-signature`, {
          tokenId,
          contract: contractAddress,
          chainId,
        })
        .then((res) => res?.data?.signature);

      if (
        mintToken &&
        mintToken !== process.env.REACT_APP_MATIC_TOKEN_ADDRESS
      ) {
        const txtx = await tokenContract?.approve(contractAddress, mintPrice);
        await txtx?.wait();
      }

      try {
        let tx = null;

        const param = getMintParams(
          contractAddress!,
          tokenURI!,
          tokenId,
          signature
        );
        if (version === "1") {
          // tx = await mintContract?.safeMint(
          //   tokenURI,
          //   tokenId,
          //   signature
          //   , {
          //   from: account,
          //   value: mintPrice,
          // });
          tx = await sendMetaTransaction(
            mintContract,
            contractAddress!,
            version === "1"
              ? chainId === SupportedChainId.GOERLI
                ? require("abis/SBT.json")
                : chainId === SupportedChainId.POLYGON
                ? require("abisPolygon/SBT.json")
                : ""
              : chainId === SupportedChainId.GOERLI
              ? require("abis/SBTv0.json")
              : chainId === SupportedChainId.POLYGON
              ? require("abisPolygon/SBTv0.json")
              : chainId === SupportedChainId.POLYGON_MUMBAI
              ? require("abisPolygon/MetaSBTDeployer.json")
              : "",
            param.sig,
            param.params
          );
        } else {
          if (mintContract?.signer) {
            tx = await mintContract?.mintSBT(account);
          }
        }

        return tx;
      } catch (e) {
        console.log(e);
        throw _get(e, "message", "Error while minting");
      }
    } catch (e) {
      console.log(e);
      throw "Error during mint";
    }
  };

  const estimateGas = async () => {
    if (mintContract?.signer) {
      const stats = await getStats();
      const tokenId = parseFloat(stats[1].toString());
      const mintPrice = stats[2].toString();
      const isWhitelisted = stats[4];
      let signature = await axiosHttp
        .post(`contract/whitelist-signature`, {
          tokenId,
          contract: contractAddress,
          chainId,
        })
        .then((res) => res?.data?.signature);
      try {
        const tx = await mintContract?.estimateGas.safeMint(
          "",
          tokenId,
          signature,
          {
            from: account,
            value: mintPrice,
          }
        );
        return tx;
      } catch (e) {
        console.log(e);
        throw _get(
          e,
          "message",
          "Could not estimate gas. Please try after sometime"
        );
      }
    }
    throw "Could not estimate gas. Please try after sometime";
  };

  const checkDiscount = async (inviteCode: string) => {
    if (mintContract?.signer) {
      try {
        const value = await mintContract?.getDiscount(inviteCode, account);
        const ethValue = ethers.utils.formatEther(value.toString());
        return ethValue;
      } catch (e) {
        console.log(e);
        throw _get(
          e,
          "message",
          "Could not estimate gas. Please try after sometime"
        );
      }
    }
    throw "Could not estimate gas. Please try after sometime";
  };

  const updateContract = async (price: string, mintToken: string) => {
    if (mintContract?.signer) {
      try {
        // const [err, res] = await multicall.multiCall(
        //     chainId === SupportedChainId.GOERLI ? require('abis/SBT.json') :
        //     chainId === SupportedChainId.POLYGON ? require('abisPolygon/SBT.json') : '',
        //     calls
        // );
        const tx = await mintContract?.setMintPrice(weth(price, mintToken));
        await tx.wait();
        const mintPriceValue = await mintContract?.mintPrice();
        console.log(mintPriceValue.toString());
        //console.log(ethers.utils.formatEther(value.toString()))
        return mintPriceValue;
      } catch (e) {
        console.log(e);
        throw _get(e, "message", "Failed to update contract");
      }
    } else {
      throw "Transaction not signed";
    }
  };

  return { mint, estimateGas, getStats, checkDiscount, updateContract };
};

export default useMintSBT;
