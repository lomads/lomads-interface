/* eslint-disable */
import { useEffect, useState, useCallback } from "react";
import { get as _get, find as _find, throttle as _throttle } from 'lodash';
import { useNavigate } from "react-router-dom";
import lomadsfulllogo from "../assets/svg/lomadsfulllogo.svg";
import humangroup from "../assets/svg/humangroup.svg";
import metamask2 from "../assets/svg/metamask2.svg";
import walletconnect from "../assets/svg/walletconnect.svg";
import { useWeb3React } from "@web3-react/core";
import "../styles/pages/LoginPage.css";
import { Connector } from "@web3-react/types";
import { updateSelectedWallet } from "state/user/reducer";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { injectedConnection, walletConnectConnection } from "connection";
import { getConnection } from "connection/utils";
import { SupportedChainId } from 'constants/chains'
import { updateConnectionError } from "state/connection/reducer";
import { isChainAllowed, switchChain } from "utils/switchChain";
import { ethers } from "ethers";
import Web3Token from 'web3-token';
import { LeapFrog } from "@uiball/loaders";
import axiosHttp from '../api';
import { getSigner } from 'utils'

const LoginPage = (props: any) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedWallet = useAppSelector((state) => state.user.selectedWallet);
  const [checkLoading, setCheckLoading] = useState<boolean>(false)
  const { chainId, connector, account, provider } = useWeb3React();


  console.log('chainId', chainId, connector, account)

  const chainAllowed = chainId && isChainAllowed(connector, chainId);
  console.log(chainAllowed, chainId);

  const navigateTo = async () => {
    return axiosHttp.get('dao').then(res => {
      if (res.data && res.data.length > 0) {
        const activeDao = sessionStorage.getItem('__lmds_active_dao')
        if (activeDao)
            return `/${activeDao}`
        else
          return `/${_get(res.data, '[0].url')}`
      } else {
        sessionStorage.removeItem('__lmds_active_dao')
        return "/namedao"
      }
    })
      .finally(() => setCheckLoading(false))
  }

  const generateToken = useCallback(_throttle(async () => {
    if (!localStorage.getItem('__lmds_web3_token')) {
      if(provider && account){
        const signer = getSigner(provider, account)
        const token = await Web3Token.sign(async (msg: string) => await signer.signMessage(msg), '365d');
        console.log(token)
        localStorage.setItem('__lmds_web3_token', token);
        const nTo = await navigateTo();
        setTimeout(() => navigate(nTo), 100);
      }
    } else {
      const nTo = await navigateTo();
      navigate(nTo)
    }
  }, 2000), [account])

  useEffect(() => {
    if(selectedWallet && account && chainAllowed)
      generateToken()
  }, [selectedWallet, account, chainAllowed]);
  
  const nextLogin = async (connector: Connector) => {
    localStorage.removeItem('__lmds_web3_token')
    const connectionType = getConnection(connector).type;
    try {
      dispatch(updateConnectionError({ connectionType, error: undefined }));
      if(chainAllowed && !account){
        await connector.activate()
      } else if (!chainAllowed) {
        await switchChain(connector, SupportedChainId.GOERLI)
        .then(async () => {
          if(!account)
            await connector.activate()
        })
      }
      dispatch(updateSelectedWallet({ wallet: connectionType }));
    } catch (error: any) {
      console.debug(`web3-react connection error: ${error}`);
      dispatch(updateConnectionError({ connectionType, error: error.message }));
    }
  };

  return (
    <>
      {
        checkLoading ?
          <div style={{ backgroundColor: '#FFF', height: '100vh', zIndex: 99999, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="logo">
              <img style={{ marginBottom: 32 }} src={lomadsfulllogo} alt="" />
            </div>
            <LeapFrog size={50} color="#C94B32" />
          </div> : null
      }
      <div className={"createDaoLogin"}>
        <div>
          <div className="logo">
            <img src={lomadsfulllogo} alt="" />
          </div>
          <div className="welcomeText1">Hello there!</div>
          <div className="welcomeText2">Connect Your Wallet</div>
        </div>
        <div className={"modalbuttons"}>
          <button
            key="metamask"
            className="modalLoginButton"
            onClick={() => nextLogin(injectedConnection.connector)}
          >
            <img src={metamask2} style={{ padding: 40 }} alt="MetaMask" />
          </button>
          <button
            key="walletconnect"
            className="modalLoginButton"
            onClick={() => nextLogin(walletConnectConnection.connector)}
          >
            <img
              src={walletconnect}
              style={{ padding: 40 }}
              alt="WalletConnect"
            />
          </button>
        </div>
        <div className="humangroup">
          <img src={humangroup} alt="human group" />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
