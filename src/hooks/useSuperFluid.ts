import { Framework } from "@superfluid-finance/sdk-core";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { getSigner } from 'utils'
import { useWeb3React } from "@web3-react/core";

const useSuperFluid = () => {
    const { account, provider, chainId } = useWeb3React()
    const createRecurringTxn = async () => {
        if(!chainId || !provider) return;
        const sf = await Framework.create({ chainId, provider });
        const signer = provider?.getSigner();
        const DAIxContract = await sf.loadSuperToken("fDAIx");
        const DAIx = DAIxContract.address;
        try {
            const createFlowOperation = sf.cfaV1.createFlow({
                sender: account as string,
                receiver: "0xC38e24B2cA73d72BEa39358257ED1c8cA499ea3b",
                flowRate: "1000000000",
                superToken: DAIx
              });
              const result = await createFlowOperation.exec(signer);
                console.log(result)
        }
        catch (error) {
            console.log(
              "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
            );
            console.error(error);
          }
    }
    return { createRecurringTxn }
}

export default useSuperFluid