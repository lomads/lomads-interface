import { get as _get, find as _find } from 'lodash'
import { useWeb3React } from "@web3-react/core";
import { useContract } from "hooks/useContract";
import { SupportedChainId } from "constants/chains";
import { ethers } from "ethers";
import MultiCall from "@indexed-finance/multicall";
import axiosHttp from 'api'
import { USDC } from 'constants/tokens';
import { USDC_GOERLI, USDC_POLYGON } from 'constants/tokens'
import { useCallback } from 'react';

const useWithdraw = () => {
    const { account, chainId, provider } = useWeb3React();
    const withdrawContract = useContract("0xdDE86Dc17dc90a6BF2592b9Afa76139C957EdC60", require('./withdraw.json'), true);

    const withdraw = async () => {
      if (withdrawContract?.signer) {
        const  overrides = {
          from: account,
          gasLimit: 500000,
          gasPrice: ethers.utils.parseUnits('150', 'gwei').toString(),
          type: 1,
          accessList: [
            {
              address: "0x4515Da3D913c184201a1545aD97FB3E3ACD6A8Dd", // proceedsRecipient gnosis safe proxy address
              storageKeys: [
                  "0x0000000000000000000000000000000000000000000000000000000000000000"
              ]
            },
            {
              address: "0xdDE86Dc17dc90a6BF2592b9Afa76139C957EdC60", // admin gnosis safe proxy address
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

        console.log(overrides)

        try {
          const value = await withdrawContract?.withdraw(overrides)
        } catch (e) {
          console.log(e)
          throw _get(e, 'message', 'Could not withdraw')
        }
      }
    }

    return { withdraw }

}

export default useWithdraw;