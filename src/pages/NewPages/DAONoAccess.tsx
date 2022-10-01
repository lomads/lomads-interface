import React, { useEffect } from "react";
import "../../styles/pages/DAOSuccess.css";
import "../../styles/Global.css";
import frameicon from "../../assets/svg/frame.svg";
import GroupEnjoy from "../../assets/svg/GroupEnjoy.svg";
import { colors } from "assets/colors";
import { Colorstype } from "types/UItype";
import { useNavigate } from "react-router-dom";
const DAONoAccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('__lmds_active_dao')
  }, [])

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
    </>
  );
};

export default DAONoAccess;
