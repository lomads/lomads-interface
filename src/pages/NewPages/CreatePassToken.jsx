
import "../../styles/pages/CreatePassToken.css";
import DogIcon from '../../assets/svg/dogIcon.svg';
import Frame from '../../assets/svg/Frame.svg';
import uploadIcon from '../../assets/svg/ico-upload.svg';
import hklogo from '../../assets/svg/hklogo.svg';
import editToken from '../../assets/svg/editToken.svg';
import memberIcon from '../../assets/svg/memberIcon.svg';

import {MdKeyboardArrowDown} from 'react-icons/md';
import { AiOutlinePlus } from "react-icons/ai";
import { useState } from "react";

const CreatePassToken = () => {
    const [tab,setTab] = useState(1);
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
        <div className="createPassToken-container">
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
            <div className="createPassToken-body">
                <img src={Frame} alt="frame-icon"/>
                <p className="heading-text">Create New Pass Token</p>
                {/* First step */}
                {
                    tab === 1
                    ?
                    <>
                    <div className="createPassToken-form-container">
                        <label>Name of the Pass Token</label>
                        <input className="text-input" placeholder="Enter token name"/>
                        <div className="optional-div">
                            <label>Pass Token Icon</label>
                            <div>
                                <p>Optional</p>
                            </div>
                        </div>
                        <span>Suggested dimensions and format : <br /> 800x800, .svg or .png</span>
                        <div className="image-picker-container">
                            <img src={uploadIcon} alt="upload-icon"/>
                            <p>Choose <br /> or drag an image</p>
                            <span>maximum size 2mb</span>
                            <input type="file"/>
                        </div>
                        <div className="optional-div">
                            <label>Supply</label>
                            <div>
                                <p>Optional</p>
                            </div>
                        </div>
                        <input className="text-input" placeholder="Number of existing tokens"/>
                        <button onClick={() => setTab(2)}>NEXT</button>
                    </div>
                    </>
                    :
                    null
                }

                {/* Second step */}
                {
                    tab === 2
                    ?
                    <>
                        <div className="tokenName-container">
                            <div className="tokenName-box">
                                <img src={hklogo} alt="hk-logo"/>
                                <input type="text" placeholder="Token name"/>
                                <p>x100</p>
                            </div>
                            <div className="tokenName-btn">
                                <img src={editToken} alt="hk-logo"/>
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div className="contact-container">
                            <h1>Contact details</h1>
                            <p>Get certain member details could be useful for the smooth functioning of your organisation</p>
                            <div className="option">
                                <div>
                                    <input 
                                        type="checkbox" 
                                        id="email" 
                                        name="email" 
                                        value="email"
                                        checked={selectedOptions.includes("email")}
                                        onChange={() => handleOptions('email')}
                                    />
                                    <label>Email</label>
                                </div>
                                <span>Please select if you intend to use services such as Notion, Google Workspace and GitHub.</span>
                            </div>
                            <div className="option">
                                <div>
                                    <input 
                                        type="checkbox" 
                                        id="discord" 
                                        name="discord" 
                                        value="discord"
                                        checked={selectedOptions.includes("discord")}
                                        onChange={() => handleOptions('discord')}
                                    />
                                    <label>Discord user-id</label>
                                </div>
                                <span>Please select if you intend to use access-controlled channels in Discord.</span>
                            </div>
                            <div className="option">
                                <div>
                                    <input 
                                        type="checkbox" 
                                        id="telegram" 
                                        name="telegram" 
                                        value="telegram"
                                        checked={selectedOptions.includes("telegram")}
                                        onChange={() => handleOptions('telegram')}
                                    />
                                    <label>Telegram user-id</label>
                                </div>
                                <span>Please select if you intend to use access-controlled Telegram groups.</span>
                            </div>
                            {
                                selectedOptions.length > 0 && !showMembers
                                ?
                                <button onClick={() => setShowMembers(true)}>NEXT</button>
                                :
                                null
                            }
                        </div>
                        {
                            showMembers
                            ?
                            <>
                                <div className="divider"></div>
                                <div className="member-container">
                                    <div className="member-header">
                                        <h1>Invite new member</h1>
                                        <div>
                                            <p>Optional</p>
                                        </div>
                                    </div>
                                    <div className="member-body">
                                        <input 
                                            type="text" 
                                            placeholder="Name" 
                                            className="input1"
                                            name="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="ENS Domain or Wallet Address" 
                                            className="input2"
                                            name="address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                        <button 
                                            style={name !== '' && address !== '' ? {background:'#C84A32'} : null}
                                            onClick={handleAddMember}
                                        >
                                            <AiOutlinePlus color="#FFF" size={25}/>
                                        </button>
                                    </div>
                                </div>
                                {/* If members list array's length is greater than zero then render the list */}
                                {
                                    memberList.length > 0
                                    ?
                                    <div className="member-list">
                                        {
                                            memberList.map((item,index) => {
                                                return(
                                                    <div className="member-li" key={index}>
                                                        <div className="member-img-name">
                                                            <img src={memberIcon} alt="member-icon"/>
                                                            <p>{item.name}</p>
                                                        </div>
                                                        <div className="member-address">
                                                            <p>{item.address}</p>
                                                            <button onClick={() => handleRemoveMember(index)}>X</button>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    :
                                    null
                                }
                                <button className="create" onClick={() => console.log(memberList)}>CREATE PASS TOKEN</button>
                            </>
                            :
                            null
                        }
                    </>
                    :
                    null
                }
            </div>
        </div>
    )
}

export default CreatePassToken;