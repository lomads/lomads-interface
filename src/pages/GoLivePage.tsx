import React, { useState } from 'react'
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
import { useAppSelector } from 'state/hooks'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'state/hooks'
import { updatedeployedGovernorAddress, updatedeployedTokenAddress } from '../state/proposal/reducer'
import { getDB, getIPFSInstance, getOrbitInstance, getValue, setValue } from 'utils/orbitDB'

const GoLivePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const { provider, connector } = useWeb3React();
  const [deployedGovernor, setdeployedGovernor] = useState<string>("");
  const [isLoading, setisLoading] = useState(false);
  const title = useAppSelector((state) => state.proposal.title);
  const purpose = useAppSelector((state) => state.proposal.purpose);
  const deployedTokenAddress = useAppSelector((state) => state.proposal.deployedTokenAddress);
  const deployedTokenSymbol = useAppSelector((state) => state.proposal.tokenSymbol)
  const longDesc = useAppSelector((state) => state.proposal.longDesc);
  const shortDesc = useAppSelector((state) => state.proposal.shortDesc);
  const tokenTitle = useAppSelector((state) => state.proposal.tokenTitle)
  const tokenSymbol = useAppSelector((state) => state.proposal.tokenSymbol)
  const explain = useAppSelector((state) => state.proposal.explain)
  const supply = useAppSelector((state) => state.proposal.supply)
  const holder = useAppSelector((state) => state.proposal.holder)

  const addToken = async () => {
    const tokenAddress = deployedTokenAddress;
    const tokenSymbol = deployedTokenSymbol;
    const tokenDecimals = 18;
    const tokenImage = 'https://user-images.githubusercontent.com/87822922/182279388-17db0814-b7f4-4b74-b79a-fdbda12c696b.png';

    try {
      const wasAdded = connector.provider?.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });

      if (wasAdded) {
        console.log('Thanks for your interest!');
      } else {
        console.log('Your loss!');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const DeployDAO = async () => {
    // navigate("/dashboard");

    const factory = await factoryCall(provider);
    const creatingGovernor = await factory.createGovernor(title, deployedTokenAddress, title, purpose, longDesc, shortDesc);
    await creatingGovernor.wait();
    const governorAddress = await factory.deployedGovernorAddress();
    await addToken();
    setisLoading(false)
    dispatch(updatedeployedGovernorAddress(governorAddress))
    navigate("/dashboard");
    setdeployedGovernor(governorAddress);
  }

  const createToken = async () => {
    // const ipfs = await getIPFSInstance();
    // const orbitdb = await getOrbitInstance(ipfs);
    // const db = await getDB(orbitdb);
    // await setValue(db, 'aa', 'aa');
    // const value = await getValue(db, 'aa');
    // console.log(value);
    // return;

    const factory = await factoryCall(provider);
    setisLoading(true);
    const creatingToken = await factory.createToken(tokenTitle, tokenSymbol, supply, holder, explain);
    await creatingToken.wait();
    const tokenAddress = await factory.deployedTokenAddress();
    dispatch(updatedeployedTokenAddress(tokenAddress));
    await DeployDAO()
  }

  return (
    <div className={"something"} style={{ paddingLeft: 480, paddingTop: 100, paddingBottom: 100, height: 1600, width: "100%" }}>
      <div className={"pageTitle"}>
        Go live
      </div>
      <div className={"pageDescription"} style={{ width: "486px" }}>
        Take your crowdfund public by completing the final checklist, cross-checking the values, and ensuring there aren’t any mis-spellings.
      </div>
      <div>
        <BasicsComponent />
      </div>
      <div>
        <SettingsComponent />
      </div>
      <div>
        <TokenComponent />
        {
          isLoading ? (
            <div>
              <div className={"subItemHeader"} style={{ paddingBottom: 20 }}>
                Hold on we are deploying your Governor and Token
              </div>
              <LineWobble size={750} color="#C94B32" />
            </div>) : (null)
        }
      </div>
      {
        deployedGovernor.length >= 32 ? (
          <div className={"subItemHeader"}>
            <div>
              Deployed Governor Address: {deployedGovernor}
            </div>
          </div>
        ) : (null)
      }

      <div>
        <button id="buttonDeploy" className={"nextButton"} onClick={createToken}>
          DEPLOY
        </button>
      </div>
    </div>
  )
}

export default GoLivePage