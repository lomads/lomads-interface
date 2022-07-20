import React, { useState } from 'react'
import '../styles/App.css'
import '../styles/CreateDao.css'
import '../styles/Dashboard.css'
import '../styles/Modal.css'
import '../styles/Sidebar.css'
import MintTokenComponent from '../components/MintTokenComponent'
import SendTokenComponent from '../components/SendTokenComponent'
import { useWeb3React } from "@web3-react/core";
import { useAppSelector } from 'state/hooks'

const Dashboard = () => {
  const governorAddress = useAppSelector((state) => state.deploy.governorAddress);

  return (
    <div className={"something"} style={{ paddingLeft: 480, paddingTop: 100, paddingBottom: 100 }}>
      <div className={"pageTitle"}>
        Dashboard Page
      </div>
      <div className={"pageDescription"} style={{ width: "486px" }}>
        You can mint, and send ERC20 tokens here
      </div>
      <div>
        <div className={"gotitle"}>
          Contracts Deployed Address
        </div>
        <div className={"tileItemHeader"} style={{ paddingTop: 0 }}>
          Governor Contract is deployed to : {governorAddress}
        </div>
        <div className={"gotitle"}>
          Token Transaction
        </div>
        <div>
          <MintTokenComponent />
        </div>
        <div>
          <SendTokenComponent />
        </div>
      </div>
    </div>
  )
}

export default Dashboard