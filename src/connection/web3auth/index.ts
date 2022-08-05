import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base"
import { ethers } from 'ethers'

export let myweb3auth: Web3Auth | null = null;
let provider: SafeEventEmitterProvider | null = null
export const init = async () =>{
    try {
        const polygonMumbaiConfig = {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          rpcTarget: "https://polygon-mumbai.g.alchemy.com/v2/adPYBBOeggH5WxfoGnMLGRwAVV2_0Kl9",
          blockExplorer: "https://mumbai.polygonscan.com",
          chainId: "0x13881",
          displayName: "Polygon Mumbai Testnet",
          ticker: "matic",
          tickerName: "matic",
        };
    

      const web3auth = new Web3Auth({
        clientId: "BJywQytxS6QAqZSwyDUmNQT490GiyjZNbCHOIggKPEHJXBkIQb2HS3RbV8pQsEcsJ9WySXFVi9MFwMG7T9v7Ux8",
        chainConfig: polygonMumbaiConfig,
        uiConfig: {
          theme: "light",
          appLogo: "https://user-images.githubusercontent.com/87822922/182828442-99abd9eb-ca46-43d6-89fc-07833a907dc0.svg",
          loginMethodsOrder: ["google","facebook","discord","github","twitter"]
        }
      });

      myweb3auth = web3auth;

      await web3auth.initModal();
        if (web3auth.provider) {
          console.log(web3auth.provider)
          provider = web3auth.provider
        };
      } catch (error) {
        console.error(error);
      }
}

export const login = async () => {
    if (!myweb3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await myweb3auth.connect();
    provider = web3authProvider;
  };

export const getUserInfo = async () => {
      if (!myweb3auth) {
        console.log("web3auth not initialized yet");
        return;
      }
      const user = await myweb3auth.getUserInfo();
      console.log(myweb3auth.provider)
      console.log(user);
    };

export const logout = async () => {
      if (!myweb3auth) {
        console.log("web3auth not initialized yet");
        return;
      }
      await myweb3auth.logout();
      provider = null;
    };
  