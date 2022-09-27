
import "../../styles/pages/MintPassToken.css";
import DogIcon from '../../assets/svg/dogIcon.svg';
import FrameRed from '../../assets/svg/FrameRed.svg';
import hklogo from '../../assets/svg/hklogo.svg';
import lomadsLogo from '../../assets/svg/lomadsLogoExpandGray.svg'
import frame2 from '../../assets/svg/Frame-2.svg'

import {MdKeyboardArrowDown} from 'react-icons/md';
import {AiOutlineMail} from 'react-icons/ai';
import {FaTelegramPlane} from 'react-icons/fa';
import { BsDiscord } from "react-icons/bs";
import { useState } from "react";

const MintPassToken = () => {
    const [tab,setTab] = useState(3);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [showMembers, setShowMembers] = useState(false);
    const [memberList,setMemberList] = useState([]);
    const [name,setName] = useState('');
    const [address,setAddress] = useState('');

    const handleOptions = (value) => {
        if(selectedOptions.includes(value)){
            setSelectedOptions(selectedOptions.filter((item) => item !== value));
        }
        else{
            setSelectedOptions([...selectedOptions, value]);
        }
    }

    const handleAddMember = () => {
        let member={};
        member.name = name;
        member.address = address;

        setMemberList([...memberList, member]);
        setName('');
        setAddress('');
    }

    const handleRemoveMember = (position) => {
        setMemberList(memberList.filter((_, index) => index !== position));
    }

    return(
        <div className="mintPassToken-container">
            <div className="address-dropdown-container">
                <div className="address-dropdown-div1">
                    <img src={DogIcon} alt="dog-icon"/>
                    <p>0X984…MHg</p>
                </div>
                <div className="address-dropdown-div2">
                    <span>
                        <MdKeyboardArrowDown
                            size={20}
                            color="#76808D"
                        />
                    </span>
                </div>
            </div>
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
                        <p>Token name</p>
                    </div>

                    {/* If open for all --- take name as user input */}
                    {
                        tab === 1
                        ?
                        <div className="userName-box">
                            <label>Your name</label>
                            <input className="text-input" placeholder="Enter your name"/>
                        </div>
                        :
                        null
                    }

                    <div className="contact-box">
                        <label>Contact details</label>
                        <div className="contact-li">
                            <AiOutlineMail color="#C94B32" size={32}/>
                            <input type="text" placeholder="Enter your email"/>
                        </div>
                        <div className="contact-li">
                            <BsDiscord color="#C94B32" size={32}/>
                            <input type="text" placeholder="Enter your discord id"/>
                        </div>
                        <div className="contact-li">
                            <FaTelegramPlane color="#C94B32" size={32}/>
                            <input type="text" placeholder="Enter your telegram username"/>
                        </div>
                    </div>

                    <button>MINT</button>
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
    )
}

export default MintPassToken;