import React, { useEffect, useRef } from "react";
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
import { AllTransactionsOptions } from "@gnosis.pm/safe-service-client";

const Dashboard = () => {
  const { provider } = useWeb3React();
  const daoName = useAppSelector((state) => state.flow.daoName);
  const invitedMembers = useAppSelector((state) => state.flow.invitedGang);
  const safeAddress = useAppSelector((state) => state.flow.safeAddress);
  const pendingTransactions = useRef<Array<Object>>([]);
  const executedTransactions = useRef<any>([]);
  const ownerCount = useRef<number>();

  const getPendingTransactions = async () => {
    const pendingTxs = await (
      await safeService(provider)
    ).getPendingTransactions(safeAddress);
    pendingTransactions.current = pendingTxs.results;
    await ownersCount();
  };

  const getExecutedTransactions = async () => {
    const options: AllTransactionsOptions = {
      executed: true,
      queued: true,
      trusted: true,
    };
    const executedTxs = await (
      await safeService(provider)
    ).getAllTransactions(safeAddress, options);
    executedTransactions.current = executedTxs.results;
    console.log(executedTransactions.current);
  };

  const ownersCount = async () => {
    const safeSDK = await ImportSafe(provider, safeAddress);
    const owners = await safeSDK.getOwners();
    ownerCount.current = owners.length;
  };

  useEffect(() => {
    getPendingTransactions();
    getExecutedTransactions();
  }, []);

  return (
    <>
      <div className="dashBoardBody">
        <div className="DAOdetails">
          <div className="DAOname" onClick={getPendingTransactions}>
            {daoName}
          </div>
        </div>
        <div className="notificationsArea"></div>
        <TreasuryCard
          safeAddress={safeAddress}
          pendingTransactions={pendingTransactions.current}
          executedTransactions={executedTransactions.current}
          ownerCount={ownerCount.current}
        />
        <MemberCard invitedMembers={invitedMembers} />
      </div>
    </>
  );
};

export default Dashboard;
