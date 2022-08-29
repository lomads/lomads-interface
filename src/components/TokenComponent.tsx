import React, { useState } from "react";
import { useAppDispatch } from "state/hooks";
import {
  updatetokenTitle,
  updatetokenSymbol,
  updateHolder,
} from "state/proposal/reducer";
import { useAppSelector } from "state/hooks";
import { TiPencil } from "react-icons/ti";
const TokenComponent = () => {
  const dispatch = useAppDispatch();
  const tokenTitle = useAppSelector((state) => state.proposal.tokenTitle);
  const tokenSymbol = useAppSelector((state) => state.proposal.tokenSymbol);
  const holder = useAppSelector((state) => state.proposal.holder);
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
        <div className={"gotitle"}>Token</div>
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
      <div className={"TitleBar"} style={{ paddingBottom: 60 }}>
        <div className={"tokentitleTile"} style={{ width: 750 }}>
          <div>
            <div className={"tileItemHeader"}>
              <div>Token Name</div>
            </div>
            <input
              className={`${
                disabledButton ? "focusInputField" : "noInputField"
              }`}
              type="title"
              name="title"
              value={tokenTitle}
              style={{ height: 40, width: 250 }}
              autoFocus
              placeholder="Enter Token Name"
              onChange={(e) => {
                dispatch(updatetokenTitle(e.target.value));
              }}
              disabled={disabledButton}
            />
          </div>
          {/* second */}
          <div style={{ marginLeft: "20px" }}>
            <div className={"tileItemHeader"}>
              <div>Symbol</div>
            </div>
            <input
              className={`${
                disabledButton ? "focusInputField" : "noInputField"
              }`}
              type="title"
              name="title"
              value={tokenSymbol}
              style={{ height: 40, width: 150 }}
              placeholder="Symbol"
              onChange={(e) => {
                dispatch(updatetokenSymbol(e.target.value));
              }}
              disabled={disabledButton}
            />
          </div>
          {/* third */}
          <div style={{ marginLeft: "20px" }}>
            <div className={"tileItemHeader"}>
              <div>Holder</div>
            </div>
            <input
              className={`${
                disabledButton ? "focusInputField" : "noInputField"
              }`}
              type="title"
              name="title"
              value={holder}
              style={{ height: 40, width: 260 }}
              placeholder="Enter Holder Address"
              onChange={(e) => {
                dispatch(updateHolder(e.target.value));
              }}
              disabled={disabledButton}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default TokenComponent;
