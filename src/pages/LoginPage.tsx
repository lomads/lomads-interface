/* eslint-disable */
import React, { useEffect, useState, useCallback } from "react";
import {
  get as _get,
  find as _find,
  throttle as _throttle,
  debounce as _debounce,
} from "lodash";
import { useLocation, useNavigate } from "react-router-dom";
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
import {
  SupportedChainId,
  SUPPORTED_CHAIN_IDS,
  CHAIN_IDS_TO_NAMES,
} from "constants/chains";
import { updateConnectionError } from "state/connection/reducer";
import { isChainAllowed, switchChain } from "utils/switchChain";
import { ethers } from "ethers";
import { setUser } from "state/dashboard/reducer";
import Web3Token from "web3-token";
import { LeapFrog } from "@uiball/loaders";
import axiosHttp from "../api";
import { getSigner } from "utils";
import styled from "styled-components/macro";
import axios from "axios";
import { Aikon } from "./NewPages/Aikon";

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
`;

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  &:not(:first-child) {
    margin-left: 0.5em;
  }

  /* addresses safaris lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: center;
  `};
`;

const LoginPage = (props: any) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from;
  const selectedWallet = useAppSelector((state) => state.user.selectedWallet);
  const [checkLoading, setCheckLoading] = useState<boolean>(false);
  const { chainId, connector, account, provider } = useWeb3React();
  const [preferredChain, setPreferredChain] = useState<number>(
    SupportedChainId?.GOERLI
  );

  console.log("chainId", chainId, connector, account);

  const chainAllowed =
    chainId &&
    isChainAllowed(connector, chainId) &&
    chainId === +preferredChain;
  console.log("chainAllowed", chainAllowed, chainId);

  useEffect(() => {
    if (chainId) {
      setPreferredChain(
        chainId
          ? SUPPORTED_CHAIN_IDS.indexOf(+chainId) > -1
            ? +chainId
            : SupportedChainId?.GOERLI
          : SupportedChainId?.GOERLI
      );
    }
  }, [chainId]);

  const navigateTo = async () => {
    const activeDao = sessionStorage.getItem("__lmds_active_dao");
    if (activeDao) return `/${activeDao}`;
    return "/";
    // const activeDao = sessionStorage.getItem('__lmds_active_dao')
    // if (activeDao)
    // 	return `/${activeDao}`
    // return "/"
    // return axiosHttp.get('dao').then(res => {
    //   if (res.data && res.data.length > 0) {
    //     const activeDao = sessionStorage.getItem('__lmds_active_dao')
    //     if (activeDao)
    //         return `/${activeDao}`
    //     else
    //       return `/${_get(res.data, '[0].url')}`
    //   } else {
    //     sessionStorage.removeItem('__lmds_active_dao')
    //     return "/namedao"
    //   }
    // })
    //   .finally(() => setCheckLoading(false))
  };

  const setLocalToken = (token: string) => {
    return Promise.resolve().then(() => {
      localStorage.setItem("__lmds_web3_token", token);
    });
  };

  const generateToken = useCallback(
    _throttle(async () => {
      if (!localStorage.getItem("__lmds_web3_token")) {
        if (provider && account) {
          const signer = getSigner(provider, account);
          const token = await Web3Token.sign(
            async (msg: string) => await signer.signMessage(msg),
            "365d"
          );
          await setLocalToken(token);
          await axiosHttp
            .post(`auth/create-account`)
            .then((res) => dispatch(setUser(res.data)));
          const nTo = await navigateTo();
          setTimeout(
            () =>
              navigate(
                nTo,
                from
                  ? {
                      state: {
                        from,
                      },
                    }
                  : undefined
              ),
            100
          );
        }
      } else {
        const nTo = await navigateTo();
        navigate(nTo);
      }
    }, 2000),
    [account]
  );

  useEffect(() => {
    if (selectedWallet && account && chainAllowed) generateToken();
  }, [selectedWallet, account, chainAllowed]);

  const nextLogin = useCallback(
    async (connector: Connector) => {
      localStorage.removeItem("__lmds_web3_token");
      const connectionType = getConnection(connector).type;
      try {
        dispatch(updateConnectionError({ connectionType, error: undefined }));
        console.log("chainAllowed", chainAllowed);
        if (chainAllowed && !account) {
          await connector.activate();
        } else if (!chainAllowed) {
          switchChain(connector, +preferredChain)
            .then(async () => {
              if (!account) await connector.activate();
            })
            .catch((e) => {
              console.log(e);
            });
        }
        dispatch(updateSelectedWallet({ wallet: connectionType }));
      } catch (error: any) {
        console.debug(`web3-react connection error: ${error}`);
        dispatch(
          updateConnectionError({ connectionType, error: error.message })
        );
      }
    },
    [chainAllowed, preferredChain]
  );

  useEffect(() => {
    console.log("window.ethereum", window.ethereum);
  }, [window.ethereum]);

  return (
    <>
      {checkLoading ? (
        <div
          style={{
            backgroundColor: "#FFF",
            height: "100vh",
            zIndex: 99999,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="logo">
            <img style={{ marginBottom: 32 }} src={lomadsfulllogo} alt="" />
          </div>
          <LeapFrog size={50} color="#C94B32" />
        </div>
      ) : null}
      <div className={"createDaoLogin"}>
        {!window.ethereum && (
          <div style={{ position: "absolute", right: 24, top: 16 }}>
            <div style={{ opacity: 0.6, fontSize: 14 }}>
              Metamask not installed
            </div>
          </div>
        )}
        <div>
          <div className="logo">
            <img src={lomadsfulllogo} alt="" />
          </div>
          <div className="welcomeText1">Hello there!</div>
          <div className="welcomeText2">Connect Your Wallet</div>
        </div>
        {/* <div>
          <div className="inputFieldTitle">Preferred chain</div>
        </div> */}
        <select
          name="chain"
          id="chain"
          value={preferredChain}
          onChange={(e) => setPreferredChain(+e.target.value)}
          className="drop"
          style={{ width: 250, marginBottom: 16 }}
        >
          {SUPPORTED_CHAIN_IDS.map((chain) => (
            <option value={+chain}>{CHAIN_IDS_TO_NAMES[chain]}</option>
          ))}
        </select>
        <div style={{ zIndex: 1 }} className={"modalbuttons"}>
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
          {/* <Aikon /> */}
        </div>
        <div className="humangroup">
          <img src={humangroup} alt="human group" />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
