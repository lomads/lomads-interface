import React from "react";
import { IconButtonType } from "types/UItype";
import "../styles/Global.css";

const IconButton = (props: IconButtonType) => {
  return (
    <>
      <button
        id="nextButtonToken"
        className={props.className}
        onClick={props.onClick}
        disabled={props.disabled}
        style={{
          height: props.height,
          width: props.width,
          fontSize: props.fontsize,
          fontWeight: props.fontweight,
          background: props.bgColor,
          border: props.border,
        }}
      >
        {props.Icon}
      </button>
    </>
  );
};

export default IconButton;
