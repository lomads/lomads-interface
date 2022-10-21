import { useEffect, useState } from "react";
import { find as _find } from 'lodash';
import useScrollPosition from "@react-hook/window-scroll";
import { useWeb3React } from "@web3-react/core";
import { Text } from "rebass";
import lomadsfulllogo from "../../assets/svg/lomadsfulllogo.svg";
import { coinbaseWalletConnection, injectedConnection } from "connection";
import { LeapFrog } from "@uiball/loaders";
import { CHAIN_INFO } from "constants/chainInfo";
import { SupportedChainId } from "constants/chains";
import { useNativeCurrencyBalances } from "state/connection/hooks";
import { setDAOList } from "state/dashboard/reducer";
import styled from "styled-components/macro";
import { isChainAllowed } from "utils/switchChain";
import { updateSelectedWallet } from "state/user/reducer";
import Web3Status from "../Web3Status";
import { useAppDispatch } from "state/hooks";
import axiosHttp from '../../api';
import {
  updatetokenTitle,
  updatetokenSymbol,
  updateSupply,
  updateHolder,
  updateStepNumber,
  updatedeployedTokenAddress,
  updateExplain,
  updateIconImgPath,
} from "state/proposal/reducer";
import { usePrevious } from "hooks/usePrevious";
import { useNavigate, useMatch, useLocation } from "react-router-dom";
import { matchPath } from "react-router";
import routes from "routes";
// import NetworkSelector from './NetworkSelector'

const HeaderFrame = styled.div<{ showBackground: boolean }>`
  display: flex,
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  position: absolute;
  top: 20px;
  right: 18px;
  padding: 1rem 0;
  /* Background slide effect on scroll. */
  background-image: ${({ theme }) =>
    `linear-gradient(to bottom, transparent 50%, ${theme.bg0} 50% )}}`};
  background-position: ${({ showBackground }) =>
    showBackground ? "0 -100%" : "0 0"};
  background-size: 100% 200%;
  box-shadow: 0px 0px 0px 1px
    ${({ theme, showBackground }) =>
    showBackground ? theme.bg2 : "transparent;"};
  transition: background-position 0.1s, box-shadow 0.1s;
  background-blend-mode: hard-light;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-template-columns: 48px 1fr 1fr;
  `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding:  1rem;
    grid-template-columns: 1fr 1fr;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding:  1rem;
    grid-template-columns: 36px 1fr;
  `};
`;

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

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg0 : theme.bg0)};
  border-radius: 16px;
  white-space: nowrap;
  width: 100%;
  height: 40px;

  :focus {
    border: 1px solid blue;
  }
`;

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`;

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`;

const UniIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }

  position: relative;
`;
export default function Header() {

  const { account, chainId, connector } = useWeb3React();
  const dispatch = useAppDispatch()
  const location = useLocation()
  const chainAllowed = chainId && isChainAllowed(connector, chainId);

  const userEthBalance = useNativeCurrencyBalances(account ? [account] : [])?.[
    account ?? ""
  ];

  const navigate = useNavigate();
  //const dashboard = useMatch("/dashboard");

  useEffect(() => {
    if ((chainId && !chainAllowed && !account) || !localStorage.getItem('__lmds_web3_token')) {
      const match = matchPath({ path: "/:daoURL" }, location.pathname);
      if(match && !_find(routes, r => r.path === location.pathname)){
          console.log('storing...', location.pathname)
          sessionStorage.setItem('__lmds_active_dao', location.pathname.substring(1))
       }
      navigate("/login");
    }
  }, [chainId , account, chainAllowed, navigate]);


  const previousAccount = usePrevious(account);

  const clearOnDisconnect = () => {
    localStorage.removeItem('__lmds_web3_token');
    dispatch(updatedeployedTokenAddress(""));
    dispatch(updatetokenTitle(""));
    dispatch(updatetokenSymbol(""));
    dispatch(updateHolder(""));
    dispatch(updateExplain(""));
    dispatch(updateSupply(0));
    dispatch(updateIconImgPath(""));
  };



  const disconnect = async () => {
    if (connector.deactivate) {
      connector.deactivate();
      // Coinbase Wallet SDK does not emit a disconnect event to the provider,
      // which is what web3-react uses to reset state. As a workaround we manually
      // reset state.
      if (connector === coinbaseWalletConnection.connector) {
        connector.resetState();
      }
    } else {
      connector.resetState();
      clearOnDisconnect();
    }
    dispatch(updateSelectedWallet({ wallet: undefined }));
    window.location.href = '/login'
    //openOptions();
  };

  useEffect(() => {
    if (previousAccount && account !== previousAccount) {
      localStorage.removeItem('__lmds_web3_token');
      sessionStorage.removeItem('__lmds_active_dao')
      disconnect()
    }
  }, [account, previousAccount])

  const scrollY = useScrollPosition();

  const { nativeCurrency } =
    CHAIN_INFO[!chainId || !chainAllowed ? SupportedChainId.MAINNET : chainId];
  const balance = userEthBalance?.toSignificant(3);
  const symbol = nativeCurrency.symbol;


  if(chainId === undefined) {
    return (
      <div style={{ backgroundColor: '#FFF', height: '100vh', zIndex: 99999, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="logo">
          <img src={lomadsfulllogo} alt="" />
        </div>
        <div style={{ marginTop: 32 }}>
          <LeapFrog size={50} color="#C94B32" />
        </div>
      </div> 
    )
  }
  
  return (
    <HeaderFrame showBackground={scrollY > 45}>
      <Title href=".">
        <UniIcon></UniIcon>
      </Title>
      <HeaderControls>
        <HeaderElement>{/* <NetworkSelector /> */}</HeaderElement>
        <HeaderElement>
          <AccountElement active={!!account}>
            <Web3Status />
          </AccountElement>
        </HeaderElement>
      </HeaderControls>
    </HeaderFrame>
  );
}
