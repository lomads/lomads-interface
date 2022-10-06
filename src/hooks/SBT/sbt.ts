import { useState, useEffect } from "react";
import { BigNumber, Contract } from "ethers";
import MultiCall from "@indexed-finance/multicall";
import SBT_ABI from "../../abis/SBT.json"

export const useSBTStats = (library : any, account : string, refresh : number, contractAddr : string) => {

    const [stats, setStats] = useState({
        needWhitelist : Boolean(false),
        isWhitelisted : Boolean(false),
        balanceOf : BigNumber.from(0),
        contractName : '',
        currentIndex : BigNumber.from(0)
    });
    useEffect(()=> {
        const fetch = async () => {
            const multicall = new MultiCall(library);
            try {
                const calls = [
                    {
                        target: contractAddr,
                        function: 'mustBeWhitelisted',
                        args: []
                    },
                    {
                        target: contractAddr,
                        function: 'checkWhitelist',
                        args: [account]
                    },
                    {
                        target: contractAddr,
                        function: 'balanceOf',
                        args: [account]
                    },
                    {
                        target: contractAddr,
                        function: 'name',
                        args: []
                    },
                    {
                        target: contractAddr,
                        function: 'currentIndex',
                        args: []
                    },
                ];
                const [,res] = await multicall.multiCall(SBT_ABI, calls);

                setStats({
                    needWhitelist : res[0],
                    isWhitelisted : res[1],
                    balanceOf : res[2],
                    contractName : res[3],
                    currentIndex : res[4]
                })
            }
            catch (e) {
                console.log(e);
            }
        }
        if (account && library && contractAddr != ''){
            fetch();
        }
    }, [library, account, refresh, contractAddr])

    return stats;
}


export const mintSBTtoken = async (sbtContract : Contract, account : string) => {
    if(sbtContract.signer){
        try {
            const tx = await sbtContract.mintSBT(account);
            return await tx.wait();
        }
        catch (e){
            return e;
        }
    }
    return false;
} 