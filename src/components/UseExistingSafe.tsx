import React, { useState, useEffect } from "react";
import _ from "lodash";
import "../styles/App.css";
import "../styles/CreateDao.css";
import "../styles/Dashboard.css";
import "../styles/Modal.css";
import "../styles/Sidebar.css";
import { useNavigate } from "react-router-dom";
import { Input, FormControl, FormErrorMessage } from "@chakra-ui/react";
import { useAppDispatch } from "state/hooks";
import {
  updateHolder,
  updateStepNumber,
  updateThreshold,
} from "state/proposal/reducer";
import { useAppSelector } from "state/hooks";
import useStepRouter from "hooks/useStepRouter";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import Safe from "@gnosis.pm/safe-core-sdk";
import axios from "axios";
import { LeapFrog } from "@uiball/loaders";
import { ImportSafe } from "connection/SafeCall";
import { GNOSIS_SAFE_BASE_URLS } from 'constants/chains'

const CreateNewSafe = () => {
  useStepRouter(4);
	const { account, chainId } = useWeb3React();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const holder = useAppSelector((state) => state.proposal.holder);
  const Threshold = useAppSelector((state) => state.proposal.threshold);
  const owner1name = useAppSelector((state) => state.proposal.owner1name);
  const [tokens, settokens] = useState<any>([]);
  const [owners, setowners] = useState<any>([]);
  const [safeAddress, setsafeAddress] = useState<string>("");
  const [text, setText] = useState<string>("IMPORT SAFE");

  const [errors, setErrors] = useState<any>({});
  const [isLoading, setisLoading] = useState<boolean>(false);

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
    if (!isAddressValid(safeAddress)) {
      terrors.issafeAddress = " * Safe Address is not valid.";
    }
    if (_.isEmpty(terrors)) {
      dispatch(updateStepNumber(4));
      holder ? navigate("/token") : UseExistingSafe();
    } else {
      setErrors(terrors);
    }
  };

  const isAddressValid = (holderAddress: string) => {
    const isValid: boolean = ethers.utils.isAddress(holderAddress);
    return isValid;
  };

  useEffect(() => {
    isAddressValid(safeAddress);
  }, [safeAddress]);
  const { provider } = useWeb3React();

  const UseExistingSafe = async () => {
    setisLoading(true);
    const safeSDK = await ImportSafe(provider, safeAddress);

    dispatch(updateHolder(safeSDK.getAddress() as string));
    const safeOwners: string[] = await safeSDK.getOwners();
    setowners(safeOwners);
    await getTokens(safeAddress);
    const safeThreshold: number = await safeSDK.getThreshold();
    dispatch(updateThreshold(safeThreshold));
    setisLoading(false);
    setText("NEXT STEP");
  };

  const getTokens = async (safeAddress: string) => {
    chainId &&
    axios
      .get(
        `${GNOSIS_SAFE_BASE_URLS[chainId]}/api/v1/safes/${safeAddress}/balances/`
      )
      .then((tokens: any) => {
        settokens(tokens.data);
      });
  };

  return (
    <>
      <div>
        <div>
          <div>
            <div className={"fieldDesc"}>Safe Address</div>
          </div>
          <FormControl isInvalid={errors.issafeAddress}>
            <Input
              id="holder"
              className={"inputField"}
              style={{ height: 50, width: 500 }}
              name="holder"
              value={safeAddress}
              placeholder="0x3429…"
              onChange={(e) => {
                setsafeAddress(e.target.value);
              }}
            />
            {errors.issafeAddress && (
              <FormErrorMessage style={{ marginTop: 0, fontSize: "x-small" }}>
                {!isAddressValid(safeAddress) ? errors.issafeAddress : null}
              </FormErrorMessage>
            )}
          </FormControl>
        </div>
      </div>
      {holder ? (
        <div>
          <div className={"fieldDesc"}>
            {holder.length >= 42 ? holder : null}
          </div>
          <div className={"fieldDesc"}>
            Owners:
            {owners
              ? owners.map((owner: any, index: any) => (
                  <div>
                    <p key={index}>{owner}</p>
                  </div>
                ))
              : null}
          </div>
          <div className={"fieldDesc"} style={{ width: 700 }}>
            Assets:
            {tokens
              ? tokens.map((token: any, index: any) => (
                  <div key={index}>
                    <p>
                      {token.tokenAddress !== null
                        ? `Token Name: ${token.token.name} :: Token Symbol: ${token.token.symbol} :: ${token.tokenAddress}`
                        : null}
                    </p>
                  </div>
                ))
              : null}
          </div>
          <div className={"fieldDesc"}>
            Threshold:
            {Threshold}
          </div>
        </div>
      ) : null}
      <div>
        <div className={"fieldDesc"}>{owner1name}</div>
      </div>
      <div>
        <button
          id="nextButtonToken"
          className={"nextButton"}
          onClick={handleClick}
        >
          {!isLoading ? (
            text
          ) : (
            <div style={{ marginLeft: 48 }}>
              <LeapFrog size={20} color="#FFFFFF" />
            </div>
          )}
        </button>
      </div>
    </>
  );
};

export default CreateNewSafe;
