import React, { useState } from "react";
import "../../../styles/pages/DashBoard/DashBoard.css";
import plus from "../../../assets/svg/plus.svg";
import { useNavigate } from "react-router-dom";

const SideBar = (props: any) => {
  const navigate = useNavigate();
  const name = props.name.split(" ");
  const SideBarStrip = () => {
    return (
      <>
        <div className="sideBarStrip">
          <div
            className="stripInvertedBoxOutline"
            onClick={() => {
              navigate("/namedao");
            }}
          >
            <div className="navbarText">
              <img src={plus} alt="add" />
            </div>
          </div>
          <div id="createADAOText">Create a DAO</div>
        </div>
      </>
    );
  };
  return (
    <>
      <div
        className="navBarInitialBox"
        onMouseEnter={() => {
          props.showSideBar(true);
        }}
      >
        <div className="invertedBox">
          <div className="navbarText">
            {name.length === 1
              ? name[0].charAt(0)
              : name[0].charAt(0) + name[name.length - 1].charAt(0)}
          </div>
        </div>
      </div>
      {props.showNavBar && <SideBarStrip />}
    </>
  );
};

export default SideBar;
