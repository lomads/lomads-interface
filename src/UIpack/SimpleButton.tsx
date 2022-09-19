import React from "react";
import { ButtonType } from "types/UItype";
import "../styles/Global.css";

const SimpleButton = (props: ButtonType) => {
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
        {props.title}
      </button>
    </>
  );
};

export default SimpleButton;