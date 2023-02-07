import "../../styles/pages/MintPassToken.css";
import { get as _get, find as _find } from "lodash";
import FrameRed from "../../assets/svg/FrameRed.svg";
import coin from "../../assets/svg/coin.svg";
import lomadsLogo from "../../assets/svg/lomadsLogoExpandGray.svg";
import frame2 from "../../assets/svg/Frame-2.svg";
import { AiOutlineMail } from "react-icons/ai";
import { FaTelegramPlane } from "react-icons/fa";
import { BsDiscord } from "react-icons/bs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { estimateGas, mintSBTtoken, useSBTStats } from "hooks/SBT/sbt";
import { useNavigate, useParams } from "react-router-dom";
import { useSBTContract } from "hooks/useContract";
import { APIgetContract, APInewSBTtoken } from "hooks/SBT/sbtAPI";
import { toast, ToastContainer } from "react-toastify";
import SimpleLoadButton from "UIpack/SimpleLoadButton";
import { useAppSelector, useAppDispatch } from "state/hooks";
import { setDAO } from "state/dashboard/reducer";
import {
  getCurrentUser,
  getDao,
  loadDao,
  updateCurrentUser,
} from "state/dashboard/actions";
import Footer from "components/Footer";
import { addDaoMember } from "state/dashboard/actions";
import axiosHttp from "api";
import SideBar from "../NewPages/DashBoard/SideBar";
import useRole from "hooks/useRole";
import useEncryptDecrypt from "hooks/useEncryptDecrypt";
import { useDropzone } from "react-dropzone";
import ReactS3Uploader from "components/ReactS3Uploader";
import { nanoid } from "@reduxjs/toolkit";
import { LeapFrog } from "@uiball/loaders";
import uploadIcon from "../../assets/svg/ico-upload.svg";
import { Divider } from "@chakra-ui/react";
import { ethers } from "ethers";
import { supportedAssets } from "utils/constants";
import axios from "axios";

