import { useEffect, useState } from "react";
import '../styles/App.css'
import '../styles/CreateDao.css'
import '../styles/Dashboard.css'
import '../styles/Modal.css'
import '../styles/Sidebar.css'
import MintTokenComponent from '../components/MintTokenComponent'
import SendTokenComponent from '../components/SendTokenComponent'
import { useWeb3React } from "@web3-react/core";
import { useAppSelector } from 'state/hooks'
import { tokenCall } from 'connection/DaoTokenCall'
import { useMoralisQuery, useMoralis} from "react-moralis"
import { useAppDispatch } from 'state/hooks'
import { updatedeployedGovernorAddress, updatedeployedTokenAddress } from '../state/proposal/reducer'

const Dashboard = () => {
  const dispatch = useAppDispatch()
  const tokenAddress = useAppSelector((state) => state.proposal.deployedTokenAddress)
  const governorAddress = useAppSelector((state) => state.proposal.deployedGovernorAddress);
  const { Moralis } = useMoralis();
  const [histories, setHistories] = useState();

  useEffect(() => {
    getHistories();
  }, [])
 
  async function getHistories() {
    const daoinfo = Moralis.Object.extend("DAOInfo");
    const query = new Moralis.Query(daoinfo);
    const results = await query.find({ useMasterKey: true });
    for (let i = 0; i < results.length; i++) {
      const object = results[i];
      console.log(object.id + " - " + object.get("title"));
    }
    dispatch(updatedeployedGovernorAddress(results[results.length-1].get("title")))
    dispatch(updatedeployedTokenAddress(results[results.length-1].get("purpose")))
  }
  
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