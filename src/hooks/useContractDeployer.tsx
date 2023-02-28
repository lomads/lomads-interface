import { get as _get } from 'lodash'
import { BigNumber } from "@ethersproject/bignumber";
import { useWeb3React } from "@web3-react/core";
import { useContract } from "hooks/useContract";
import { ethers } from "ethers";

import {
    SBT_DEPLOYER_ADDRESSES
  } from 'constants/addresses'
import { useState } from "react";

export type SBTParams = {
    name: string,
    symbol: string,
    payToken: string,
    owner: string | undefined,
    treasury: string,
    mintPrice: string,
    whitelisted: number,
    members: Array<string>,
    discounts: Array<number>,
    inviteCodes: Array<string>
}

const useContractDeployer = (abi: any) => {
    const { account, provider, chainId } = useWeb3React();
    const deployerContract = useContract(SBT_DEPLOYER_ADDRESSES, abi, true)
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

    const deploy = async ({ name, symbol, owner, payToken, treasury, mintPrice, whitelisted, discounts, inviteCodes, members }: SBTParams) => {
        setDeployLoading(true);
        try {
            if(chainId && account && deployerContract?.signer) {
                const currentTokenId: BigNumber = await deployerContract?.counter();
                console.log(currentTokenId)
                console.log({ name, symbol, owner, treasury, mintPrice, whitelisted })
                const tx = await deployerContract?.deployNewSBT(
                    name, 
                    symbol, 
                    owner,
                    payToken,
                    treasury,
                    ethers.utils.parseEther(mintPrice),
                    whitelisted ? 1 : 0,
                    discounts,
                    inviteCodes,
                    members
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