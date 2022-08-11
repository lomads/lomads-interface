import { useNavigate } from 'react-router-dom';
import createDao from "../assets/svg/createDao.svg";
import metamask2 from "../assets/svg/metamask2.svg";
import walletconnect from "../assets/svg/walletconnect.svg";
import '../styles/App.css'
import '../styles/CreateDao.css'
import '../styles/Dashboard.css'
import '../styles/Modal.css'
import { Web3AuthPropType } from 'types';
import { useWeb3React } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import Header from 'components/Header';

const LoginPage = (props: Web3AuthPropType) => {
    const navigate = useNavigate()
    const { connector, account } = useWeb3React()
    const nextLogin = async (walletType: string)=>{
        console.log("midas type", walletType)
        if(walletType == "MetaMask") {
            await connector.activate()
        } else {
            console.log("midas wallet connect")
        }
        navigate('/createdao');
    }
   
  return (
           <>
           <div className='absolute top-0 right-0'>
              <Header/>
          </div>
            <div className={"createDaoLogin"}>
            <div className="logo">
                <img src={createDao} alt=""/>
            </div>
            <div className="welcomeText1">
                Hello there!
            </div>
            <div className="welcomeText2">
                Connect to create a DAO
            </div>  
            <div className={"body"}>
                {/*onClick={() => loginWeb3auth("metamask")}*/}
                <button className="modalLoginButton" onClick={()=>nextLogin("MetaMask")}>
                   <img src={metamask2} style={{padding:40}} alt="MetaMask"/>
                </button>
                <button className="modalLoginButton" onClick={() => nextLogin("WalletConnect")}>
                   <img src={walletconnect} style={{padding:40}} alt="WalletConnect"/>
                </button>
                <div className={"loginWithoutWallet"}>
                   <button className='font-sans text-sm text-text_color' onClick={props.login}>login without crypto wallet </button>
                </div>
            </div>
        </div>
           </>
  )
}

export default LoginPage