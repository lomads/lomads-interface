import React, { useEffect, useState, useMemo } from "react";
import { get as _get, find as _find } from 'lodash';
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
import { Tooltip } from "@chakra-ui/react";
import { useAppSelector } from "state/hooks";

const TreasuryCard = (props: ItreasuryCardType) => {
  const { provider, account } = useWeb3React();
  const ownerCount = props.ownerCount;
  const [copy, setCopy] = useState<boolean>(false);
  const [isAddressValid, setisAddressValid] = useState<boolean>(false);
  const { DAO, DAOLoading } = useAppSelector((state) => state.dashboard);

  const isOwner = async () => {
    const safeSDK = await ImportSafe(provider, _get(DAO, 'safe.address', ''));
    const condition = await safeSDK.isOwner(account as string);
    return condition;
  };
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

  const amIAdmin = useMemo(() => {
    if(DAO) {
      let user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet') === account?.toLowerCase() && m.role === 'ADMIN')
      if(user)
        return true
      return false
    }
    return false;
  }, [account, DAO])


  useEffect(() => {
    (async (_address: string, _safeAddress: string) => {
      const condition = await isOwner();
      if (condition) {
        setisAddressValid(true);
      }
    })(account as string, _get(DAO, 'safe.address', ''));
  }, [account, isOwner, _get(DAO, 'safe.address', ''), provider]);

  useEffect(() => {
    setisAddressValid(false);
  }, [account as string]);

  const confirmTransaction = async (_safeTxHashs: string) => {
    const safeSDK = await ImportSafe(provider, _get(DAO, 'safe.address', ''));
    const isOwner = await safeSDK.isOwner(account as string);
    if (isOwner) {
      const senderSignature = await safeSDK.signTransactionHash(_safeTxHashs);
      await (
        await safeService(provider)
      )
        .confirmTransaction(_safeTxHashs, senderSignature.data)
        .then(async (success) => {
          console.log("User confirmed the transaction");
          await props.getPendingTransactions();
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
    const safeSDK = await ImportSafe(provider, _get(DAO, 'safe.address', ''));
    const safeTransactionData: SafeTransactionData = {
      to: _txs.to,
      value: _txs.value,
      data: _txs.data !== null ? _txs.data : "0x",
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
    _txs.confirmations &&
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
    await props.getPendingTransactions();
  };

  const rejectTransaction = async (_nonce: number) => {
    const safeSDK = await ImportSafe(provider, _get(DAO, 'safe.address', ''));
    const transactionObject = await safeSDK.createRejectionTransaction(_nonce);
    const safeTxHash = await safeSDK.getTransactionHash(transactionObject);
    const signature = await safeSDK.signTransactionHash(safeTxHash);
    const senderAddress = account as string;
    const safeAddress = _get(DAO, 'safe.address', '');
    await (
      await safeService(provider)
    )
      .proposeTransaction({
        safeAddress,
        safeTransactionData: transactionObject.data,
        safeTxHash,
        senderAddress,
        senderSignature: signature.data,
      })
      .then((result) => {
        console.log(
          "on chain rejection transaction has been proposed successfully."
        );
      })
      .catch((err) => {
        console.log("an error occured while proposing a reject transaction.");
      });
    await (
      await safeService(provider)
    )
      .confirmTransaction(safeTxHash, signature.data)
      .then(async (result) => {
        console.log("on chain transaction has been confirmed by the signer");
        await props.getPendingTransactions();
      })
      .catch((err) => {
        console.log("an error occured while confirming a reject transaction.");
      });
  };
  return (
    <div className="treasuryCard">
      <div className="treasuryHeader">
        <div
          id="treasuryCardTitle"
          onClick={(e) => {
            props.getPendingTransactions();
            props.getExecutedTransactions();
          }}
        >
          Treasury
        </div>
        <div className="headerDetails">
          <div>
            <hr className="vl" />
          </div>
          <div
            className="copyArea"
            onClick={() => {
              setCopy(true);
            }}
            onMouseOut={() => {
              setCopy(false);
            }}
          >
            <Tooltip label={copy ? "copied" : "copy"}>
              <div
                className="copyLinkButton"
                onClick={() => {
                  navigator.clipboard.writeText(_get(DAO, 'safe.address', ''));
                }}
              >
                <img src={copyIcon} alt="copy" className="safeCopyImage" />
              </div>
            </Tooltip>
            <div className="dashboardText">
              {_get(DAO, 'safe.address', '').slice(0, 6) +
                "..." +
                _get(DAO, 'safe.address', '').slice(-4)}
            </div>
          </div>
          <div className="copyArea">
            <img src={coin} alt="asset" />
            <div id="safeBalance">
              $ {props.fiatBalance ? props.fiatBalance : "0.0"}
            </div>
            <div className="dashboardText">total balance</div>
          </div>
          {isAddressValid && amIAdmin && (
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
          )}
        </div>
      </div>
      {(props.executedTransactions !== undefined ||
        props.pendingTransactions?.count !== undefined) && (
        <>
          <div id="treasuryTransactions">
            <div className="dashboardText">Last Transactions</div>
            {props.pendingTransactions !== undefined &&
              props.pendingTransactions.results.length >= 1 &&
              props.pendingTransactions.results
                .sort((a, b) => {
                  return a.nonce - b.nonce;
                })
                .map((result: any, index: number) => {
                  return result.dataDecoded !== null &&
                    result.dataDecoded.method !== "multiSend" ? (
                    <PendingTransactions
                      showExecute={hasUserApproved(index)}
                      amount={
                        result.dataDecoded !== null &&
                        result.dataDecoded.parameters[1].value
                      }
                      recipient={
                        result.dataDecoded !== null &&
                        result.dataDecoded.parameters[0].value
                      }
                      confirmations={
                        result.confirmations && result.confirmations.length
                      }
                      ownerCount={ownerCount}
                      confirmTransaction={confirmTransaction}
                      safeTxHash={result.safeTxHash}
                      isOwner={isOwner}
                      key={index}
                      executeTransactions={executeTransactions}
                      txs={result}
                      tokenAddress={result.to}
                      tokens={props.tokens}
                      isAddressValid={isAddressValid}
                      rejectTransaction={rejectTransaction}
                    />
                  ) : result.dataDecoded !== null ? (
                    result.dataDecoded.parameters[0].valueDecoded.map(
                      (multiresult: any, multiIndex: number) => {
                        return (
                          <PendingTransactions
                            showExecute={hasUserApproved(index)}
                            amount={multiresult.dataDecoded.parameters[1].value}
                            recipient={
                              multiresult.dataDecoded.parameters[0].value +
                              "mul "
                            }
                            confirmations={
                              result.confirmations &&
                              result.confirmations.length
                            }
                            ownerCount={ownerCount}
                            confirmTransaction={confirmTransaction}
                            safeTxHash={result.safeTxHash}
                            isOwner={isOwner}
                            key={multiIndex}
                            executeTransactions={executeTransactions}
                            txs={result}
                            tokenAddress={multiresult.dataDecoded.to}
                            tokens={props.tokens}
                            isAddressValid={isAddressValid}
                            rejectTransaction={rejectTransaction}
                            multiIndex={multiIndex}
                          />
                        );
                      }
                    )
                  ) : (
                    <>
                      <PendingTransactions
                        showExecute={hasUserApproved(index)}
                        amount={"rejection"}
                        recipient={"rejection"}
                        confirmations={
                          result.confirmations && result.confirmations.length
                        }
                        ownerCount={ownerCount}
                        confirmTransaction={confirmTransaction}
                        safeTxHash={result.safeTxHash}
                        isOwner={isOwner}
                        key={index}
                        executeTransactions={executeTransactions}
                        txs={result}
                        tokenAddress={undefined}
                        tokens={props.tokens}
                        isAddressValid={isAddressValid}
                        rejectTransaction={rejectTransaction}
                      />
                    </>
                  );
                })}
            {props.executedTransactions !== undefined &&
              props.executedTransactions.results.length >= 1 &&
              props.executedTransactions.results.map(
                (result: any, index: any) => {
                  return result.txType === "ETHEREUM_TRANSACTION" ? (
                    result.transfers[0] !== undefined &&
                      result.transfers[0].tokenInfo !== null && (
                        <>
                          <TransactionComplete
                            credit={true}
                            amount={result.transfers[0].value}
                            recipient={result.transfers[0].to}
                            ownerCount={ownerCount}
                            key={index}
                            submissionDate={result.executionDate}
                            tokenSymbol={result.transfers[0].tokenInfo.symbol}
                            tokenAddress={result.transfers[0].tokenAddress}
                            tokens={props.tokens}
                          />
                        </>
                      )
                  ) : result.safe &&
                    result.dataDecoded !== null &&
                    result.dataDecoded.method !== "multiSend" ? (
                    <TransactionComplete
                      credit={false}
                      amount={result.dataDecoded.parameters[1].value}
                      recipient={result.dataDecoded.parameters[0].value}
                      ownerCount={ownerCount}
                      key={index}
                      submissionDate={
                        result.confirmations[result.confirmations.length - 1]
                          .submissionDate
                      }
                      tokenAddress={result.to}
                      tokens={props.tokens}
                    />
                  ) : (
                    result.dataDecoded !== null &&
                    result.dataDecoded.parameters[0].valueDecoded.map(
                      (multiresult: any, index: number) => {
                        return (
                          <TransactionComplete
                            credit={false}
                            amount={multiresult.dataDecoded.parameters[1].value}
                            recipient={
                              multiresult.dataDecoded.parameters[0].value +
                              "mul "
                            }
                            ownerCount={ownerCount}
                            key={index}
                            submissionDate={
                              result.confirmations[
                                result.confirmations.length - 1
                              ].submissionDate
                            }
                            tokenAddress={multiresult.to}
                            tokens={props.tokens}
                            index={index}
                          />
                        );
                      }
                    )
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
