import React from "react";
import "../../styles/pages/DAOSuccess.css";
import "../../styles/Global.css";
import lomadsfulllogo from "../../assets/svg/lomadsfulllogo.svg";
import GroupEnjoy from "../../assets/svg/GroupEnjoy.svg";
import { colors } from "assets/colors";
import { Colorstype } from "types/UItype";
const DAOsuccess = () => {
  return (
    <>
      <div className="DAOsuccess">
        <div className="itemsGroup">
          <div className="logo">
            <img src={lomadsfulllogo} alt="logo" />
          </div>
          <div className="congrats">Well done!</div>
          <div className="headerText">Your DAO is live</div>
          <div className="infoText">
            you will be redirected to the dashboard in a few secons
          </div>
        </div>
        <div className="groupenjoy">
          <img src={GroupEnjoy} alt="Congrats" />
        </div>
        {colors.map((result: Colorstype) => {
          return (
            <div
              className="colors"
              style={{
                backgroundColor: result.backgroudColor,
                left: result.left,
                right: result.right,
                top: result.top,
                bottom: result.bottom,
                transform: result.transform,
              }}
            ></div>
          );
        })}
      </div>
    </>
  );
};

export default DAOsuccess;
