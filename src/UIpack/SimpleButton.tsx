import React from "react";
import { ButtonType } from "types/UItype";
import "../styles/Global.css";

const SimpleButton = (props: ButtonType) => {
  return (
    <>
      <button
        id="nextButtonToken"
        className={props.className}
        onClick={props.onClick}
        disabled={props.disabled || undefined}
        style={{
          height: props.height,
          width: props.width,
          fontSize: props.fontsize,
          fontWeight: props.fontweight,
          background: props.bgColor,
          boxShadow: props.shadow,
        }}
      >
        {props.title}
      </button>
    </>
  );
};

export default SimpleButton;
