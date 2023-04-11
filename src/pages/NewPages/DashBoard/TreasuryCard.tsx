// @ts-nocheck
import React, { useEffect, useRef, useState, useMemo, useImperativeHandle, useCallback } from "react";
import { get as _get, sortBy as _sortBy, orderBy as _orderBy, filter as _filter, map as _map, find as _find } from 'lodash';
import { useAppDispatch, useAppSelector } from "state/hooks";
import SafeButton from "UIpack/SafeButton";
import { useWeb3React } from "@web3-react/core";
import { EthSignSignature } from "@gnosis.pm/safe-core-sdk";
import { SafeTransactionData } from "@gnosis.pm/safe-core-sdk-types/dist/src/types";
import copyIcon from "../../../assets/svg/copyIcon.svg";
import {
	Table,
	TableContainer,
	Tbody
} from '@chakra-ui/react'
import { tokenCallSafe } from "connection/DaoTokenCall";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";
import {
	AllTransactionsListResponse,
	AllTransactionsOptions,
	SafeMultisigTransactionListResponse,
} from "@gnosis.pm/safe-service-client";
import coin from "../../../assets/svg/coin.svg";
import plus from "../../../assets/svg/plusBtn.svg";
import recurring_payment from "../../../assets/svg/recurring_payment.svg";
import { useParams } from "react-router-dom";
import { ItreasuryCardType } from "types/DashBoardType";
import { ImportSafe, safeService } from "connection/SafeCall";
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { Tooltip } from "@chakra-ui/react";
import PendingTxn from './TreasuryCard/PendingTxn';
import CompleteTxn from './TreasuryCard/CompleteTxn';
import useRole from "hooks/useRole";
import { usePrevious } from "hooks/usePrevious";
import axiosHttp from 'api'
import { nanoid } from "@reduxjs/toolkit";
import moment from "moment";
import { setDAO, setRecurringPayments } from "state/dashboard/reducer";
import { getCurrentUser, loadRecurringPayments } from "state/dashboard/actions";
import GOERLI_LOGO from '../../../assets/images/goerli.png';
import POLYGON_LOGO from '../../../assets/images/polygon.png';
import useSafeTokens from "hooks/useSafeTokens";
import useSafeTransaction from "hooks/useSafeTransaction";
import axios from "axios";
import { GNOSIS_SAFE_BASE_URLS, SupportedChainId } from 'constants/chains';
import { GNOSIS_SAFE_ALLOWANCE_MODULE_CONTRACT } from 'constants/chains';
import RecurringTxn from "./TreasuryCard/RecurringTxn";
import { updateSafeThreshold } from "state/flow/reducer";
import RecurringTxnTreasury from "./TreasuryCard/RecurringTxnTreasury";
import useGnosisTxnTransform from "hooks/useGnosisTxnTransform";
import Button from "muiComponents/Button";
import CsvDownloadButton from 'react-json-to-csv'
const { toChecksumAddress } = require('ethereum-checksum-address')

const HEADERS = [
	{ key: "nonce", name: "nonce" },
	{ key: "safeTxHash", name: "safeTxHash" },
	{ key: "formattedValue", name: "formattedValue" },
	{ key: "symbol", name: "symbol" },
	{ key: "to", name: "to" },
	{ key: "confirmations", name: "confirmations" },
	{ key: "submissionDate", name: "submissionDate" },
	{ key: "executionDate", name: "executionDate" },
	// safeTxHash: _get(transaction, 'safeTxHash', "0"),
	// rejectionSafeTxHash: _get(transaction, 'rejectedTxn.safeTxHash', null),
	// nonce: _get(transaction, 'nonce', "0"),
	// value: 0,
	// formattedValue: "0",
	// symbol: "",
	// decimals: "",
	// to: "0x",
	// confimationsRequired: _get(transaction, 'confirmationsRequired', 0),
	// confirmations: _get(transaction, 'confirmations', []).length,
	// hasMyConfirmation: hasMyConfirmation ? true: false,
	// hasRejection: transaction?.rejectedTxn ? true : false,
	// hasMyRejection: hasMyRejection ? true : false,
	// rejections: _get(transaction, 'rejectedTxn.confirmations', []).length,
	// canExecuteTxn,
	// canRejectTxn,
	// submissionDate: _get(transaction, 'submissionDate', null),
	// executionDate: _get(transaction, 'executionDate', null)
]


