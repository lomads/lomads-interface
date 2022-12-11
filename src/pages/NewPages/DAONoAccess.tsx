import React, { useEffect, useState } from "react";
import "../../styles/pages/DAOSuccess.css";
import "../../styles/Global.css";
import frameicon from "../../assets/svg/frame.svg";
import GroupEnjoy from "../../assets/svg/GroupEnjoy.svg";
import { colors } from "assets/colors";
import { Colorstype } from "types/UItype";
import { useNavigate } from "react-router-dom";
import { loadDao } from 'state/dashboard/actions';
import SideBar from "../NewPages/DashBoard/SideBar";
import { useAppDispatch } from "state/hooks";
import { useWeb3React } from "@web3-react/core";

const DAONoAccess = () => {
  const { chainId } = useWeb3React();
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const [showNavBar, setShowNavBar] = useState<boolean>(false);
  useEffect(() => {
    dispatch(loadDao({ chainId }))
    sessionStorage.removeItem('__lmds_active_dao')
  }, [chainId])

  const showSideBar = (_choice: boolean) => {
		setShowNavBar(_choice);
	};

  return (
    <>
      <div className="DAOsuccess">
        <div className="itemsGroup">
          <div className="logo" style={{ display: 'flex', alignItems: 'center', justifyContent:'center' }}>
            <img src={frameicon} style={{ width: 250, height: 250 }} alt="logo" />
          </div>
          <div className="message">You are currently not on the member list</div>
          <div className="message-subtext">Please contact the admin through email or other social channels</div>
        </div>
      </div>
      <SideBar
				name={""}
				showSideBar={showSideBar}
				showNavBar={showNavBar}
			/>
    </>
  );
};

export default DAONoAccess;
