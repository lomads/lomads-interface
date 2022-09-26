import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "state/hooks";
import "../../../styles/Global.css";
import "../../../styles/pages/DashBoard/DashBoard.css";
import MemberCard from "./MemberCard";
import TreasuryCard from "./TreasuryCard";
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

const Dashboard = () => {
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
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleShowMember = () => {
    setShowAddMember(!showAddMember);
  };
  const getPendingTransactions = async () => {
    const pendingTxs = await (
      await safeService(provider)
    ).getPendingTransactions(safeAddress);
    setPendingTransactions(pendingTxs);
    await ownersCount();
    console.log("pending", pendingTransactions?.results);
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
      <div className="dashBoardBody">
        <div className="DAOdetails">
          <div className="DAOname" onClick={getPendingTransactions}>
            {daoName}
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
        />
        <MemberCard
          totalMembers={totalMembers}
          toggleShowMember={toggleShowMember}
        />
      </div>
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
      <SideBar name={daoName} />
      {showAddMember && <AddMember toggleShowMember={toggleShowMember} />}
    </>
  );
};

export default Dashboard;
