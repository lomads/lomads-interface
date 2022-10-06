
import "../../styles/pages/MintPassToken.css";
import FrameRed from '../../assets/svg/FrameRed.svg';
import hklogo from '../../assets/svg/hklogo.svg';
import lomadsLogo from '../../assets/svg/lomadsLogoExpandGray.svg'
import frame2 from '../../assets/svg/Frame-2.svg'
import {AiOutlineMail} from 'react-icons/ai';
import {FaTelegramPlane} from 'react-icons/fa';
import { BsDiscord } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { mintSBTtoken, useSBTStats } from "hooks/SBT/sbt";
import { useParams } from "react-router-dom";
import { useSBTContract } from "hooks/useContract";
import { APIgetContract, APInewSBTtoken } from "hooks/SBT/sbtAPI";
import {toast, ToastContainer} from "react-toastify";
import SimpleLoadButton from "UIpack/SimpleLoadButton";

const MintPassToken = () => {
    /// temporary solution until we don't have specific routes for DAO, contract address will be passed into the url 
    const {contractAddr} = useParams();
    /// 1 : no whitelist 
    /// 2 : whitelist user is in
    /// 3 : whitelist user isnt in
    const [tab,setTab] = useState(3);
    const [update, setUpdate] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [contract, setContract] = useState(null)
    const {account, provider} = useWeb3React();
    const {needWhitelist, isWhitelisted, balanceOf, contractName, currentIndex} = useSBTStats(provider, account, update, contractAddr ? contractAddr : '');
    const sbtContract = useSBTContract(contractAddr ? contractAddr : null);
    
    

    useEffect(()=>{

        if (needWhitelist){
            if(isWhitelisted){
                setTab(2);
            }
            else{
                setTab(3);
            }
        }
        else {
            setTab(1);
        }
        
    }, [account, contractName, needWhitelist])

    useEffect(()=> {
        const fetch = async () => {
            const req = await APIgetContract(contractAddr);
            console.log(req.data)
            setContract(req.data.contract)
        } 
        fetch();
    }, [])


    const renderSocialLogo = (item) => {

        if (item == "email") {
            return <AiOutlineMail color="#C94B32" size={32}/>
        }
        else if (item == "discord") {
            return <BsDiscord  color="#C94B32" size={32} />
        }
        return <FaTelegramPlane  color="#C94B32" size={32}/>
    }


    const mintSBT = async () => {
        const userName = document.querySelector("#user-name");
        const userMail = document.querySelector("#user-email");
        const userDiscord = document.querySelector("#user-discord");
        const userTG = document.querySelector("#user-tg");

        if(account && sbtContract){
            setLoading(true);
            const sbtId = currentIndex.toString();
            const tx = await mintSBTtoken(sbtContract, account);
            console.log()
            if (tx.error){
                setLoading(false);
                toast.error(`${tx.error.message}`);
                return;
            }
            else {
                const metadataJSON = {
                    id : sbtId,
                    description: "SBT TOKEN",
                    name: userName.value,
                    image: 'url',
                    attributes : [{
                        trait_type : "Wallet Address/ENS Domain",
                        value : account
                    },
                    {
                        trait_type: "Email",
                        value: userMail.value
                    },
                    {
                        trait_type: "Discord",
                        value: userDiscord.value
                    },
                    {
                        trait_type: "Telegram",
                        value: userTG.value
                    }],
                    contract: contractAddr
                }

                const req = await APInewSBTtoken(metadataJSON);
                if (req) {
                    setLoading(false);
                    toast.success("SBT mint successfuly !");
                    return;
                }
                return;
            }
        }
        toast.error("Please connect your account before !")
        return;

    }
    return(
        <>
        <div className="mintPassToken-container">
            {
                tab === 1 || tab === 2
                ?
                <div className="mintPassToken-body">
                    <img src={FrameRed} alt="frame-icon"/>
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
                        <p className="heading-text" style={{marginBottom:0}}>You are whitelisted</p>
                        <p className="heading-text">To join the organisation mint your pass token</p>
                        </>
                        :
                        null
                    }

                    {/* Token img and name */}
                    <div className="tokenName-box">
                        <img src={hklogo} alt="hk-logo"/>
                        <p>{contractName}</p>
                    </div>

                    {/* If open for all --- take name as user input */}
                    {
                        tab === 1
                        ?
                        <div className="userName-box">
                            <label>Your name</label>
                            <input className="text-input" id="user-name" placeholder="Enter your name"/>
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
                                    <input type="text"  id={`user-${item}`}  placeholder={`Enter your ${item}`}/>
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
                <div className="mintPassToken-body" style={{height:'90vh',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:0}}>
                    <img src={frame2} alt="frame2"/>
                    <p className="notAllowedText">This organisation allows membership only for <br />whitelisted individuals. </p>
                    <span className="notAllowedText2">Please contact the admin through email or other social channels.</span>
                </div>
            }
            <div className="mintPassToken-footer">
                <p style={{fontStyle:'italic'}}>Powered by <span>Gnosis Safe</span></p>
                <div>
                    <p>Made possible by</p>
                    <img src={lomadsLogo}/>
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