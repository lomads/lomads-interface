import React, { useEffect, useRef, useState } from "react";
import { get as _get } from 'lodash';
import { useAppSelector } from "state/hooks";
import {useParams} from "react-router-dom";
import "../../../styles/Global.css";
import "../../../styles/pages/DashBoard/DashBoard.css";
import MemberCard from "./MemberCard";
import TreasuryCard from "./TreasuryCard";
import { LeapFrog } from "@uiball/loaders";
import {
  SafeTransactionData,
  SafeTransactionDataPartial,
} from "@gnosis.pm/safe-core-sdk-types";
import { ImportSafe, safeService } from "connection/SafeCall";
import { EthSignSignature } from "@gnosis.pm/safe-core-sdk";
import { useWeb3React } from "@web3-react/core";
import {
  AllTransactionsListResponse,
  AllTransactionsOptions,
  SafeMultisigTransactionListResponse,
} from "@gnosis.pm/safe-service-client";
import SideModal from "./SideModal";
import SideBar from "./SideBar";
import axios from "axios";
import NotificationArea from "./NotificationArea";
import AddMember from "./MemberCard/AddMember";
import dashboardfooterlogo from "../../../assets/svg/dashboardfooterlogo.svg";
import { useAppDispatch } from "state/hooks";
import { getDao } from "state/dashboard/actions";
import { updateCurrentNonce, updateSafeThreshold } from "state/flow/reducer";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { daoURL } = useParams()
  const { provider, account } = useWeb3React();
  const daoName = useAppSelector((state) => state.flow.daoName);
  const invitedMembers = useAppSelector((state) => state.flow.invitedGang);
  const safeAddress = useAppSelector((state) => state.flow.safeAddress);
  const totalMembers = useAppSelector((state) => state.flow.totalMembers);
  const [pendingTransactions, setPendingTransactions] =
    useState<SafeMultisigTransactionListResponse>();
  const [executedTransactions, setExecutedTransactions] =
    useState<AllTransactionsListResponse>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [ownerCount, setOwnerCount] = useState<number>();
  const [safeTokens, setSafeTokens] = useState<Array<any>>([]);
  const [showNotification, setShowNotification] = useState<boolean>(true);
  const [showAddMember, setShowAddMember] = useState<boolean>(false);
  const [showNavBar, setShowNavBar] = useState<boolean>(false);
  const currentNonce = useAppSelector((state) => state.flow.currentNonce);
  const { DAO, DAOLoading } = useAppSelector((state) => state.dashboard);
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleShowMember = () => {
    setShowAddMember(!showAddMember);
  };
  const showSideBar = (_choice: boolean) => {
    setShowNavBar(_choice);
  };

  useEffect(() => {
    if(daoURL && (!DAO || (DAO && DAO.url !== daoURL)))
      dispatch(getDao(daoURL))
  }, [daoURL])

  const getPendingTransactions = async () => {
    const pendingTxs = await (
      await safeService(provider)
    ).getPendingTransactions(safeAddress);
    setPendingTransactions(pendingTxs);
    await ownersCount();
    console.log("pending", pendingTransactions?.results);
    // const nonce = pendingTxs.results[0] && pendingTxs.results[0].nonce;
    const nonce = await (await safeService(provider)).getNextNonce(safeAddress);
    console.log("nonce", nonce);
    dispatch(updateCurrentNonce(nonce));
    console.log("updated nonce:", currentNonce);
    await getTokens(safeAddress);
    setShowNotification(true);
  };

  const getExecutedTransactions = async () => {
    const options: AllTransactionsOptions = {
      executed: true,
      queued: false,
      trusted: true,
    };
    const executedTxs = await (
      await safeService(provider)
    ).getAllTransactions(safeAddress, options);
    setExecutedTransactions(executedTxs);
    console.log("executedTxs:", executedTxs);
  };

  const ownersCount = async () => {
    const safeSDK = await ImportSafe(provider, safeAddress);
    const owners = await safeSDK.getOwners();
    const threshold = await safeSDK.getThreshold();
    dispatch(updateSafeThreshold(threshold));
    setOwnerCount(owners.length);
  };

  const getTokens = async (safeAddress: string) => {
    await axios
      .get(
        `https://safe-transaction.goerli.gnosis.io/api/v1/safes/${safeAddress}/balances/usd/`
      )
      .then((tokens: any) => {
        setSafeTokens(tokens.data);
      });
  };
  
  useEffect(() => {
    getPendingTransactions();
    getExecutedTransactions();
    getTokens(safeAddress);
  }, [safeAddress]);

  if (showModal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }
  const showNotificationArea = (_choice: boolean) => {
    setShowNotification(_choice);
  };

  return (
    <>
     { DAOLoading ?
      <div style={{ height: '100vh', zIndex: 99999, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LeapFrog size={50} color="#C94B32" />
      </div> :
     <div
        className="dashBoardBody"
        onMouseEnter={() => {
          showSideBar(false);
        }}
      >
        <div className="DAOdetails">
          <div className="DAOname" onClick={getPendingTransactions}>
            { _get(DAO, 'name', '') }
          </div>
        </div>
        {pendingTransactions !== undefined &&
          pendingTransactions?.count >= 1 &&
          showNotification && (
            <NotificationArea
              pendingTransactionCount={pendingTransactions?.count}
              showNotificationArea={showNotificationArea}
            />
          )}
        <TreasuryCard
          safeAddress={safeAddress}
          pendingTransactions={pendingTransactions}
          executedTransactions={executedTransactions}
          ownerCount={ownerCount}
          toggleModal={toggleModal}
          fiatBalance={safeTokens.length >= 1 && safeTokens[0].fiatBalance}
          account={account}
          getPendingTransactions={getPendingTransactions}
          tokens={safeTokens}
          getExecutedTransactions={getExecutedTransactions}
        />
        <MemberCard
          totalMembers={totalMembers}
          toggleShowMember={toggleShowMember}
        />
        {/* <div className="appLogoArea">
          <div className="dashboardText">powered by Gnosis Safe</div>
          <div>
            <img src={dashboardfooterlogo} alt="footer logo" id="footerImage" />
          </div>
        </div> */}
      </div> }
      {showModal && (
        <SideModal
          toggleModal={toggleModal}
          tokens={safeTokens}
          totalMembers={totalMembers}
          safeAddress={safeAddress}
          getPendingTransactions={getPendingTransactions}
          showNotificationArea={showNotificationArea}
          toggleShowMember={toggleShowMember}
        />
      )}
      <SideBar
        name={daoName}
        showSideBar={showSideBar}
        showNavBar={showNavBar}
      />
      {showAddMember && <AddMember toggleShowMember={toggleShowMember} />}
    </>
  );
};

export default Dashboard;
