import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {
    HStack,
    Tag,
    TagLabel,
    TagCloseButton,
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

const BasicsPage = () => {
    const dispatch = useAppDispatch()
    const title = useAppSelector((state) => state.proposal.title)
    const purpose = useAppSelector((state) => state.proposal.purpose)
    const shortDesc = useAppSelector((state) => state.proposal.shortDesc)
    const longDesc = useAppSelector((state) => state.proposal.longDesc)
    const navigate = useNavigate();
    const [file, setFile] = useState<string>("");
    const [tag,setTag] = useState<string>("");
    const [tags,setTags] = useState<Array<String>>([]);

    const handleKey = (e:any) =>{
        if(e.key === 'Enter') {
            setTags([...tags,tag])
            console.log(tags)
        }
    }
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

    const Tags = (props: tagType) => {
        return (
            <Tag size={'lg'} key={'lg'} borderRadius='full' variant='solid' colorScheme='#e7cfcb;'>
                <TagLabel textColor='#76808d'>{props.title}</TagLabel>
                <TagCloseButton textColor='#76808d' />
            </Tag>
        );
    }

    return (
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
            <div className={"pageItemHeader"}>
                Short description
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
                <div style={{marginTop:12,width:250}}>
                  <Input focusBorderColor='#B84E24' placeholder='Ethereum' type="text" onChange={(e)=>{setTag(e.target.value)}} onKeyDown={handleKey}/>
                </div>
                <div style={{ marginTop: "10px" }}>
                    <HStack spacing={4}>
                        <Tags title="Tag 1" />
                        <Tags title="Tag 2" />
                    </HStack>
                </div>
            </div>
            <div className={"pageItemHeader"}>
                Community links
                <div style={{marginTop:12,width:250}}>
                <div style={{marginTop:12,width:250}}>
                  <Input focusBorderColor='#B84E24' placeholder='http://' type="text" onChange={(e)=>{setTag(e.target.value)}} onKeyDown={handleKey}/>
                </div>
                </div>
                <div style={{ marginTop: "10px" }}>
                    <HStack spacing={4}>
                        <Tags title="www.lomads.com" />
                        <Tags title="www.bitcoin.com" />
                    </HStack>
                </div>
            </div>
            <div>
                <button id="nextButtonBasics" className={"nextButton"} onClick={handleClick}>
                    NEXT STEP
                </button>
            </div>
        </div>
    )
}

export default BasicsPage