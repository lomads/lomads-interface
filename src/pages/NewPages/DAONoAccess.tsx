import React from "react";
import "../../styles/pages/DAOSuccess.css";
import "../../styles/Global.css";
import lomadslogodark from "../../assets/svg/lomadslogodark.svg";
import GroupEnjoy from "../../assets/svg/GroupEnjoy.svg";
import { colors } from "assets/colors";
import { Colorstype } from "types/UItype";
import { useNavigate } from "react-router-dom";
const DAONoAccess = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="DAOsuccess">
        <div className="itemsGroup">
          <div className="logo">
            <img src={lomadslogodark} alt="logo" />
          </div>
          <div className="congrats"></div>
          <div className="header">No Access</div>
          <img src={GroupEnjoy} alt="Congrats" className="groupenjoy" />
        </div>
      </div>
    </>
  );
};

export default DAONoAccess;