const TreasuryCard = (props: ItreasuryCardType) => {
	const { provider, account, ...rest } = useWeb3React();
	const [chainId, setChainId] = useState(null);
	const { daoURL } = useParams()
	const dispatch = useAppDispatch()
	const treasuryCardRef  = useRef<HTMLDivElement>()
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
	const node = useRef<HTMLDivElement>()
	const [editMode, setEditMode] = useState<any>();
	const [lowBalanceError, setLowBalanceError] = useState<any>(null);

	useOnClickOutside(node, () => editMode ? setEditMode(null) : undefined)
	useState<Array<any>>();
	//const [recurringTxnQueue, setRecurringTxnQueue] = useState<Array<any>>();

	const [labels, setLabels] = useState<Array<any>>();
	const { DAO, recurringPayments } = useAppSelector(store => store.dashboard);

	useEffect(() => {
		if(DAO?.chainId) {
			setChainId(DAO?.chainId)
		}
	}, [DAO])

	const { safeTokens, tokenBalance } = useSafeTokens(_get(DAO, 'safe.address', ''))

	const { createSafeTransaction, createSafeTxnLoading } = useSafeTransaction(_get(DAO, 'safe.address', ''))

	const { transform }  = useGnosisTxnTransform(_get(DAO, 'safe.address', ''))

	const { myRole, can, isSafeOwner } = useRole(DAO, account);

	const [totalUSD, setTotalUSD] = useState<any>('0');

	const [tab, setTab] = useState<any>(1);

	const prevDAO = usePrevious(DAO);

	// useEffect(() => {
	// 	if (!owner && recurringPayments && recurringPayments.length > 0 && recurringPayments.filter((rp: any) => rp?.delegate?.wallet === account).length > 0) {
	// 		setTab(2)
	// 	}
	// }, [recurringPayments, owner])

	const exportableData = useMemo(() => {
		if(pendingTxn && executedTxn) {
			return transform([...(pendingTxn as []), ...(executedTxn as [])], labels, true)
		} 
		return []
	}, [pendingTxn, executedTxn, labels])

	console.log("exportableData", exportableData)

	const getSafeTokens = useCallback(async () => {
		if (!chainId) return [];
		return axios.get(`${GNOSIS_SAFE_BASE_URLS[chainId]}/api/v1/safes/${DAO?.safe?.address}/balances/usd/`, {withCredentials: false })
		.then((res: any) => {
			let tokens = res.data.map((t: any) => {
				let tkn = t
				if(!tkn.tokenAddress){
					return {
						...t,
						tokenAddress: chainId === SupportedChainId.POLYGON ? process.env.REACT_APP_MATIC_TOKEN_ADDRESS : process.env.REACT_APP_GOERLI_TOKEN_ADDRESS,
						token: {
							symbol: chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR',
							decimal: 18
						}
					}
				}
				return t 
			})
			return tokens
		})
	}, [chainId])

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
			loadTxnLabel();
			loadRecurringTxnQueue();
		}
	}));

	const amIAdmin = useMemo(() => {
		if (DAO) {
			let user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase() && m.role === 'role1')
			if (user)
				return true
			return false
		}
		return false;
	}, [account, DAO])

	const isOwner = async (_safeAddress: string) => {
		const safe = await axios.get(`${GNOSIS_SAFE_BASE_URLS[chainId]}/api/v1/safes/${_safeAddress}`, {withCredentials: false }).then(res => res.data)
		// const safeSDK = await ImportSafe(provider, _safeAddress);
		// const condition = await safeSDK.isOwner(account as string);
		// const threshold = await safeSDK.getThreshold();
		setOwner(safe?.owners?.indexOf(account) > -1)
		setThreshold(safe.threshold)
		// setThreshold(threshold)
	};

	const loadRecurringTxnQueue = () => {
		dispatch(loadRecurringPayments({ safeAddress: _get(DAO, 'safe.address', '') }))
		// return axiosHttp.get(`/recurring-payment?safeAddress=${_get(DAO, 'safe.address', '')}`)
		// .then(txn => txn.data)
		// .then(txn => {
		// 	setRecurringTxnQueue(txn)
		// })
	}

	useEffect(() => {
		loadRecurringTxnQueue()
	}, [_get(DAO, 'safe.address', '')])

	const loadOffChainTxn = async () => {
		return axiosHttp.get(`transaction/off-chain?daoId=${DAO._id}`)
			.then(txn => txn.data)
			.then(txn => {
				const pTxn = txn.filter((tx: any) => !tx.isExecuted)
				const eTxn = txn.filter((tx: any) => tx.isExecuted)
				return { pTxn, eTxn }
			})
	}

	const loadTxnLabel = async () => {
		axiosHttp.get(`transaction/label?safeAddress=${_get(DAO, 'safe.address', '')}`)
			.then(res => setLabels(res.data))
	}

	const fetchDao = async () => {
		return axiosHttp.get(`dao/${daoURL}`)
			.then(res => dispatch(setDAO(res.data)))
			.catch(e => console.log(e))
	}

	const loadPendingTxn = async () => {
		(await safeService(provider, `${chainId}`))
			.getPendingTransactions(_get(DAO, 'safe.address', ''))
			.then(ptx => { props.onChangePendingTransactions(ptx); return ptx })
			.then(ptx => _get(ptx, 'results', []))
			.then(ptx =>
				_map(ptx, (p: any) => {
					let matchRejTx = _find(ptx, px => px.nonce === p.nonce && px.data === null && px.value === "0");
					if (matchRejTx)
						return { ...p, rejectedTxn: matchRejTx }
					return p
				})
			)
			.then(ptx => _filter(ptx, p => {
				let matchRejTx = _find(ptx, px => px.nonce === p.nonce && px.data === null && px.value === "0");
				console.log("matchRejTx", matchRejTx)
				if (matchRejTx)
					return matchRejTx.safeTxHash !== p.safeTxHash
				return true
			}))
			.then(ptx => _filter(ptx, p => !p.dataDecoded || (_get(p, 'dataDecoded.method', '') === 'multiSend' || _get(p, 'dataDecoded.method', '') === 'transfer' || _get(p, 'dataDecoded.method', '') === 'addOwnerWithThreshold' || _get(p, 'dataDecoded.method', '') === 'removeOwner' || _get(p, 'dataDecoded.method', '') === 'changeThreshold')))
			.then(async ptx => {
				const { pTxn } = await loadOffChainTxn()
				return ptx.concat(pTxn)
			})
			.then(ptx => _orderBy(ptx, [p => p.offChain, p => p.submissionDate], ['asc', 'asc']))
			.then(ptx => { console.log("loadPendingTxn", ptx); return ptx })
			.then(ptx => setPendingTxn(ptx))
	}

	const loadExecutedTxn = async () => {
		(await safeService(provider, `${chainId}`))
			.getAllTransactions(_get(DAO, 'safe.address', ''), { executed: true, queued: false, trusted: true })
			.then(etx => _get(etx, 'results', []))
			//.then(etx => _filter(etx, p => _get(p, 'data')))
			.then(etx => _filter(etx, p => !_get(p, 'dataDecoded') || (_get(p, 'dataDecoded') && _get(p, 'dataDecoded.method', '') === 'transfer' || _get(p, 'dataDecoded.method', '') === 'multiSend' || _get(p, 'dataDecoded.method', '') === 'addOwnerWithThreshold' || _get(p, 'dataDecoded.method', '') === 'removeOwner' || _get(p, 'dataDecoded.method', '') === 'changeThreshold')))
			.then(async etx => {
				const { eTxn } = await loadOffChainTxn()
				return etx.concat(eTxn)
			})
			.then(ptx => _orderBy(ptx, [(p: any) => p.offChain, (p: any) => p.executionDate ? p.executionDate : p.submissionDate], ['desc', 'desc']))
			.then(etx => { console.log("loadExecutedTxn", etx); return etx })
			.then(etx => setExecutedTxn(etx))
	}

	useEffect(() => {
		if (pendingTxn) {
			pendingTxn.filter(t => !t.offChain).map((tx, i) => {
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
				loadTxnLabel()
			} else {
				setPendingTxn(undefined);
				setExecutedTxn(undefined);
				setOffChainPendingTxn(undefined);
				setOffChainExecutedTxn(undefined)
				setLabels(undefined)
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
				loadTxnLabel()
			} else {
				setPendingTxn(undefined);
				setExecutedTxn(undefined);
				setOffChainPendingTxn(undefined);
				setOffChainExecutedTxn(undefined)
				setLabels(undefined)
			}
		}
	}, [DAO, daoURL, chainId])

	useEffect(() => {
		if (safeTokens) {
			console.log("tokens:", safeTokens)
			let total = 0;
			safeTokens.map((t: any) => {
				total = +t.fiatBalance + total
			})
			setTotalUSD(total.toFixed(2))
		}
	}, [safeTokens])


	const createOnChainTxn = async (txn: any, action: string | null) => {
		return new Promise(async (resolve, reject) => {
			try {
				if (!chainId) return;
				let send: Array<{ recipient: string, amount: string }> = [];
				if (txn.dataDecoded.method === 'transfer') {
					const amountValue = _get(txn, 'dataDecoded.parameters[1].value')
					const receiver = _get(txn, 'dataDecoded.parameters[0].value')
					send = [{ recipient: receiver, amount: amountValue }]
				} else if (txn.dataDecoded.method === 'multiSend') {
					send = _get(txn, 'dataDecoded.parameters[0].valueDecoded').map((operation: any) => {
						return {
							recipient: _get(operation, 'dataDecoded.parameters[0].value'),
							amount: _get(operation, 'dataDecoded.parameters[1].value') / 10 ** _get(txn, 'token.decimals', 18)
						}
					})
				}
				const txnResponse = await createSafeTransaction({ tokenAddress: _get(txn, 'token.tokenAddress', null), send, confirm: action === 'confirm' });
				if (txnResponse) {
					await axiosHttp.patch(`transaction/off-chain/${txn.safeTxHash}/move-on-chain`, {
						onChainTxHash: txnResponse.safeTxHash,
						taskId: txn.taskId
					})
					return resolve({ safeTxHash: txnResponse.safeTxHash, signature: txnResponse.signature, nonce: txnResponse.currentNonce })
				} else {

					reject(null)
				}
			} catch (e) {
				console.log(e)
				reject(null)
			}
		})
	}

	const handleConfirmTransaction = async (_safeTxHashs: string, txn: any) => {
		if (txn.offChain && _get(txn, 'token.symbol') === 'SWEAT') {
			setConfirmTxLoading(_safeTxHashs);
			axiosHttp.patch(`transaction/off-chain/${_safeTxHashs}/approve`,
				{
					confirmations: isSafeOwner ? [{
						owner: account,
						submissionDate: moment().utc().toDate()
					}] : []
				}
			)
				.then(async res => {
					await axiosHttp.post(`utility/create-notification`, {
						event: 'transaction:confirmed',
						safeAddress: _get(DAO, 'safe.address', ''),
						account
					})
					loadPendingTxn()
				})
				.catch(e => console.log(e))
				.finally(() => setConfirmTxLoading(null))
		} else if (txn.offChain && _get(txn, 'token.symbol') !== 'SWEAT') {
			try {
				await createOnChainTxn(txn, 'confirm')
				loadPendingTxn();
				loadTxnLabel();
			} catch (e) {
				console.log(e)
			}
		} else {
			try {
				setConfirmTxLoading(_safeTxHashs);
				// const safeSDK = await ImportSafe(provider, _get(DAO, 'safe.address', ''));
				// const isOwner = await safeSDK.isOwner(account as string);
				if (isSafeOwner) {
					const senderSignature = await safeSDK.signTransactionHash(_safeTxHashs);
					await (await safeService(provider, `${chainId}`))
						.confirmTransaction(_safeTxHashs, senderSignature.data)
						.then(async (success) => {
							await (await safeService(provider, `${chainId}`)).getTransactionConfirmations(_safeTxHashs)
								.then(async (res) => {
									console.log(res)
									await axiosHttp.post(`utility/create-notification`, {
										event: 'transaction:confirmed',
										safeAddress: _get(DAO, 'safe.address', ''),
										account
									})
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
		if (txn.offChain && _get(txn, 'token.symbol') === 'SWEAT') {
			setRejectTxLoading(_nonce);
			axiosHttp.patch(`transaction/off-chain/${_nonce}/reject`,
				{
					_nonce,
					safeTxHash: nanoid(32),
					value: "0",
					submissionDate: moment().utc().toDate(),
					token: { symbol: 'SWEAT' },
					confirmations: isSafeOwner ? [{
						owner: account,
						submissionDate: moment().utc().toDate()
					}] : [],
					dataDecoded: null
				}
			)
				.then(async res => {
					await axiosHttp.post(`utility/create-notification`, {
						event: 'transaction:rejected',
						safeAddress: _get(DAO, 'safe.address', ''),
						account
					})
					loadPendingTxn()
				})
				.catch(e => console.log(e))
				.finally(() => setRejectTxLoading(null))
		} else {
			try {
				setRejectTxLoading(_nonce);
				const safeSDK = await ImportSafe(provider, _get(DAO, 'safe.address', ''));
				if (txn.offChain && _get(txn, 'token.symbol') !== 'SWEAT') {
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
								await loadTxnLabel()
								await axiosHttp.post(`utility/create-notification`, {
									event: 'transaction:rejected',
									safeAddress: _get(DAO, 'safe.address', ''),
									account
								})
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

	const ownersCount = async (_safeAddress: string) => {
		// const safeSDK = await ImportSafe(provider, _safeAddress);
		// const owners = await safeSDK.getOwners();
		// const threshold = await safeSDK.getThreshold();
		const safe = await axios.get(`${GNOSIS_SAFE_BASE_URLS[chainId]}/api/v1/safes/${safeAddress}`, {withCredentials: false }).then(res => res.data)
		// const safeSDK = await ImportSafe(provider, _safeAddress);
		// const condition = await safeSDK.isOwner(account as string);
		// const threshold = await safeSDK.getThreshold();
		// setOwner(safe?.owners?.indexOf(account) > -1)
		// setThreshold(safe?.threshold)
		isOwner(_safeAddress)
		dispatch(updateSafeThreshold(safe?.threshold));
		const dao = await axiosHttp.patch(`dao/${DAO.url}/sync-safe-owners`, safe?.owners)
		return dao;
	};

	const handleExecuteTransactions = async (txn: any, reject: boolean | undefined, syncOwners = false, amount = null, isAllowanceTransaction = false) => {
		console.log(txn)
		let _txs = txn;
		if (txn.offChain && _get(txn, 'token.symbol') === 'SWEAT') {
			setExecuteTxLoading(txn.safeTxHash)
			axiosHttp.get(`transaction/off-chain/${txn.safeTxHash}/execute${reject ? `?rejectedTxn=true&decimals=${tokenDecimal(_get(txn, 'to', ''))}&daoId=${_get(DAO, '_id', '')}` : `?decimals=${tokenDecimal(_get(txn, 'to', ''))}&daoId=${_get(DAO, '_id', '')}`}`)
				.then(async res => {
					loadPendingTxn()
					fetchDao()
					dispatch(getCurrentUser({}))

					await axiosHttp.post(`utility/create-notification`, {
						event: 'transaction:executed',
						safeAddress: _get(DAO, 'safe.address', ''),
						account
					})

				})
				.catch(e => console.log(e))
				.finally(() => setExecuteTxLoading(null))
		} else {
			const st = await getSafeTokens();
			let safeToken = _find(st, t => toChecksumAddress(t.tokenAddress) === toChecksumAddress(_get(txn, 'dataDecoded.parameters[0].valueDecoded[0].to', _get(txn, 'to', ''))))
			console.log("safeTokensafeToken",st, safeToken, _get(txn, 'dataDecoded.parameters[0].valueDecoded[0].to', _get(txn, 'to', '')))
			if (!safeToken)
				safeToken = _find(st || [], (st: any) => _get(st, 'tokenAddress', '') === (chainId === SupportedChainId.GOERLI ? process.env.REACT_APP_GOERLI_TOKEN_ADDRESS : process.env.REACT_APP_MATIC_TOKEN_ADDRESS))
			if (!reject && amount && !isAllowanceTransaction) {
				const balance = _get(safeToken, 'balance', 0) / 10 ** _get(safeToken, 'token.decimal', _get(safeToken, 'token.decimals', 18))
				if (+amount > +balance) {
					setLowBalanceError(`Low token balance`)
					setTimeout(() => setLowBalanceError(null), 1000)
					return;
				}
			}
			if (txn.rejectedTxn && reject)
				_txs = txn.rejectedTxn;
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
				if (!reject) {
					await axiosHttp.patch(`transaction/on-chain/executed?daoId=${_get(DAO, '_id', '')}`, {
						safeTx: {
							..._txs,
							token: { ...safeToken.token, tokenAddress: safeToken.tokenAddress }
						}
					}
					)
				} else {
					await axiosHttp.patch(`recurring-payment/reject`, { txHash: txn.safeTxHash })
				}
				if (syncOwners)
					await ownersCount(_get(DAO, 'safe.address', ''))
				await axiosHttp.post(`utility/create-notification`, {
					event: 'transaction:executed',
					safeAddress: _get(DAO, 'safe.address', ''),
					account
				})
				await loadPendingTxn()
				await loadExecutedTxn()
				await loadTxnLabel()
				await fetchDao()
				dispatch(loadRecurringPayments({}))
				dispatch(getCurrentUser({}))
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
		if (safeTokens && safeTokens.length > 0) {
			let valid = safeTokens.some((t: any) => +t.balance > 0)
			return valid
		}
		return false
	}, [safeTokens])


	const tokenDecimal = useCallback((addr: any) => {
		if (safeTokens) {
			if (!addr || addr === SupportedChainId.POLYGON || addr === SupportedChainId.GOERLI || addr === 'SWEAT')
				return 18
			const tkn = _find(safeTokens, (stkn: any) => stkn.tokenAddress === addr)
			if (tkn) {
				console.log("tokenDecimal", tkn)
				return _get(tkn, 'token.decimals', 18)
			}
			return 18
		}
	}, [safeTokens])

	// const tokenDecimal = (addr:string) => {
	// 	if(!addr) return 18
	// 	const tkn = _find(props.tokens, t => t.tokenAddress === addr);
	// 	return _get(tkn, 'token.decimals', 18)
	// }

	const nextQueue = (rtransaction:any) => {
		if(rtransaction && rtransaction.queue) {
			let queue = rtransaction.queue.filter((q:any) => !q.moduleTxnHash);
			queue = _orderBy(queue, q => q.nonce, 'asc')
			if(queue && queue.length > 0) return queue[0]
		}
		return null
	}

	const recurringTreasuryData = useMemo(() => {
		if(!recurringPayments) return []
		const rp = recurringPayments.filter((rtx:any) => {
			const nQ = nextQueue(rtx);
			if(rtx.active && nQ && nQ.nonce < moment().utc().endOf('day').unix() && (account === toChecksumAddress(rtx.receiver.wallet))) 
				return true
			return false
		})
		return rp
	}, [recurringPayments])

	if (!DAO || (DAO && DAO.url !== daoURL))
		return null

	return (
		<div className="treasuryCard" id="treasury-management">
			<div className="treasuryHeader">
				<div style={{ display: 'flex', alignItems: 'center' }}>
					{(can(myRole, 'transaction.view') || isSafeOwner) && DAO && daoURL === _get(DAO, 'url', '') &&
						<>
							<div
								id="treasuryCardTitle"
								style={tab === 1 ? { opacity: '1' } : { opacity: '0.4' }}
								onClick={(e) => {
									setTab(1)
									loadPendingTxn()
									loadExecutedTxn()
								}}
							>
								Treasury
								<span onClick={() => {
									window.open(
										chainId === SupportedChainId.GOERLI ?
											`https://goerli.etherscan.io/address/${_get(DAO, 'safe.address')}` :
											`https://polygonscan.com/address/${_get(DAO, 'safe.address')}`
									)
								}}>
									<img style={{ width: 24, height: 24, objectFit: 'contain', marginLeft: 8 }} src={chainId === SupportedChainId.GOERLI ? GOERLI_LOGO : POLYGON_LOGO} />
								</span>
							</div>
							<div className="treasuryDivider"></div>
						</>
					}
					{(can(myRole, 'transaction.view') || isSafeOwner) && DAO && daoURL === _get(DAO, 'url', '') &&
						<>

							<div
								id="treasuryCardTitle"
								style={tab === 2 ? { opacity: '1' } : { opacity: '0.4' }}
								onClick={(e) => {
									setTab(2)
								}}
							>
								Recurring payments
							</div>
						</>}
				</div>
				<div className="headerDetails">
					<div className="copyArea" onClick={() => setCopy(true)} onMouseOut={() => setCopy(false)}>
						<Tooltip label={copy ? "copied" : "copy"}>
							<div className="copyLinkButton" onClick={() => navigator.clipboard.writeText(_get(DAO, 'safe.address', ''))}>
								<img src={copyIcon} alt="copy" className="safeCopyImage" />
							</div>
						</Tooltip>
						<div className="dashboardText">{`${_get(DAO, 'safe.address', '').slice(0, 6)}...${_get(DAO, 'safe.address', '').slice(-4)}`}</div>
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
					{owner && tab === 1 && <SafeButton onClick={props.toggleModal} height={40} width={150} titleColor="#B12F15" title="SEND TOKEN" bgColor={!hasValidToken ? "#f0f2f6" : "#FFFFFF"} opacity={!hasValidToken ? "0.4" : "1"} disabled={!hasValidToken} fontweight={400} fontsize={16} />}
					{/* <Button onClick={() => transform([...(pendingTxn as []), ...(executedTxn as [])])} size="small" variant="contained">DOWNLOAD</Button> */}
					{owner && tab === 1 && <CsvDownloadButton
						className="downloadBtn"
						style={{
							backgroundColor: !hasValidToken ? "#f0f2f6" : "#FFFFFF"
						}}
						filename={`${_get(DAO,'safe.address', 'export')}.csv`}
						disabled={!hasValidToken}
						data={exportableData} >EXPORT</CsvDownloadButton> }
				</div>
			</div>

			{/* For treasury --- token details */}
			{
				tab === 1 && safeTokens && safeTokens.length > 0 &&
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
					<Tooltip isOpen={lowBalanceError} label={"Low token balance"}>
						<div className="treasuryTokens-right">
							{
								safeTokens.map((token: any) => {
									return (
										<>
											<div className="tokenDiv">
												<span>{`${(_get(token, 'balance', 0) / 10 ** tokenDecimal(token.tokenAddress)).toFixed(4)}`}</span>
												<h1>{`${_get(token, 'token.symbol', chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR')}`}</h1>
											</div>
										</>
									)
								})
							}
						</div>
					</Tooltip>
				</div>
			}

			{/* For recurring payments */}
			{
				tab === 2 && owner &&
				<div className="treasuryTokens">
					<div className="treasuryTokens-left">
						{/* <img src={recurring_payment} alt="asset" />
						<span style={{ color: '#76808D' }}>
							$1245.00
						</span>
						<div className="dashboardText">per month</div> */}
					</div>
					<div className="treasuryTokens-right">
						<button className="recurring-btn" onClick={props.toggleShowCreateRecurring}>
							<img src={plus} alt="asset" /> NEW RECURRING PAYMENT
						</button>
					</div>
				</div>
			}

			{/* Treasury card body */}
			{tab === 1 && (can(myRole, 'transaction.view') || isSafeOwner) && DAO && daoURL === _get(DAO, 'url', '') ?
				<>
					{
						pendingTxn !== undefined && executedTxn !== undefined &&
						(pendingTxn && executedTxn && (pendingTxn.length !== 0 || executedTxn.length !== 0)) &&
						<div className="position-relative">
								{props.isHelpIconOpen && <div className="help-card">
										Managing and automating your treasury has never been easier! Here you can approve and send token payments manually, or set up recurring payments to team members!
								</div>}
							<div id="treasuryTransactions">
							<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
								<div className="dashboardText" style={{ marginBottom: '6px', flexGrow: 1 }}>Last Transactions</div>
								{/* { lowBalanceError && <div className="dashboardText" style={{ marginBottom: '6px', color: 'red' }}>Low token balance</div> } */}
							</div>
							{
								recurringTreasuryData.map((rtx :any) => 
									<RecurringTxnTreasury onExecute={async (data: any) => {
										await loadTxnLabel()
										dispatch(setRecurringPayments(data))
									}} transaction={rtx}/>
								)
							}
							{
								pendingTxn.map((ptx, index) =>
									<PendingTxn editMode={editMode} onSetEditMode={setEditMode} onLoadLabels={(l: any) => setLabels(l)} safeAddress={_get(DAO, 'safe.address', '')} labels={labels} executeFirst={executeFirst} isAdmin={amIAdmin} owner={owner} threshold={threshold} executeTransactions={handleExecuteTransactions} confirmTransaction={handleConfirmTransaction} rejectTransaction={handleRejectTransaction} tokens={props.tokens} transaction={ptx} confirmTxLoading={confirmTxLoading} rejectTxLoading={rejectTxLoading} executeTxLoading={executeTxLoading} />
								)
							}
							{
								executedTxn.map((ptx, index) =>
									<CompleteTxn editMode={editMode} onSetEditMode={setEditMode} onLoadLabels={(l: any) => setLabels(l)} safeAddress={_get(DAO, 'safe.address', '')} labels={labels} isAdmin={amIAdmin} owner={owner} transaction={ptx} tokens={props.tokens} />
								)
							}
						</div>
					 </div>
					}
				</> :
				<>
					{
						recurringPayments && recurringPayments.length > 0 &&
						<TableContainer>
							<Table variant='simple' id="treasuryTransactions" style={{ width: '100%' }}>
								<Tbody style={{ paddingTop: 8 }}>
									{
										(owner ? recurringPayments : recurringPayments.filter((rp: any) => rp?.delegate?.wallet === account)).map((txn: any) =>
											<RecurringTxn owner={owner} onRecurringEdit={props.onRecurringEdit} onExecute={async (data: any) => {
												await loadTxnLabel()
												dispatch(setRecurringPayments(data))
											}} transaction={txn} />
										)
									}
								</Tbody>
							</Table>
						</TableContainer>
					}
				</>
			}
		</div>
	)

}

export default TreasuryCard