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
              ? "Multisend"
              : props.amount / 10 ** 18}{" "}
            {props.tokens !== undefined &&
              props.tokens.map((result: any, index: any) => {
                return (
                  props.tokenAddress === result.tokenAddress &&
                  result.token.symbol
                );
              })}
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
            {props.recipient !== undefined && props.recipient === "multisend"
              ? "multisend"
              : props.recipient.slice(0, 6) + "..." + props.recipient.slice(-4)}
          </div>
        </div>
        <div id="voteArea">
          <div className="dashboardTextBold">
            {!props.credit
              ? props.ownerCount + "/" + props.ownerCount + " vote"
              : null}
          </div>
        </div>
        <div className="confirmIconGrp">
          {props.multiIndex !== undefined && props.multiIndex !== 0 ? (
            <div className="multiSendDivider"></div>
          ) : (
            <div className="dashboardText">{`${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default TransactionComplete;
