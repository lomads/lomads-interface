import { Checkbox } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import SimpleButton from "UIpack/SimpleButton";
import doubleEuro from "../../../../assets/svg/doubleEuro.svg";
import { ItransactionDetailsType } from "types/DashBoardType";

const TransactionDetails = (props: ItransactionDetailsType) => {
  return (
    <>
      <div id="transactionDetailsPage">
        <div>
          <img src={doubleEuro} alt="euro" id="doubleEuro" />
        </div>
        <div className="transactionDetails">Transaction Details</div>
        <div className="currencySelectionArea">
          <div className="dashboardTextBold">Currency: </div>
          <div>
            <select
              name="chain"
              id="chain"
              className="tokenDropdown"
              onChange={(e) => {
                props.selectToken(e.target.value);
              }}
              defaultValue={props.selectedToken}
            >
              <option value="" disabled={true}>
                select a token
              </option>
              {props.tokens.map((result: any, index: any) => {
                return (
                  result.tokenAddress !== null && (
                    <>
                      <option value={result.tokenAddress} key={index}>
                        {result.token.symbol}
                      </option>
                    </>
                  )
                );
              })}
            </select>
          </div>
        </div>
        <div>
          <SimpleButton
            title="NEXT"
            bgColor={props.selectedToken ? "#C94B32" : "rgba(27, 43, 65, 0.2)"}
            className="button"
            height={40}
            width={"12vw"}
            disabled={!props.selectedToken}
            fontsize={18}
            onClick={() => {
              props.showNavigation(true, false, false);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default TransactionDetails;
