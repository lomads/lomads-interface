import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import "../../styles/pages/AddNewSafe.css";
import "../../styles/Global.css";
import SafeButton from "UIpack/SafeButton";
import SimpleInputField from "UIpack/SimpleInputField";
import SimpleButton from "UIpack/SimpleButton";
import { InviteGangType } from "types/UItype";
import { Checkbox } from "@chakra-ui/react";
import { useAppSelector } from "state/hooks";
import { useAppDispatch } from "state/hooks";
import {
  updateOwners,
  updatesafeName,
  updateThreshold,
} from "state/flow/reducer";
import daoMember2 from "../../assets/svg/daoMember2.svg";
import { updateHolder } from "state/proposal/reducer";
import { useWeb3React } from "@web3-react/core";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk";
import { ethers } from "ethers";

const AddNewSafe = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const invitedMembers = useAppSelector((state) => state.flow.invitedGang);
  const [myowers, setMyOwers] = useState<InviteGangType[]>(invitedMembers);
  const [showContinue, setshowContinue] = useState<boolean>(true);
  const [ownerSelected, setOwnerSelected] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const safeName = useAppSelector((state) => state.flow.safeName);
  const selectedOwners = useAppSelector((state) => state.flow.owners);
  const Threshold = useAppSelector((state) => state.flow.threshold);

  const handleCheck = (event: any) => {
    const index = event.target.value;
    const newData: InviteGangType = myowers[index];
    const newMember = [...selectedOwners, newData];
    dispatch(updateOwners(newMember));
  };

  const handleSafeName = () => {
    let terrors: any = {};
    if (!safeName) {
      terrors.safeName = " * safe Name is required";
    }
    if (_.isEmpty(terrors)) {
      setshowContinue(false);
    } else {
      setErrors(terrors);
    }
  };

  const { provider } = useWeb3React();

  const deployNewSafe = async () => {
    const safeOwner = provider?.getSigner(0);

    const ethAdapter = new EthersAdapter({
      ethers,
      signer: safeOwner as any,
    });
    const safeFactory = await SafeFactory.create({
      ethAdapter,
    });
    const owners: any = selectedOwners.map((result) => {
      return result.address;
    });
    console.log(owners);
    const threshold: number = parseInt(Threshold.toString());
    const safeAccountConfig: SafeAccountConfig = {
      owners,
      threshold,
    };

    await safeFactory
      .deploySafe({ safeAccountConfig })
      .then(async (tx) => {
        dispatch(updateHolder(tx.getAddress() as string));
        console.log(tx.getAddress);
        navigate("/success");
      })
      .catch((err) => {
        console.log("An error occured while creating safe", err);
      });
  };

  const AddOwners = () => {
    return (
      <>
        <div className="divider">
          <hr />
        </div>
        <div className="addOwner">
          <div className="inputFieldTitle">Select Owners</div>
          <div className="ownerArea">
            {invitedMembers.map((result: any, index: any) => {
              return (
                <>
                  <div key={index} className="owner">
                    <div className="avatarName">
                      <img src={daoMember2} alt={result.address} />
                      <p className="text">{result.name}</p>
                    </div>
                    <p className="text">
                      {result.address.slice(0, 18) +
                        "..." +
                        result.address.slice(-6)}
                    </p>
                    <Checkbox
                      value={index}
                      onChange={(event) => {
                        handleCheck(event);
                      }}
                    />
                  </div>
                </>
              );
            })}
            <div className="cardButton">
              <SimpleButton
                title="NEXT"
                height={40}
                bgColor="#C94B32"
                width={180}
                onClick={() => {
                  if (selectedOwners.length >= 1) {
                    setOwnerSelected(true);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  const SelectedOwners = () => {
    return (
      <>
        <div className="divider">
          <hr />
        </div>
        <div className="addOwner">
          <div className="inputFieldTitle">Owners</div>
          <div className="ownerArea">
            {selectedOwners.map((result: any, index: any) => {
              return (
                <>
                  <div key={index} className="owner">
                    <div className="avatarName">
                      <img src={daoMember2} alt={result.address} />
                      <p className="text">{result.name}</p>
                    </div>
                    <p className="text">
                      {result.address.slice(0, 18) +
                        "..." +
                        result.address.slice(-6)}
                    </p>
                  </div>
                </>
              );
            })}
          </div>
        </div>
        <SelectThreshold />
      </>
    );
  };

  const SelectThreshold = () => {
    return (
      <>
        <div className="divider">
          <hr />
        </div>
        <div className="centerCard">
          <div>
            <div className="thresholdText">
              Any transaction requires the confirmation of
            </div>
          </div>
          <div className="selectionArea">
            <div>
              <select
                name="chain"
                id="chain"
                className="dropdown"
                onChange={(e) => {
                  dispatch(updateThreshold(e.target.value));
                }}
              >
                {selectedOwners.map((result: any, index: any) => {
                  return <option value={index + 1}>{index + 1}</option>;
                })}
              </select>
            </div>
            <div className="thresholdCount">
              of {selectedOwners.length} owner(s)
            </div>
          </div>
        </div>
        <div className="footerText">
          By continuing you consent to the terms of use and privacy policy of
          Gnosis Safe
        </div>
        <div className="footerText">
          You’re about to create a new safe and will have to confirm a
          transaction with your curentry connected wallet.
          <span className="boldText">
            The creation will cost approximately 0.01256 GOR.
          </span>{" "}
          The exact amount will be teterminated by your wallet.
        </div>
        <div>
          <SimpleButton
            title="CREATE SAFE"
            bgColor="#C94B32"
            height={50}
            width={250}
            fontsize={20}
            onClick={deployNewSafe}
          />
        </div>
      </>
    );
  };

  useEffect(() => {
    console.log(Threshold);
  }, [Threshold]);

  return (
    <>
      <div className="StartSafe">
        <div className="headerText">3/3 DAO Treasury</div>
        <div className="buttonArea">
          <div>
            <SafeButton
              title="CREATE NEW SAFE"
              titleColor="#C94B32"
              bgColor="#FFFFFF"
              height={55}
              width={225}
              fontsize={20}
              fontweight={400}
            />
          </div>
          <div className="centerText">or</div>
          <div>
            <SafeButton
              title="ADD EXISTING SAFE"
              titleColor="#C94B32"
              bgColor="#FFFFFF"
              height={55}
              width={225}
              fontsize={20}
              fontweight={400}
            />
          </div>
        </div>
        <div className="divider">
          <hr />
        </div>
        <div className="centerCard">
          <div>
            <div className="inputFieldTitle">Safe Name</div>
            <SimpleInputField
              className="inputField"
              height={50}
              width={460}
              placeholder="Pied Piper"
              value={safeName}
              onchange={(e) => {
                dispatch(updatesafeName(e.target.value));
              }}
              isInvalid={errors.safeName}
            />
          </div>
        </div>
        {showContinue ? (
          <>
            <div className="continueButton">
              <SimpleButton
                title="CONTINUE"
                height={50}
                width={250}
                fontsize={20}
                onClick={handleSafeName}
                bgColor="#C94B32"
              />
            </div>
          </>
        ) : invitedMembers.length >= 1 ? (
          ownerSelected ? (
            <SelectedOwners />
          ) : (
            <AddOwners />
          )
        ) : (
          <SelectThreshold />
        )}
      </div>
    </>
  );
};

export default AddNewSafe;
