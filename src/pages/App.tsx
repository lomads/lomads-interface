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
    
  }, []);

  const login = async () => {
   
  };

  const logout = async () => {
    
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
          <Route path='/dao/:deployedAddress' element={<SidebarPage page="Dao" />} />
          <Route path='/sidepage' element={<SidebarPage page='Basics' web3Provider={provider} />} />
        </Routes>
      </div>
    </Context.Provider >
  )
}