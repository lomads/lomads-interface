import React, { useEffect, useState, useMemo, useImperativeHandle } from "react";
import { get as _get, sortBy as _sortBy, filter as _filter, map as _map, find as _find } from 'lodash';
import { useAppSelector } from "state/hooks";
import SafeButton from "UIpack/SafeButton";
import { useWeb3React } from "@web3-react/core";
import { EthSignSignature } from "@gnosis.pm/safe-core-sdk";
import { SafeTransactionData } from "@gnosis.pm/safe-core-sdk-types/dist/src/types";
import copyIcon from "../../../assets/svg/copyIcon.svg";
import { tokenCallSafe } from "connection/DaoTokenCall";
import { getSafeTokens } from 'utils'
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";
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
import useRole from "hooks/useRole";
import { SupportedChainId } from "constants/chains";
import { usePrevious } from "hooks/usePrevious";
import axiosHttp from 'api'
import { nanoid } from "@reduxjs/toolkit";
import moment from "moment";

const TreasuryCard = (props: ItreasuryCardType) => {
	const { provider, account, chainId, ...rest } = useWeb3React();
	console.log("useWeb3React", chainId, rest)
	const { daoURL } = useParams()
	const [copy, setCopy] = useState<boolean>(false);
	const [isAddressValid, setisAddressValid] = useState<boolean>(false);
	const [owner, setOwner] = useState<boolean>(false);
	const [threshold, setThreshold] = useState<number>();
	const [confirmTxLoading, setConfirmTxLoading] = useState<any>(null);
	const [rejectTxLoading, setRejectTxLoading] = useState<any>(null);
	const [executeTxLoading, setExecuteTxLoading] = useState<any>(null);
	const [executeFirst, setExecuteFirst] = useState<any>(null);
	const currentNonce = useAppSelector((state) => state.flow.currentNonce);
	const [pendingTxn, setPendingTxn] = useState<Array<any>>();
	const [executedTxn, setExecutedTxn] = useState<Array<any>>();
	const [offChainPendingTxn, setOffChainPendingTxn] = useState<Array<any>>();
	const [offChainExecutedTxn, setOffChainExecutedTxn] = useState<Array<any>>();

	const { DAO } = useAppSelector(store => store.dashboard);

	const { myRole, can, isSafeOwner } = useRole(DAO, account);

	const [totalUSD, setTotalUSD] = useState<any>('0');

	const prevDAO = usePrevious(DAO);

	useEffect(() => {
		if (prevDAO && !DAO) {
			setExecutedTxn(undefined)
			setPendingTxn(undefined)
		}
	}, [DAO, prevDAO])

	useImperativeHandle(props.innerRef, () => ({
		reload: (event: any) => {
			loadPendingTxn();
			loadExecutedTxn();
			loadOffChainTxn();
		}
	}));

	const amIAdmin = useMemo(() => {
		if (DAO) {
			let user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase() && m.role === 'ADMIN')
			if (user)
				return true
			return false
		}
		return false;
	}, [account, DAO])

	const isOwner = async (_safeAddress: string) => {
		const safeSDK = await ImportSafe(provider, _safeAddress);
		const condition = await safeSDK.isOwner(account as string);
		const threshold = await safeSDK.getThreshold();
		setOwner(condition)
		setThreshold(threshold)
	};

	const loadOffChainTxn = async () => {
		return axiosHttp.get(`transaction/off-chain?daoId=${DAO._id}`)
		.then(txn => txn.data)
		.then(txn => {
			const pTxn = txn.filter((tx:any) => !tx.isExecuted)
			const eTxn = txn.filter((tx:any) => tx.isExecuted)
			return { pTxn, eTxn }
		})
	}

	const loadPendingTxn = async () => {
		(await safeService(provider, `${chainId}`))
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
			.then(ptx => _filter(ptx, p => {
				let matchRejTx = _find(ptx, px => px.nonce === p.nonce && px.data === null);
				if (matchRejTx)
					return matchRejTx.safeTxHash !== p.safeTxHash
				return true
			}))
			.then(ptx => _filter(ptx, p => !p.dataDecoded || (_get(p, 'dataDecoded.method', '') === 'multiSend' || _get(p, 'dataDecoded.method', '') === 'transfer')))
			.then(async ptx => {
				const { pTxn } = await loadOffChainTxn() 
				return ptx.concat(pTxn)
			})
			.then(ptx => _sortBy(ptx, 'submissionDate', 'ASC'))
			.then(ptx => { console.log("loadPendingTxn", ptx); return ptx })
			.then(ptx => setPendingTxn(ptx))
	}

	const loadExecutedTxn = async () => {
		(await safeService(provider, `${chainId}`))
			.getAllTransactions(_get(DAO, 'safe.address', ''), { executed: true, queued: false, trusted: true })
			.then(etx => _get(etx, 'results', []))
			//.then(etx => _filter(etx, p => _get(p, 'data')))
			.then(etx => _filter(etx, p => !_get(p, 'dataDecoded') || (_get(p, 'dataDecoded') && _get(p, 'dataDecoded.method', '') === 'transfer' || _get(p, 'dataDecoded.method', '') === 'multiSend')))
			.then(async etx => {
				const { eTxn } = await loadOffChainTxn() 
				return etx.concat(eTxn)
			})
			.then(ptx => _sortBy(ptx, 'submissionDate', 'ASC'))
			.then(etx => { console.log("loadExecutedTxn", etx); return etx })
			.then(etx => setExecutedTxn(etx))
	}

	useEffect(() => {
		if (pendingTxn) {
			pendingTxn.map((tx, i) => {
				if (i === 0)
					setExecuteFirst(tx.nonce)
			})
		}
	}, [pendingTxn])

	useEffect(() => {
		if (threshold) {
			if (DAO && (DAO.url === daoURL)) {
				isOwner(_get(DAO, 'safe.address', ''))
				loadPendingTxn()
				loadExecutedTxn()
				loadOffChainTxn()
			} else {
				setPendingTxn(undefined);
				setExecutedTxn(undefined);
				setOffChainPendingTxn(undefined);
				setOffChainExecutedTxn(undefined)
			}
		}
	}, [DAO, daoURL, threshold])

	useEffect(() => {
		if (chainId) {
			if (DAO && (DAO.url === daoURL)) {
				isOwner(_get(DAO, 'safe.address', ''))
				loadPendingTxn()
				loadExecutedTxn()
				loadOffChainTxn()
			} else {
				setPendingTxn(undefined);
				setExecutedTxn(undefined);
				setOffChainPendingTxn(undefined);
				setOffChainExecutedTxn(undefined)
			}
		}
	}, [DAO, daoURL, chainId])

	useEffect(() => {
		if (props.tokens) {
			let total = 0;
			props.tokens.map((t: any) => {
				total = +t.fiatBalance + total
			})
			setTotalUSD(total.toFixed(2))
		}
	}, [props.tokens])


	const createOnChainTxn = async (txn: any, action: string | null) => {
		console.log(txn);
        return new Promise(async (resolve, reject) => {
            try {
                if(!chainId) return;
				const amountValue = _get(txn, 'dataDecoded.parameters[1].value')
				const receiver = _get(txn, 'dataDecoded.parameters[0].value')
                const tokens = await getSafeTokens(chainId, _get(DAO, 'safe.address', null))
                let selToken = _find(tokens, t => t.tokenAddress === _get(txn, 'token.tokenAddress', null))
                if (selToken && (_get(selToken, 'balance', 0)) < amountValue)
                    return console.log('Low token balance');
                const token = await tokenCallSafe(_get(txn, 'token.tokenAddress', null));
                const safeSDK = await ImportSafe(provider, _get(DAO, 'safe.address', ''));
                const nonce = await (await safeService(provider, `${chainId}`)).getNextNonce(_get(DAO, 'safe.address', null));
				console.log("nonce", nonce)
				console.log("amountValue", amountValue)
				console.log("receiver", receiver)
                const unsignedTransaction = await token.populateTransaction.transfer(
                    receiver,
                    BigInt(amountValue)
                )
                const safeTransactionData: SafeTransactionDataPartial[] = [{
                    to: _get(txn, 'token.tokenAddress', null),
                    data: unsignedTransaction.data as string,
                    value: "0",
                }];
				console.log(safeTransactionData)
                const safeTransaction = await safeSDK.createTransaction({
                    safeTransactionData,
                    options: { nonce }
                });
				console.log(safeTransaction)
                const safeTxHash = await safeSDK.getTransactionHash(safeTransaction);
				console.log("safeTxHash", safeTxHash)
                const signature = await safeSDK.signTransactionHash(safeTxHash);
                const senderAddress = account as string;
                const safeAddress = _get(DAO, 'safe.address', '');
                await (await safeService(provider, `${chainId}`))
                .proposeTransaction({
                    safeAddress,
                    safeTransactionData: safeTransaction.data,
                    safeTxHash,
                    senderAddress,
                    senderSignature: signature.data,
                })
                .then(async (value) => {
                    console.log("transaction has been proposed");
					if(action === 'confirm') {
						console.log("safeTxHash", safeTxHash)
						await ( await safeService(provider, `${chainId}`) )
						.confirmTransaction(safeTxHash, signature.data)
						.then(async (success) => {
							console.log("transaction has been confirmed");
							await axiosHttp.delete(`transaction/off-chain/${txn.safeTxHash}`)
							console.log("success", success)
							resolve({ safeTxHash, signature, nonce })
						})
						.catch((err) => {
							console.log("error occured while confirming transaction", err);
							return reject(null)
						});
					} else {
						await axiosHttp.delete(`transaction/off-chain/${txn.safeTxHash}`)
						return resolve({ safeTxHash, signature, nonce })
					}
                })
                .catch((error) => {
                    console.log("an error occoured while proposing transaction", error);
                    return reject(null)
                });
            } catch (e) {
                console.log(e)
                reject(null)
            }
        })
    }

	const handleConfirmTransaction = async (_safeTxHashs: string, txn: any) => {
		if(txn.offChain && _get(txn, 'token.symbol') === 'SWEAT'){
			setConfirmTxLoading(_safeTxHashs);
			axiosHttp.patch(`transaction/off-chain/${_safeTxHashs}/approve`,
				{
					confirmations: isSafeOwner ? [{
						owner: account,
						submissionDate:  moment().utc().toDate()
					}]: []
				}
			)
			.then(res => loadPendingTxn())
			.catch(e => console.log(e))
			.finally(() => setConfirmTxLoading(null))
		} else if(txn.offChain && _get(txn, 'token.symbol') !== 'SWEAT') { 
			await createOnChainTxn(txn, 'confirm')
			loadPendingTxn();
		} else {
			try {
				setConfirmTxLoading(_safeTxHashs);
				const safeSDK = await ImportSafe(provider, _get(DAO, 'safe.address', ''));
				const isOwner = await safeSDK.isOwner(account as string);
				if (isOwner) {
					const senderSignature = await safeSDK.signTransactionHash(_safeTxHashs);
					await (await safeService(provider, `${chainId}`))
						.confirmTransaction(_safeTxHashs, senderSignature.data)
						.then(async (success) => {
							await (await safeService(provider, `${chainId}`)).getTransactionConfirmations(_safeTxHashs)
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
		}
	};

	const handleRejectTransaction = async (_n: number, txn: any = null) => {
		let _nonce: any = _n;
		if(txn.offChain && _get(txn, 'token.symbol') === 'SWEAT'){
			setRejectTxLoading(_nonce);
			axiosHttp.patch(`transaction/off-chain/${_nonce}/reject`,
				{
					_nonce,
					safeTxHash: nanoid(32),
					value: "0",
					submissionDate:  moment().utc().toDate(),
					token:{ symbol: 'SWEAT' },
					confirmations: isSafeOwner ? [{
						owner: account,
						submissionDate:  moment().utc().toDate()
					}] : [],
					dataDecoded: null
				}
			)
			.then(res => loadPendingTxn())
			.catch(e => console.log(e))
			.finally(() => setRejectTxLoading(null))
		} else {
			try {
				setRejectTxLoading(_nonce);
				const safeSDK = await ImportSafe(provider, _get(DAO, 'safe.address', ''));
				if(txn.offChain && _get(txn, 'token.symbol') !== 'SWEAT') {
					const response = await createOnChainTxn(txn, null)
					console.log(response)
					_nonce = _get(response, 'nonce', null);
				}
				console.log("_nonce", _nonce)
				const transactionObject = await safeSDK.createRejectionTransaction(_nonce);
				const safeTxHash = await safeSDK.getTransactionHash(transactionObject);
				const signature = await safeSDK.signTransactionHash(safeTxHash);
				const senderAddress = account as string;
				const safeAddress = _get(DAO, 'safe.address', '');
				await (
					await safeService(provider, `${chainId}`)
				)
					.proposeTransaction({
						safeAddress,
						safeTransactionData: transactionObject.data,
						safeTxHash,
						senderAddress,
						senderSignature: signature.data,
					})
					.then(async (result) => {
						console.log(result)
						console.log(
							"on chain rejection transaction has been proposed successfully."
						);
						await (await safeService(provider, `${chainId}`))
						.confirmTransaction(safeTxHash, signature.data)
						.then(async (result) => {
							console.log("on chain transaction has been confirmed by the signer");
							await loadPendingTxn()
							setRejectTxLoading(null);
						})
						.catch((err) => {
							setRejectTxLoading(null);
							console.log("an error occured while confirming a reject transaction.");
						});
					})
					.catch((err) => {
						setRejectTxLoading(null);
						console.log(err)
						console.log("an error occured while proposing a reject transaction.");
					});
			} catch (e) {
				console.log(e)
				setRejectTxLoading(null);
			}
		}
	};


	const handleExecuteTransactions = async (_txs: any, reject: boolean | undefined) => {
		let txn = _txs;
		if(txn.offChain && _get(txn, 'token.symbol') === 'SWEAT'){
			setExecuteTxLoading(txn.safeTxHash)
			axiosHttp.get(`transaction/off-chain/${txn.safeTxHash}/execute${reject ? '?rejectedTxn=true' : ''}`)
			.then(res => loadPendingTxn())
			.catch(e => console.log(e))
			.finally(() => setExecuteTxLoading(null))
		} else {
			if(txn.rejectedTxn)
				txn = txn.rejectedTxn;
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
				console.log(safeTransactionData)
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
				await loadPendingTxn()
				await loadExecutedTxn()
			} catch (e) {
				console.log(e)
				setExecuteTxLoading(null)
			}
		}
	};

	// const balance = useMemo(() => {
	// 	if (props.fiatBalance) {
	// 		let total = 0;
	// 		props.fiatBalance.map((t: any) => {
	// 			total = +t.fiatBalance + total
	// 		})
	// 		return total.toFixed(2);
	// 	}
	// 	return 0
	// }, [props.fiatBalance]);

	const hasValidToken = useMemo(() => {
		if (props.tokens && props.tokens.length > 0) {
			let valid = props.tokens.some((t: any) => +t.balance > 0)
			return valid
		}
		return false
	}, [props.tokens])

	if (!DAO || (DAO && DAO.url !== daoURL))
		return null

	return (
		<div className="treasuryCard">
			<div className="treasuryHeader">
				<div id="treasuryCardTitle" onClick={(e) => {
					loadPendingTxn()
					loadExecutedTxn()
				}}>Treasury</div>
				<div className="headerDetails">
					{/* <div><hr className="vl" /></div> */}
					<div className="copyArea" onClick={() => setCopy(true)} onMouseOut={() => setCopy(false)}>
						<Tooltip label={copy ? "copied" : "copy"}>
							<div className="copyLinkButton" onClick={() => navigator.clipboard.writeText(_get(DAO, 'safe.address', ''))}>
								<img src={copyIcon} alt="copy" className="safeCopyImage" />
							</div>
						</Tooltip>
						<div className="dashboardText">{`${_get(props, 'safeAddress', '').slice(0, 6)}...${_get(props, 'safeAddress', '').slice(-4)}`}</div>
					</div>
					{/* <div className="copyArea">
						{
							props.tokens.map((token: any) => {
								return (<>
									<img src={coin} alt="asset" />
									<div id="safeBalance">{`${_get(token, 'balance', 0) / 10 ** 18} ${_get(token, 'token.symbol', chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR')}`}</div>
								</>)
							})
						}
					</div> */}
					{owner && <SafeButton onClick={props.toggleModal} height={40} width={150} titleColor="#B12F15" title="SEND TOKEN" bgColor={!hasValidToken ? "#f0f2f6" : "#FFFFFF"} opacity={!hasValidToken ? "0.4" : "1"} disabled={!hasValidToken} fontweight={400} fontsize={16} />}
				</div>
			</div>
			{props.tokens && props.tokens.length > 0 &&
				<div className="treasuryTokens">
					<div className="treasuryTokens-left">
						{
							totalUSD === '0.00'
								?
								null
								:
								<>
									<img src={coin} alt="asset" />

									<span>
										${totalUSD}
									</span>

									<div className="dashboardText">total balance</div></>
						}

					</div>
					<div className="treasuryTokens-right">
						{
							props.tokens.map((token: any) => {
								return (
									<>
										<div className="tokenDiv">
											<span>{`${_get(token, 'balance', 0) / 10 ** 18}`}</span>
											<h1>{`${_get(token, 'token.symbol', chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR')}`}</h1>
										</div>
									</>
								)
							})
						}
					</div>
				</div>
			}
			<>
				{
					pendingTxn !== undefined && executedTxn !== undefined &&
					(pendingTxn && executedTxn && (pendingTxn.length !== 0 || executedTxn.length !== 0)) &&
					<div id="treasuryTransactions">
						<div className="dashboardText" style={{ marginBottom: '6px' }}>Last Transactions</div>
						{
							pendingTxn.map((ptx, index) =>
								<PendingTxn executeFirst={executeFirst} isAdmin={amIAdmin} owner={owner} threshold={threshold} executeTransactions={handleExecuteTransactions} confirmTransaction={handleConfirmTransaction} rejectTransaction={handleRejectTransaction} tokens={props.tokens} transaction={ptx} confirmTxLoading={confirmTxLoading} rejectTxLoading={rejectTxLoading} executeTxLoading={executeTxLoading} />
							)
						}
						{
							executedTxn.map((ptx, index) =>
								<CompleteTxn isAdmin={amIAdmin} owner={owner} transaction={ptx} tokens={props.tokens} />
							)
						}
					</div>
				}
			</>
		</div>
	)

}

export default TreasuryCard