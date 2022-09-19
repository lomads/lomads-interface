import React, { useEffect, useState } from "react";
import _ from "lodash";
import "../../styles/pages/AddExistingSafe.css";
import "../../styles/Global.css";
import SafeButton from "UIpack/SafeButton";
import SimpleInputField from "UIpack/SimpleInputField";
import SimpleButton from "UIpack/SimpleButton";
import { useNavigate } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { updateHolder } from "state/proposal/reducer";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { ImportSafe } from "connection/SafeCall";
import { updateSafeAddress, updatesafeName } from "state/flow/reducer";
import { ethers } from "ethers";
import AddressInputField from "UIpack/AddressInputField";

const AddExistingSafe = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const safeAddress = useAppSelector((state) => state.flow.safeAddress);
  const safeName = useAppSelector((state) => state.flow.safeName);
  const [errors, setErrors] = useState<any>({});

  const { provider } = useWeb3React();

  const UseExistingSafe = async () => {
    const safeSDK = await ImportSafe(provider, safeAddress);
    dispatch(updateHolder(safeSDK.getAddress() as string));
    navigate("/success");
  };

  const isAddressValid = (holderAddress: string) => {
    const isValid: boolean = ethers.utils.isAddress(holderAddress);
    return isValid;
  };

  useEffect(() => {
    isAddressValid(safeAddress);
  }, [safeAddress]);

  const handleClick = () => {
    let terrors: any = {};
    if (!isAddressValid(safeAddress)) {
      terrors.issafeAddress = " * Safe Address is not valid.";
    }
    if (_.isEmpty(terrors)) {
      UseExistingSafe();
    } else {
      setErrors(terrors);
    }
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
            <div>
              <div className="inputFieldTitle">Name Your DAO</div>
            </div>
            <select name="chain" id="chain" className="dropdown">
              <option value="polygon">Polygon Mumbai</option>
              <option value="goerli">Goerli</option>
            </select>
          </div>
          <div className="inputArea">
            <div>
              <div>
                <div className="inputFieldTitle">Safe Name</div>
              </div>
              <SimpleInputField
                className="inputField"
                height={50}
                width={150}
                placeholder="Pied Piper"
                value={safeName}
                onchange={(e) => {
                  dispatch(updatesafeName(e.target.value));
                }}
              />
            </div>
            <div>
              <div>
                <div className="inputFieldTitle">Safe Address</div>
              </div>
              <AddressInputField
                className="inputField"
                height={50}
                width={280}
                placeholder="0xbeee39"
                value={safeAddress}
                onchange={(e) => {
                  dispatch(updateSafeAddress(e.target.value));
                }}
                isInvalid={errors.issafeAddress}
              />
            </div>
          </div>
        </div>
        <div className="findSafe">
          <SimpleButton
            title="FIND SAFE"
            height={50}
            width={160}
            fontsize={20}
            fontweight={400}
            onClick={handleClick}
            bgColor="#C94B32"
          />
        </div>
      </div>
    </>
  );
};

export default AddExistingSafe;
