
import "../../styles/pages/MintPassToken.css";
import { get as _get } from 'lodash'
import FrameRed from '../../assets/svg/FrameRed.svg';
import coin from '../../assets/svg/coin.svg';
import lomadsLogo from '../../assets/svg/lomadsLogoExpandGray.svg'
import frame2 from '../../assets/svg/Frame-2.svg'
import { AiOutlineMail } from 'react-icons/ai';
import { FaTelegramPlane } from 'react-icons/fa';
import { BsDiscord } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { mintSBTtoken, useSBTStats } from "hooks/SBT/sbt";
import { useNavigate, useParams } from "react-router-dom";
import { useSBTContract } from "hooks/useContract";
import { APIgetContract, APInewSBTtoken } from "hooks/SBT/sbtAPI";
import { toast, ToastContainer } from "react-toastify";
import SimpleLoadButton from "UIpack/SimpleLoadButton";
import { useAppSelector, useAppDispatch } from "state/hooks";
import { setDAO } from "state/dashboard/reducer";

const MintPassToken = () => {
    /// temporary solution until we don't have specific routes for DAO, contract address will be passed into the url 
    const { contractAddr } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    /// 1 : no whitelist 
    /// 2 : whitelist user is in
    /// 3 : whitelist user isnt in
    const [tab, setTab] = useState(3);
    const [update, setUpdate] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [contract, setContract] = useState(null);
    const [nameError, setNameError] = useState(false);
    const [discordError, setDiscordError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [telegramError, setTelegramError] = useState(false);
    const { account, provider } = useWeb3React();
    const { DAO } = useAppSelector((state) => state.dashboard);
    const { needWhitelist, isWhitelisted, balanceOf, contractName, currentIndex } = useSBTStats(provider, account, update, contractAddr ? contractAddr : '');
    const sbtContract = useSBTContract(contractAddr ? contractAddr : null);
    useEffect(() => {

        if (needWhitelist) {
            if (isWhitelisted) {
                setTab(2);
            }
            else {
                setTab(3);
            }
        }
        else {
            setTab(1);
        }

    }, [account, contractName, needWhitelist])

    useEffect(() => {
        const fetch = async () => {
            const req = await APIgetContract(contractAddr);
            console.log("contract : ", req.data)
            setContract(req.data)
        }
        fetch();
    }, [])


    const renderSocialLogo = (item) => {

        if (item == "email") {
            return <AiOutlineMail color="#C94B32" size={32} />
        }
        else if (item == "discord") {
            return <BsDiscord color="#C94B32" size={32} />
        }
        return <FaTelegramPlane color="#C94B32" size={32} />
    }

    const handleResetError = (item) => {
        if (item === 'email') {
            setEmailError(false);
        }
        else if (item === 'discord') {
            setDiscordError(false);
        }
        else {
            setTelegramError(false);
        }
    }


    const mintSBT = async () => {
        const userName = document.querySelector("#user-name");
        const userMail = document.querySelector("#user-email");
        const userDiscord = document.querySelector("#user-discord");
        const userTG = document.querySelector("#user-telegram");

        if (userName.value === '') {
            setNameError(true);
            return;
        }
        else if (contract.contactDetail.includes('email') && userMail.value === '') {
            setEmailError(true);
            return;
        }
        else if (contract.contactDetail.includes('discord') && userDiscord.value === '') {
            setDiscordError(true);
            return;
        }
        else if (contract.contactDetail.includes('telegram') && userTG.value === '') {
            setTelegramError(true);
            return;
        }
        else {
            if (account && sbtContract) {
                setLoading(true);
                const sbtId = currentIndex.toString();
                const tx = await mintSBTtoken(sbtContract, account);
                if (tx.error) {
                    setLoading(false);
                    toast.error(`${tx.error.message}`);
                    return;
                }
                else {
                    const metadataJSON = {
                        id: sbtId,
                        daoUrl: DAO.url,
                        description: "SBT TOKEN",
                        name: userName.value,
                        image: 'url',
                        attributes: [{
                            trait_type: "Wallet Address/ENS Domain",
                            value: account
                        },
                        {
                            trait_type: "Email",
                            value: _get(userMail, 'value', '')
                        },
                        {
                            trait_type: "Discord",
                            value: _get(userDiscord, 'value', '')
                        },
                        {
                            trait_type: "Telegram",
                            value: _get(userTG, 'value', '')
                        }],
                        contract: contractAddr,
                    }

                    const req = await APInewSBTtoken(metadataJSON);
                    if (req) {
                        setLoading(false);
                        toast.success("SBT mint successfuly !");
                        dispatch(setDAO(req.data));
                        navigate(`/${DAO.url}`)
                        return;
                    }
                    return;
                }
            }
            toast.error("Please connect your account before !")
            return;
        }
    }
    return (
        <>
            <div className="mintPassToken-container">
                {
                    tab === 1 || tab === 2
                        ?
                        <div className="mintPassToken-body">
                            <img src={FrameRed} alt="frame-icon" />
                            {
                                tab === 1
                                    ?
                                    <p className="heading-text">To join the organisation mint your pass token</p>
                                    :
                                    null
                            }
                            {
                                tab === 2
                                    ?
                                    <>
                                        <p className="heading-text" style={{ marginBottom: 0 }}>You are whitelisted</p>
                                        <p className="heading-text">To join the organisation mint your pass token</p>
                                    </>
                                    :
                                    null
                            }

                            {/* Token img and name */}
                            <div className="tokenName-box">
                                <img src={coin} alt="asset" />
                                <p>{contractName}</p>
                            </div>

                            {/* If open for all --- take name as user input */}
                            {
                                tab === 1
                                    ?
                                    <div className="userName-box">
                                        <label>Your name</label>
                                        <input
                                            className="text-input"
                                            id="user-name"
                                            placeholder="Enter your name"
                                            onChange={() => setNameError(false)}
                                        />
                                        {nameError && <p className="error">Please enter your name</p>}
                                    </div>
                                    :
                                    null
                            }

                            <div className="contact-box">
                                <label>Contact details</label>
                                {
                                    contract ? (
                                        contract.contactDetail.map((item, index) => {
                                            return (
                                                <div className="contact-li" key={index}>
                                                    {renderSocialLogo(item)}
                                                    <div>
                                                        <input
                                                            type="text"
                                                            id={`user-${item}`}
                                                            placeholder={`Enter your ${item}`}
                                                            onChange={() => handleResetError(item)}
                                                        />
                                                        {
                                                            emailError && item === 'email' && <p className="error">Please enter your email</p>
                                                        }
                                                        {
                                                            discordError && item === 'discord' && <p className="error">Please enter your discord handle</p>
                                                        }
                                                        {
                                                            telegramError && item === 'telegram' && <p className="error">Please enter your telegram handle</p>
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )
                                        : (null)
                                }
                            </div>

                            <SimpleLoadButton
                                title="MINT"
                                height={50}
                                width={160}
                                fontsize={20}
                                fontweight={400}
                                onClick={mintSBT}
                                bgColor={"#C94B32"}
                                condition={isLoading}
                            />
                        </div>
                        :
                        <div className="mintPassToken-body" style={{ height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 0 }}>
                            <img src={frame2} alt="frame2" />
                            <p className="notAllowedText">This organisation allows membership only for <br />whitelisted individuals. </p>
                            <span className="notAllowedText2">Please contact the admin through email or other social channels.</span>
                        </div>
                }
                <div className="mintPassToken-footer">
                    <p style={{ fontStyle: 'italic' }}>Powered by <span>Gnosis Safe</span></p>
                    <div>
                        <p>Made possible by</p>
                        <img src={lomadsLogo} />
                    </div>
                </div>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                theme='dark'
                rtl={false} />
        </>
    )
}

export default MintPassToken;