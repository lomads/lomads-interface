import React,{useState,useEffect} from 'react'
// import {useMoralis} from "react-moralis";
import { useNavigate } from 'react-router-dom';
import createDao from "../assets/svg/createDao.svg";
import metamask2 from "../assets/svg/metamask2.svg";
import walletconnect from "../assets/svg/walletconnect.svg";
import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import '../styles/App.css'
import '../styles/CreateDao.css'
import '../styles/Dashboard.css'
import '../styles/Modal.css'

const LoginPage = () => {
    const navigate = useNavigate();
    const [web3auth,setWeb3auth] = useState<Web3Auth | null>(null)
    const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
    const clientId = "BJywQytxS6QAqZSwyDUmNQT490GiyjZNbCHOIggKPEHJXBkIQb2HS3RbV8pQsEcsJ9WySXFVi9MFwMG7T9v7Ux8";
  
    useEffect(() => {
      const init = async () => {
        try {
          const polygonMumbaiConfig = {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            rpcTarget: "https://polygon-mumbai.g.alchemy.com/v2/adPYBBOeggH5WxfoGnMLGRwAVV2_0Kl9",
            blockExplorer: "https://mumbai.polygonscan.com",
            chainId: "0x13881",
            displayName: "Polygon Mumbai Testnet",
            ticker: "matic",
            tickerName: "matic",
          };
      
  
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: polygonMumbaiConfig,
          uiConfig: {
            theme: "light",
            appLogo: "https://user-images.githubusercontent.com/87822922/182828442-99abd9eb-ca46-43d6-89fc-07833a907dc0.svg",
            loginMethodsOrder: ["google","facebook","discord","github","twitter"]
          }
        });
  
        setWeb3auth(web3auth);
  
        await web3auth.initModal();
          if (web3auth.provider) {
            console.log(web3auth.provider)
            setProvider(web3auth.provider);
          };
        } catch (error) {
          console.error(error);
        }
      };
  
      init();
    }, []);
  
    const login = async () => {
      if (!web3auth) {
        console.log("web3auth not initialized yet");
        return;
      }
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
    };
  
    // const getUserInfo = async () => {
    //   if (!web3auth) {
    //     console.log("web3auth not initialized yet");
    //     return;
    //   }
    //   const user = await web3auth.getUserInfo();
    //   console.log(web3auth.provider)
    //   console.log(user);
    // };
  
    // const logout = async () => {
    //   if (!web3auth) {
    //     console.log("web3auth not initialized yet");
    //     return;
    //   }
    //   await web3auth.logout();
    //   setProvider(null);
    // };
   
    const nextLogin=()=>{
        navigate('/createdao');
    }
    
  return (
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
                <button className="modalLoginButton" onClick={nextLogin}>
                   <img src={metamask2} style={{padding:40}} alt="MetaMask"/>
                </button>
                <button className="modalLoginButton" onClick={nextLogin}>
                   <img src={walletconnect} style={{padding:40}} alt="MetaMask"/>
                </button>
                <div className={"loginWithoutWallet"}>
                   <button className='font-sans text-sm text-text_color' onClick={login}>login without crypto wallet </button>
                </div>
            </div>
        </div>
  )
}

export default LoginPage