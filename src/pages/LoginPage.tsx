import { useEffect } from "react";
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

const LoginPage = (props: any) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedWallet = useAppSelector((state) => state.user.selectedWallet);

  const { chainId, connector, account } = useWeb3React();

  const chainAllowed = chainId && isChainAllowed(connector, chainId);

  useEffect(() => {
    if (selectedWallet && account && chainAllowed) {
      navigate("/namedao");
    }
  }, [selectedWallet, navigate, account, chainAllowed]);

  const nextLogin = async (connector: Connector) => {
    const connectionType = getConnection(connector).type;
    try {
      dispatch(updateConnectionError({ connectionType, error: undefined }));
      await connector.activate();
      dispatch(updateSelectedWallet({ wallet: connectionType }));
      navigate("/namedao");
    } catch (error: any) {
      console.debug(`web3-react connection error: ${error}`);
      dispatch(updateConnectionError({ connectionType, error: error.message }));
    }
  };

  return (
    <>
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
