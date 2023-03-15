import { get as _get, find as _find } from 'lodash'
import { useWeb3React } from "@web3-react/core";
import { useContract, useTokenContract } from "hooks/useContract";
import { SupportedChainId } from "constants/chains";
import { ethers } from "ethers";
import MultiCall from "@indexed-finance/multicall";
import axiosHttp from 'api'
import { USDC } from 'constants/tokens';
import { USDC_GOERLI, USDC_POLYGON } from 'constants/tokens'

export type SBTParams = {
    name: string,
    tokenSymbol: string,
    supply: number,
    baseUrl: string,
    whitelisted: number
}

const useMintSBT = (contractAddress: string | undefined) => {
    const { account, chainId, provider } = useWeb3React();
    const mintContract = useContract(contractAddress, 
        chainId === SupportedChainId.GOERLI ? require('abis/SBT.json') :
        chainId === SupportedChainId.POLYGON ? require('abisPolygon/SBT.json') : ''
    , true);

    const weth = (price: string, token: string): any => {
      if(!chainId) return;
      const tokens = [
          {
              label: 'ETH',
              value: "0x0000000000000000000000000000000000000000",
              decimals: 18
          },
          {
              label: _get(USDC, `[${chainId}].symbol`),
              value: _get(USDC, `[${chainId}].address`),
              decimals: _get(USDC, `[${chainId}].decimals`),
          }
      ]
      const payToken = _find(tokens, (t:any) => t.value === token)
      return ethers.utils.parseUnits(price, payToken?.decimals)
  }

    const getStats = async () => {
        if(account) {
          const calls: any = [
            {
              target: contractAddress,
              function: "balanceOf",
              args: [account],
            },
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
            }
          ]
          const multicall = new MultiCall(provider);
          const [, res] = await multicall.multiCall(
              chainId === SupportedChainId.GOERLI ? require('abis/SBT.json') :
              chainId === SupportedChainId.POLYGON ? require('abisPolygon/SBT.json') : '',
              calls
          );
          return res
        }
        return [null, null, null, null]
    }

    const mint = async (tokenURI: string, tokenContract: any) => {
        try {
          const stats = await getStats();
          const tokenId = parseFloat(stats[1].toString());
          const mintPrice = (stats[2]).toString()
          const mintToken = (stats[3]).toString()
          const isWhitelisted = stats[4];
          let signature = null;
          if(isWhitelisted) {
            signature = await axiosHttp.post(`contract/whitelist-signature`, {
              tokenId, 
              contract: contractAddress,
              chainId
            }).then(res => res?.data?.signature)
          }

          if(mintToken !== process.env.REACT_APP_MATIC_TOKEN_ADDRESS)
             await tokenContract?.approve(contractAddress, mintPrice)

          try {
            const tx = await mintContract?.safeMint(
              tokenURI,
              tokenId,
              signature
              , {
              from: account,
              value: mintPrice,
            });
            const txn = await tx?.wait();
            return txn;
          } catch (e) {
            console.log(e)
            throw _get(e, 'message', 'Error while minting')
          }
        }
        catch (e) {
           console.log(e)
           throw 'Error during mint'
        }
    }

    const estimateGas = async () => {
        if (mintContract?.signer) {
          const stats = await getStats();
          const tokenId = parseFloat(stats[1].toString());
          const mintPrice = (stats[2]).toString()
          const isWhitelisted = stats[4];
          let signature = null;
          if(isWhitelisted) {
            signature = await axiosHttp.post(`contract/whitelist-signature`, {
              tokenId, 
              contract: contractAddress,
              chainId
            }).then(res => res?.data?.signature)
          }
          try {
            const tx = await mintContract?.estimateGas.safeMint(
              "",
              tokenId,
              signature
              , {
              from: account,
              value: mintPrice,
            });
            return tx;
          } catch (e) {
            console.log(e)
            throw _get(e, 'message', 'Could not estimate gas. Please try after sometime')
          }
        }
        throw 'Could not estimate gas. Please try after sometime'
      };

    const checkDiscount = async (inviteCode: string) => {
      if (mintContract?.signer) {
        try {
          const value = await mintContract?.getDiscount(inviteCode, account)
          const ethValue = ethers.utils.formatEther(value.toString());
          return ethValue
        } catch (e) {
          console.log(e)
          throw _get(e, 'message', 'Could not estimate gas. Please try after sometime')
        }
      }
      throw 'Could not estimate gas. Please try after sometime'
    }

    const updateContract = async (price: string, mintToken: string) => {
      if (mintContract?.signer) {
        try {
          // const [err, res] = await multicall.multiCall(
          //     chainId === SupportedChainId.GOERLI ? require('abis/SBT.json') :
          //     chainId === SupportedChainId.POLYGON ? require('abisPolygon/SBT.json') : '',
          //     calls
          // );
          const tx = await mintContract?.setMintPrice(weth(price, mintToken))
          await tx.wait()
          const mintPriceValue = await mintContract?.mintPrice()
          console.log(mintPriceValue.toString())
          //console.log(ethers.utils.formatEther(value.toString()))
          return mintPriceValue
        } catch (e) {
          console.log(e)
          throw _get(e, 'message', 'Failed to update contract')
        }
      } else {
        throw "Transaction not signed"
      }
    }

    return { mint, estimateGas, getStats, checkDiscount, updateContract }

}

export default useMintSBT;