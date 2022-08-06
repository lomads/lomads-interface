import React, { useState,SyntheticEvent, useCallback, } from 'react'
import { useNavigate } from 'react-router-dom';
import { 
    Input
} from '@chakra-ui/react'
import '../styles/App.css'
import '../styles/CreateDao.css'
import '../styles/Dashboard.css'
import '../styles/Modal.css'
import '../styles/Sidebar.css'
import { imageType, tagType } from '../types';
import { useAppDispatch } from 'state/hooks'
import { updateTitle, updatePurpose, updateShortDesc, updateLongDesc } from 'state/proposal/reducer'
import { useAppSelector } from 'state/hooks'
import CommunityTag from './CommunityTag';
import KeywordTag from './KeywordTag';
import Header from 'components/Header';
import Navbar from 'components/Web3AuthNavbar/Navbar';

const BasicsPage = () => {
    const dispatch = useAppDispatch()
    const title = useAppSelector((state) => state.proposal.title)
    const purpose = useAppSelector((state) => state.proposal.purpose)
    const shortDesc = useAppSelector((state) => state.proposal.shortDesc)
    const longDesc = useAppSelector((state) => state.proposal.longDesc)
    const navigate = useNavigate();
    const [file, setFile] = useState<string>("");
    const web3authAddress  = useAppSelector((state) => state.proposal.Web3AuthAddress)

    function handleUpload(event: any) {
        setFile(event.target.files[0]);

        // Add code here to upload file to server
        // ...
    }
    const handleClick = () => {
        navigate("/settings")
    }

    const ImageThumb: React.FC<imageType> = ({ image }) => {
        return <img src={URL.createObjectURL(image)} alt={image.name} width="700" height={"500"} />;
    };
    const showHeader =  web3authAddress.length>=30 ? <Navbar/> : <Header/>;
    return (
        <>
        <div className='absolute top-0 right-0'>
            {showHeader}
        </div>
        <div className={"something"} style={{ paddingLeft: 480, paddingTop: 100, paddingBottom: 100,height:1600 }}>
            <div className={"pageTitle"}>
                Basics
            </div>
            <div className={"pageDescription"}>
                Name your project, upload an image, and set the details.
            </div>
            <div className={"titleBar"}>
                <div className={"titleTile"} style={{ width: 380 }}>
                    <div className={"tileItemHeader"}>
                        <div>
                            Title
                        </div>
                        <div className={"rect2"}>
                            <div className={"reqText"}>
                                Required
                            </div>
                        </div>
                    </div>
                    <input className={"inputField"} name="title" value={title} style={{ height: 40, width: 340 }}
                        autoFocus placeholder="Name your DAO" onChange={(e) => { dispatch(updateTitle(e.target.value)) }} />
                </div>
                <div className={"titleTile"} style={{ width: 280 }}>
                    <div className={"tileItemHeader"}>
                        <div>
                            Purpose
                        </div>
                        <div className={"rect2"}>
                            <div className={"reqText"}>
                                Required
                            </div>
                        </div>
                    </div>
                    <input className={"inputField"} name="title" value={purpose} style={{ height: 40, width: 240 }}
                        placeholder="Choose Purpose" onChange={(e) => { dispatch(updatePurpose(e.target.value)) }} />
                </div>
            </div>
            <div className={"subItemHeader"}>
                <div>
                    Short description
                </div>
                <div className={"rect2"}>
                    <div className={"reqText"}>
                        Required
                    </div>
                </div>
            </div>
            <textarea className={"shorttextField"} name="shortDesc" value={shortDesc}
                placeholder="In a few words" onChange={(e) => { dispatch(updateShortDesc(e.target.value)) }}></textarea>
            <div className={"pageItemHeader"}>
                Long description
            </div>
            <textarea className={"textField"} name="longDesc" value={longDesc} style={{ height: 150 }}
                placeholder="Explain in detail" onChange={(e) => { dispatch(updateLongDesc(e.target.value)) }} />
            <div className={"pageItemHeader"}>
                Cover image
                <div className={"fieldDesc"}>
                    The cover image is similar to album artwork, or a movie poster. It should visually summarize your project in an artistic way
                    , and will be surfaced at the top of your entry and as the preview card across social media platforms. Images must be 2:1 ratio. Suggested dimensions 3000x1500.
                </div>
                <div id="upload-box">
                    <div id="upload-file">
                        <button>
                            <input type="file" style={{ opacity: "0", position: "relative", zIndex: 2 }} onChange={handleUpload} />
                        </button>
                    </div>
                    {/* <p>Filename: {file.name}</p>
                        <p>File type: {file.type}</p>
                        <p>File size: {file.size} bytes</p>
                        {file && <ImageThumb image={file} />} */}
                </div>
            </div>
            <div className={"pageItemHeader"}>
                Tags
                <div className='mt-3 w-72'>
               <KeywordTag/>
                </div>
            </div>
            <div className={"pageItemHeader"}>
                Community links
                <div className='mt-3 w-72'>
                <CommunityTag/>
                </div>
            </div>
            <div>
                <button id="nextButtonBasics" className={"nextButton"} onClick={handleClick}>
                    NEXT STEP
                </button>
            </div>
        </div>
        </>
    )
}

export default BasicsPage