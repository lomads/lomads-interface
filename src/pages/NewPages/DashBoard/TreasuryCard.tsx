import React, { useEffect, useState, useMemo, useImperativeHandle } from "react";
import { get as _get, sortBy as _sortBy, filter as _filter, map as _map, find as _find } from 'lodash';
import { useAppSelector } from "state/hooks";
import SafeButton from "UIpack/SafeButton";
import { useWeb3React } from "@web3-react/core";
import { EthSignSignature } from "@gnosis.pm/safe-core-sdk";
import { SafeTransactionData } from "@gnosis.pm/safe-core-sdk-types/dist/src/types";
import copyIcon from "../../../assets/svg/copyIcon.svg";
import {
  AllTransactionsListResponse,
  AllTransactionsOptions,
  SafeMultisigTransactionListResponse,
} from "@gnosis.pm/safe-service-client";
import coin from "../../../assets/svg/coin.svg";
import { useParams } from "react-router-dom";
import { ItreasuryCardType } from "types/DashBoardType";
import { ImportSafe, safeService } from "connection/SafeCall";
import { Tooltip } from "@chakra-ui/react";
import PendingTxn from './TreasuryCard/PendingTxn';
import CompleteTxn from './TreasuryCard/CompleteTxn';

const TreasuryCard = (props: ItreasuryCardType) => {
  const { provider, account } = useWeb3React();
  const { daoURL } = useParams()
  const [copy, setCopy] = useState<boolean>(false);
  const [isAddressValid, setisAddressValid] = useState<boolean>(false);
  const [owner, setOwner] = useState<boolean>(false);
  const [threshold, setThreshold] = useState<number>();
  const [confirmTxLoading, setConfirmTxLoading] = useState<any>(null);
  const [rejectTxLoading, setRejectTxLoading] = useState<any>(null);
  const [executeTxLoading, setExecuteTxLoading] = useState<any>(null);

  const [pendingTxn, setPendingTxn] = useState<Array<any>>();
  const [executedTxn, setExecutedTxn] = useState<Array<any>>();

  const { DAO } = useAppSelector(store => store.dashboard);

  useImperativeHandle(props.innerRef, () => ({
    reload: (event: any) => {
      loadPendingTxn();
      loadExecutedTxn();
    }
  }));

  const isOwner = async (_safeAddress: string) => {
    const safeSDK = await ImportSafe(provider, _safeAddress);
    const condition = await safeSDK.isOwner(account as string);
    const threshold = await safeSDK.getThreshold();
    setOwner(condition)
    setThreshold(threshold)
  };

  const loadPendingTxn = async () => {
    (await safeService(provider))
      .getPendingTransactions(_get(DAO, 'safe.address', ''))
      .then(ptx => { props.onChangePendingTransactions(ptx); return ptx })
      .then(ptx => _get(ptx, 'results', []))
      .then(ptx =>
        _map(ptx, (p: any) => {
          let matchRejTx = _find(ptx, px => px.nonce === p.nonce && px.data === null);
          if (matchRejTx)
            return { ...p, rejectedTxn: matchRejTx }
          return p
        })
      )
      .then(ptx => _filter(ptx, p => _get(p, 'dataDecoded.method', '') === 'multiSend' || _get(p, 'dataDecoded.method', '') === 'transfer'))
      .then(ptx => _sortBy(ptx, 'nonce', 'ASC'))
      .then(ptx => { console.log(ptx); return ptx })
      .then(ptx => setPendingTxn(ptx))
  }

  const loadExecutedTxn = async () => {
    (await safeService(provider))
      .getAllTransactions(_get(DAO, 'safe.address', ''), { executed: true, queued: false, trusted: true })
      .then(etx => _get(etx, 'results', []))
      .then(etx => _filter(etx, p => _get(p, 'data')))
      .then(etx => _filter(etx, p => !_get(p, 'dataDecoded') || (_get(p, 'dataDecoded') && _get(p, 'dataDecoded.method', '') === 'transfer' || _get(p, 'dataDecoded.method', '') === 'multiSend')))
      .then(etx => { console.log(etx); return etx })
      .then(etx => setExecutedTxn(etx))
  }

  useEffect(() => {
    if (DAO && (DAO.url === daoURL)) {
      isOwner(_get(DAO, 'safe.address', ''))
      loadPendingTxn()
      loadExecutedTxn()
    } else {
      setPendingTxn(undefined);
      setExecutedTxn(undefined);
    }
  }, [DAO, daoURL])

  useEffect(() => {
    if (DAO && (DAO.url === daoURL)) {
      isOwner(_get(DAO, 'safe.address', ''))
      loadPendingTxn()
      loadExecutedTxn()
    } else {
      setPendingTxn(undefined);
      setExecutedTxn(undefined);
    }
  }, [DAO, daoURL])

  const handleConfirmTransaction = async (_safeTxHashs: string) => {
    try {
      setConfirmTxLoading(_safeTxHashs);
      const safeSDK = await ImportSafe(provider, _get(DAO, 'safe.address', ''));
      const isOwner = await safeSDK.isOwner(account as string);
      if (isOwner) {
        const senderSignature = await safeSDK.signTransactionHash(_safeTxHashs);
        await (await safeService(provider))
          .confirmTransaction(_safeTxHashs, senderSignature.data)
          .then(async (success) => {
            await (await safeService(provider)).getTransactionConfirmations(_safeTxHashs)
              .then(async (res) => {
                console.log(res)
                setPendingTxn(prev => {
                  return prev?.map(tx => {
                    if (tx.safeTxHash === _safeTxHashs)
                      return { ...tx, confirmations: res.results }
                    if (tx.rejectedTxn && tx.rejectedTxn.safeTxHash === _safeTxHashs)
                      return { ...tx, rejectedTxn: { ...tx.rejectedTxn, confirmations: res.results } }
                    return tx
                  })
                })
                setConfirmTxLoading(null);
                console.log("User confirmed the transaction");
              })
          })
          .catch((err) => {
            setConfirmTxLoading(null);
            console.log("error occured while confirming transaction", err);
          });
      } else {
        setConfirmTxLoading(null);
        console.log("sorry you already approved the transaction");
      }
    } catch (e) {
      console.log(e)
      setConfirmTxLoading(null);
    }
  };

  const handleRejectTransaction = async (_nonce: number) => {
    try {
      setRejectTxLoading(_nonce);
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
          console.log(result)
          console.log(
            "on chain rejection transaction has been proposed successfully."
          );
        })
        .catch((err) => {
          setRejectTxLoading(null);
          console.log(err)
          console.log("an error occured while proposing a reject transaction.");
        });
      await (await safeService(provider))
        .confirmTransaction(safeTxHash, signature.data)
        .then(async (result) => {
          console.log("on chain transaction has been confirmed by the signer");
          await (await safeService(provider)).getTransactionConfirmations(safeTxHash)
            .then(async (res) => {
              console.log(res)
              setRejectTxLoading(null);
              setPendingTxn(prev => {
                let succTxn = _find(prev, p => p.nonce === _nonce)
                return prev?.map(tx => {
                  if (tx.safeTxHash === succTxn.safeTxHash)
                    return { ...succTxn, rejectedTxn: { safeTxHash, data: null, nonce: _nonce, confirmations: res.results } }
                  return tx
                })
              })
              console.log("User confirmed the transaction");
            })
        })
        .catch((err) => {
          setRejectTxLoading(null);
          console.log("an error occured while confirming a reject transaction.");
        });
    } catch (e) {
      console.log(e)
      setRejectTxLoading(null);
    }
  };


  const handleExecuteTransactions = async (_txs: any, reject: boolean | undefined) => {
    try {
      setExecuteTxLoading(_txs.safeTxHash)
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
      setExecuteTxLoading(null)
      if (reject) {
        setPendingTxn(prev => {
          let parentTxn = _find(prev, p => p.rejectedTxn.safeTxHash === _txs.safeTxHash)
          return prev?.filter(tx => tx.safeTxHash !== parentTxn.safeTxHash)
        })
      } else {
        setPendingTxn(prev => {
          let parentTxn = _find(prev, p => p.safeTxHash === _txs.safeTxHash)
          return prev?.filter(tx => tx.safeTxHash !== parentTxn.safeTxHash)
        })
        await loadExecutedTxn()
      }
      //await props.getPendingTransactions();
    } catch (e) {
      console.log(e)
      setExecuteTxLoading(null)
    }
  };

  const balance = useMemo(() => {
    if (props.fiatBalance) {
      let total = 0;
      props.fiatBalance.map((t: any) => {
        total = +t.fiatBalance + total
      })
      return total.toFixed(2);
    }
    return 0
  }, [props.fiatBalance]);

  return (
    <div className="treasuryCard">
      <div className="treasuryHeader">
        <div id="treasuryCardTitle" onClick={(e) => {
          loadPendingTxn()
          loadExecutedTxn()
        }}>Treasury</div>
        <div className="headerDetails">
          <div><hr className="vl" /></div>
          <div className="copyArea" onClick={() => setCopy(true)} onMouseOut={() => setCopy(false)}>
            <Tooltip label={copy ? "copied" : "copy"}>
              <div className="copyLinkButton" onClick={() => navigator.clipboard.writeText(_get(DAO, 'safe.address', ''))}>
                <img src={copyIcon} alt="copy" className="safeCopyImage" />
              </div>
            </Tooltip>
            <div className="dashboardText">{`${_get(props, 'safeAddress', '').slice(0, 6)}...${_get(props, 'safeAddress', '').slice(-4)}`}</div>
          </div>
          <div className="copyArea">
            <>
              <img src={coin} alt="asset" />
              <div id="safeBalance">{`$ ${balance}`}</div>
            </>
            <div className="dashboardText">total balance</div>
          </div>
          {owner && <SafeButton onClick={props.toggleModal} height={40} width={150} titleColor="#B12F15" title="SEND TOKEN" bgColor="#FFFFFF" opacity="1" disabled={false} fontweight={400} fontsize={16} />}
        </div>
      </div>
      <>
        {
          pendingTxn !== undefined && executedTxn !== undefined &&
          <div id="treasuryTransactions">
            <div className="dashboardText" style={{ marginBottom: '6px' }}>Last Transactions</div>
            {
              pendingTxn.map((ptx, index) =>
                <PendingTxn owner={owner} threshold={threshold} executeTransactions={handleExecuteTransactions} confirmTransaction={handleConfirmTransaction} rejectTransaction={handleRejectTransaction} tokens={props.tokens} transaction={ptx} confirmTxLoading={confirmTxLoading} rejectTxLoading={rejectTxLoading} executeTxLoading={executeTxLoading} />
              )
            }
            {
              executedTxn.map((ptx, index) =>
                <CompleteTxn owner={owner} transaction={ptx} tokens={props.tokens} />
              )
            }
          </div>
        }
      </>
    </div>
  )

}

export default TreasuryCard