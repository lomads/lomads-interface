import React, { useState, useEffect } from 'react'
import { Routes, Route } from "react-router-dom";
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import StartDAO from './StartDAO';
import SidebarPage from './SidebarPage';
import { Context } from '../constants/context';
import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { ethers } from 'ethers';
import { useAppDispatch } from 'state/hooks'
import { updateWeb3AuthAddress, updateWeb3AuthAddressPvtKey } from 'state/proposal/reducer';
import { setWeb3authProvider } from 'connection/DaoFactoryCall';



export default function App() {


  const dispatch = useAppDispatch()
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null)
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
  useEffect(() => {
    const init = async () => {
      try {
        const GoerliConfig = {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          rpcTarget: "https://goerli.infura.io/v3/68529fb2a856462d811ee8a83053565f",
          blockExplorer: "https://goerli.etherscan.io/",
          chainId: "5",
          displayName: "Goerli testnet",
          ticker: "goerli",
          tickerName: "goerli",
        };

        const web3auth = new Web3Auth({
          clientId: "BJywQytxS6QAqZSwyDUmNQT490GiyjZNbCHOIggKPEHJXBkIQb2HS3RbV8pQsEcsJ9WySXFVi9MFwMG7T9v7Ux8",
          chainConfig: GoerliConfig,
          uiConfig: {
            theme: "light",
            appLogo: "https://user-images.githubusercontent.com/87822922/182828442-99abd9eb-ca46-43d6-89fc-07833a907dc0.svg",
            loginMethodsOrder: ["google", "facebook", "discord", "github", "twitter"]
          }
        });

        setWeb3auth(web3auth);

        await web3auth.initModal();
        console.log("Midas web3auth provider", web3auth)
        if (web3auth.provider) {
          const provider = new ethers.providers.Web3Provider(web3auth.provider as any)
          const signer = provider.getSigner();
          const address = (await signer.getAddress()).toString()
          dispatch(updateWeb3AuthAddress(address));
          const privateKey = await web3auth.provider?.request({
            method: "eth_private_key"
          });
          dispatch(updateWeb3AuthAddressPvtKey(privateKey))
          console.log(privateKey)
          console.log(address)
          setProvider(web3auth.provider);
          setWeb3authProvider(web3auth.provider)

        };
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    const provider = new ethers.providers.Web3Provider(web3authProvider as any)
    const signer = provider.getSigner();
    const address = (await signer.getAddress()).toString()
    dispatch(updateWeb3AuthAddress(address));
    const privateKey = await web3auth.provider?.request({
      method: "eth_private_key"
    });
    dispatch(updateWeb3AuthAddressPvtKey(privateKey))
    console.log(address)
    console.log(privateKey)
    setProvider(web3authProvider);
    setWeb3authProvider(web3authProvider)
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };
  return (
    <Context.Provider value={{ title: '' }}>
      {/* <Header /> */}
      <div style={{ margin: 0 }}>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={[<LoginPage web3auth={web3auth} login={login} logout={logout} web3Provider={provider} />]} />
          <Route path='/createdao' element={[<StartDAO web3Provider={provider} />]} />
          <Route path='/basics' element={<SidebarPage page="Basics" web3Provider={provider} />} />
          <Route path='/settings' element={<SidebarPage page="Settings" web3Provider={provider} />} />
          <Route path='/token' element={<SidebarPage page="Token" web3Provider={provider} />} />
          <Route path='/golive' element={<SidebarPage page="Go Live" web3Provider={provider} />} />
          <Route path='/dashboard' element={<SidebarPage page="Dashboard" />} />
          <Route path='/sidepage' element={<SidebarPage page='Basics' web3Provider={provider} />} />
        </Routes>
      </div>
    </Context.Provider >
  )
}