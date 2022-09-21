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
import coin from "../../assets/svg/coin.svg";
import axios from "axios";
import SimpleLoadButton from "UIpack/SimpleLoadButton";
import OutlineButton from "UIpack/OutlineButton";

const AddExistingSafe = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const safeAddress = useAppSelector((state) => state.flow.safeAddress);
  const safeName = useAppSelector((state) => state.flow.safeName);
  const selectedOwners = useAppSelector((state) => state.flow.owners);
  const [safeOwners, setSafeOwners] = useState<string[]>([]);
  const [tokens, setTokens] = useState<any>([]);
  const [errors, setErrors] = useState<any>({});
  const [balance, setBalance] = useState<string>("");
  const [isLoading, setisLoading] = useState<boolean>(false);

  const { provider } = useWeb3React();

  const UseExistingSafe = async () => {
    setisLoading(true);
    const safeSDK = await ImportSafe(provider, safeAddress);
    dispatch(updateHolder(safeSDK.getAddress() as string));
    const safeOwners: string[] = await safeSDK.getOwners();
    setSafeOwners(safeOwners);
    const bal = await safeSDK.getBalance();
    setBalance(bal.toString());
    await getTokens(safeAddress);
    setisLoading(false);
  };
  const getTokens = async (safeAddress: string) => {
    axios
      .get(
        `https://safe-transaction.goerli.gnosis.io/api/v1/safes/${safeAddress}/balances/usd/`
      )
      .then((tokens: any) => {
        setTokens(tokens.data);
      });
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
          <div className="centerText">or</div>
          <div>
            <SafeButton
              title="ADD EXISTING SAFE"
              titleColor="#C94B32"
              bgColor="#FFFFFF"
              height={58}
              width={228}
              fontsize={20}
              fontweight={400}
              disabled={false}
            />
          </div>
        </div>
        <div className="divider">
          <hr />
        </div>
        {safeOwners.length >= 1 ? (
          <>
            <div className="safeinfo">
              <div className="safedata">
                <div className="safeName">
                  {safeName ? (
                    safeName
                  ) : (
                    <SimpleInputField
                      className="inputField"
                      height={30}
                      width={151}
                      placeholder="Safe Name"
                      value={safeName}
                      onchange={(e) => {
                        dispatch(updatesafeName(e.target.value));
                      }}
                    />
                  )}
                </div>
                <div className="safeDivider">
                  <hr />
                </div>
                <div className="address">
                  {safeAddress.slice(0, 18) + "..." + safeAddress.slice(-6)}
                </div>
              </div>
              {/* assets */}
              <div className="safedata">
                <div className="balance">
                  <img src={coin} alt="coin" />
                  <div className="safeBalance">
                    $ {tokens.length >= 1 && tokens[0].fiatBalance}
                  </div>
                </div>
                <div className="tokenAssets">
                  {tokens.length > 1 ? (
                    <>
                      <div className="balance">
                        <div className="asset">
                          <div className="safeName">
                            {tokens[1].token.symbol.slice(0, 1) +
                              tokens[1].token.symbol.slice(-1)}
                          </div>
                        </div>
                        <div className="amount">
                          {tokens[1].balance / 10 ** 18}
                        </div>
                      </div>
                    </>
                  ) : null}
                  {tokens.length === 3 ? (
                    <>
                      <div className="balance">
                        <div className="asset">
                          <div className="safeName">
                            {tokens[2].token.symbol.slice(0, 1) +
                              tokens[2].token.symbol.slice(-1)}
                          </div>
                        </div>
                        <div className="amount">
                          {tokens[2].balance / 10 ** 18}
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="safeOwners">
                <div className="ownerCount">{safeOwners.length} Owners :</div>
                <div className="ownerList">
                  {safeOwners.map((result: any, index: any) => {
                    return (
                      <>
                        <div className="safeowner" key={index}>
                          <SimpleInputField
                            className="inputField"
                            height={30}
                            width={151}
                            placeholder="Name"
                          />
                          <div className="address">
                            {result.slice(0, 18) + "..." + result.slice(-6)}
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
              <div className="footerText">
                By continuing you consent to the terms of use and privacy policy
                of Gnosis Safe
              </div>
              <div className="buttonArea">
                <div>
                  <OutlineButton
                    title="CHANGE SAFE"
                    borderColor="#C94B32"
                    bgColor="#FFFFFF"
                    height={55}
                    width={225}
                    fontsize={20}
                    fontweight={400}
                    onClick={() => {
                      setSafeOwners([]);
                    }}
                  />
                </div>
                <div>
                  <SimpleButton
                    className="button"
                    title="ADD SAFE"
                    bgColor="#C94B32"
                    height={55}
                    width={225}
                    fontsize={20}
                    fontweight={400}
                    onClick={() => {
                      navigate("/success");
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="centerCard">
              <div className="chainDetails">
                <div>
                  <div className="inputFieldTitle">
                    Select the network on which the Safe was created
                  </div>
                </div>
                <select name="chain" id="chain" className="drop">
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
                    name="safeName"
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
                    name="safeAddress"
                    onchange={(e) => {
                      dispatch(updateSafeAddress(e.target.value));
                    }}
                    isInvalid={errors.issafeAddress}
                  />
                </div>
              </div>
            </div>
            <div className="findSafe">
              <SimpleLoadButton
                title="FIND SAFE"
                height={50}
                width={160}
                fontsize={20}
                fontweight={400}
                onClick={handleClick}
                bgColor={
                  isAddressValid(safeAddress)
                    ? "#C94B32"
                    : "rgba(27, 43, 65, 0.2)"
                }
                condition={isLoading}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AddExistingSafe;
