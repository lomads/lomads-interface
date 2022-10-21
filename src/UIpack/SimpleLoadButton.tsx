import { LeapFrog } from "@uiball/loaders";
import React from "react";
import { LoadingButtonType } from "types/UItype";

const SimpleLoadButton = (props: LoadingButtonType) => {
  return (
    <>
      <button
        id="nextButtonToken"
        ref={props.ref}
        className={"button"}
        disabled={props.disabled}
        onClick={props.onClick}
        style={{
          height: props.height,
          width: props.width,
          fontSize: props.fontsize,
          fontWeight: props.fontweight,
          background: props.bgColor,
        }}
      >
        {props.condition ? (
          <>
            <div className="loader">
              <LeapFrog size={25} color="#FFFFFF" />
            </div>
          </>
        ) : (
          props.title
        )}
      </button>
    </>
  );
};

export default SimpleLoadButton;
