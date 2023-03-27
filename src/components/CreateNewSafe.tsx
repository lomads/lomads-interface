// @ts-nocheck 
import React, { useState, useEffect } from "react";
import _ from "lodash";
import "../styles/App.css";
import "../styles/CreateDao.css";
import "../styles/Dashboard.css";
import "../styles/Modal.css";
import "../styles/Sidebar.css";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "state/hooks";
import {
  updateHolder,
  updateowner1,
  updateowner1name,
  updateowner2,
  updateowner2name,
  updateowner3,
  updateowner3name,
  updatesafeName,
  updateStepNumber,
  updateThreshold,
} from "state/proposal/reducer";
import { useAppSelector } from "state/hooks";
import useStepRouter from "hooks/useStepRouter";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk";
import AddressInputField from "UIpack/AddressInputField";
import SimpleInputField from "UIpack/SimpleInputField";
import { LeapFrog } from "@uiball/loaders";
import { useNewMoralisObject } from "react-moralis";

const CreateNewSafe = () => {
  useStepRouter(4);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const holder = useAppSelector((state) => state.proposal.holder);
  const Threshold = useAppSelector((state) => state.proposal.threshold);
  const owner1 = useAppSelector((state) => state.proposal.owner1);
  const owner2 = useAppSelector((state) => state.proposal.owner2);
  const owner3 = useAppSelector((state) => state.proposal.owner3);
  const owner1name = useAppSelector((state) => state.proposal.owner1name);
  const owner2name = useAppSelector((state) => state.proposal.owner2name);
  const owner3name = useAppSelector((state) => state.proposal.owner3name);
  const safeName = useAppSelector((state) => state.proposal.safeName);
  const [text, setText] = useState<string>("CREATE SAFE");

  const [errors, setErrors] = useState<any>({});
  const [isLoading, setisLoading] = useState<boolean>(false);

  const { save } = useNewMoralisObject("safe");

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
    if (
      !isAddressValid(owner1) ||
      !isAddressValid(owner2) ||
      !isAddressValid(owner3)
    ) {
      terrors.isowner = " * owner address is not valid.";
    }
    if (!owner1 || !owner2 || !owner3) {
      terrors.owner = " * onwer name is required.";
    }
    if (!safeName) {
      terrors.safename = " * Safe Name is required.";
    }
    if (Threshold <= 0 || Threshold > 3) {
      terrors.threshold =
        " * threshold must be greater than 0 and less than 3.";
    }
    if (_.isEmpty(terrors)) {
      dispatch(updateStepNumber(4));
      holder ? navigate("/token") : deployNewSafe();
    } else {
      setErrors(terrors);
    }
  };

  const isAddressValid = (holderAddress: string) => {
    const isValid: boolean = ethers.utils.isAddress(holderAddress);
    return isValid;
  };

  useEffect(() => {
    isAddressValid(holder);
  }, [holder]);
  const { provider } = useWeb3React();

  const deployNewSafe = async () => {
    setisLoading(true);
    const safeOwner = provider?.getSigner(0);

    const ethAdapter = new EthersAdapter({
      ethers,
      signer: safeOwner as any,
    });
    const safeFactory = await SafeFactory.create({
      ethAdapter,
    });
    const owners = [owner1, owner2, owner3];
    const threshold: number = parseInt(Threshold.toString());
    const safeAccountConfig: SafeAccountConfig = {
      owners,
      threshold,
    };

    await safeFactory
      .deploySafe({ safeAccountConfig })
      .then(async (tx) => {
        dispatch(updateHolder(tx.getAddress() as string));
        setText("NEXT STEP");
        setisLoading(false);
      })
      .catch((err) => {
        setisLoading(false);
      });
  };

  return (
    <>
      <div>
        {/* safe name */}
        <div>
          <div>
            <div className={"fieldDesc"}>Safe Name</div>
          </div>
          <SimpleInputField
            isInvalid={errors.safename}
            className="inputField"
            id="holder"
            height={50}
            width={660}
            value={safeName}
            placeholder="Pied Piper"
            name="holder"
            onchange={(e) => {
              dispatch(updatesafeName(e.target.value));
            }}
          />
        </div>
        {/* first set of owners */}
        <div className="flex flex-row justify-start items-center">
          <div className="w-40">
            <div>
              <div className={"fieldDesc"}>Owner Name</div>
            </div>
            <SimpleInputField
              isInvalid={errors.owner}
              className="inputField"
              id="holdername"
              height={50}
              width={150}
              value={owner1name}
              placeholder="Gavin Belson"
              name="holdername"
              onchange={(e) => {
                dispatch(updateowner1name(e.target.value));
              }}
            />
          </div>
          <div>
            <div>
              <div className={"fieldDesc"}>Owner Address</div>
            </div>
            <AddressInputField
              isInvalid={errors.isowner}
              className="inputField"
              id="holder"
              height={50}
              width={500}
              value={owner1}
              placeholder="0x3429"
              name="holder"
              onchange={(e) => {
                dispatch(updateowner1(e.target.value));
              }}
            />
          </div>
        </div>
      </div>
      {/* second set of owners */}
      <div className="flex flex-row justify-start items-center">
        <div className="w-40">
          <div>
            <div className={"fieldDesc"}>Owner Name</div>
          </div>
          <SimpleInputField
            isInvalid={errors.owner}
            className="inputField"
            id="holdername"
            height={50}
            width={150}
            value={owner2name}
            placeholder="Peter Gregory"
            name="holdername"
            onchange={(e) => {
              dispatch(updateowner2name(e.target.value));
            }}
          />
        </div>
        <div>
          <div>
            <div className={"fieldDesc"}>Owner Address</div>
          </div>
          <AddressInputField
            isInvalid={errors.isowner}
            className="inputField"
            id="holder"
            height={50}
            width={500}
            value={owner2}
            placeholder="0x3429"
            name="holder"
            onchange={(e) => {
              dispatch(updateowner2(e.target.value));
            }}
          />
        </div>
      </div>
      {/* third set of owner */}
      <div className="flex flex-row justify-start items-center">
        <div className="w-40">
          <div>
            <div className={"fieldDesc"}>Owner Name</div>
          </div>
          <SimpleInputField
            isInvalid={errors.owner}
            className="inputField"
            id="holdername"
            height={50}
            width={150}
            value={owner3name}
            placeholder="Richard Hendricks"
            name="holdername"
            onchange={(e) => {
              dispatch(updateowner3name(e.target.value));
            }}
          />
        </div>
        <div>
          <div>
            <div className={"fieldDesc"}>Owner Address</div>
          </div>
          <AddressInputField
            isInvalid={errors.isowner}
            className="inputField"
            id="holder"
            height={50}
            width={500}
            value={owner3}
            placeholder="0x3429"
            name="holder"
            onchange={(e) => {
              dispatch(updateowner3(e.target.value));
            }}
          />
        </div>
      </div>
      <div className="w-40">
        <div>
          <div className={"fieldDesc"}>Threshold</div>
        </div>
        <SimpleInputField
          isInvalid={errors.threshold}
          className="inputField"
          id="threshold"
          height={50}
          width={150}
          value={Threshold}
          placeholder="1"
          name="threshold"
          type="number"
          onchange={(e) => {
            dispatch(updateThreshold(e.target.value));
          }}
        />
      </div>
      {holder ? (
        <div>
          <div className={"fieldDesc"}>{`Safe Name: ${safeName}`}</div>
          <div className={"fieldDesc"}>{`Safe Address: ${holder}`}</div>
          <div className={"fieldDesc"}>{`${owner1name}: ${owner1}`}</div>
          <div className={"fieldDesc"}>{`${owner2name}: ${owner2}`}</div>
          <div className={"fieldDesc"}>{`${owner3name}: ${owner3}`}</div>
          <div className={"fieldDesc"}>{`Threshold: ${Threshold}`}</div>
        </div>
      ) : null}
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
