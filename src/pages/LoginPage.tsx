import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import createDao from "../assets/svg/createDao.svg";
import metamask2 from "../assets/svg/metamask2.svg";
import walletconnect from "../assets/svg/walletconnect.svg";
import "../styles/App.css";
import "../styles/CreateDao.css";
import "../styles/Dashboard.css";
import "../styles/Modal.css";
import { Connector } from "@web3-react/types";
import Header from "components/Header";
import { updateSelectedWallet } from "state/user/reducer";
import { useAppDispatch, useAppSelector } from "state/hooks";
import {
  ConnectionType,
  injectedConnection,
  walletConnectConnection,
} from "connection";
import { getConnection } from "connection/utils";
import { useModalIsOpen, useToggleWalletModal } from "state/application/hooks";
import { updateConnectionError } from "state/connection/reducer";

const WALLET_VIEWS = {
  OPTIONS: "options",
  ACCOUNT: "account",
  PENDING: "pending",
};

const LoginPage = (props: any) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toggleWalletModal = useToggleWalletModal();
  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT);
  //   const selectedWallet = useAppSelector((state) => state.user.selectedWallet);
  const [pendingConnector, setPendingConnector] = useState<
    Connector | undefined
  >();

  const nextLogin = async (connector: Connector) => {
    const connectionType = getConnection(connector).type;
    try {
      setPendingConnector(connector);
      setWalletView(WALLET_VIEWS.PENDING);
      dispatch(updateConnectionError({ connectionType, error: undefined }));
      await connector.activate();
      dispatch(updateSelectedWallet({ wallet: connectionType }));
      navigate("/createdao");
    } catch (error: any) {
      console.debug(`web3-react connection error: ${error}`);
      dispatch(updateConnectionError({ connectionType, error: error.message }));
    }
  };

  return (
    <>
      <div className="absolute top-0 right-0">
        <Header />
      </div>
      <div className={"createDaoLogin"}>
        <div className="logo">
          <img src={createDao} alt="" />
        </div>
        <div className="welcomeText1">Hello there!</div>
        <div className="welcomeText2">Connect to create a DAO</div>
        <div className={"body"}>
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
          <div className={"loginWithoutWallet"}>
            <button
              className="font-sans text-sm text-text_color"
              onClick={props.login}
            >
              login without crypto wallet{" "}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
