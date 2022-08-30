import { useState } from "react";
import { LineWobble } from "@uiball/loaders";
import { useNavigate } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import "../styles/App.css";
import "../styles/CreateDao.css";
import "../styles/Dashboard.css";
import "../styles/Modal.css";
import "../styles/Sidebar.css";
import BasicsComponent from "../components/BasicsComponent";
import TokenComponent from "../components/TokenComponent";
import SettingsComponent from "../components/SettingsComponent";
import { useAppDispatch, useAppSelector } from "state/hooks";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import {
  updatedeployedGovernorAddress,
  updatedeployedTokenAddress,
} from "../state/proposal/reducer";
import Header from "components/Header";
import { useNewMoralisObject } from "react-moralis";
import useStepRouter from "hooks/useStepRouter";
import { useTransactionAdder } from "state/transactions/hooks";
import { useDAOContract } from "hooks/useContract";
import { TransactionInfo } from "state/transactions/types";
import { TransactionType } from "state/transactions/types";
import { ethers } from "ethers";
import { TOKEN_ABI } from "abis/DaoToken";
import { sidebarPropType } from "types";

const GoLivePage = (props: sidebarPropType) => {
  useStepRouter(5);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { provider, connector } = useWeb3React();
  const [deployedGovernor, setdeployedGovernor] = useState<string>("");
  const [isLoading, setisLoading] = useState(false);
  const title = useAppSelector((state) => state.proposal.title);
  const purpose = useAppSelector((state) => state.proposal.purpose);
  const deployedTokenAddress = useAppSelector(
    (state) => state.proposal.deployedTokenAddress
  );
  const deployedTokenSymbol = useAppSelector(
    (state) => state.proposal.tokenSymbol
  );
  const longDesc = useAppSelector((state) => state.proposal.longDesc);
  const shortDesc = useAppSelector((state) => state.proposal.shortDesc);
  const tags = useAppSelector((state) => state.proposal.tags);
  const communityTags = useAppSelector((state) => state.proposal.communityTags);
  const tokenTitle = useAppSelector((state) => state.proposal.tokenTitle);
  const tokenSymbol = useAppSelector((state) => state.proposal.tokenSymbol);
  const explain = useAppSelector((state) => state.proposal.explain);
  const supply = useAppSelector((state) => state.proposal.supply);
  const holder = useAppSelector((state) => state.proposal.holder);
  const template = useAppSelector((state) => state.proposal.template);
  const support = useAppSelector((state) => state.proposal.support);
  const minApproval = useAppSelector((state) => state.proposal.minApproval);
  const voteDurDay = useAppSelector((state) => state.proposal.voteDurDay);
  const voteDurHour = useAppSelector((state) => state.proposal.voteDurHour);
  const web3authAddress = useAppSelector(
    (state) => state.proposal.Web3AuthAddress
  );
  const coverImgPath = useAppSelector((state) => state.proposal.coverImgPath);
  const iconImgPath = useAppSelector((state) => state.proposal.iconImgPath);
  const tokenAddress = useAppSelector(
    (state) => state.proposal.deployedTokenAddress
  );
  const { save } = useNewMoralisObject("DAOInfo");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const addTransaction = useTransactionAdder();
  const factory = useDAOContract();

  const addToken = async (deployedTokenAddress: string) => {
    const tokenAddress = deployedTokenAddress;
    const tokenSymbol = deployedTokenSymbol;
    const tokenDecimals = 18;
    const tokenImage =
      "https://user-images.githubusercontent.com/87822922/182279388-17db0814-b7f4-4b74-b79a-fdbda12c696b.png";

    try {
      const wasAdded = connector.provider?.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const DeployDAO = async (deployedTokenAddress: string) => {
    onClose();
    if (!isLoading) {
      setisLoading(true);
    }
    console.log("DEploying Goerli");
    console.log(deployedTokenAddress);
    const creatingGovernor =
      factory &&
      deployedTokenAddress !== null &&
      (await factory.createGovernor(
        title,
        deployedTokenAddress,
        title,
        purpose,
        longDesc,
        shortDesc
      ));
    const transactionInfo = {
      type: TransactionType.DEPOSIT_LIQUIDITY_STAKING,
    } as TransactionInfo;
    addTransaction(creatingGovernor, transactionInfo);
    await creatingGovernor.wait();
    const governorAddress = await factory?.deployedGovernorAddress();
    await addToken(deployedTokenAddress);
    await saveObject(deployedTokenAddress);
    dispatch(updatedeployedGovernorAddress(governorAddress));
    setdeployedGovernor(governorAddress);
    setisLoading(false);
  };
  const createToken = async () => {
    if (factory) {
      setisLoading(true);
      // setIsTokenDeploy(false)
      onClose();
      const creatingToken = await factory.createToken(
        tokenTitle,
        tokenSymbol,
        supply,
        holder,
        explain
      );
      const transactionInfo = {
        type: TransactionType.DEPOSIT_LIQUIDITY_STAKING,
      } as TransactionInfo;
      addTransaction(creatingToken, transactionInfo);
      await creatingToken.wait();
      const tokenAddress = await factory.deployedTokenAddress();
      dispatch(updatedeployedTokenAddress(tokenAddress));
      if (tokenAddress) {
        console.log("token address is:", tokenAddress);
        dispatch(updatedeployedTokenAddress(tokenAddress));
        await MintToken(tokenAddress);
        DeployDAO(tokenAddress);
        // localStorage.removeItem('maxStep');
      }
    }
  };

  const MintToken = async (tokenAddress: string) => {
    const signer = provider?.getSigner();
    const token = await new ethers.Contract(tokenAddress, TOKEN_ABI, signer);
    const amount = supply * 10 ** 18;
    const mintToken = await token.mint(holder, BigInt(amount));
    await mintToken.wait();
  };

  const saveObject = async (deployedTokenAddress: string) => {
    const data = {
      title: title,
      purpose: purpose,
      shortDesc: shortDesc,
      longDesc: longDesc,
      coverImg: coverImgPath,
      tags: tags,
      communityTags: communityTags,
      settingTemp: template,
      voteDurDay: voteDurDay,
      voteDurHour: voteDurHour,
      support: support,
      minApproval: minApproval,
      tokenName: tokenTitle,
      tokenSymbol: tokenSymbol,
      explain: explain,
      supply: supply.toString(),
      holder: holder,
      iconImg: iconImgPath,
    };
    await save(data, {
      onSuccess: (daoinfo) => {
        // Execute any logic that should take place after the object is saved.
        console.log("New object created with objectId: " + daoinfo.id);
        navigate(`/dao/${deployedTokenAddress}`);
      },
      onError: (error) => {
        // Execute any logic that should take place if the save fails.
        // error is a Moralis.Error with an error code and message.
        console.log(
          "Failed to create new object, with error code: " + error.message
        );
      },
    });
  };

  const Deploy = () => {
    if (tokenAddress) {
      DeployDAO(tokenAddress);
    } else {
      createToken();
    }
  };

  return (
    <>
      <div
        className={"something"}
        style={{
          paddingLeft: 480,
          paddingTop: 100,
          paddingBottom: 100,
          height: 1600,
          width: "100%",
        }}
      >
        <div className={"pageTitle"}>Go live</div>
        <div className={"pageDescription"} style={{ width: "486px" }}>
          Take your DAO public by completing the final checklist, cross-checking
          the values, and ensuring there aren’t any mis-spellings.
        </div>
        <div>
          <BasicsComponent />
        </div>
        <div>
          <SettingsComponent />
        </div>
        <div>
          <TokenComponent />
          {isLoading ? (
            <div>
              <div className={"subItemHeader"} style={{ paddingBottom: 20 }}>
                Hold on we are deploying your Governor and Token
              </div>
              <LineWobble size={750} color="#C94B32" />
            </div>
          ) : null}
        </div>
        {deployedGovernor.length >= 32 ? (
          <div className={"subItemHeader"}>
            <div>Deployed Governor Address: {deployedGovernor}</div>
          </div>
        ) : null}

        <div>
          <button id="buttonDeploy" className={"nextButton"} onClick={onOpen}>
            DEPLOY
          </button>
        </div>
      </div>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="#C94B32">Final Check</ModalHeader>
          <ModalBody className={"pageDescription"}>
            Ensure All values above are correct before proceeding. These values
            cannot be changed after deploying.
          </ModalBody>
          <ModalFooter>
            <div className="flex flex-row justify-between items-center w-full">
              <Button
                colorScheme="blue"
                mr={3}
                onClick={onClose}
                width="180px"
                variant="outline"
                color="#C94B32"
              >
                Close
              </Button>
              <Button
                variant="solid"
                colorScheme="#C94B32"
                bg="#C94B32"
                onClick={Deploy}
                width="180px"
                color="#FFFFFF"
              >
                Deploy
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GoLivePage;
