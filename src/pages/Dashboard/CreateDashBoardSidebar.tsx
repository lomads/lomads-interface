import React, { useEffect, useState } from "react";

import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import "../../styles/Sidebar.css";
import daoImageShaped from "../../assets/svg/daoImageShaped.svg";
import collapseIcon from "../../assets/svg/collapseIcon.svg";
import expandIcon from "../../assets/svg/expandIcon.svg";
import proposalIcon from "../../assets/svg/proposalIcon.svg";
import treasuryIcon from "../../assets/svg/treasuryIcon.svg";
import membersIcon from "../../assets/svg/membersIcon.svg";
import chatIcon from "../../assets/svg/chatIcon.svg";
import lomadsLogo from "../../assets/svg/lomadsLogo.svg";
import lomadsLogoExpand from "../../assets/svg/lomadsLogoExpand.svg";
import polyMainnet from "../../assets/svg/polyMainnet.svg";
import linkedIn from "../../assets/svg/linkedIn.svg";
import twitter from "../../assets/svg/twitter.svg";
import instagram from "../../assets/svg/instagram.svg";
import completeSelect from "../../assets/svg/completeSelect.svg";
import requiredSelect from "../../assets/svg/requiredSelect.svg";
import optionalSelect from "../../assets/svg/optionalSelect.svg";
import highlightSelect from "../../assets/svg/highlightSelect.svg";
import updateIcon from "../../assets/svg/updateIcon.svg";
import pexels from "../../assets/images/metamask.png";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { updateStepNumber } from "state/proposal/reducer";
import { useMoralis } from "react-moralis";
// import {STEP_NUMBER} from "./CreateDAO";

