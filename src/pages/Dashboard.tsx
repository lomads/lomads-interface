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
import { useMoralisQuery, useMoralis } from "react-moralis"
import { useAppDispatch } from 'state/hooks'
import { updatedeployedGovernorAddress, updatedeployedTokenAddress } from '../state/proposal/reducer'

const Dashboard = () => {
  const dispatch = useAppDispatch()
  const tokenAddress = useAppSelector((state) => state.proposal.deployedTokenAddress)
  const governorAddress = useAppSelector((state) => state.proposal.deployedGovernorAddress);
  const { Moralis } = useMoralis();
  const [histories, setHistories] = useState<object>([]);
  const [title, setTitle] = useState("")
  const [purpose, setPurpose] = useState("")
  const [shortDesc, setShortDesc] = useState("")
  const [longDesc, setLongDesc] = useState("")
  const [coverImg, setCoverImg] = useState("")
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [explain, setExplain] = useState("")
  const [supply, setSupply] = useState("")
  const [holder, setHolder] = useState("")

  useEffect(() => {
    getHistories();
  }, [])

  async function getHistories() {
    const daoinfo = Moralis.Object.extend("DAOInfo");
    const query = new Moralis.Query(daoinfo);
    const results = await query.find({ useMasterKey: true });
    setHistories(results);
    setTitle(results[results.length - 1].get("title"));
    setPurpose(results[results.length - 1].get("purpose"));
    setShortDesc(results[results.length - 1].get("shortDesc"));
    setLongDesc(results[results.length - 1].get("longDesc"));
    setCoverImg(results[results.length - 1].get("coverImg"));
    setTokenName(results[results.length - 1].get("TokenName"));
    setTokenSymbol(results[results.length - 1].get("TokenSymbol"));
    setExplain(results[results.length - 1].get("explain"));
    setSupply(results[results.length - 1].get("supply"));
    setHolder(results[results.length - 1].get("holder"));
  }

  return (
    <div className={"something"} style={{ paddingLeft: 480, paddingTop: 100, paddingBottom: 100, height: 1600 }}>
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
      <div>
        <div className={"gotitle"}>
          Deployed DAO Info from Moralis
        </div>
        <div className={"tileItemHeader"} style={{ paddingTop: 0 }}>
          DAO title : {title}
        </div>
        <div className={"tileItemHeader"} style={{ paddingTop: 0 }}>
          DAO purpose : {purpose}
        </div>
        <div className={"tileItemHeader"} style={{ paddingTop: 0 }}>
          DAO shortDesc : {shortDesc}
        </div>
        <div className={"tileItemHeader"} style={{ paddingTop: 0 }}>
          DAO longDesc : {longDesc}
        </div>
        <div className={"tileItemHeader"} style={{ paddingTop: 0 }}>
          DAO coverImg : {coverImg}
          <img
            alt={`Uploaded coverImg`}
            src={"https://ipfs.infura.io/ipfs/" + coverImg}
            style={{ maxWidth: "400px", margin: "15px" }}
          />
        </div>
        <div className={"tileItemHeader"} style={{ paddingTop: 0 }}>
          DAO tokenName : {tokenName}
        </div>
        <div className={"tileItemHeader"} style={{ paddingTop: 0 }}>
          DAO tokenSymbol : {tokenSymbol}
        </div>
        <div className={"tileItemHeader"} style={{ paddingTop: 0 }}>
          DAO explain : {explain}
        </div>
        <div className={"tileItemHeader"} style={{ paddingTop: 0 }}>
          DAO supply : {supply}
        </div>
        <div className={"tileItemHeader"} style={{ paddingTop: 0 }}>
          DAO holder : {holder}
        </div>
      </div>
    </div>
  )
}

export default Dashboard