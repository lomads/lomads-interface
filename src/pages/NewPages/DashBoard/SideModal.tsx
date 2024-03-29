import React, { useEffect, useRef, useState } from "react";
import { get as _get, find as _find } from 'lodash';
import TransactionDetails from "./SideModal/TransactionDetails";
import {
	IsetRecipientType,
	IsideModal,
	TransactionDataType,
} from "types/DashBoardType";
import { InviteGangType } from "types/UItype";
import { switchChain } from "utils/switchChain";
import SelectRecipient from "./SideModal/SelectRecipient";
import { useAppSelector, useAppDispatch } from "state/hooks";
import TransactionSend from "./SideModal/TransactionSend";
import { tokenCallSafe } from "connection/DaoTokenCall";
import { ImportSafe, safeService } from "connection/SafeCall";
import { useWeb3React } from "@web3-react/core";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";
import TransactionSuccess from "./SideModal/TransactionSuccess";
import { Checkbox, getToken } from "@chakra-ui/react";
import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import { SafeTransactionOptionalProps } from "@gnosis.pm/safe-core-sdk/dist/src/utils/transactions/types";
import ethers from "ethers";
import axios from "axios";
import { getDao } from "state/dashboard/actions";
import { updateTotalMembers } from "state/flow/reducer";
import axiosHttp from '../../../api'
import { CHAIN_IDS_TO_NAMES, SupportedChainId } from "constants/chains";
import { GNOSIS_SAFE_BASE_URLS } from 'constants/chains'
import { nanoid } from "@reduxjs/toolkit";
import moment from "moment";
import useRole from "hooks/useRole";
import useSafeTransaction from "hooks/useSafeTransaction";
import { useSafeTokens } from "hooks/useSafeTokens";

