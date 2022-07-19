import React,{useState} from 'react'
import '../styles/App.css'
import '../styles/CreateDao.css'
import '../styles/Dashboard.css'
import '../styles/Modal.css'
import '../styles/Sidebar.css'
import { useWeb3React } from "@web3-react/core";
import { factoryCall } from 'connection/DaoFactoryCall'
import BasicsComponent from '../components/BasicsComponent'
import TokenComponent from '../components/TokenComponent'
import SettingsComponent from '../components/SettingsComponent'
import { LineWobble } from '@uiball/loaders'

const GoLivePage = () => {
  const {provider} = useWeb3React();
  const [deployedGovernor,setdeployedGovernor] = useState<string>("");
  const [isLoading,setisLoading] = useState(false);

  const DeployDAO = async () =>{
    const factory = await factoryCall(provider);
    setisLoading(true);
    const creatingGovernor = await factory.createGovernor("MyGov","0x3c5bAF552449858dfa69E9dAa8b44A1a26ee2873","MyGovernor","testing","teeesting","testing..");
    await creatingGovernor.wait();
    const governorAddress = await factory.deployedGovernorAddress();
    setisLoading(false)
    setdeployedGovernor(governorAddress);


  }
  return (
    <div className={"something"} style={{paddingLeft:480, paddingTop:100,paddingBottom:100}}>
                <div className={"pageTitle"}>
                    Go live
                </div>
                <div className={"pageDescription"} style={{width:"486px"}}>
                    Take your crowdfund public by completing the final checklist, cross-checking the values, and ensuring there aren’t any mis-spellings.
                </div>
                <div>
                   <div className={"gotitle"}>
                     Basics
                   </div>
                   <div>
                    <BasicsComponent/>
                   </div>
                </div>
                <div>
                   <div className={"gotitle"}>
                     Settings
                   </div>
                   <div>
                    <SettingsComponent/>
                   </div>
                </div>
                <div>
                   <div className={"gotitle"}>
                     Token
                   </div>
                   <div>
                    <TokenComponent/>
                   </div>
                   {
                   isLoading ? (
                   <div>
                    <div className={"subItemHeader"} style={{paddingBottom:20}}>
                        Hold on we are deploying your Governor
                    </div>
                   <LineWobble size={750} color="#C94B32" />
                </div>):(null)
                }
                </div>
                {
                  deployedGovernor.length>=32 ? (
                    <div className={"subItemHeader"}>
                            <div>
                                Deployed Token Address: {deployedGovernor}
                            </div>
                        </div> 
                        ) : (null)
                }

                <div>
                    <button id="buttonDeploy" className={"nextButton"} onClick={DeployDAO}>
                        DEPLOY
                    </button>
                </div>
    </div>
  )
}

export default GoLivePage