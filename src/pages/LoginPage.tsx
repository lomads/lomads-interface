import React,{useEffect} from 'react'
// import {useMoralis} from "react-moralis";
import { useNavigate } from 'react-router-dom';
import createDao from "../assets/svg/createDao.svg";
import metamask2 from "../assets/svg/metamask2.svg";
import walletconnect from "../assets/svg/walletconnect.svg";
import '../styles/App.css'
import '../styles/CreateDao.css'
import '../styles/Dashboard.css'
import '../styles/Modal.css'
import { Web3AuthPropType } from 'types';
import Navbar from 'components/Web3AuthNavbar/Navbar';
import Header from 'components/Header';
import { useAppSelector } from 'state/hooks';

const LoginPage = (props: Web3AuthPropType) => {
    const web3authAddress  = useAppSelector((state) => state.proposal.Web3AuthAddress)
    const navigate = useNavigate()
  
    const nextLogin=()=>{
        navigate('/createdao');
    }
    // const showHeader = () => {
    //     if(web3authAddress.length>=30){
    //         return <Navbar/>
    //     }else{
    //         return <Header/>
    //     }
    // }
    // useEffect(()=>{
    //     showHeader()
    // })
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
                <button className="modalLoginButton" onClick={nextLogin}>
                   <img src={metamask2} style={{padding:40}} alt="MetaMask"/>
                </button>
                <button className="modalLoginButton" onClick={nextLogin}>
                   <img src={walletconnect} style={{padding:40}} alt="MetaMask"/>
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