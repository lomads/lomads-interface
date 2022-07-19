import React,{useState} from 'react'
import '../styles/App.css'
import '../styles/CreateDao.css'
import '../styles/Dashboard.css'
import '../styles/Modal.css'
import '../styles/Sidebar.css'
import { useWeb3React } from "@web3-react/core";
import { useNavigate } from 'react-router-dom'
import { factoryCall } from 'connection/DaoFactoryCall'
import { LineWobble } from '@uiball/loaders'
const TokenPage = () => {
    const {provider} = useWeb3React();
    const navigate = useNavigate();
    const [isLoading,setisLoading] = useState(false);
    const [title, setTitle] = useState<string>("");
    const [symbol, setsymbol] = useState<string>("");
    const [explain, setExplain] = useState<string>("");
    const [supply, setSupply] = useState<number>();
    const [holder, setHolder] = useState<string>("");
    const [file, setFile] = useState<string>("");
    const [deployed,setDeployed] = useState<string>("");
    function handleUpload(event:any) {
        setFile(event.target.files[0]);

        // Add code here to upload file to server
        // ...
    }

    const createToken = async () =>{
        const factory = await factoryCall(provider);
        setisLoading(true);
        if(title.length>=3 && symbol.length>=2){
           const creatingToken =  await factory.createToken(title,symbol,supply,explain);
           await creatingToken.wait();
            const tokenAddress  = await factory.deployedTokenAddress();
            setisLoading(false);
            setDeployed(tokenAddress);
        }
    }


    const handleClick = () =>{
        navigate("/golive");
    }
  return (
    <div className={"something"} style={{paddingLeft:480, paddingTop:100,paddingBottom:100}}>
                <div className={"pageTitle"}>
                    Token
                </div>
                <div className={"pageDescription"}>
                    Mint ERC20 tokens to create new communities and distribute ownership. Learn more
                </div>
                <div className={"titleBar"}>
                    <div className={"tokentitleTile"} style={{width:750}}>
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
                        <input className={"inputField"} type="title" name="title" value={title} style={{height:40, width:340}}
                               autoFocus placeholder="Name your Token Name" onChange={(e)=>{setTitle(e.target.value)}} />
                    </div>
                    {/* second */}
                    <div style={{marginLeft:"20px"}}>
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
                        <input className={"inputField"} type="title" name="title" value={symbol} style={{height:40, width:240}}
                               placeholder="Enter your Token Symbol" onChange={(e)=>{setsymbol(e.target.value)}} />
                    </div>
                    </div>
                    
                </div>
                <div className='pageItemHeader'>
                    Description
                    <div className={"fieldDesc"}>
                        Briefly describe your token for use on Mirror and social sharing.
                    </div>
                </div>
                <textarea className={"textField"} name="longDesc" value={explain} style={{height:150}}
                       placeholder="Explain in detail" onChange={(e)=>{setExplain(e.target.value)}} />
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
                <input className={"inputField"} type="number" name="supply" value={supply} style={{height:50}}
                       autoFocus placeholder="100,000,000" onChange={(e)=>{setSupply(e.target.valueAsNumber)}} />
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
                <input className={"inputField"} type="holder" name="holder" value={holder} style={{height:50}}
                       autoFocus placeholder="0x3429…" onChange={(e)=>{setHolder(e.target.value)}} />

               <div>
                <div className={"subItemHeader"}>
                        <div>
                            Deployed Token Address
                        </div>
                    </div>
                    <div className={"fieldDesc"}>
                        Depolyed Contract address of Token.
                    </div>
                </div>
                <input className={"inputField"} type="holder" name="deployedToken" value={deployed} style={{height:50}}
                       autoFocus placeholder="0x9ddk..." onChange={(e)=>{setDeployed(e.target.value)}}/>
                       
                <div className={"pageItemHeader"}>
                    Icon image
                    <div className={"fieldDesc"}>
                        Brand your token by uploading an icon image.
                    </div>
                    <div id="upload-box">
                        <div id="upload-file">
                        <button>
                            <input type="file" style={{opacity:"0",position:"relative",zIndex:2}} onChange={handleUpload}/>
                        </button>
                        </div>
                        {/* <p>Filename: {file.name}</p>
                        <p>File type: {file.type}</p>
                        <p>File size: {file.size} bytes</p>
                        {file && <ImageThumb image={file} />} */}
                    </div>
                    {
                   isLoading ? (
                   <div>
                    <div className={"subItemHeader"} style={{paddingBottom:20}}>
                        Hold on we are deploying your Token
                    </div>
                   <LineWobble size={750} color="#C94B32" />
                </div>):(null)
                }
                </div>
                <div>
                    {deployed.length>=30 ? (<button id="nextButtonToken" className={"nextButton"} onClick={handleClick}>
                        NEXT STEP
                    </button>): (<button id="nextButtonToken" className={"nextButton"} onClick={createToken}>
                        Create Token
                    </button>)} 
                   
                </div>
            </div>
  )
}

export default TokenPage