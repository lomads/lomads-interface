import { get as _get } from 'lodash'
import { useWeb3React } from "@web3-react/core";
import { useContract } from "hooks/useContract";
import { SupportedChainId } from "constants/chains";
import { ethers } from "ethers";
import MultiCall from "@indexed-finance/multicall";

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

    const getStats = async () => {
        const calls: any = [
            {
                target: contractAddress,
                function: "balanceOf",
                args: [account],
              },
              {
                target: contractAddress,
                function: "name",
                args: [],
              },
              {
                target: contractAddress,
                function: "totalSupply",
                args: [],
              },
        ]
        const multicall = new MultiCall(provider);
        const [, res] = await multicall.multiCall(
            chainId === SupportedChainId.GOERLI ? require('abis/SBT.json') :
            chainId === SupportedChainId.POLYGON ? require('abisPolygon/SBT.json') : '',
            calls
        );
        return res
    }

    const mint = async ({ referralCode, mintPrice }: { referralCode: string, mintPrice: string }) => {
        try {
            const stats = await getStats()
            console.log(stats)
            const currentIndex =
            parseFloat(stats[2].toString()) === 0
              ? "1"
              : stats[2].toString();
            if(chainId && account && mintContract?.signer) {
                console.log(referralCode, mintPrice)
                const tx = await mintContract?.safeMint(
                    `${process.env.REACT_APP_NODE_BASE_URL}/v1/${contractAddress}/${currentIndex}`, 
                    referralCode, 
                {
                    from: account,
                    value: ethers.utils.parseEther(mintPrice)
                });
                await tx.wait();
                return currentIndex;
            } else {
                throw 'Error during mint'
            }
        }
        catch (e) {
           console.log(e)
           throw 'Error during mint'
        }
    }

    const estimateGas = async ( mintPrice: string, referralCode: string) => {
        if (mintContract?.signer) {
          try {
            const tx = await mintContract?.estimateGas.safeMint("", referralCode, {
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

    const updateContract = async (price: any) => {
      if (mintContract?.signer) {
        try {
          // const [err, res] = await multicall.multiCall(
          //     chainId === SupportedChainId.GOERLI ? require('abis/SBT.json') :
          //     chainId === SupportedChainId.POLYGON ? require('abisPolygon/SBT.json') : '',
          //     calls
          // );
          const tx = await mintContract?.setMintPrice(price)
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