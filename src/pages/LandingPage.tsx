import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import "../styles/CreateDao.css";
import "../styles/Dashboard.css";
import "../styles/Modal.css";
import "../styles/Sidebar.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/login");
  };
  return (
    <div style={{ backgroundColor: "white" }}>
      <button
        id="buyToken"
        className={"page-button"}
        style={{
          width: 140,
          marginLeft: 250,
          position: "absolute",
          top: 30,
          right: 80,
        }}
        onClick={handleClick}
      >
        Create Dao
      </button>
    </div>
  );
};

export default LandingPage;