const CreateDashBoardSidebar = () => {
  const dispatch = useAppDispatch();
  const [menuCollapse, setMenuCollapse] = useState(false); //useState(isMenuCollapsed);
  const stepNumber = useAppSelector((state) => state.proposal.stepNumber);
  const { Moralis } = useMoralis();
  const [title, setTitle] = useState("");

  const menuIconClick = () => {
    setMenuCollapse(!menuCollapse);
  };

  useEffect(() => {
    getHistories();
  }, []);

  async function getHistories() {
    const daoinfo = Moralis.Object.extend("DAOInfo");
    const query = new Moralis.Query(daoinfo);
    const results = await query.find({ useMasterKey: true });
    const lastIndex = results.length - 1;
    setTitle(results[lastIndex].get("title"));
  }

  let navigate = useNavigate();

  const navigateFunc = (e?: any, pageUrl?: string) => {
    if (pageUrl !== undefined) {
      const abc = window.location.href + pageUrl;
      console.log(abc);
      navigate(pageUrl);
    }
  };

  const Header = () => {
    return (
      <div className="closemenu" onClick={menuIconClick} style={{ padding: 5 }}>
        {menuCollapse ? (
          <div>
            <img src={expandIcon} alt="" />
          </div>
        ) : (
          <div>
            <img src={collapseIcon} alt="" />
          </div>
        )}
      </div>
    );
  };

  const Body = () => {
    return menuCollapse ? <BodyCollapse /> : <BodyExpand />;
  };

  const BodyCollapse = () => {
    return (
      <div>
        <div>
          <img
            src={daoImageShaped}
            alt=""
            style={{
              maxHeight: 100,
              maxWidth: 100,
              paddingLeft: 20,
              paddingTop: 50,
              paddingBottom: 150,
            }}
            onClick={(e) => navigateFunc(e, "/")}
          />
        </div>
        <div style={{ paddingBottom: 120, paddingLeft: 30 }}>
          <Menu>
            <MenuItem>{getNavigationIcon(proposalIcon)}</MenuItem>
            <MenuItem>
              {getNavigationIcon(updateIcon, "", stepNumber > 2)}
            </MenuItem>
            <MenuItem>
              {getNavigationIcon(treasuryIcon, "", stepNumber > 3)}
            </MenuItem>
            <MenuItem>
              {getNavigationIcon(membersIcon, "", stepNumber > 4)}
            </MenuItem>
            <MenuItem>
              {getNavigationIcon(chatIcon, "", stepNumber > 5)}
            </MenuItem>
          </Menu>
        </div>
      </div>
    );
  };

  const BodyExpand = () => {
    return (
      <div>
        <div></div>
        <div
          className={"daoNameSidebar"}
          style={{ paddingTop: 250, paddingBottom: 30, marginLeft: 42 }}
        >
          <div className="w-56">{title}</div>
        </div>
        <div style={{ paddingLeft: 80, paddingBottom: 100 }}>
          <Menu>
            <MenuItem
              onClick={(e) => {
                stepNumber > 2
                  ? navigateFunc(e, "")
                  : console.log("no navigation");
              }}
              className="my-2"
            >
              {getNavigationItem("PROPOSALS", proposalIcon)}
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                stepNumber > 2
                  ? navigateFunc(e, "")
                  : console.log("no navigation");
              }}
              className="my-2"
            >
              {getNavigationItem("UPDATES", updateIcon)}
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                stepNumber > 2
                  ? navigateFunc(e, "")
                  : console.log("no navigation");
              }}
              className="my-2"
            >
              {getNavigationItem("TREASURY", treasuryIcon)}
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                stepNumber > 3
                  ? navigateFunc(e, "")
                  : console.log("no navigation");
              }}
              className="my-2"
            >
              {getNavigationItem("MEMBERS", membersIcon)}
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                stepNumber > 4
                  ? navigateFunc(e, "TREASURY")
                  : console.log("no navigation");
              }}
              className="my-2"
            >
              {getNavigationItem("CHAT", chatIcon)}
            </MenuItem>
          </Menu>
        </div>
      </div>
    );
  };

  const getNavigationItem = (text: string, icon: any) => {
    return (
      <div className={"daoNavItem"} style={{ paddingBottom: 0 }}>
        {addIcon(icon)}
        {text}
      </div>
    );
  };

  const getIcon = (isRequired: boolean, isComplete: boolean) => {
    let source = isRequired ? requiredSelect : optionalSelect;
    if (isComplete) {
      source = completeSelect;
    }
    return (
      <img
        src={source}
        style={{
          paddingRight: 20,
          paddingLeft: source === highlightSelect ? -40 : 0,
        }}
        alt=""
      />
    );
  };
  const addIcon = (icon: any) => {
    return (
      <img
        src={icon}
        style={{
          paddingRight: 20,
          paddingLeft: icon === highlightSelect ? -40 : 0,
        }}
        alt=""
      />
    );
  };

  const updateCurrentStepNo = (stepNumber: number) => {
    console.log(stepNumber);
    dispatch(updateStepNumber(stepNumber));
  };

  const getNavigationIcon = (
    icon: any,
    pageUrl?: string,
    gotoStep?: boolean
  ) => {
    return (
      <div style={{ paddingBottom: 10 }}>
        <img
          src={icon}
          onClick={(e) =>
            gotoStep ? navigateFunc(e, pageUrl) : console.log("no navigation")
          }
          alt=""
        />
      </div>
    );
  };

  const Footer = () => {
    return menuCollapse ? <FooterCollapse /> : <FooterExpand />;
  };

  const FooterCollapse = () => {
    return (
      <div style={{ padding: "20px 10px 305px 45px" }}>
        <img
          src={lomadsLogo}
          onClick={() => logoOnClick("https://lomads.xyz/")}
          alt=""
        />
      </div>
    );
  };

  const FooterExpand = () => {
    return (
      <div style={{ paddingBottom: 300 }}>
        <div style={{ display: "flex", paddingTop: 15 }}>
          <div style={{ display: "flex", paddingLeft: 40 }}>
            <img src={polyMainnet} alt="" />
            <div className={"polyMainnet"}>Polygon Mainnet</div>
          </div>
          <div style={{ display: "flex", paddingLeft: 40 }}>
            <img
              src={linkedIn}
              alt=""
              onClick={() =>
                logoOnClick("https://www.linkedin.com/company/lomads")
              }
              style={{ paddingRight: 10 }}
            />
            <img
              src={twitter}
              alt=""
              onClick={() =>
                logoOnClick("https://mobile.twitter.com/lomads_co")
              }
              style={{ paddingRight: 10 }}
            />
            <img
              src={instagram}
              alt=""
              onClick={() => logoOnClick("https://discord.gg/grbm7nk5")}
              style={{ paddingRight: 10 }}
            />
          </div>
        </div>
        <div style={{ padding: "15px 10px 10px 60px" }}>
          <img
            src={lomadsLogoExpand}
            alt=""
            onClick={() => logoOnClick("https://lomads.xyz/")}
          />
        </div>
      </div>
    );
  };

  const logoOnClick = (url: string) => {
    return window.open(url, "_blank");
  };

  return (
    <div id="sidebar">
      <ProSidebar
        collapsed={menuCollapse}
        width={450}
        collapsedWidth={134}
        style={{ height: 1600 }}
      >
        <SidebarHeader>
          <Header />
        </SidebarHeader>
        <SidebarContent>
          <Body />
        </SidebarContent>
        <SidebarFooter>
          <Footer />
        </SidebarFooter>
      </ProSidebar>
    </div>
  );
};

export default CreateDashBoardSidebar;