import React, { useState } from "react";
import "../../../styles/pages/DashBoard/DashBoard.css";
import { GrFormAdd } from "react-icons/gr";
import plus from "../../../assets/svg/plus.svg";

const SideBar = (props: any) => {
  // const [showNavBar, setShowNavBar] = useState<boolean>(false);
  const name = props.name.split(" ");
  const SideBarStrip = () => {
    return (
      <>
        <div className="sideBarStrip">
          <div className="stripInvertedBoxOutline">
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
      <div className="navBarInitialBox">
        <div className="invertedBox">
          <div className="navbarText">
            {name.length === 1
              ? name[0].charAt(0)
              : name[0].charAt(0) + name[name.length - 1].charAt(0)}
          </div>
        </div>
      </div>
      <SideBarStrip />
    </>
  );
};

export default SideBar;
