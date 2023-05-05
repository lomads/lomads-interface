import { get as _get, find as _find } from 'lodash'
import { useWeb3React } from "@web3-react/core";
import { useContract } from "hooks/useContract";
import { SupportedChainId } from "constants/chains";
import { ethers } from "ethers";
import MultiCall from "@indexed-finance/multicall";
import axiosHttp from 'api'
import { USDC } from 'constants/tokens';
import { USDC_GOERLI, USDC_POLYGON } from 'constants/tokens'
import { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from 'state/hooks';
import { INFURA_NETWORK_URLS } from 'constants/infura';
import { CHAIN_INFO } from 'constants/chainInfo';
import { getRpcUrls } from 'utils/switchChain';

export type SBTParams = {
    name: string,
    tokenSymbol: string,
    supply: number,
    baseUrl: string,
    whitelisted: number
}

const useMintSBT = (contractAddress: string | undefined, version: string | undefined = "0") => {
  console.log("useMintSBT", contractAddress, version)
    const { account, provider: currentProvider, chainId: currentChainId, provider } = useWeb3React();
    const { DAO } = useAppSelector(store => store.dashboard)
    const [chainId, setChainId] = useState(null)
    useEffect(() => {
      if(DAO)
        setChainId(_get(DAO, 'sbt.chainId', _get(DAO, 'chainId')))
    }, [DAO])
    const mintContract = useContract(contractAddress, 
        +version >= 1 ?  require('abis/SBT.json') : require('abis/SBTv0.json')
    , true);

    const weth = (price: string, token: string): any => {
      if(!chainId) return;
      const tokens = [
        {
          label: CHAIN_INFO[chainId]?.nativeCurrency?.symbol,
          value: process.env.REACT_APP_NATIVE_TOKEN_ADDRESS,
          decimals: CHAIN_INFO[chainId]?.nativeCurrency?.decimals
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

    const getStats = useCallback(async (overrideChainId: number | undefined = undefined) => {
        if(account && chainId) {
          let currChainId: number | null = overrideChainId ? overrideChainId : chainId;
          const calls: any = [
            {
              target: contractAddress,
              function: "balanceOf",
              args: [account],
            },
            ...( +version >= 1 ? [{
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
            {
              target: contractAddress,
              function: "treasuryAddress",
              args: [],
            }] : [
              {
                target: contractAddress,
                function: "currentIndex",
                args: [],
              }
            ]),
            
          ]
          const rpcUrl = getRpcUrls(currChainId)
          let provider = new ethers.providers.JsonRpcProvider(rpcUrl[0])
          const multicall = new MultiCall(provider);
          const [, res] = await multicall.multiCall(
            +version >= 1 ? require('abis/SBT.json') : require('abis/SBTv0.json'),
              calls
          );
          console.log("currChainId", res)
          return res
        }
        return [null, null, null, null]
    }, [version, contractAddress, chainId, account])

    const payByCrypto = async (tokenContract: any) => {
      if(window.ethereum) {
        const stats = await getStats();
        const treasury = stats[5];
        const mintToken = (stats[3] ? stats[3] : process.env.REACT_APP_MATIC_TOKEN_ADDRESS).toString()
        let mintPrice = stats[2]._hex
        if(mintToken === process.env.REACT_APP_NATIVE_TOKEN_ADDRESS) {
          const params = {
            from: account, to: treasury, value: mintPrice
          }
          /* @ts-ignore */
          const txHash = await window?.ethereum?.request({
            method: 'eth_sendTransaction',
            params: [params],
          });
          const result = await new Promise((resolve, reject) => {
            const interval = setInterval(async ()=>{
              console.log("Attempting to get transaction receipt...");
              /* @ts-ignore */
              let receipt = await window?.ethereum?.request({
                method: 'eth_getTransactionReceipt',
                params: [txHash],
              });
              if(receipt) {
                clearInterval(interval)
                resolve(receipt)
              }
            }, 2000);
          })
          console.log("receipt", result)
          return result
        } else {
          const tx = await tokenContract.transfer(treasury, stats[2]._hex)
          return await tx.wait()
        }
      }
      return null
    }

    const mint = async (tokenURI: string | null | undefined, payment: string | undefined, signature: string | undefined, tokenContract: any) => {
        try {
          const stats = await getStats();
          let tokenId = parseFloat(stats[1].toString());
          const mintPrice = (stats[2] ? stats[2] : 0).toString()
          const mintToken = (stats[3] ? stats[3] : process.env.REACT_APP_MATIC_TOKEN_ADDRESS).toString()
          const isWhitelisted = stats[4] ? stats[4] : 0

          // if(mintToken && (mintToken !== process.env.REACT_APP_MATIC_TOKEN_ADDRESS)) {
          //   const txtx = await tokenContract?.approve(contractAddress, mintPrice)
          //   await txtx?.wait()
          // }

          try {
            let tx = null;
            if(+version >= 1) {
              tx = await mintContract?.safeMint(
                tokenURI,
                tokenId,
                payment,
                signature
              );
            } else {
              if(mintContract?.signer) {
                tx = await mintContract?.mintSBT(account);
              } 
            }
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
          const payment = '0x'
          try {
            const tx = await mintContract?.estimateGas.payableMint(
              "", 
              {
              from: account,
              value: mintPrice,
            });
            return tx;
          } catch (e) {
            console.log(e)
            throw _get(e, 'data.message', _get(e, 'message', 'Could not estimate gas. Please try after sometime'))
          }
        }
        throw 'Could not estimate gas. Please try after sometime'
      };

    const withdraw = async () => {
      if (mintContract?.signer) {

        const  overrides = {
          gasLimit: 3000000,
          gasPrice: ethers.utils.parseUnits('300', 'gwei').toString(),
          type: 1,
          accessList: [
            {
              address: "0xbd062EB9720c78f00c68770F3dE62118e66be404", // admin gnosis safe proxy address
              storageKeys: [
                  "0x0000000000000000000000000000000000000000000000000000000000000000"
              ]
            },
            {
              address: "0xEb42ab42685cF1C2Ad2A49d67C7f1363f2e7D807", // proceedsRecipient gnosis safe proxy address
              storageKeys: [
                  "0x0000000000000000000000000000000000000000000000000000000000000000"
              ]
            },
            {
              address: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',  // gnosis safe master address
              storageKeys: []
            }
          ]
        }

        try {
          const value = await mintContract?.withdraw(overrides)
        } catch (e) {
          console.log(e)
          throw _get(e, 'message', 'Could not withdraw')
        }
      }
      throw 'Could not withdraw. Please try after sometime'
    }

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

    return { mint, estimateGas, getStats, checkDiscount, updateContract, withdraw, payByCrypto }

}

export default useMintSBT;