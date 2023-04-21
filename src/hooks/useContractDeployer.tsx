import { get as _get, find as _find } from 'lodash'
import { BigNumber } from "@ethersproject/bignumber";
import { useWeb3React } from "@web3-react/core";
import { useContract } from "hooks/useContract";
import { ethers } from "ethers";
import { USDC } from 'constants/tokens';
import { useState } from "react";
import { CHAIN_INFO } from 'constants/chainInfo';

export type SBTParams = {
    name: string,
    symbol: string,
    mintToken: string,
    treasury: string,
    mintPrice: string,
    whitelisted: number,
    chainId: number
}


const useContractDeployer = (deployerAddress: any) => {
    const { account, provider } = useWeb3React();
    const deployerContract = useContract(deployerAddress, require('abis/SBTDeployer.json'), true)
    const [deployLoading, setDeployLoading] = useState(false)

    const waitFor = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

    const retry = (promise: any, onRetry: any, maxRetries: number) => {
        const retryWithBackoff: any = async (retries: number) => {
            try {
                if (retries > 0) {
                    const timeToWait = 2 ** retries * 1000;
                    console.log(`waiting for ${timeToWait}ms...`);
                    await waitFor(timeToWait);
                }
                return await promise();
            } catch (e) {
                if (retries < maxRetries) {
                    onRetry();
                    return retryWithBackoff(retries + 1);
                } else {
                    console.warn("Max retries reached. Bubbling the error up");
                    throw e;
                }
            }
        }
        return retryWithBackoff(0);
    }

    const getContractById = async (id: BigNumber) => {
        return deployerContract?.getContractByIndex(BigNumber.from(parseInt(id.toString())));
    }

    const weth = (price: string, token: string, chainId: number): any => {
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

    const deploy = async ({ name, symbol, mintToken, treasury, mintPrice, whitelisted, chainId }: SBTParams) => {
        setDeployLoading(true);
        try {
            if(chainId && account && deployerContract?.signer) {
                const currentTokenId: BigNumber = await deployerContract?.counter();
                const tx = await deployerContract?.deployNewSBT(
                    name, 
                    symbol, 
                    weth(mintPrice, mintToken, chainId),
                    mintToken,
                    treasury,
                    whitelisted ? 1 : 0
                );
                const txn = await tx.wait();
                if(!txn) {
                    setDeployLoading(false);
                    throw 'Error during deployment'
                }
                const contractAddr = await retry(
                    () => getContractById(currentTokenId),
                    () => { console.log('retry called...') },
                    50
                )
                setDeployLoading(false);
                return contractAddr
            } else {
                setDeployLoading(false);
                throw 'Error during deployment'
            }
        }
        catch (e:any) {
           console.log(e.message)
           throw _get(e ,'message', 'Error during deployment')
        }
    }

    return { deploy, deployLoading }

}

export default useContractDeployer;