import React from "react";
import { OutlineButtonType } from "types/UItype";

const OutlineButton = (props: OutlineButtonType) => {
  return (
    <div>
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
            border: `2px solid ${props.borderColor}`,
            color: props.borderColor,
          }}
        >
          {props.title}
        </button>
      </>
    </div>
  );
};

export default OutlineButton;
