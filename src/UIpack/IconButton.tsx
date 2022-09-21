import React from "react";
import { IconButtonType } from "types/UItype";
import "../styles/Global.css";

const IconButton = (props: IconButtonType) => {
  return (
    <>
      <button
        id="nextButtonToken"
        className={"button"}
        onClick={props.onClick}
        style={{
          height: props.height,
          width: props.width,
          fontSize: props.fontsize,
          fontWeight: props.fontweight,
          background: props.bgColor,
        }}
      >
        {props.Icon}
      </button>
    </>
  );
};

export default IconButton;
