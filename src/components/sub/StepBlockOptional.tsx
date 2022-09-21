import React from "react";
import { useNavigate } from "react-router-dom";
import rectImage from "../../assets/svg/rect.svg";
import rightArrow from "../../assets/svg/rightArrow.svg";
import vertLineOptional from "../../assets/svg/vertLineOptional.svg";
import { blockType } from "../../types/index";

export const StepBlockOptional = (props: blockType) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(props.onClickGoToStep || "");
  };
  return (
    <div className={"stepBlockOptional"} id={"stepBlockOptional"}>
      <div className={"rect1"} style={{ background: "#FFFFFF" }}>
        <img src={rectImage} style={{ paddingTop: 20 }} alt="rectImage" />
      </div>
      <div>
        <div style={{ display: "flex" }}>
          <div className={"title"} style={{ color: "#76808D" }}>
            {props.blockTitle}
          </div>
          <div className={"rect2"} style={{ background: "#FFFFFF" }}>
            <div
              className={"reqText"}
              style={{ color: "rgba(118, 128, 141, 0.5)" }}
            >
              Optional
            </div>
          </div>
        </div>
        <div className={"description"} style={{ color: "#76808D" }}>
          {props.blockDescription}
        </div>
      </div>
    </div>
  );
};
