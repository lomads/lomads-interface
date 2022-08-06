import React from 'react'
import '../styles/App.css'
import '../styles/CreateDao.css'
import '../styles/Dashboard.css'
import '../styles/Modal.css'
import '../styles/Sidebar.css'
import MintTokenComponent from '../components/MintTokenComponent'
import SendTokenComponent from '../components/SendTokenComponent'
import { useAppSelector } from 'state/hooks'

const Dashboard = () => {
  const tokenAddress = useAppSelector((state) => state.proposal.deployedTokenAddress)
  const governorAddress = useAppSelector((state) => state.proposal.deployedGovernorAddress);
 

  return (
    <div className={"something"} style={{ paddingLeft: 480, paddingTop: 100, paddingBottom: 100,height:1600 }}>
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
          Token Contract is deployed to : {tokenAddress}
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