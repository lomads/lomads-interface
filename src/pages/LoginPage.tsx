import { useEffect, useState } from "react";
import { get as _get, find as _find } from 'lodash';
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
import { updateConnectionError } from "state/connection/reducer";
import { isChainAllowed } from "utils/switchChain";
import { ethers } from "ethers";
import Web3Token from 'web3-token';
import { LeapFrog } from "@uiball/loaders";
import axiosHttp from '../api';

const LoginPage = (props: any) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedWallet = useAppSelector((state) => state.user.selectedWallet);
  const [checkLoading, setCheckLoading] = useState<boolean>(false)
  const { chainId, connector, account } = useWeb3React();

  const chainAllowed = chainId && isChainAllowed(connector, chainId);

  const navigateTo = async () => {
    return axiosHttp.get('dao').then(res => {
      if(res.data && res.data.length > 0) {
        const activeDao = localStorage.getItem('__lmds_active_dao')
        if(activeDao) {
          let hasAccess = _find(res.data, d => d.url === activeDao)
          if(hasAccess)
            return `/${activeDao}`
          else
            return `/noaccess`
        }
        else
          return `/${_get(res.data, '[0].url')}`
      } else {
        const activeDao = localStorage.getItem('__lmds_active_dao')
        if(activeDao) 
          return `/noaccess`
        return "/namedao"
      }
    })
    .finally(() => setCheckLoading(false))
  }

  const generateToken = async () => {
    if(!localStorage.getItem('__lmds_web3_token')){
      if(window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const token = await Web3Token.sign(async (msg:string) => await signer.signMessage(msg), '1d');
        console.log(token)
        localStorage.setItem('__lmds_web3_token', token);
        const nTo = await navigateTo();
        setTimeout(() => navigate(nTo), 100);
      }
    } else {
      const nTo = await navigateTo();
      navigate(nTo)
    }
  }

  useEffect(() => {
    if (selectedWallet && account && chainAllowed) {
      generateToken()
    }
  }, [selectedWallet, account, chainAllowed]);

  const nextLogin = async (connector: Connector) => {
    const connectionType = getConnection(connector).type;
    try {
      dispatch(updateConnectionError({ connectionType, error: undefined }));
      await connector.activate();
      dispatch(updateSelectedWallet({ wallet: connectionType }));
      //generateToken()
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