const SideModal = (props: IsideModal) => {
	const dispatch = useAppDispatch();
	const { provider, account, chainId, connector } = useWeb3React();
	const [selectedToken, setSelectedToken] = useState<string>("");
	const [addNewRecipient, setAddNewRecipient] = useState<boolean>(false);
	const [modalNavigation, setModalNavigation] = useState({
		showRecipient: false,
		showTransactionSender: false,
		showSuccess: false,
	});
	const [error, setError] = useState<any>(null)
	const [isLoading, setisLoading] = useState<boolean>(false);
	//const [safeTokens, setSafeTokens] = useState<Array<any>>([]);
	const { safeTokens } = useSafeTokens()
	const totalMembers = useAppSelector((state) => state.flow.totalMembers);

	const selectToken = (_tokenAddress: string) => {
		setSelectedToken(_tokenAddress);
	};

	const selectedRecipients = useRef<InviteGangType[]>([]);
	const setRecipient = useRef<IsetRecipientType[]>([]);
	const currentNonce = useAppSelector((state) => state.flow.currentNonce);
	const safeAddress = useAppSelector((state) => state.flow.safeAddress);

	const { DAO } = useAppSelector(store => store.dashboard);
	const { isSafeOwner } = useRole(DAO, account);

	const { createSafeTransaction, createSafeTxnLoading } = useSafeTransaction(_get(DAO, 'safe.address', ''))

	const showNavigation = (
		_showRecipient: boolean,
		_showSuccess: boolean,
		_showTransactionSender: boolean
	) => {
		setModalNavigation({
			showRecipient: _showRecipient,
			showSuccess: _showSuccess,
			showTransactionSender: _showTransactionSender,
		});
	};
	const transactionData = useRef<TransactionDataType[]>([]);


	const toggleAddNewRecipient = () => {
		setAddNewRecipient(!addNewRecipient);
	};

	const createOffChainTxn = () => {
		setisLoading(true);
		const nonce = moment().unix();
		let payload = {}
		if (setRecipient.current.length > 1) {
			payload = {
				daoId: _get(DAO, '_id', undefined),
				safe: props.safeAddress,
				safeTxHash: nanoid(32),
				nonce,
				executor: account,
				submissionDate: moment().utc().toDate(),
				token: {
					symbol: 'SWEAT',
					tokenAddress: 'SWEAT',
				},
				confirmations: isSafeOwner ? [{
					owner: account,
					submissionDate: moment().utc().toDate()
				}] : [],
				dataDecoded: {
					method: "multiSend",
					parameters: [{
						valueDecoded: setRecipient.current.map(r => {
							return {
								dataDecoded: {
									method: 'transfer',
									parameters: [
										{ name: 'to', type: "address", value: r.recipient },
										{ name: 'value', type: "uint256", value: `${BigInt(parseFloat(r.amount) * 10 ** 18)}` },
									]
								}
							}
						})
					}]
				}
			}
		} 
		else {
			payload = {
				daoId: _get(DAO, '_id', undefined),
				safe: props.safeAddress,
				nonce,
				safeTxHash: nanoid(32),
				executor: account,
				submissionDate: moment().utc().toDate(),
				token: {
					symbol: 'SWEAT',
					tokenAddress: 'SWEAT',
				},
				confirmations: isSafeOwner ? [{
					owner: account,
					submissionDate: moment().utc().toDate()
				}] : [],
				dataDecoded: {
					method: 'transfer',
					parameters: [
						{ name: 'to', type: "address", value: setRecipient.current[0].recipient },
						{ name: 'value', type: "uint256", value: `${BigInt(parseFloat(setRecipient.current[0].amount) * 10 ** 18)}` },
					]
				}
			}
		}
		axiosHttp.post('transaction/off-chain', payload)
			.then(res => {
				console.log(res);
				let payload: any[] = [];
				setRecipient.current.map(r => {
					payload.push({
						safeAddress: _get(DAO, 'safe.address', null),
						safeTxHash: res.data.safeTxHash,
						recipient: r.recipient,
						label: _get(r, 'reason', null),
						tag:_get(r, 'tag', null)
					})
				})
				axiosHttp.post(`transaction/label`, payload)
					.then(async () => {
						dispatch(getDao(DAO.url))
						await props.getPendingTransactions();
						showNavigation(false, true, false);
						setisLoading(false);
					})
			})
			.finally(() => setisLoading(false))
	}

	const createTransaction = async () => {
		setError(null)
		if (selectedToken === 'SWEAT') {
			return createOffChainTxn()
		}
		try {

			const txnResponse = await createSafeTransaction({ tokenAddress: selectedToken, send: setRecipient.current});
			if (txnResponse?.safeTxHash) {
				dispatch(getDao(DAO.url))
				await props.getPendingTransactions();
				showNavigation(false, true, false);
				setisLoading(false);
			}
		} catch (e) {
			console.log(e)
			if(typeof e === 'string')
				setError(e)
			else
				setError(_get(e, 'message', 'Something went wrong'))
		}
	};

	// const getTokens = async (safeAddress: string) => {
	// 	chainId &&
	// 		await axios
	// 			.get(
	// 				`${GNOSIS_SAFE_BASE_URLS[chainId]}/api/v1/safes/${safeAddress}/balances/usd/`
	// 			)
	// 			.then((tokens: any) => {
	// 				setSafeTokens(tokens.data);
	// 			});
	// };

	// useEffect(() => {
	// 	getTokens(props.safeAddress);
	// 	return () => { };
	// }, [props.safeAddress]);

	useEffect(() => {
		if (DAO)
			dispatch(updateTotalMembers(_get(DAO, 'members', []).map((m: any) => { return { name: m.member.name, address: m.member.wallet } })))
	}, [DAO])

	return (
		<>
			<div className="sidebarModal">
				<div onClick={props.toggleModal} className="overlay"></div>
				<div className="SideModal">
					<div className="closeButtonArea">
						<IconButton
							Icon={
								<AiOutlineClose
									style={{
										color: "#C94B32",
										height: "16px",
										width: "16px",
									}}
								/>
							}
							bgColor="linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%)"
							height={37}
							width={37}
							className="sideModalCloseButton"
							onClick={props.toggleModal}
						/>
					</div>
					{!modalNavigation.showRecipient &&
						!modalNavigation.showSuccess &&
						!modalNavigation.showTransactionSender && (
							<TransactionDetails
								tokens={props.tokens}
								modalNavigation={props.toggleModal}
								selectToken={selectToken}
								selectedToken={selectedToken}
								showNavigation={showNavigation}
							/>
						)}
					{modalNavigation.showRecipient &&
						!modalNavigation.showSuccess &&
						!modalNavigation.showTransactionSender && (
							<SelectRecipient
								totalMembers={totalMembers}
								showNavigation={showNavigation}
								selectedRecipients={selectedRecipients}
								setRecipient={setRecipient}
								toggleAddNewRecipient={toggleAddNewRecipient}
								addNewRecipient={addNewRecipient}
							/>
						)}
					{!modalNavigation.showRecipient &&
						!modalNavigation.showSuccess &&
						modalNavigation.showTransactionSender && (
							<TransactionSend
								error={error}
								showNavigation={showNavigation}
								selectedRecipients={selectedRecipients}
								transactionData={transactionData.current}
								createTransaction={createTransaction}
								setRecipient={setRecipient}
								tokens={props.tokens}
								selectToken={selectToken}
								selectedToken={selectedToken}
								toggleAddNewRecipient={toggleAddNewRecipient}
								addNewRecipient={addNewRecipient}
								isLoading={isLoading || createSafeTxnLoading}
								safeTokens={safeTokens}
							/>
						)}
					{!modalNavigation.showRecipient &&
						modalNavigation.showSuccess &&
						!modalNavigation.showTransactionSender && <TransactionSuccess />}
				</div>
			</div>
		</>
	);
};

export default SideModal;
