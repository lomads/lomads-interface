import React, { useEffect, useState } from "react";
import copyIcon from "../../../assets/svg/copyIcon.svg";
import coin from "../../../assets/svg/coin.svg";
import SafeButton from "UIpack/SafeButton";
import { ItreasuryCardType } from "types/DashBoardType";
import { ImportSafe, safeService } from "connection/SafeCall";
import { useWeb3React } from "@web3-react/core";
import PendingTransactions from "./TreasuryCard/PendingTransactions";
import TransactionComplete from "./TreasuryCard/TransactionComplete";
import { EthSignSignature } from "@gnosis.pm/safe-core-sdk";
import { SafeTransactionData } from "@gnosis.pm/safe-core-sdk-types/dist/src/types";

const TreasuryCard = (props: ItreasuryCardType) => {
  const { provider, account } = useWeb3React();
  const ownerCount = props.ownerCount;

  const hasUserApproved = (_index: number) => {
    return (
      props.pendingTransactions !== undefined &&
      props.pendingTransactions?.results[_index].confirmations?.some(
        (signer) => {
          if (signer.owner === account) {
            return true;
          }
          return false;
        }
      )
    );
  };

  const isOwner = async () => {
    const safeSDK = await ImportSafe(provider, props.safeAddress);
    return await safeSDK.isOwner(account as string);
  };

  const confirmTransaction = async (_safeTxHashs: string) => {
    const safeSDK = await ImportSafe(provider, props.safeAddress);
    const isOwner = await safeSDK.isOwner(account as string);
    if (isOwner) {
      const senderSignature = await safeSDK.signTransactionHash(_safeTxHashs);
      await (
        await safeService(provider)
      )
        .confirmTransaction(_safeTxHashs, senderSignature.data)
        .then((success) => {
          console.log("User confirmed the transaction");
        })
        .catch((err) => {
          console.log("error occured while confirming transaction", err);
        });
    } else {
      console.log("sorry you already approved the transaction");
    }
  };

  const executeTransactions = async (_txs: any) => {
    console.log(_txs);
    const safeSDK = await ImportSafe(provider, props.safeAddress);
    const safeTransactionData: SafeTransactionData = {
      to: _txs.to,
      value: _txs.value,
      data: _txs.data,
      operation: _txs.operation,
      safeTxGas: _txs.safeTxGas,
      baseGas: _txs.baseGas,
      gasPrice: _txs.gasPrice,
      gasToken: _txs.gasToken,
      refundReceiver: _txs.refundReceiver,
      nonce: _txs.nonce,
    };
    const safeTransaction = await safeSDK.createTransaction({
      safeTransactionData,
    });
    _txs.confirmations.forEach((confirmation: any) => {
      const signature = new EthSignSignature(
        confirmation.owner,
        confirmation.signature
      );
      safeTransaction.addSignature(signature);
    });
    const executeTxResponse = await safeSDK.executeTransaction(safeTransaction);
    const receipt =
      executeTxResponse.transactionResponse &&
      (await executeTxResponse.transactionResponse.wait());
    console.log("confirmed", receipt);
  };

  return (
    <div className="treasuryCard">
      <div className="treasuryHeader">
        <div
          id="treasuryCardTitle"
          onClick={(e) => {
            props.getPendingTransactions();
          }}
        >
          Treasury
        </div>
        <div className="headerDetails">
          <div>
            <hr className="vl" />
          </div>
          <div className="copyArea">
            <div
              className="copyLinkButton"
              onClick={() => {
                navigator.clipboard.writeText(props.safeAddress);
              }}
            >
              <img src={copyIcon} alt="copy" className="safeCopyImage" />
            </div>
            <div className="dashboardText">
              {props.safeAddress.slice(0, 18) +
                "..." +
                props.safeAddress.slice(-6)}
            </div>
          </div>
          <div className="copyArea">
            <img src={coin} alt="asset" />
            <div id="safeBalance">
              $ {props.fiatBalance && props.fiatBalance}
            </div>
            <div className="dashboardText">total balance</div>
          </div>
          <SafeButton
            height={40}
            width={150}
            titleColor="#B12F15"
            title="SEND TOKEN"
            bgColor="#FFFFFF"
            opacity="1"
            disabled={false}
            fontweight={400}
            fontsize={16}
            onClick={props.toggleModal}
          />
        </div>
      </div>
      {(props.executedTransactions !== undefined ||
        props.pendingTransactions?.count !== undefined) && (
        <>
          <div id="treasuryTransactions">
            <div className="dashboardText">Last Transactions</div>
            {props.pendingTransactions !== undefined &&
              props.pendingTransactions.results.length >= 1 &&
              props.pendingTransactions.results.map(
                (result: any, index: number) => {
                  return result.dataDecoded.method !== "multiSend" ? (
                    <PendingTransactions
                      showExecute={hasUserApproved(index)}
                      amount={result.dataDecoded.parameters[1].value}
                      recipient={result.dataDecoded.parameters[0].value}
                      confirmations={result.confirmations.length}
                      ownerCount={ownerCount}
                      confirmTransaction={confirmTransaction}
                      safeTxHash={result.safeTxHash}
                      isOwner={isOwner}
                      key={index}
                      executeTransactions={executeTransactions}
                      tokenAddress={result.to}
                      tokens={props.tokens}
                    />
                  ) : (
                    <PendingTransactions
                      showExecute={hasUserApproved(index)}
                      amount={"multisend"}
                      recipient={"multisend"}
                      confirmations={result.confirmations.length}
                      ownerCount={ownerCount}
                      confirmTransaction={confirmTransaction}
                      safeTxHash={result.safeTxHash}
                      isOwner={isOwner}
                      key={index}
                      executeTransactions={executeTransactions}
                      txs={result}
                    />
                  );
                }
              )}
            {props.executedTransactions !== undefined &&
              props.executedTransactions.results.length >= 1 &&
              props.executedTransactions.results.map(
                (result: any, index: any) => {
                  return result.txType !== "ETHEREUM_TRANSACTION" ? (
                    result.safe &&
                      result.dataDecoded.method !== "multiSend" && (
                        <TransactionComplete
                          credit={false}
                          amount={result.dataDecoded.parameters[1].value}
                          recipient={result.dataDecoded.parameters[0].value}
                          ownerCount={ownerCount}
                          key={index}
                          submissionDate={
                            result.confirmations[
                              result.confirmations.length - 1
                            ].submissionDate
                          }
                        />
                      )
                  ) : (
                    <>
                      <TransactionComplete
                        credit={true}
                        amount={result.transfers[0].value}
                        recipient={result.transfers[0].to}
                        ownerCount={ownerCount}
                        key={index}
                        submissionDate={result.executionDate}
                        tokenSymbol={result.transfers[0].tokenInfo.symbol}
                      />
                    </>
                  );
                }
              )}
          </div>
        </>
      )}
    </div>
  );
};

export default TreasuryCard;
