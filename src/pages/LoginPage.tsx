import React,{useState} from 'react'
// import {useMoralis} from "react-moralis";
import { useNavigate } from 'react-router-dom';
import createDao from "../assets/svg/createDao.svg";
import metamask2 from "../assets/svg/metamask2.svg";
import walletconnect from "../assets/svg/walletconnect.svg";
import '../styles/App.css'
import '../styles/CreateDao.css'
import '../styles/Dashboard.css'
import '../styles/Modal.css'
import '../styles/Sidebar.css'

const LoginPage = () => {
    const navigate = useNavigate();
    // const { authenticate, isAuthenticated, isAuthenticating, user, account, chainId, logout } = useMoralis();
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    // const moralisLogin = async () => {
    //     console.log("in login");
    //     if (!isAuthenticated) {
    //         console.log("authenticate");
    //         await authenticate({signingMessage: "Log into Lomads Dapp to create a DAO" })
    //             .then(function (user) {
    //                 console.log("logged in user:", user);
    //                 console.log(user.get("ethAddress"));
    //                 console.log(account);
    //                 setIsUserLoggedIn(true);
    //                 navigate("/dao");
    //             })
    //             .catch(function (error) {
    //                 console.log(error);
    //             });
    //     } else {
    //         setIsUserLoggedIn(true);
    //         navigate("/dao");
    //         console.log("already authenticated");
    //     }
    // }

    // const moralisLogout = async () => {
    //     await logout();
    //     setIsUserLoggedIn(false);
    //     console.log("logged out");
    // }
    const moralisLogin=()=>{
        setIsUserLoggedIn(true);
        navigate('/createdao');
    }
    const moralisLogout=()=>{
        setIsUserLoggedIn(false);
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
                <button className="modalLoginButton" onClick={moralisLogin}>
                   <img src={metamask2} style={{padding:40}} alt="MetaMask"/>
                </button>
                <button className="modalLoginButton" onClick={moralisLogin}>
                   <img src={walletconnect} style={{padding:40}} alt="MetaMask"/>
                </button>
                <div className={"loginWithoutWallet"}>
                   <a onClick={moralisLogout} style={{textDecorationLine: "underline"}} href="/">login without crypto wallet </a>
                </div>
            </div>
        </div>
  )
}

export default LoginPage