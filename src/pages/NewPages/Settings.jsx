import { useEffect, useState } from "react";
import "./Settings.css";
import { get as _get, find as _find } from "lodash";
import settingIcon from "../../assets/svg/settingsXL.svg";
import { CgClose } from "react-icons/cg";
import { Link, useNavigate, useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  FormLabel,
  IconButton,
  Image,
  Input,
  Switch,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import copyIcon from "../../assets/svg/copyIcon.svg";
import { isChainAllowed } from "utils/switchChain";
import coin from "../../assets/svg/coin.svg";
import Footer from "components/Footer";
import { ChevronRight } from "react-feather";
import { IoMdCloseCircle } from "react-icons/io";

// ASSETS
import OrganistionDetails from "../../assets/images/settings-page/1-ogranisation-details.svg";
import RolesPermissions from "../../assets/images/settings-page/2-roles-permissions.svg";
import Safe from "../../assets/images/settings-page/3-safe.svg";
import PassTokens from "../../assets/images/settings-page/4-pass-tokens.svg";
import XpPoints from "../../assets/images/settings-page/5-xp-points.svg";
import Terminology from "../../assets/images/settings-page/6-terminology.svg";
import Discord from "../../assets/images/settings-page/7-discord.svg";

import SideModal from "./DashBoard/SideModal";
import OrganisationDetailsModal from "./OrganisationDetailsModal";
import RolesPermissionsModal from "./RolesPermissionsModal";
import SafeModal from "./SafeModal";
import XpPointsModal from "./XpPointsModal";
import PassTokenModal from "./PassTokenModal";
import TerminologyModal from "./TerminologyModal";
import DiscordModal from "./DiscordModal";
import { useAppDispatch, useAppSelector } from "state/hooks";
import CreateMorePassTokenModal from "./CreateMorePassTokenModal";
import { getDao } from "state/dashboard/actions";
import CompensateMembersModal from "./CompensateMembersModal";
import CompensateMembersDescriptionModal from "./CompensateMembersDescriptionModal";
import CompensateMembersDoneModal from "./CompensateMembersDoneModal";
import DisableXpPointDailog from "./DisableXpPointDailog";
import eventEmitter from "utils/eventEmmiter";

const Settings = () => {
  const navigate = useNavigate();
  const { daoURL } = useParams();

  const dispatch = useAppDispatch();

  //! CONST DECLARATION
  const [showModal, setShowModal] = useState(false);
  const [openOrganisationDetails, setOpenOrganisationDetails] = useState(false);
  const [openRolesPermissions, setOpenRolesPermissions] = useState(false);
  const [openSafe, setOpenSafe] = useState(false);
  const [openPassToken, setOpenPassToken] = useState(false);
  const [openXpPoints, setOpenXpPoints] = useState(false);
  const [openTerminology, setOpenTerminology] = useState(false);
  const [openDiscord, setOpenDiscord] = useState(false);
  const [openCreatePassToken, setOpenCreatePassToken] = useState(false);


  const { DAO, updateDaoLoading, updateDaoLinksLoading } = useAppSelector((state) => state.dashboard);

  console.log("DAO data : ", DAO);
  
  const [name, setName] = useState(_get(DAO, 'name', ''));

  useEffect(()=>{
    setName(_get(DAO, 'name', ''))
  },[DAO])
  
  useEffect(()=>{
    if (!DAO || (DAO && DAO.url !== daoURL))
				dispatch(getDao(daoURL))
			}
  ,[DAO])

  useEffect(() => {
    eventEmitter.on('close-xp-modal', ()=>{
      setShowModal(false)
      setOpenXpPoints(false)
    })
    return () => {
      eventEmitter.off('close-xp-modal', ()=>{
        setShowModal(false)
        setOpenXpPoints(false)
      })
    }
  }, [])
  
  


  //! TOGGLE FUNCTIONS
  let toggleModal = () => {
    setShowModal(!showModal);
  };
  let toggleOrganisationDetailsModal = () => {
    setOpenOrganisationDetails(!openOrganisationDetails);
  };
  let toggleRP = () => {
    setOpenRolesPermissions(!openRolesPermissions);
  };
  let toggleS = () => {
    setOpenSafe(!openSafe);
  };
  let togglePassToken = () => {
    setOpenPassToken(!openPassToken);
  };
  let toggleXp = () => {
    setOpenXpPoints(!openXpPoints);
  };
  let toggleTerminology = () => {
    setOpenTerminology(!openTerminology);
  };
  let toggleDiscord = () => {
    setOpenDiscord(!openDiscord);
  };

  let toggleCreatePassTokenModal = () => {
    setOpenCreatePassToken(!openCreatePassToken);
  };
  const daoName = name.split(" ");
  return (
    <>
      <div className="settings-page">
      {/* <DisableXpPointDailog
                    toggleShowLink={toggleCreatePassTokenModal}
                    daoUrl={_get(DAO, 'url', '')}
                /> */}
        <div className="settings-left-bar">
          <div onClick={() => navigate(-1)} className="logo-container">
            <p style={{textTransform: "capitalize"}}>{ daoName.length === 1
                                ? daoName[0].charAt(0)
                                : daoName[0].charAt(0) + daoName[daoName.length - 1].charAt(0)}</p>
          </div>
          <img src={settingIcon} />
        </div>
        <div className="settings-center">
          <div className="settings-header">
            <h1>{ name }</h1>
            <h2>Settings</h2>
          </div>
          <div className="settings-organisation" 
                          onClick={() => {
                            toggleModal();
                            setOpenOrganisationDetails(true);
                          }}
          >
            <div>
              <img src={OrganistionDetails} style={{ height: "35px" }} />
              <Link
                className="style-content"
                style={{ color: "#C94B32" }}
              >
                Organisation Details
                <ChevronRight />
              </Link>
            </div>
          </div>

          <div className="settings-organisation-flexbox">
            <div className="settings-organisation-child"
                onClick={() => {
                  toggleModal();
                  setOpenRolesPermissions(true);
                }}
            >
              <div
                style={{
                  padding: "20px",
                }}
              >
                <img src={RolesPermissions} style={{ height: "35px" }} />
                <Link
                  className="style-content"
                  style={{ color: "#C94B32" }}
                >
                  Roles & Permissions
                  <ChevronRight />
                </Link>
              </div>
            </div>
            <div className="settings-organisation-child disabled">
              <div
                style={{
                  padding: "20px",
                }}
              >
                <img src={Safe} style={{ height: "35px" }} />
                <Link
                  className="style-content"
                  style={{ color: "#C94B32" }}
                >
                  Safe
                  <ChevronRight />
                </Link>
              </div>
            </div>

            <div className="settings-organisation-child"
              onClick={() => {
                toggleModal();
                DAO?.sbt?.name ? togglePassToken() : toggleCreatePassTokenModal()
              }}
            >
              <div
                style={{
                  padding: "20px",
                }}
              >
                <img src={PassTokens} style={{ height: "35px" }} />
                <Link
                  className="style-content"
                  style={{ color: "#C94B32" }}
                >
                  Pass Tokens
                  <ChevronRight />
                </Link>
              </div>
            </div>
          </div>

          <div className="settings-organisation-flexbox">
            <div className="settings-organisation-child"
              onClick={() => {
                toggleModal();
                setOpenXpPoints(true);
              }}
            >
              <div
                style={{
                  padding: "20px",
                }}
              >
                <img src={XpPoints} style={{ height: "35px" }} />
                <Link
                  className="style-content"
                  style={{ color: "#C94B32" }}
                >
                  SWEAT points
                  <ChevronRight />
                </Link>
              </div>
            </div>
            <div className="settings-organisation-child disabled">
              <div
                style={{
                  padding: "20px",
                }}
              >
                <img src={Terminology} style={{ height: "35px" }} />
                <Link
                  className="style-content"
                  style={{ color: "#C94B32" }}
                >
                  Terminology
                  <ChevronRight />
                </Link>
              </div>
            </div>

            <div className="settings-organisation-child disabled">
              <div
                style={{
                  padding: "20px",
                }}
              >
                <img src={Discord} style={{ height: "35px" }} />
                <Link
                  className="style-content"
                  style={{ color: "#C94B32" }}
                >
                  Discord
                  <ChevronRight />
                </Link>
              </div>
            </div>
          </div>

          <Footer theme="light" />
        </div>
        <div className="settings-right-bar">
          <button onClick={() => navigate(-1)}>
            <CgClose color="#FFF" size={24} />
          </button>
        </div>
      </div>

      {/* // !-------------  Organisation Details ------------ */}
      {showModal && openOrganisationDetails && (
        <OrganisationDetailsModal
          toggleModal={toggleModal}
          toggleOrganisationDetailsModal={toggleOrganisationDetailsModal}
        />
      )}
      {/* // !-------------  Roles & Permissions ------------ */}
      {showModal && openRolesPermissions && (
        <RolesPermissionsModal toggleModal={toggleModal} toggleRP={toggleRP} />
      )}
      {/* // !-------------  Safe ------------ */}
      {showModal && openSafe && (
        <SafeModal toggleModal={toggleModal} toggleS={toggleS} />
      )}
      {/* // !-------------  Pass Token ------------ */}
      {showModal && openPassToken && (
        <PassTokenModal
          toggleModal={toggleModal}
          togglePassToken={togglePassToken}
        />
      )}
      {showModal && openCreatePassToken && (
        <CreateMorePassTokenModal
          toggleModal={toggleModal}
          navFromSetting={true}
          toggleCreatePassTokenModal={toggleCreatePassTokenModal}
        />
      )}
      {/* // !-------------  SWEAT Points ------------ */}
      {showModal && openXpPoints && (
        <XpPointsModal toggleModal={toggleModal} toggleXp={toggleXp} />
      )}
      {/* // !-------------  Terminology ------------ */}
      {showModal && openTerminology && (
        <TerminologyModal
          toggleModal={toggleModal}
          toggleTerminology={toggleTerminology}
        />
      )}
      {/* // !-------------  Discord ------------ */}
      {showModal && openDiscord && (
        <DiscordModal toggleModal={toggleModal} toggleDiscord={toggleDiscord} />
      )}
    </>
  );
};

export default Settings;
