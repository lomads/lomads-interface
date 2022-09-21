import React, { useState } from "react";
import copyIcon from "../../../assets/svg/copyIcon.svg";
import coin from "../../../assets/svg/coin.svg";
import SafeButton from "UIpack/SafeButton";
import receiveTokenOutline from "../../../assets/svg/receiveTokenOutline.svg";
import sendToken from "../../../assets/svg/sendToken.svg";
import receiveToken from "../../../assets/svg/receiveToken.svg";
import SimpleInputField from "UIpack/SimpleInputField";
import IconButton from "UIpack/IconButton";
import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai";
import SimpleButton from "UIpack/SimpleButton";

const TreasuryCard = (props: any) => {
  const ownerCount = props.ownerCount;
  const PendingTransactions = (props: any) => {
    return (
      <>
        <div className="transactionRow">
          <div className="coinText">
            <img src={receiveTokenOutline} alt="" />

            <div className="dashboardTextBold">{props.amount / 10 ** 18}</div>
          </div>
          <div className="transactionName">
            <SimpleInputField
              className="inputField"
              height={30}
              width={"100%"}
              placeholder="Name Transaction"
            />
          </div>
          <div className="dashboardText">
            to{" "}
            {props.recipient.slice(0, 18) + "..." + props.recipient.slice(-6)}
          </div>
          <div className="dashboardTextBold">
            {props.confirmations + "/" + props.ownerCount} vote
          </div>
          <div className="confirmIconGrp">
            {!props.showExecute ? (
              <>
                <IconButton
                  Icon={
                    <AiOutlineClose
                      style={{
                        color: "#C94B32",
                        height: "16px",
                        width: "16px",
                      }}
                    />
                  }
                  bgColor="#FFFFFF"
                  height={30}
                  width={30}
                  border="2px solid #C94B32"
                  className="iconButtons"
                />
                <IconButton
                  Icon={
                    <AiOutlineCheck
                      style={{
                        color: "#FFFFFF",
                        height: "16px",
                        width: "16px",
                      }}
                    />
                  }
                  bgColor="#C94B32"
                  height={30}
                  width={30}
                  border="2px solid #C94B32"
                  className="iconButtons"
                />
              </>
            ) : (
              <>
                <SimpleButton
                  width={"100%"}
                  height={30}
                  title="EXECUTE"
                  bgColor="#C94B32"
                  className="button"
                />
              </>
            )}
          </div>
        </div>
      </>
    );
  };

  const TransactionComplete = (props: any) => {
    return (
      <>
        <div className="transactionRow">
          <div className="coinText">
            <img src={props.credit ? receiveToken : sendToken} alt="" />

            <div className="dashboardTextBold">{props.amount / 10 ** 18}</div>
          </div>
          <div className="transactionName">
            <SimpleInputField
              className="inputField"
              height={30}
              width={"100%"}
              placeholder="Name Transaction"
            />
          </div>
          <div className="dashboardText">
            to{" "}
            {props.recipient.slice(0, 18) + "..." + props.recipient.slice(-6)}
          </div>
          <div className="dashboardTextBold">
            {props.ownerCount + "/" + props.ownerCount} vote
          </div>
          <div className="confirmIconGrp">
            <div className="dashboardText">10/20 10:33</div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="treasuryCard">
      <div className="treasuryHeader">
        <div className="titleHeader">Treasury</div>
        <div className="headerDetails">
          <div>
            <hr className="vl" />
          </div>
          <div className="copyArea">
            <div className="copyLinkButton">
              <img src={copyIcon} alt="copy" />
            </div>
            <div className="dashboardText">{props.safeAddress}</div>
          </div>
          <div className="copyArea">
            <img src={coin} alt="asset" />
            <div id="safeBalance">$ 8.54</div>
            <div className="dashboardText">total balance</div>
          </div>
          <SafeButton
            height={40}
            width={150}
            titleColor="#B12F15"
            title="SEND TOKEN"
            bgColor="#FFFFFF"
            opacity="1"
            disabled={false}
            fontweight={400}
            fontsize={16}
          />
        </div>
      </div>
      <div className="treasuryTransactions">
        <div className="dashboardText">Last Transactions</div>
        {props.pendingTransactions.length >= 1 &&
          props.pendingTransactions.map((result: any, index: any) => {
            return (
              <PendingTransactions
                showExecute={false}
                amount={result.dataDecoded.parameters[1].value}
                recipient={result.dataDecoded.parameters[0].value}
                confirmations={result.confirmations.length}
                ownerCount={ownerCount}
                key={index}
              />
            );
          })}
        {props.executedTransactions.length >= 1 &&
          props.executedTransactions.map((result: any, index: any) => {
            return (
              <TransactionComplete
                amount={result.transfers[index].value}
                recipient={result.transfers[index].to}
                ownerCount={ownerCount}
              />
            );
          })}
      </div>
    </div>
  );
};

export default TreasuryCard;
