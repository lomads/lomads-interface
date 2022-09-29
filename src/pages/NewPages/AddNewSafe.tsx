import React, { useEffect, useState, useRef } from "react";
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
  updateSafeAddress,
  updatesafeName,
  updateThreshold,
  updateTotalMembers,
  resetCreateDAOLoader
} from "state/flow/reducer";
import daoMember2 from "../../assets/svg/daoMember2.svg";
import { updateHolder } from "state/proposal/reducer";
import { useWeb3React } from "@web3-react/core";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk";
import { ethers } from "ethers";
import SimpleLoadButton from "UIpack/SimpleLoadButton";
import { createDAO } from '../../state/flow/actions';

const AddNewSafe = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { provider, account } = useWeb3React();
  const invitedMembers = useAppSelector((state) => state.flow.invitedGang);
  const [myowers, setMyOwers] = useState<InviteGangType[]>(invitedMembers);
  const [showContinue, setshowContinue] = useState<boolean>(true);
  const [ownerSelected, setOwnerSelected] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setisLoading] = useState<boolean>(false);
  const safeName = useAppSelector((state) => state.flow.safeName);
  const selectedOwners = useAppSelector((state) => state.flow.owners);
  const safeAddress = useAppSelector((state) => state.flow.safeAddress);
  const createDAOLoading = useAppSelector((state) => state.flow.createDAOLoading);
  const flow = useAppSelector((state) => state.flow);
  let Myvalue = useRef<Array<InviteGangType>>([
    {
      name: "creator",
      address: account as string,
    },
  ]);

  let thresholdValue = useRef<number>(1);

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    // const index: number = parseInt(event.target.value);
    const checked = event.target.checked;
    if (checked) {
      const index = myowers.findIndex(
        (result: InviteGangType) => result.address === event.target.value
      );
      const newData: InviteGangType = myowers[index];
      Myvalue.current.push(newData);
    } else {
      const refIndex = Myvalue.current.findIndex(
        (result: InviteGangType) => result.address === event.target.value
      );
      Myvalue.current.splice(refIndex, 1);
    }
  };

  useEffect(() => {
    if(createDAOLoading == false){
      setisLoading(false)
      resetCreateDAOLoader()
      return navigate("/success");
    }
    if(createDAOLoading == true)
      setisLoading(true)
  }, [createDAOLoading])

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

  const deployNewSafe = async () => {
    setisLoading(true);
    dispatch(updateOwners(Myvalue.current));
    const safeOwner = provider?.getSigner(0);

    const ethAdapter = new EthersAdapter({
      ethers,
      signer: safeOwner as any,
    });
    const safeFactory = await SafeFactory.create({
      ethAdapter,
    });
    const owners: any = Myvalue.current.map((result) => {
      return result.address;
    });
    const threshold: number = thresholdValue.current;
    const safeAccountConfig: SafeAccountConfig = {
      owners,
      threshold,
    };

    await safeFactory
      .deploySafe({ safeAccountConfig })
      .then(async (tx) => {
        dispatch(updateSafeAddress(tx.getAddress() as string));
        const totalAddresses = [...invitedMembers, ...Myvalue.current];
        const value = totalAddresses.reduce((final: any, current: any) => {
          let object = final.find(
            (item: any) => item.address === current.address
          );
          if (object) {
            return final;
          }
          return final.concat([current]);
        }, []);
        dispatch(updateTotalMembers(value));
        //setisLoading(false);
        const payload: any = {
          contractAddress: '',
          name: flow.daoName,
          url: flow.daoAddress,
          image: null,
          members: value,
          safe: {
            name: safeName,
            address: tx.getAddress(),
            owners: owners,
          }
        }
        dispatch(createDAO(payload))
      })
      .catch((err) => {
        console.log("An error occured while creating safe", err);
        setisLoading(false);
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
            <div className="owner">
              <div className="avatarName">
                <img src={daoMember2} alt={Myvalue.current[0].address} />
                <p className="nameText">{Myvalue.current[0].name}</p>
              </div>
              <p className="addressText">
                {Myvalue.current[0].address.slice(0, 18) +
                  "..." +
                  Myvalue.current[0].address.slice(-6)}
              </p>
              <Checkbox
                size="lg"
                colorScheme="orange"
                name="owner"
                defaultChecked={true}
                disabled={true}
              />
            </div>
            {invitedMembers.map((result: any, index: any) => {
              return (
                <>
                  <div key={index} className="owner">
                    <div className="avatarName">
                      <img src={daoMember2} alt={result.address} />
                      <p className="nameText">{result.name}</p>
                    </div>
                    <p className="text">
                      {result.address.slice(0, 18) +
                        "..." +
                        result.address.slice(-6)}
                    </p>
                    <Checkbox
                      size="lg"
                      colorScheme="orange"
                      id={index}
                      name="owner"
                      value={result.address}
                      onChange={(event) => handleCheck(event)}
                    />
                  </div>
                </>
              );
            })}
            <div className="cardButton">
              <SimpleButton
                className="button"
                title="NEXT"
                height={40}
                bgColor="#C94B32"
                width={180}
                onClick={() => {
                  if (Myvalue.current.length >= 1) {
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
            {Myvalue.current.map((result: any, index: any) => {
              return (
                <>
                  <div key={index} className="owner">
                    <div className="avatarName">
                      <img src={daoMember2} alt={result.address} />
                      <p className="nameText">{result.name}</p>
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
                onChange={(event) => {
                  thresholdValue.current = parseInt(event.target.value);
                }}
              >
                {Myvalue.current.map((result: any, index: any) => {
                  return <option value={index + 1}>{index + 1}</option>;
                })}
              </select>
            </div>
            <div className="thresholdCount">
              of {Myvalue.current.length} owner(s)
            </div>
          </div>
        </div>
        <div className="footer">
          By continuing you consent to the terms of use and privacy policy of
          Gnosis Safe
        </div>
        <div className="footer">
          You’re about to create a new safe and will have to confirm a
          transaction with your curentry connected wallet.
          <span className="boldText">
            The creation will cost approximately 0.01256 GOR.
          </span>
          The exact amount will be teterminated by your wallet.
        </div>
        <div className="createButton">
          <SimpleLoadButton
            title="CREATE SAFE"
            bgColor="#C94B32"
            height={50}
            width={250}
            fontsize={20}
            onClick={deployNewSafe}
            condition={isLoading}
          />
        </div>
      </>
    );
  };

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
              height={58}
              width={228}
              fontsize={20}
              fontweight={400}
              disabled={false}
            />
          </div>
          <div className="centerText">or</div>
          <div>
            <SafeButton
              title="ADD EXISTING SAFE"
              titleColor="rgba(201, 75, 50, 0.6)"
              bgColor="#FFFFFF"
              height={58}
              width={228}
              fontsize={20}
              fontweight={400}
              disabled={true}
              opacity="0.6"
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
                className="button"
                title="CONTINUE"
                height={50}
                width={250}
                fontsize={20}
                onClick={handleSafeName}
                bgColor={safeName ? "#C94B32" : "rgba(27, 43, 65, 0.2)"}
                shadow={
                  safeName
                    ? "3px 5px 20px rgba(27, 43, 65, 0.12), 0px 0px 20px rgba(201, 75, 50, 0.18)"
                    : undefined
                }
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
          <SelectedOwners />
        )}
      </div>
    </>
  );
};

export default AddNewSafe;
