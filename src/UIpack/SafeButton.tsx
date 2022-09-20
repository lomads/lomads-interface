import React from "react";
import { SafeButtonType } from "types/UItype";
import "../styles/Global.css";

const SafeButton = (props: SafeButtonType) => {
  return (
    <>
      <button
        id="safeButton"
        className={"safeButton"}
        onClick={props.onClick}
        style={{
          height: props.height,
          width: props.width,
          fontSize: props.fontsize,
          fontWeight: props.fontweight,
          color: props.titleColor,
          backgroundColor: props.bgColor,
          opacity: props.opacity,
        }}
        disabled={props.disabled}
      >
        {props.title}
      </button>
    </>
  );
};

export default SafeButton;