const MintPassToken = () => {
  /// temporary solution until we don't have specific routes for DAO, contract address will be passed into the url
  const { contractAddr, daoURL } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  /// 1 : no whitelist
  /// 2 : whitelist user is in
  /// 3 : whitelist user isnt in
  const [showNavBar, setShowNavBar] = useState(false);
  const [tab, setTab] = useState(3);
  const [update, setUpdate] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [contract, setContract] = useState(null);
  const [nameError, setNameError] = useState(false);
  const [discordError, setDiscordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [telegramError, setTelegramError] = useState(false);
  const [decrypted, setDecrypted] = useState(null);
  const { account, chainId, provider } = useWeb3React();
  const { user, DAO, DAOLoading } = useAppSelector((state) => state.dashboard);
  const [priceUsd, setpriceUsd] = useState("");
  const [gasUsd, setgasUsd] = useState("");
  const [gas, setgas] = useState("");
  const { myRole } = useRole(DAO, account);
  const {
    needWhitelist,
    isWhitelisted,
    balanceOf,
    contractName,
    currentIndex,
  } = useSBTStats(
    provider,
    account,
    update,
    contractAddr ? contractAddr : "",
    chainId
  );
  const sbtContract = useSBTContract(contractAddr ? contractAddr : null);
  const { encryptMessage, decryptMessage } = useEncryptDecrypt();

  const showSideBar = (_choice) => {
    setShowNavBar(_choice);
  };

  const [image, setImage] = useState(null);
  const [droppedfiles, setDroppedfiles] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [referralCode, setreferralCode] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    setDroppedfiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  const onUploadProgress = (progress, message, file) => {};

  const onUploadError = (error) => {
    setDroppedfiles([]);
    setUploadLoading(false);
  };

  const onUploadStart = (file, next) => {
    setUploadLoading(true);
    return next(file);
  };

  const onFinish = (finish) => {
    setDroppedfiles([]);
    setUploadLoading(false);
    var arr = finish.signedUrl.split("?");
    console.log(arr);
    setImage(arr[0]);
  };

  const getSignedUploadUrl = (file, callback) => {
    console.log(file);
    const filename = `SBT/${nanoid(32)}.${file.type.split("/")[1]}`;
    return axiosHttp
      .post(`utility/upload-url`, { key: filename, mime: file.type })
      .then((res) => callback(res.data));
  };

  // useEffect(() => {
  //     if (account && chainId && user) {
  //         handleGetPublicKey();
  //     }
  // }, [account, chainId, user]);

  // const handleGetPublicKey = async () => {
  //     // Key is returned as base64
  //     const keyB64 = await window.ethereum.request({
  //         method: 'eth_getEncryptionPublicKey',
  //         params: [account],
  //     });
  //     const publicKey = Buffer.from(keyB64, 'base64');
  //     setPublicKey(publicKey);
  // }

  useEffect(() => {
    const calculatePriceAndGasFees = async () => {
      if (contract?.mintPrice) {
        const request = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${supportedAssets[chainId].id}`
        );

        const price = await request.data.market_data?.current_price["usd"];

        const estimateTransactionCost = await estimateGas(
          sbtContract,
          account,
          ethers.utils.parseEther(contract?.mintPrice),
          referralCode
        );

        const estimateinUsd =
          parseFloat(
            ethers.utils.formatUnits(estimateTransactionCost.toString(), "gwei")
          ) * price;

        const mintPriceinUsd = parseFloat(contract?.mintPrice) * price;

        setpriceUsd(mintPriceinUsd.toString());
        setgasUsd(estimateinUsd.toString());
        setgas(
          ethers.utils.formatUnits(estimateTransactionCost.toString(), "gwei")
        );
      }
    };

    calculatePriceAndGasFees();
  }, [chainId, account, contract?.mintPrice]);

  useEffect(() => {
    if (account && chainId) dispatch(loadDao({ chainId }));
  }, [chainId, account]);

  useEffect(() => {
    if (
      account &&
      chainId &&
      (!user || (user && user.wallet.toLowerCase() !== account.toLowerCase()))
    ) {
      dispatch(getCurrentUser({}));
    }
  }, [account, chainId, user]);

  const myMetadata = useMemo(() => {
    return _find(_get(DAO, "sbt.metadata", []), (m) => {
      return _find(m.attributes, (a) => a.value === account);
    });
  }, [DAO?.sbt, account]);

  useEffect(() => {
    if ((!DAO || (DAO && DAO.url !== daoURL)) && !DAOLoading)
      dispatch(getDao(daoURL));
  }, [daoURL, DAO, DAOLoading]);

  const findTraitValue = useCallback(
    (attr) => {
      if (DAO && DAO.sbt) {
        if (myMetadata && myMetadata.attributes) {
          for (let index = 0; index < myMetadata.attributes.length; index++) {
            const attribute = myMetadata.attributes[index];
            if (attr === attribute.trait_type.toLowerCase()) {
              if (decrypted) return decrypted[attr];
              //return attribute?.value;
            }
          }
          return null;
        }
      }
    },
    [myMetadata, decrypted]
  );

  const getPersonalDetails = useCallback(
    (attr) => {
      if (DAO && DAO.sbt) {
        if (myMetadata && myMetadata.attributes) {
          for (let index = 0; index < myMetadata.attributes.length; index++) {
            const attribute = myMetadata.attributes[index];
            if (attr === attribute.trait_type.toLowerCase()) {
              return attribute?.value;
            }
          }
          return null;
        }
      }
    },
    [myMetadata]
  );

  useEffect(() => {
    if (needWhitelist) {
      if (isWhitelisted) {
        setTab(2);
      } else {
        setTab(3);
      }
    } else {
      setTab(1);
    }
  }, [account, contractName, needWhitelist]);

  useEffect(() => {
    const fetch = async () => {
      const req = await APIgetContract(contractAddr);
      console.log("contract : ", req.data);
      setContract(req.data);
    };
    fetch();
  }, []);

  const renderSocialLogo = (item) => {
    if (item == "email") {
      return <AiOutlineMail color='#C94B32' size={32} />;
    } else if (item == "discord") {
      return <BsDiscord color='#C94B32' size={32} />;
    }
    return <FaTelegramPlane color='#C94B32' size={32} />;
  };

  const handleResetError = (item) => {
    if (item === "email") {
      setEmailError(false);
    } else if (item === "discord") {
      setDiscordError(false);
    } else {
      setTelegramError(false);
    }
  };

  const isUpdate = useMemo(() => {
    if (
      contractName !== "" &&
      DAO &&
      DAO.sbt &&
      DAO.sbt &&
      account &&
      balanceOf
    ) {
      console.log("balanceOF", parseInt(balanceOf._hex, 16));
      if (parseInt(balanceOf._hex, 16) === 1) {
        return true;
      }
    }
    return false;
  }, [contractAddr, balanceOf, DAO]);

  useEffect(() => {
    console.log("DAO", DAO);
    if (isUpdate && DAO && myMetadata && account) {
      const personalDetails = getPersonalDetails(
        "Personal Details".toLowerCase()
      );
      if (personalDetails) {
        decryptMessage(personalDetails)
          .then((res) => setDecrypted(res))
          .catch((e) => console.log(e));
      }
    }
  }, [isUpdate]);

  const updateMetadata = async () => {
    const userName = document.querySelector("#user-name");
    const userMail = document.querySelector("#user-email");
    const userDiscord = document.querySelector("#user-discord");
    const userTG = document.querySelector("#user-telegram");

    if (userName.value === "") {
      setNameError(true);
      return;
    } else if (
      contract.contactDetail.includes("email") &&
      userMail.value === ""
    ) {
      setEmailError(true);
      return;
    } else if (
      contract.contactDetail.includes("discord") &&
      userDiscord.value === ""
    ) {
      setDiscordError(true);
      return;
    } else if (
      contract.contactDetail.includes("telegram") &&
      userTG.value === ""
    ) {
      setTelegramError(true);
      return;
    } else {
      const msg = await encryptMessage(
        JSON.stringify({
          email: _get(userMail, "value", ""),
          discord: _get(userDiscord, "value", ""),
          telegram: _get(userTG, "value", ""),
        })
      );
      let payload = {
        attributes: [...myMetadata.attributes].map((attribute) => {
          if (attribute.trait_type === "Personal Details") {
            return { ...attribute, value: msg };
          } else if (attribute.trait_type === "Email") {
            return {
              ...attribute,
              value:
                _get(userMail, "value", "") && userMail.value !== ""
                  ? true
                  : null,
            };
          } else if (attribute.trait_type === "Discord") {
            return {
              ...attribute,
              value:
                _get(userDiscord, "value", "") && userDiscord.value !== ""
                  ? true
                  : null,
            };
          } else if (attribute.trait_type === "Telegram") {
            return {
              ...attribute,
              value:
                _get(userTG, "value", "") && userTG.value !== "" ? true : null,
            };
          } else {
            return attribute;
          }
        }),
      };
      axiosHttp
        .patch(`metadata/${_get(DAO, "sbt._id")}`, payload)
        .then(async (res) => {
          if (userDiscord.value) {
            await axiosHttp.patch(
              `dao/${_get(DAO, "url", "")}/update-user-discord`,
              {
                discordId: userDiscord.value || null,
                userId: _get(user, "_id", ""),
              }
            );
          }
          dispatch(getDao(_get(DAO, "url", "")));
          setTimeout(() => navigate(`/${DAO.url}`), 1500);
        })
        .catch((e) => console.log(e));
    }
  };

  const mintSBT = async (shouldMint = true) => {
    const userName = document.querySelector("#user-name");
    const userMail = document.querySelector("#user-email");
    const userDiscord = document.querySelector("#user-discord");
    const userTG = document.querySelector("#user-telegram");

    if (userName.value === "") {
      setNameError(true);
      return;
    } else if (
      contract.contactDetail.includes("email") &&
      userMail.value === ""
    ) {
      setEmailError(true);
      return;
    } else if (
      contract.contactDetail.includes("discord") &&
      userDiscord.value === ""
    ) {
      setDiscordError(true);
      return;
    } else if (
      contract.contactDetail.includes("telegram") &&
      userTG.value === ""
    ) {
      setTelegramError(true);
      return;
    } else {
      console.log("address", account, sbtContract);
      if (account && sbtContract) {
        try {
          console.log(
            "details",
            _get(userMail, "value", ""),
            _get(userDiscord, "value", "")
            // userDiscord?.value,
            // userTG?.value
          );
          setLoading(true);
          const sbtId =
            parseFloat(currentIndex.toString()) === 0
              ? "1"
              : currentIndex.toString();
          let tx = null;
          if (shouldMint) console.log("mintPrice", contract);
          tx = await mintSBTtoken(
            sbtContract,
            account,
            ethers.utils.parseEther(contract?.mintPrice),
            referralCode
          );
          console.log(tx);
          if (tx?.error) {
            setLoading(false);
            console.log(`${tx.error.message}`);
            //toast.error(`${tx.error.message}`);
            toast.error(`Something went wrong. Please try again`);
            return;
          } else {
            const msg = await encryptMessage(
              JSON.stringify({
                email: _get(userMail, "value", ""),
                discord: _get(userDiscord, "value", ""),
                telegram: _get(userTG, "value", ""),
              })
            );
            const metadataJSON = {
              id: sbtId,
              daoUrl: DAO.url,
              description: "SBT TOKEN",
              name: userName.value,
              image: _get(DAO, "sbt.image", ""),
              attributes: [
                {
                  trait_type: "Wallet Address/ENS Domain",
                  value: account,
                },
                {
                  trait_type: "Personal Details",
                  value: msg,
                },
                {
                  trait_type: "Email",
                  value:
                    _get(userMail, "value", "") && userMail.value !== ""
                      ? true
                      : null,
                },
                {
                  trait_type: "Discord",
                  value:
                    _get(userDiscord, "value", "") && userDiscord.value !== ""
                      ? true
                      : null,
                },
                {
                  trait_type: "Telegram",
                  value:
                    _get(userTG, "value", "") && userTG.value !== ""
                      ? true
                      : null,
                },
              ],
              contract: contractAddr,
            };
            console.log("metadataJSON : ", metadataJSON);

            const req = await APInewSBTtoken(metadataJSON);
            if (req) {
              console.log(
                "updating discord",
                `${_get(DAO, "url", "")}`,
                userDiscord,
                user
              );
              await axiosHttp.patch(
                `dao/${_get(DAO, "url", "")}/update-user-discord`,
                {
                  discordId: userDiscord.value || null,
                  userId: _get(user, "_id", ""),
                }
              );
              console.log("here1", userName.value);
              dispatch(updateCurrentUser({ name: userName.value }));
              dispatch(
                addDaoMember({
                  url: DAO?.url,
                  payload: {
                    name: "",
                    address: account,
                    role: myRole ? myRole : "role4",
                  },
                })
              );
              dispatch(getDao(DAO.url));
              setLoading(false);
              //toast.success("SBT mint successfuly !");
              setTimeout(() => navigate(`/${DAO.url}`), 1500);
              return;
            }
            return;
          }
        } catch (e) {
          console.log(e);
          setLoading(false);
        }
      }
      toast.error("Please connect your account before !");
      return;
    }
  };
  // console.log("userName", userName);
  return (
    <>
      <div className='mintPassToken-container'>
        {tab === 1 || tab === 2 ? (
          <div className='mintPassToken-body'>
            <img
              style={{ marginBottom: "50px" }}
              src={FrameRed}
              alt='frame-icon'
            />
            {/* {tab === 1 ? (
              <p className='heading-text'>
                To join the organisation mint your pass token
              </p>
            ) : null} */}
            {tab === 2 ? (
              <>
                <p className='heading-text' style={{ marginBottom: 0 }}>
                  You are whitelisted
                </p>
                <p className='heading-text'>
                  To join the organisation mint your pass token
                </p>
              </>
            ) : null}

            {/* Token img and name */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <div>
                <div className='tokenName-box'>
                  <img src={coin} alt='asset' />
                  <p>{contractName}</p>
                </div>

                {/* If open for all --- take name as user input */}

                <div className='image-picker-container'>
                  {image ? (
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <div
                        onClick={() => setImage(null)}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          style={{
                            width: 18,
                            height: 18,
                            position: "absolute",
                            right: 8,
                            top: 8,
                            opacity: 0.7,
                          }}
                          src={require("../../assets/images/close.png")}
                        />
                      </div>
                      <img
                        src={image}
                        alt='selected-token-icon'
                        className='selected-img'
                      />
                    </div>
                  ) : (
                    <div {...getRootProps()}>
                      <ReactS3Uploader
                        droppedfiles={droppedfiles}
                        getSignedUrl={getSignedUploadUrl}
                        accept='image/png,image/jpeg,image/jpg'
                        className={{ display: "none" }}
                        onProgress={onUploadProgress}
                        onError={onUploadError}
                        preprocess={onUploadStart}
                        onFinish={onFinish}
                        multiple
                        uploadRequestHeaders={{}}
                        contentDisposition='auto'
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        {uploadLoading ? (
                          <LeapFrog size={24} color='#C94B32' />
                        ) : (
                          <>
                            <img src={uploadIcon} alt='upload-icon' />
                            <p>
                              Choose <br /> or drag an image
                            </p>
                            <span>maximum size 2mb</span>
                          </>
                        )}
                      </div>
                      <input {...getInputProps()} />
                    </div>
                  )}
                </div>

                <div className='contact-box'>
                  <div>
                    <hr
                      style={{
                        color: "#E85C3C",
                        width: "100%",
                      }}
                    />
                    <div className='summary-item'>
                      <p>SBT Price</p>
                      <div>
                        <p>
                          {contract?.mintPrice}{" "}
                          {supportedAssets[chainId].symbol}
                        </p>
                        <p
                          style={{
                            color: "rgba(27, 45, 65, 0.2)",
                            textAlign: "end",
                          }}
                        >
                          ${parseFloat(priceUsd).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className='summary-item'>
                      <p>Gas Fees</p>
                      <div>
                        <p>
                          {gas} {supportedAssets[chainId].symbol}
                        </p>
                        <p
                          style={{
                            color: "rgba(27, 45, 65, 0.2)",
                            textAlign: "end",
                          }}
                        >
                          ${parseFloat(gasUsd).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {/* <div className='summary-item'>
                      <p>Processing Fees</p>
                      <div>
                        <p>5 MATIC</p>
                        <p style={{ color: "rgba(27, 45, 65, 0.2)" }}>$4.755</p>
                      </div>
                    </div> */}

                    <hr
                      style={{
                        color: "#E85C3C",
                        width: "100%",
                      }}
                    />

                    <div className='summary-item'>
                      <p>Total</p>
                      <div>
                        <p>
                          {parseFloat(contract?.mintPrice) + parseFloat(gas)}{" "}
                          {supportedAssets[chainId].symbol}
                        </p>
                        <p
                          style={{
                            color: "rgba(27, 45, 65, 0.2)",
                            textAlign: "end",
                          }}
                        >
                          $
                          {(parseFloat(gasUsd) + parseFloat(priceUsd)).toFixed(
                            2
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                {tab === 1 ? (
                  <>
                    <div className='userName-box'>
                      <label>Your name</label>
                      <input
                        className='text-input'
                        id='user-name'
                        disabled={isUpdate}
                        defaultValue={_get(user, "name", null)}
                        placeholder='Enter your name'
                        onChange={() => setNameError(false)}
                      />
                      {nameError && (
                        <p className='error'>Please enter your name</p>
                      )}

                      <label style={{ marginTop: "15px" }}>Invite Code</label>
                      <input
                        className='text-input'
                        id='user-name'
                        disabled={isUpdate}
                        value={referralCode}
                        placeholder='Enter an Invite Code'
                        onChange={(e) => setreferralCode(e.target.value)}
                      />
                    </div>
                  </>
                ) : null}

                <div className='contact-box'>
                  <label>Contact details</label>
                  {contract
                    ? contract.contactDetail.map((item, index) => {
                        return (
                          <div className='contact-li' key={index}>
                            {renderSocialLogo(item)}
                            <div>
                              <input
                                type='text'
                                id={`user-${item.toLowerCase()}`}
                                disabled={
                                  isUpdate &&
                                  findTraitValue(item) &&
                                  findTraitValue(item) !== ""
                                }
                                defaultValue={findTraitValue(item)}
                                placeholder={`Enter your ${item}`}
                                onChange={() => handleResetError(item)}
                              />
                              {emailError && item === "email" && (
                                <p className='error'>Please enter your email</p>
                              )}
                              {discordError && item === "discord" && (
                                <p className='error'>
                                  Please enter your discord handle
                                </p>
                              )}
                              {telegramError && item === "telegram" && (
                                <p className='error'>
                                  Please enter your telegram handle
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })
                    : null}
                </div>

                <div style={{ display: "flex", justifyContent: "center" }}>
                  <SimpleLoadButton
                    title={isUpdate ? "UPDATE" : "MINT"}
                    height={50}
                    width={160}
                    fontsize={20}
                    fontweight={400}
                    onClick={() => {
                      if (isUpdate) {
                        if (myMetadata) updateMetadata();
                        else mintSBT(false);
                      } else mintSBT();
                    }}
                    bgColor={"#C94B32"}
                    condition={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className='mintPassToken-body'
            style={{
              height: "90vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 0,
            }}
          >
            <img src={frame2} alt='frame2' />
            <p className='notAllowedText'>
              This organisation allows membership only for <br />
              whitelisted individuals.{" "}
            </p>
            <span className='notAllowedText2'>
              Please contact the admin through email or other social channels.
            </span>
          </div>
        )}
        <div style={{ width: "80%" }}>
          <Footer theme='dark' />
        </div>
        {/* <div className="mintPassToken-footer">
                    <p style={{ fontStyle: 'italic' }}>Powered by <span>Gnosis Safe</span></p>
                    <div>
                        <p>Made possible by</p>
                        <img src={lomadsLogo} />
                    </div>
                </div> */}
      </div>
      <ToastContainer
        position='bottom-right'
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        theme='dark'
        rtl={false}
      />
      <SideBar
        name={_get(DAO, "name", "")}
        showSideBar={showSideBar}
        showNavBar={showNavBar}
      />
    </>
  );
};

export default MintPassToken;
