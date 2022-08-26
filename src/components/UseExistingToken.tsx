import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Input, FormControl, FormErrorMessage } from "@chakra-ui/react";
import { useAppDispatch } from "state/hooks";
import {
  updatetokenTitle,
  updatetokenSymbol,
  updateExplain,
  updateSupply,
  updateHolder,
  updateIconImgPath,
  updateStepNumber,
  updatedeployedTokenAddress,
  updateDecimals,
} from "state/proposal/reducer";
import { useAppSelector } from "state/hooks";
import { useNavigate } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { TOKEN_ABI } from "abis/DaoToken";
import { updateTokenAddress } from "state/deploy/reducer";
import { DotPulse } from "@uiball/loaders";

const UseExistingToken = () => {
  const { provider } = useWeb3React();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tokenAddress = useAppSelector(
    (state) => state.proposal.deployedTokenAddress
  );
  let tokenTitle = useAppSelector((state) => state.proposal.tokenTitle);
  let tokenSymbol = useAppSelector((state) => state.proposal.tokenSymbol);
  let supply = useAppSelector((state) => state.proposal.supply);
  let holder = useAppSelector((state) => state.proposal.holder);
  let decimals = useAppSelector((state) => state.proposal.decimals);
  let web3authAddress = useAppSelector(
    (state) => state.proposal.Web3AuthAddress
  );
  const [errors, setErrors] = useState<any>({});
  const [isSearching, setisSearching] = useState<boolean>(false);

  useEffect(() => {
    if (!_.isEmpty(errors)) {
      const id = Object.keys(errors)[0];
      const element = document.getElementById(id);
      if (element) {
        element.focus();
        const rect = element.getBoundingClientRect();
        window.scrollTo({
          top: window.scrollY + rect.y - 100,
          behavior: "auto",
        });
      }
    }
  }, [errors]);

  const handleClick = () => {
    let terrors: any = {};

    if (!tokenAddress) {
      terrors.tokenAddress = "* Token Address is required.";
    }

    if (!tokenTitle) {
      terrors.tokenTitle = "* Token title is required.";
    }

    if (!tokenSymbol) {
      terrors.tokenSymbol = "* Token symbol is required.";
    }

    if (!supply) {
      terrors.supply = "* Total supply is required.";
    }

    if (!holder) {
      terrors.holder = "* Holder address is required.";
    }
    if (_.isEmpty(terrors)) {
      dispatch(updateStepNumber(5));
      navigate("/golive");
    } else {
      setErrors(terrors);
    }
  };

  const searchDetails = async () => {
    if (tokenAddress !== null) {
      setisSearching(true);
      const signer = provider?.getSigner();
      const token = new ethers.Contract(
        tokenAddress as string,
        TOKEN_ABI,
        signer
      );
      tokenTitle = await token.name();
      tokenSymbol = await token.symbol();
      holder = await token.owner();
      supply = await token.totalSupply();
      dispatch(updatetokenTitle(tokenTitle));
      dispatch(updatetokenSymbol(tokenSymbol));
      dispatch(updateHolder(holder));
      dispatch(updateSupply(supply.toString()));
      console.log(supply.toString());
      setisSearching(false);
    }
  };

  return (
    <>
      <div>
        <div className={"pageDescription"}>
          Use an existing ERC20 token for your community.
        </div>
        <div className={"titleBar"}>
          <div className={"tokentitleTile"} style={{ width: 650 }}>
            <div className="w-full">
              <div className={"tileItemHeaderToken"}>
                <div>Token Address</div>
                <div className={"rect2"}>
                  <div className={"reqText"}>Required</div>
                </div>
              </div>
              <div className={"tokenpageDescription"}>
                Enter the address of ERC20 Token.
              </div>
              <div className="flex flex-row items-center justify-evenly">
                <FormControl isInvalid={!tokenAddress && errors.tokenAddress}>
                  <Input
                    id="tokenAddress"
                    className={"inputField"}
                    style={{ height: 40, width: 340 }}
                    name="tokenAddress"
                    value={tokenAddress as string}
                    placeholder="0x3429"
                    onChange={(e) => {
                      dispatch(updatedeployedTokenAddress(e.target.value));
                    }}
                  />
                  {!tokenAddress && errors.tokenAddress && (
                    <FormErrorMessage
                      style={{ marginTop: 0, fontSize: "x-small" }}
                    >
                      {errors.tokenTitle}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <button
                  id="nextButtonToken"
                  className={"searchButton"}
                  onClick={searchDetails}
                >
                  {!isSearching ? (
                    "SEARCH"
                  ) : (
                    <div className="ml-20">
                      <DotPulse color="white" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className={"flex justify-center items-center mt-3 relative right-20"}
          style={{ width: 750 }}
        >
          <div>
            <div className={"tileItemHeader"}>
              <div>Name</div>
            </div>
            <div className={"tokenpageDescription"}>
              Descriptive Name of Token.
            </div>
            <FormControl isInvalid={!tokenTitle && errors.tokenTitle}>
              <Input
                id="tokenTitle"
                className={"inputField"}
                style={{ height: 40, width: 340 }}
                name="title"
                value={tokenTitle}
                placeholder="Name your Token Name"
                onChange={(e) => {
                  dispatch(updatetokenTitle(e.target.value));
                }}
              />
              {!tokenTitle && errors.tokenTitle && (
                <FormErrorMessage style={{ marginTop: 0, fontSize: "x-small" }}>
                  {errors.tokenTitle}
                </FormErrorMessage>
              )}
            </FormControl>
          </div>
          {/* second */}
          <div style={{ marginLeft: "20px" }}>
            <div className={"tileItemHeader"}>
              <div>Symbol</div>
            </div>
            <div className={"tokenpageDescription"}>
              A one word symbol signifying the token.
            </div>
            <FormControl isInvalid={!tokenSymbol && errors.tokenSymbol}>
              <Input
                id="tokenSymbol"
                className={"inputField"}
                style={{ height: 40, width: 240 }}
                name="title"
                value={tokenSymbol}
                placeholder="Enter your Token Symbol"
                onChange={(e) => {
                  dispatch(updatetokenSymbol(e.target.value));
                }}
              />
              {!tokenSymbol && errors.tokenSymbol && (
                <FormErrorMessage style={{ marginTop: 0, fontSize: "x-small" }}>
                  {errors.tokenSymbol}
                </FormErrorMessage>
              )}
            </FormControl>
          </div>
        </div>
        {/* supply */}
        <div>
          <div className={"subItemHeader"}>
            <div>Supply</div>
          </div>
          <div className={"fieldDesc"}>Total Token Supply.</div>
        </div>
        <FormControl isInvalid={!supply && errors.supply}>
          <Input
            id="supply"
            className={"inputField"}
            style={{ height: 40, width: 340 }}
            name="supply"
            type="number"
            value={supply}
            placeholder="100,000,000"
            onChange={(e) => {
              dispatch(updateSupply(e.target.value));
            }}
          />
          {!supply && errors.supply && (
            <FormErrorMessage style={{ marginTop: 0, fontSize: "x-small" }}>
              {errors.supply}
            </FormErrorMessage>
          )}
        </FormControl>
        <div>
          <div className={"subItemHeader"}>
            <div>Holder</div>
          </div>
          <div className={"fieldDesc"}>Address that controls the token.</div>
        </div>
        <FormControl isInvalid={!holder && errors.holder}>
          <Input
            id="holder"
            className={"inputField"}
            style={{ height: 40, width: 340 }}
            name="holder"
            value={holder}
            placeholder="0x3429…"
            onChange={(e) => {
              dispatch(updateHolder(e.target.value));
            }}
          />
          {!holder && errors.holder && (
            <FormErrorMessage style={{ marginTop: 0, fontSize: "x-small" }}>
              {errors.holder}
            </FormErrorMessage>
          )}
        </FormControl>
      </div>
      <div>
        <button
          id="nextButtonToken"
          className={"nextButton"}
          onClick={handleClick}
        >
          NEXT STEP
        </button>
      </div>
    </>
  );
};
export default UseExistingToken;
