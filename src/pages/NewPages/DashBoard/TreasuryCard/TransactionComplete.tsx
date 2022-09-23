import React, { useState } from "react";
import sendToken from "../../../../assets/svg/sendToken.svg";
import receiveToken from "../../../../assets/svg/receiveToken.svg";
import SimpleInputField from "UIpack/SimpleInputField";

const TransactionComplete = (props: any) => {
  const date = new Date(props.submissionDate);
  return (
    <>
      <div className="transactionRow">
        <div className="coinText">
          <img src={props.credit ? receiveToken : sendToken} alt="" />

          <div className="dashboardTextBold">
            {props.amount === "multisend"
              ? "multisend"
              : props.amount / 10 ** 18}
          </div>
        </div>
        <div className="transactionName">
          <SimpleInputField
            className="inputField"
            height={30}
            width={"100%"}
            placeholder="Name Transaction"
          />
        </div>
        <div className="transactionAddress">
          <div className="dashboardText">
            to{" "}
            {props.recipient === "multisend"
              ? "multisend"
              : props.recipient.slice(0, 18) +
                "..." +
                props.recipient.slice(-6)}
          </div>
        </div>
        <div className="dashboardTextBold">
          {props.ownerCount + "/" + props.ownerCount} vote
        </div>
        <div className="confirmIconGrp">
          <div className="dashboardText">{`${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`}</div>
        </div>
      </div>
    </>
  );
};

export default TransactionComplete;
