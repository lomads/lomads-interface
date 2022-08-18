import React, { useState } from 'react'
import '../styles/App.css'
import '../styles/CreateDao.css'
import '../styles/Dashboard.css'
import '../styles/Modal.css'
import '../styles/Sidebar.css'
import { useNavigate } from 'react-router-dom'
import {Oval} from 'react-loader-spinner'
import {
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
} from '@chakra-ui/react'
import { useAppDispatch } from 'state/hooks'
import { updatetokenTitle, updatetokenSymbol, updateExplain, updateSupply, updateHolder, updateIconImgPath } from 'state/proposal/reducer'
import { useAppSelector } from 'state/hooks'
import Header from 'components/Header';
import Navbar from 'components/Web3AuthNavbar/Navbar'
import { imageType, Web3AuthPropType } from 'types'
import { fileUpload } from '../utils/ipfs'

const TokenPage = (props: Web3AuthPropType) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const tokenTitle = useAppSelector((state) => state.proposal.tokenTitle)
    const tokenSymbol = useAppSelector((state) => state.proposal.tokenSymbol)
    const explain = useAppSelector((state) => state.proposal.explain)
    const supply = useAppSelector((state) => state.proposal.supply)
    const holder = useAppSelector((state) => state.proposal.holder)
    const web3authAddress = useAppSelector((state) => state.proposal.Web3AuthAddress)
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleUpload(event: any) {
        console.log('Handle upload.....')
        const files = event.target.files;
        if (!files || files.length === 0) {
            return alert("No files selected");
        }
        setFile(files[0]);
        setLoading(true);
        const result: any = await fileUpload(files[0]);
        setLoading(false);
        dispatch(updateIconImgPath(result));
    }

    function handleRemoveCover() {
        setFile(null);
        dispatch(updateIconImgPath(''));
    }

    const handleClick = () => {
        navigate("/golive");
    }
    const ImageThumb: React.FC<imageType> = ({ image }) => {
        return <img src={URL.createObjectURL(image)} alt={image.name} width="300" height={"300"} style={{maxWidth: '100%', maxHeight: '100%', width: 'auto', height: '100%' }}/>;
    };
    const showHeader = !!web3authAddress ? <Navbar web3Provider={props.web3Provider} /> : <Header />;
    return (
        <>
            <div className='absolute top-0 right-0'>
                {showHeader}
            </div>
            <div className={"something"} style={{ paddingLeft: 480, paddingTop: 100, paddingBottom: 100, height: 1600 }}>
                <div className={"pageTitle"}>
                    Token
                </div>
                <div className={"pageDescription"}>
                    Mint ERC20 tokens to create new communities and distribute ownership. Learn more
                </div>
                <div className={"titleBar"}>
                    <div className={"tokentitleTile"} style={{ width: 750 }}>
                        <div>
                            <div className={"tileItemHeader"}>
                                <div>
                                    Name
                                </div>
                                <div className={"rect2"}>
                                    <div className={"reqText"}>
                                        Required
                                    </div>
                                </div>
                            </div>
                            <div className={"tokenpageDescription"}>
                                A Short but descriptive name for your project token. This name will be used in block explorers and token wallets.
                            </div>
                            <FormControl isInvalid={tokenTitle === ''}>
                                <Input
                                    className={"inputField"}
                                    style={{ height: 40, width: 340 }}
                                    name="title"
                                    value={tokenTitle}
                                    placeholder="Name your Token Name"
                                    autoFocus
                                    onChange={(e) => { dispatch(updatetokenTitle(e.target.value)) }}
                                />
                                {tokenTitle === '' &&
                                    <FormErrorMessage 
                                        style={{marginTop: 0, fontSize: "x-small"}}
                                    >
                                        * Token title is required.
                                    </FormErrorMessage>
                                }
                            </FormControl>
                        </div>
                        {/* second */}
                        <div style={{ marginLeft: "20px" }}>
                            <div className={"tileItemHeader"}>
                                <div>
                                    Symbol
                                </div>
                                <div className={"rect2"}>
                                    <div className={"reqText"}>
                                        Required
                                    </div>
                                </div>
                            </div>
                            <div className={"tokenpageDescription"}>
                                A one owrd symbol signifying your project token. This symbol will be used in block explorers and token wallets.
                            </div>
                            <FormControl isInvalid={tokenTitle !== '' && tokenSymbol === ''}>
                                <Input
                                    className={"inputField"}
                                    style={{ height: 40, width: 240 }}
                                    name="title"
                                    value={tokenSymbol}
                                    placeholder="Enter your Token Symbol"
                                    onChange={(e) => { dispatch(updatetokenSymbol(e.target.value)) }}
                                />
                                {tokenTitle !== '' && tokenSymbol === '' &&
                                    <FormErrorMessage 
                                        style={{marginTop: 0, fontSize: "x-small"}}
                                    >
                                        * Token symbol is required.
                                    </FormErrorMessage>
                                }
                            </FormControl>
                        </div>
                    </div>

                </div>
                <div className='pageItemHeader'>
                    Description
                    <div className={"fieldDesc"}>
                        Briefly describe your token for use on Mirror and social sharing.
                    </div>
                </div>
                <textarea className={"textField"} name="longDesc" value={explain} style={{ height: 150 }}
                    placeholder="Explain in detail" onChange={(e) => { dispatch(updateExplain(e.target.value)) }} />
                <div>
                    <div className={"subItemHeader"}>
                        <div>
                            Supply
                        </div>
                        <div className={"rect2"}>
                            <div className={"reqText"}>
                                Required
                            </div>
                        </div>
                    </div>
                    <div className={"fieldDesc"}>
                        Define the initial token supply.
                    </div>
                </div>
                <FormControl isInvalid={tokenTitle !== '' && tokenSymbol !== '' && !supply}>
                    <Input
                        className={"inputField"}
                        style={{ height: 50, width: 500 }}
                        name="supply"
                        type="number"
                        value={supply}
                        placeholder="100,000,000"
                        onChange={(e) => { dispatch(updateSupply(e.target.value)) }}
                    />
                    {tokenTitle !== '' && tokenSymbol !== '' && !supply &&
                        <FormErrorMessage 
                            style={{marginTop: 0, fontSize: "x-small"}}
                        >
                            * Total supply is required.
                        </FormErrorMessage>
                    }
                </FormControl>
                <div>
                    <div className={"subItemHeader"}>
                        <div>
                            Holder
                        </div>
                        <div className={"rect2"}>
                            <div className={"reqText"}>
                                Required
                            </div>
                        </div>
                    </div>
                    <div className={"fieldDesc"}>
                        Enter the address that controls the token. This should probably be a multi-sig. Make sure to enter the Ethereum address, not the ENS name.
                    </div>
                </div>
                <FormControl isInvalid={tokenTitle !== '' && tokenSymbol !== '' && !!supply && holder === ''}>
                    <Input
                        className={"inputField"}
                        style={{ height: 50, width: 500 }}
                        name="holder"
                        value={holder}
                        placeholder="0x3429…"
                        onChange={(e) => { dispatch(updateHolder(e.target.value)) }}
                    />
                    {tokenTitle !== '' && tokenSymbol !== '' && !!supply && holder === '' &&
                        <FormErrorMessage 
                            style={{marginTop: 0, fontSize: "x-small"}}
                        >
                            * Holder address is required.
                        </FormErrorMessage>
                    }
                </FormControl>
                <div className={"pageItemHeader"}>
                    Icon image
                    <div className={"fieldDesc"}>
                        Brand your token by uploading an icon image.
                    </div>
                    <div id="upload-box">
                        {!loading && file && <div id="upload-remove" onClick={handleRemoveCover}/>}
                        {loading && <Oval
                            height={80}
                            width={80}
                            color="#4fa94d"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                            ariaLabel='oval-loading'
                            secondaryColor="#4fa94d"
                            strokeWidth={2}
                            strokeWidthSecondary={2}

                        />}
                        {!loading && !file && <div id="upload-file">
                            <button>
                                <input type="file" style={{ opacity: "0", position: "relative", zIndex: 2 }} onChange={handleUpload} />
                            </button>
                        </div>}
                        {!loading && file && <ImageThumb image={file} />}
                        {/* <p>Filename: {file.name}</p>
                        <p>File type: {file.type}</p>
                        <p>File size: {file.size} bytes</p>
                        {file && <ImageThumb image={file} />} */}
                    </div>
                </div>
                <div>
                    <button id="nextButtonToken" className={"nextButton"} onClick={handleClick}>
                        NEXT STEP
                    </button>
                </div>
            </div>

        </>
    )
}

export default TokenPage;