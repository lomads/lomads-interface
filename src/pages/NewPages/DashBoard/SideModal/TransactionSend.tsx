import { Checkbox } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import SimpleButton from "UIpack/SimpleButton";
import doubleEuro from "../../../../assets/svg/doubleEuro.svg";
import daoMember2 from "../../../../assets/svg/daoMember2.svg";
import SafeButton from "UIpack/SafeButton";
import OutlineButton from "UIpack/OutlineButton";
import SimpleInputField from "UIpack/SimpleInputField";
import { ethers } from "ethers";
import { InviteGangType } from "types/UItype";
import { IselectTransactionSend, IsetRecipientType } from "types/DashBoardType";

const TransactionSend = (props: IselectTransactionSend) => {
  const managePreviousNavigation = () => {
    const length = props.setRecipient.current.length;
    console.log("set length:", length);
    props.setRecipient.current.splice(0, length);
    console.log("after set length:", length);
    props.showNavigation(true, false, false);
  };

  const deleteMember = (_address: any) => {
    const deleteMember = [...props.setRecipient.current];

    const newContract = deleteMember.splice(
      deleteMember.findIndex((ele) => ele.recipient === _address),
      1
    );
    props.setRecipient.current = deleteMember;
    console.log("update setrecipient:", props.setRecipient.current);
    console.log(newContract);
    console.log("rest length:", deleteMember);
    setShowInput(props.setRecipient.current);
    console.log("showinput:", showInput);
  };

  const [showInput, setShowInput] = useState(props.setRecipient.current);
  return (
    <>
      <div className="closeButtonArea">
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
          bgColor="linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%)"
          height={37}
          width={37}
          className="sideModalCloseButton"
          onClick={(e) => {
            managePreviousNavigation();
          }}
        />
      </div>
      <div id="transactionSendPage">
        <div id="doubleEuroImage">
          <img src={doubleEuro} alt="euro" id="recipientDoubleEuro" />
        </div>
        <div id="transactionDetails">Transaction Details</div>
        <div className="currencySelectionArea">
          <div className="dashboardTextBold">Currency: </div>
          <div>
            <select
              name="chain"
              id="chain"
              className="tokenDropdown"
              placeholder="Select Token"
              onChange={(e) => {
                props.selectToken(e.target.value);
              }}
              defaultValue={props.selectedToken}
            >
              {props.tokens.map((result: any, index: any) => {
                return (
                  result.tokenAddress !== null && (
                    <>
                      <option
                        value={
                          props.selectedToken
                            ? props.selectedToken
                            : result.tokenAddress
                        }
                        key={index}
                      >
                        {result.token.symbol}
                      </option>
                    </>
                  )
                );
              })}
            </select>
          </div>
        </div>
        <div id="transactionSendDivider1"></div>
        <div id="recipientList">
          {showInput.map((result: IsetRecipientType, index: number) => {
            return (
              <div>
                <div id="assignAmount">
                  <div id="recipientAvatarAndName">
                    <img src={daoMember2} alt={result.recipient} />
                    <p className="nameText">{result.name}</p>
                  </div>
                  <div id="amountInputFields">
                    <div>
                      <SimpleInputField
                        height={50}
                        width={106}
                        placeholder="Amount"
                        type="number"
                        onchange={(e) => {
                          props.setRecipient.current[index].amount =
                            e.target.value;
                        }}
                      />
                    </div>
                    <div>
                      <SimpleInputField
                        height={50}
                        width={195}
                        placeholder="Reason for transaction"
                        type="text"
                        onchange={(e) => {
                          props.setRecipient.current[index].reason =
                            e.target.value;
                        }}
                      />
                    </div>
                    <div>
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
                        bgColor="linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%)"
                        height={25}
                        width={25}
                        className="sideModalCloseButton"
                        onClick={(e) => {
                          deleteMember(result.recipient);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div id="addMember">
          <div>
            <SafeButton
              bgColor="#FFFFFF"
              disabled={false}
              title="ADD OTHER"
              titleColor="#76808D"
              fontsize={16}
              fontweight={400}
              height={40}
              width={162}
            />
          </div>
          <div>
            <SafeButton
              bgColor="#FFFFFF"
              disabled={false}
              title="ADD A MEMBER"
              titleColor="#76808D"
              fontsize={16}
              fontweight={400}
              height={40}
              width={162}
            />
          </div>
        </div>
        <div id="transactionSendDivider2"></div>
        <div id="transactionSendButton">
          <SimpleButton
            title="SEND TOKENS"
            height={50}
            width={150}
            bgColor="#C94B32"
            className="button"
            fontsize={20}
            fontweight={400}
            onClick={() => {
              props.createTransaction();
            }}
          />
        </div>
      </div>
    </>
  );
};

export default TransactionSend;
