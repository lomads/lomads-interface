import React, { useState } from "react";
import { useAppDispatch } from "state/hooks";
import { updateTitle, updatePurpose } from "state/proposal/reducer";
import { useAppSelector } from "state/hooks";
import { TiPencil } from "react-icons/ti";

const BasicsComponent = (props: any) => {
  const dispatch = useAppDispatch();
  const title = useAppSelector((state) => state.proposal.title);
  const purpose = useAppSelector((state) => state.proposal.purpose);
  const [disabledButton, setDisabledButton] = useState<boolean>(true);

  return (
    <>
      <div
        style={{
          display: "inline-flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div className={"gotitle"}>Basics</div>
        <div>
          <TiPencil
            size={25}
            style={{ marginRight: 150, color: "#B84E24", cursor: "pointer" }}
            onClick={() => {
              setDisabledButton(!disabledButton);
            }}
          />
        </div>
      </div>
      <div className={"titleBar"} style={{ paddingBottom: 60, width: "100%" }}>
        <div className={"tokentitleTile"} style={{ width: 870 }}>
          <div>
            <div className={"tileItemHeader"}>
              <div>Title</div>
            </div>
            <input
              className={`${
                disabledButton ? "focusInputField" : "noInputField"
              }`}
              type="title"
              name="title"
              value={title}
              style={{ height: 40, width: 400 }}
              autoFocus
              placeholder="Enter Title"
              onChange={(e) => {
                dispatch(updateTitle(e.target.value));
              }}
              disabled={disabledButton}
            />
          </div>
          {/* second */}
          <div style={{ marginLeft: "20px" }}>
            <div className={"tileItemHeader"}>
              <div>Purpose</div>
            </div>
            <input
              className={`${
                disabledButton ? "focusInputField" : "noInputField"
              }`}
              type="title"
              name="title"
              value={purpose}
              style={{ height: 40, width: 400 }}
              placeholder="Enter Purpose"
              onChange={(e) => {
                dispatch(updatePurpose(e.target.value));
              }}
              disabled={disabledButton}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BasicsComponent;
