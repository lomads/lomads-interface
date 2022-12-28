import { useState, useEffect, useMemo } from "react";
import "./Settings.css";
import { get as _get, find as _find } from "lodash";
import settingIcon from "../../assets/svg/settingsXL.svg";
import editIcon from "../../assets/svg/editButton.svg";
import copy from "../../assets/svg/copyIcon.svg";
import logo from "../../assets/svg/lomadsLogoExpand.svg";
import { CgClose } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "state/hooks";
import { useWeb3React } from "@web3-react/core";
import { useSBTStats } from "hooks/SBT/sbt";
import { Tooltip } from "@chakra-ui/react";
import copyIcon from "../../assets/svg/copyIcon.svg";
import { isChainAllowed } from "utils/switchChain";
import coin from "../../assets/svg/coin.svg";
import Footer from "components/Footer";

const Settings = () => {
  const navigate = useNavigate();
  const [update, setUpdate] = useState(0);
  const { provider, chainId, account, connector } = useWeb3React();
  const { DAO } = useAppSelector((state) => state.dashboard);
  const { balanceOf, contractName } = useSBTStats(
    provider,
    account ? account : "",
    update,
    DAO?.sbt ? DAO.sbt.address : ""
  );
  console.log("DAO data : ", DAO);
  const daoName = _get(DAO, "name", "").split(" ");
  const [copy, setCopy] = useState(false);
  const chainAllowed = chainId && isChainAllowed(connector, chainId);

  useEffect(() => {
    if (chainId && !chainAllowed && !account) {
      navigate("/");
    }
  }, [chainId, account, chainAllowed, navigate]);

  useEffect(() => {
    if (contractName !== "") {
      if (DAO?.sbt && parseInt(balanceOf._hex, 16) === 0) {
        navigate(`/${DAO.url}/sbt/mint/${DAO.sbt.address}`);
      }
    }
  }, [DAO, balanceOf, contractName]);

  const amIAdmin = useMemo(() => {
    if (DAO) {
      let user = _find(
        _get(DAO, "members", []),
        (m) =>
          _get(m, "member.wallet", "").toLowerCase() ===
            account?.toLowerCase() && m.role === "role1"
      );
      if (user) return true;
      return false;
    }
    return false;
  }, [account, DAO]);

  return (
    <div className="settings-page">
      <div className="settings-left-bar">
        <div onClick={() => navigate(-1)} className="logo-container">
          <p>
            {daoName.length === 1
              ? daoName[0].charAt(0)
              : daoName[0].charAt(0) + daoName[daoName.length - 1].charAt(0)}
          </p>
        </div>
        <img src={settingIcon} />
      </div>
      <div className="settings-center">
        <div className="settings-header">
          <h1>Settings</h1>
          {amIAdmin ? (
            <p>
              You're an&nbsp;<span>Admin</span>
            </p>
          ) : (
            <p>
              You're a&nbsp;<span>Member</span>
            </p>
          )}
        </div>

        <div className="settings-organisation">
          <div className="organisation-name">
            <h1>{_get(DAO, "name", "")}</h1>
            {/* <button>
                            <img src={editIcon} alt="edit-icon" />
                        </button> */}
          </div>

          <div className="organisation-desc">
            <p>{_get(DAO, "description", "")}</p>
          </div>

          <div className="organisation-link">
            <div
              className="copyArea"
              onClick={() => {
                setCopy(true);
              }}
              onMouseOut={() => {
                setCopy(false);
              }}
            >
              <Tooltip label={copy ? "copied" : "copy"}>
                <div
                  className="copyLinkButton"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${
                        process.env.REACT_APP_URL + "/" + _get(DAO, "url", "")
                      }`
                    );
                  }}
                >
                  <img src={copyIcon} alt="copy" className="safeCopyImage" />
                </div>
              </Tooltip>
              <p>{process.env.REACT_APP_URL + "/" + _get(DAO, "url", "")}</p>
            </div>
          </div>

          {/* <div className='organisation-link'>
                        <button>
                            <img src={copy} alt="copy" />
                        </button>
                        <p>{process.env.REACT_APP_URL + "/" + _get(DAO, 'url', '')}</p>
                    </div> */}

          {/* <div className='organisation-policy'>
                        <p>Membership policy :</p>
                        <div>
                            <input type='checkbox' />
                            <span>WHITELISTED</span>
                        </div>
                    </div> */}
        </div>

        {/* <div className='settings-links'>
                    <div className='links-header'>
                        <h1>Links</h1>
                         <button>
                            <img src={editIcon} alt="edit-icon" />
                        </button>
                    </div>
                    <span>Will display on the top of the dashboard</span>
                    <div className='link-body'>
                        <div>
                            <button>
                                LINK NAME
                            </button>
                            <p>https://linkname</p>
                        </div>
                        <div>
                            <button>
                                LINK NAME
                            </button>
                            <p>https://linkname</p>
                        </div>
                    </div>
                </div> */}

        <div className="settings-token">
          <h1>Pass Tokens</h1>
          {DAO?.sbt?.name ? (
            // <div className='token-details'>
            //     <button>
            //         <img src={copy} alt="copy" />
            //     </button>
            //     <img src={coin} alt="asset" />
            //     <p>{DAO?.sbt?.name}</p>
            // </div>
            <div className="token-details">
              <div
                className="copyArea"
                onClick={() => {
                  setCopy(true);
                }}
                onMouseOut={() => {
                  setCopy(false);
                }}
              >
                <Tooltip label={copy ? "copied" : "copy"}>
                  <div
                    className="copyLinkButton"
                    onClick={() => {
                      navigator.clipboard.writeText(`${DAO?.sbt?.address}`);
                    }}
                  >
                    <img src={copyIcon} alt="copy" className="safeCopyImage" />
                  </div>
                </Tooltip>
                {DAO?.sbt?.image ? (
                  <img
                    style={{ width: 24, height: 24 }}
                    src={DAO?.sbt?.image}
                    alt="asset"
                  />
                ) : (
                  <img src={coin} alt="asset" />
                )}
                <p>{DAO?.sbt?.name}</p>
              </div>
            </div>
          ) : (
            <>
              <p>The organisation doesn’t have token yet</p>
              <button onClick={() => navigate("/sbt/create")}>
                configure pass token
              </button>
            </>
          )}
        </div>
        <Footer theme="light" />
      </div>
      <div className="settings-right-bar">
        <button onClick={() => navigate(-1)}>
          <CgClose color="#FFF" size={24} />
        </button>
      </div>
    </div>
  );
};

export default Settings;
