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
import { useMoralis } from "react-moralis"
import { useAppDispatch } from 'state/hooks'
import { updatedeployedGovernorAddress, updatedeployedTokenAddress } from '../state/proposal/reducer'
import {  fetchFile } from '../utils/ipfs';

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
  const [tags, setTags] = useState<Array<string>>([])
  const [communityLinks, setCommunityLinks] = useState<Array<string>>([])
  const [settingTemp, setSettingTemp] = useState("")
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [explain, setExplain] = useState("")
  const [supply, setSupply] = useState("")
  const [holder, setHolder] = useState("")
  const [iconImg, setIconImg] = useState("")
  const [coverImg64, setCoverImg64] = useState("");
  const [iconImg64, setIconImg64] = useState("");
  const [support, setSupport] = useState("")
  const [voteDurDay, setVoteDurDate] = useState("")
  const [voteDurHour, setVoteDurHour] = useState("")
  const [minApproval, setMinApproval] = useState("")

  useEffect(() => {
    getHistories();
  }, [])

  async function getHistories() {
    const daoinfo = Moralis.Object.extend("DAOInfo");
    const query = new Moralis.Query(daoinfo);
    const results = await query.find({ useMasterKey: true });
    const lastIndex = results.length - 1; 
    setHistories(results);
    setTitle(results[lastIndex].get("title"));
    setPurpose(results[lastIndex].get("purpose"));
    setShortDesc(results[lastIndex].get("shortDesc"));
    setLongDesc(results[lastIndex].get("longDesc"));
    setCoverImg(results[lastIndex].get("coverImg"));
    setTags(results[lastIndex].get("tags"))
    setCommunityLinks(results[lastIndex].get("communityTags"))
    setSettingTemp(results[lastIndex].get("settingTemp"))
    setTokenName(results[lastIndex].get("tokenName"));
    setTokenSymbol(results[lastIndex].get("tokenSymbol"));
    setExplain(results[lastIndex].get("explain"));
    setSupply(results[lastIndex].get("supply"));
    setHolder(results[lastIndex].get("holder"));
    setIconImg(results[lastIndex].get("iconImg"));
    setVoteDurDate(results[lastIndex].get("voteDurDay"))
    setVoteDurHour(results[lastIndex].get("voteDurHour"))
    setMinApproval(results[lastIndex].get("minApproval"))
    setSupport(results[lastIndex].get("support"))
  }

  useEffect(() => {
    const init = async () => {
      if(!!coverImg) {
        const result: any = await fetchFile(coverImg);
        setCoverImg64(result);
      }

      if(!!iconImg) {
        const result: any = await fetchFile(iconImg);
        setIconImg64(result);
      }
    }
    init();
  }, [coverImg, iconImg]);

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
            src={"data:image/jpeg;base64," + coverImg64}
            style={{ maxWidth: "400px", margin: "15px" }}
          />
        </div>
        <div className={"tileItemHeader"} style={{ paddingTop: 0 }}>
          DAO tags : {tags}
        </div>
        <div className={"tileItemHeader"} style={{ paddingTop: 0 }}>
          DAO communityLinks : {communityLinks}
        </div>
        <div className={"tileItemHeader"} style={{ paddingTop: 0 }}>
          DAO settingTemp : {settingTemp}
        </div>
        <div className={"tileItemHeader"} style={{ paddingTop: 0 }}>
          DAO support : {support}
        </div>
        <div className={"tileItemHeader"} style={{ paddingTop: 0 }}>
          DAO minApproval : {minApproval}
        </div>
        <div className={"tileItemHeader"} style={{ paddingTop: 0 }}>
          DAO voteDurDay : {voteDurDay}
        </div>
        <div className={"tileItemHeader"} style={{ paddingTop: 0 }}>
          DAO voteDurHour : {voteDurHour}
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
        <div className={"tileItemHeader"} style={{ paddingTop: 0 }}>
          DAO iconImg : {iconImg}
          <img
            alt={`Uploaded iconImg`}
            src={"data:image/jpeg;base64," + iconImg64}
            style={{ maxWidth: "400px", margin: "15px" }}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard