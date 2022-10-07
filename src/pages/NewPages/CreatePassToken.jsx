
import "../../styles/pages/CreatePassToken.css";
import { useEffect } from "react";
import Frame from '../../assets/svg/frame.svg';
import uploadIcon from '../../assets/svg/ico-upload.svg';
import hklogo from '../../assets/svg/hklogo.svg';
import editToken from '../../assets/svg/editToken.svg';
import memberIcon from '../../assets/svg/memberIcon.svg';
import { AiOutlinePlus } from "react-icons/ai";
import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useSBTDeployerContract } from "hooks/useContract";
import { createNewSBT, getCurrentId, getContractById } from "hooks/SBT/sbtDeployer";
import { APInewContract } from "hooks/SBT/sbtAPI";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SimpleLoadButton from "UIpack/SimpleLoadButton";
import trimAddress from "utils/sliceAddr";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { createContract } from '../../state/contract/actions';
import { resetCreateContractLoader } from '../../state/contract/reducer';

import { ethers } from "ethers";

const CreatePassToken = () => {
    const { account, provider } = useWeb3React();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { DAO } = useAppSelector((state) => state.dashboard);
    console.log("DAO data : ", DAO);
    const sbtDeployerContract = useSBTDeployerContract();
    const [tab, setTab] = useState(1);
    const [sbtName, setSbtName] = useState('');
    const [tokenQuantity, setTokenQuantity] = useState('');
    const [contractAddr, setContractAddr] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [showMembers, setShowMembers] = useState(false);
    const [memberList, setMemberList] = useState([]);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [image, setImage] = useState(null);

    const { createContractLoading } = useAppSelector(store => store.contract)
    /*
    State used to define main parameters for a the new SBT contract
    */
    const [SBTConstructor, setSBTConstructor] = useState({
        name: '',
        supply: '',
        img: ''
    });

    const handleOptions = (value) => {
        if (selectedOptions.includes(value)) {
            setSelectedOptions(selectedOptions.filter((item) => item !== value));
        }
        else {
            setSelectedOptions([...selectedOptions, value]);
        }
    }

    const isAddressValid = (holderAddress) => {
        const ENSdomain = holderAddress.slice(-4);
        if (ENSdomain === ".eth") {
            return true;
        }
        else {
            const isValid = ethers.utils.isAddress(holderAddress);
            return isValid;
        }
    };

    const isRightAddress = (holderAddress) => {
        const isValid = ethers.utils.isAddress(holderAddress);
        return isValid;
    };

    const isPresent = (_address) => {
        const check = memberList.some((mem) => mem.address === _address);
        return check;
    };

    const addMember = async (_ownerName, _ownerAddress) => {
        const member = { name: _ownerName, address: _ownerAddress };
        if (_ownerAddress.slice(-4) === ".eth") {
            const resolver = await provider?.getResolver(_ownerAddress);
            const EnsAddress = await resolver?.getAddress();
            if (EnsAddress !== undefined) {
                member.address = EnsAddress;
                member.name = _ownerName !== '' ? _ownerName : _ownerAddress;
                const present = isPresent(member.address);
                if (present) {
                    return toast.error("Address already added");
                }
            }
            else {
                member.address = _ownerAddress;
                return toast.error("Invalid address OR ens");
            }
        }
        else {
            const ENSname = await provider?.lookupAddress(_ownerAddress);
            if (ENSname) {
                member.name = _ownerName !== '' ? _ownerName : ENSname;
            }
            else {
                member.name = _ownerName;
            }
        }
        if (!isPresent(member.address) && isRightAddress(member.address)) {
            setMemberList([...memberList, member]);
            setName('');
            setAddress('');
        }
    };

    const handleAddMember = () => {
        if (!isAddressValid(address)) {
            return toast.error("Invalid address OR ens");
        }
        if (isPresent(address)) {
            return toast.error("Address already added");
        }
        else {
            addMember(name, address);
        }
    }

    const handleRemoveMember = (position) => {
        setMemberList(memberList.filter((_, index) => index !== position));
    }

    const addSBTConstructor = () => {
        if (sbtName === '') {
            return toast.error("Please enter token name");
        }
        else {
            setSBTConstructor({
                name: sbtName,
                supply: tokenQuantity,
                img: null /// need to be save in base64 format when DB is ready
            });
            setTab(2);
        }
    }

    useEffect(() => {
        if (contractAddr) {
            if (createContractLoading === false) {
                setContractAddr(null)
                dispatch(resetCreateContractLoader())
                setIsLoading(false)
                // navigate(`/sbt/success/${contractAddr}`);
                navigate(-1);
            }
        }
    }, [createContractLoading, contractAddr])

    const deploySBTContract = async () => {
        if (account) {
            setIsLoading(true);
            const counter = await getCurrentId(sbtDeployerContract);
            const tx = await createNewSBT(sbtDeployerContract, SBTConstructor, memberList);
            if (!tx) {
                setIsLoading(false);
                toast.error("Error during deployment");
                return;
            }
            else {
                console.log("Contract deployed");
                const contractAddr = await getContractById(sbtDeployerContract, counter);
                setContractAddr(contractAddr);
                const contractJSON = {
                    address: contractAddr,
                    admin: account,
                    contactDetail: selectedOptions,
                    metadata: [],
                    membersList: memberList,
                    daoId: DAO._id
                }
                dispatch(createContract(contractJSON))
                //     const req = await APInewContract(contractJSON);
                //     if (req){
                //         setIsLoading(false)
                //         navigate(`/sbt/success/${contractAddr}`);
                //         return;
                //     }
                //    return;
            }
        }
        // toast.error("Please connect your account before !")
        // return;
    }

    const handleSelectImage = (event) => {
        setImage(URL.createObjectURL(event.target.files[0]))
    }

    return (
        <>
            <div className="createPassToken-container">
                <div className="createPassToken-body">
                    <img src={Frame} alt="frame-icon" />
                    <p className="heading-text">Create New Pass Token</p>
                    {/* First step */}
                    {
                        tab === 1
                            ?
                            <>
                                <div className="createPassToken-form-container">
                                    <label>Name of the Pass Token</label>
                                    <input
                                        id="token-name"
                                        className="text-input"
                                        placeholder="Enter token name"
                                        value={sbtName}
                                        onChange={(e) => setSbtName(e.target.value)}
                                    />
                                    <div className="optional-div">
                                        <label>Pass Token Icon</label>
                                        <div>
                                            <p>Optional</p>
                                        </div>
                                    </div>
                                    <span>Suggested dimensions and format : <br /> 800x800, .svg or .png</span>
                                    <div className="image-picker-container">
                                        {
                                            image
                                                ?
                                                <img src={image} alt="selected-token-icon" className="selected-img" />
                                                :
                                                <>
                                                    <img src={uploadIcon} alt="upload-icon" />
                                                    <p>Choose <br /> or drag an image</p>
                                                    <span>maximum size 2mb</span>
                                                    <input type="file" onChange={handleSelectImage} />
                                                </>
                                        }
                                    </div>
                                    <div className="optional-div">
                                        <label>Supply</label>
                                        <div>
                                            <p>Optional</p>
                                        </div>
                                    </div>
                                    <input
                                        id="token-supply"
                                        className="text-input"
                                        placeholder="Number of existing tokens"
                                        value={tokenQuantity}
                                        onChange={(e) => setTokenQuantity(e.target.value)}
                                    />
                                    <button onClick={addSBTConstructor}>NEXT</button>
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
                                        <img src={hklogo} alt="hk-logo" />
                                        <p style={{ marginLeft: "5px" }}>{SBTConstructor.name}</p>
                                        <p style={{ marginLeft: "auto", marginRight: "20px" }}>x{SBTConstructor.supply}</p>
                                    </div>
                                    <div className="tokenName-btn">
                                        <img onClick={() => setTab(1)} src={editToken} alt="hk-logo" />
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
                                                        style={address !== '' ? { background: '#C84A32' } : null}
                                                        onClick={handleAddMember}
                                                    >
                                                        <AiOutlinePlus color="#FFF" size={25} />
                                                    </button>
                                                </div>
                                            </div>
                                            {/* If members list array's length is greater than zero then render the list */}
                                            {
                                                memberList.length > 0
                                                    ?
                                                    <div className="member-list">
                                                        {
                                                            memberList.map((item, index) => {
                                                                return (
                                                                    <div className="member-li" key={index}>
                                                                        <div className="member-img-name">
                                                                            <img src={memberIcon} alt="member-icon" />
                                                                            <p style={{ color: "white" }}>{item.name}</p>
                                                                        </div>
                                                                        <div className="member-address">
                                                                            <p style={{ color: "white" }}>{trimAddress(item.address)}</p>
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
                                            <div style={{ height: '20px' }}></div>
                                            <SimpleLoadButton
                                                title="CREATE PASS"
                                                height={50}
                                                width={160}
                                                fontsize={20}
                                                fontweight={400}
                                                onClick={deploySBTContract}
                                                bgColor={"#C94B32"}
                                                condition={isLoading}
                                            />
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
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                theme='dark'
                rtl={false} />
        </>
    )
}

export default CreatePassToken;