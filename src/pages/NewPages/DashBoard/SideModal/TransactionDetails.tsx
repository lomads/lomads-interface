import { Checkbox } from "@chakra-ui/react";
import { get as _get } from 'lodash';
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import SimpleButton from "UIpack/SimpleButton";
import doubleEuro from "../../../../assets/svg/doubleEuro.svg";
import { ItransactionDetailsType } from "types/DashBoardType";
import { SupportedChainId } from "constants/chains";
import { useWeb3React } from "@web3-react/core";
import {useSafeTokens} from "hooks/useSafeTokens";
import { useAppDispatch, useAppSelector } from "state/hooks";

const TransactionDetails = (props: ItransactionDetailsType) => {
  const { chainId } = useWeb3React();
  const { DAO } = useAppSelector((state) => state.dashboard);
  const { safeTokens } = useSafeTokens()
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
                console.log(e.target.value)
                props.selectToken(e.target.value);
              }}
              defaultValue={props.selectedToken}
            >
              <option value="" disabled={true}>
                select a token
              </option>
              {safeTokens.map((result: any, index: any) => {
                console.log("tokens_RESULT", result)
                return (
                  (
                    <>
                      <option value={result.tokenAddress} key={index}>
                        {_get(result, 'token.symbol')}
                      </option>
                    </>
                  )
                );
              })}
              { _get(DAO, 'sweatPoints', false) &&
              <option value="SWEAT">
                SWEAT
              </option>
              }
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
