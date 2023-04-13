// eslint-disable-next-line no-restricted-imports
import { get as _get, find as _find } from 'lodash';
import { t, Trans } from "@lingui/macro";
import { useWeb3React } from "@web3-react/core";
import { getConnection } from "connection/utils";
import { darken } from "polished";
import React, { useEffect, useMemo, useState } from "react";
import { Activity } from "react-feather";
import { useAppSelector } from "state/hooks";
import styled, { css } from "styled-components/macro";
import { isChainAllowed, switchChain } from "utils/switchChain";
import { SupportedChainId } from 'constants/chains'

import { useHasSocks } from "hooks/useSocksBalance";
import { useToggleWalletModal } from "state/application/hooks";
import {
	isTransactionRecent,
	useAllTransactions,
} from "state/transactions/hooks";
import { TransactionDetails } from "state/transactions/types";
import { shortenAddress } from "utils";
import { ButtonSecondary } from "../Button";
import StatusIcon from "../Identicon/StatusIcon";
import Loader from "../Loader";
import { RowBetween } from "../Row";
import WalletModal from "../WalletModal";
import { useNavigate } from "react-router-dom";
import axiosHttp from '../../api';
import useEns from 'hooks/useEns'
import dogIcon from '../../assets/svg/dogIcon.svg';
import { MdKeyboardArrowDown } from 'react-icons/md';
import Avatar from 'muiComponents/Avatar';

const Web3StatusGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  border-radius: 30px;
  background-color: #FFF;
  box-shadow: 3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1);
  cursor: pointer;
  user-select: none;
  height: 60px;
  border:none;
  outline:none;
`;
const Web3StatusError = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.red1};
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  border:none;
  outline:none;
`;

const Web3StatusConnect = styled(Web3StatusGeneric) <{ faded?: boolean }>`
  background-color: ${({ theme }) => theme.primary4};
  border: none;

  color: ${({ theme }) => theme.primaryText1};
  font-weight: 500;

  ${({ faded }) =>
		faded &&
		css`
      background-color: ${({ theme }) => theme.primary5};
      color: ${({ theme }) => theme.primaryText1};
    `}
`;

const Web3StatusConnected = styled(Web3StatusGeneric) <{ pending?: boolean }>`
	width: 220px;
	height:60px;
	color: ${({ pending, theme }) => (pending ? theme.white : theme.text1)};
	font-weight: 500;
`;

const Text = styled.p`
  	color: #909090;
    font-size: 14px;
    font-style: italic;
    margin-left: 10px;
`;

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`;

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
	return b.addedTime - a.addedTime;
}

function Sock() {
	return (
		<span
			role="img"
			aria-label={t`has socks emoji`}
			style={{ marginTop: -4, marginBottom: -4 }}
		>
			🧦
		</span>
	);
}

function Web3StatusInner() {
	const { account, connector, chainId, ENSName } = useWeb3React();
	const { DAO, user, Project } = useAppSelector((state) => state.dashboard);
	const connectionType = getConnection(connector).type;
	const { getENSAddress, getENSName } = useEns()
	const [ens, setEns] = useState<string|null|undefined>(null)

	useEffect(() => {
		if(account) {
			const getEns = async () => {
				const name = await getENSName(account)
				setEns(name)
			}
			getEns();
		}
	}, [account])

	const error = useAppSelector(
		(state) =>
			state.connection.errorByConnectionType[getConnection(connector).type]
	);

	const chainAllowed = chainId && isChainAllowed(connector, chainId);

	const allTransactions = useAllTransactions();

	const sortedRecentTransactions = useMemo(() => {
		const txs = Object.values(allTransactions);
		return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
	}, [allTransactions]);

	const pending = sortedRecentTransactions
		.filter((tx) => !tx.receipt)
		.map((tx) => tx.hash);

	const hasPendingTransactions = !!pending.length;
	const hasSocks = useHasSocks();
	const toggleWalletModal = useToggleWalletModal();

	const navigate = useNavigate();


	const navigateTo = () => {
		const activeDao = sessionStorage.getItem('__lmds_active_dao')
		if (activeDao)
			return `/${activeDao}`
		return '/'
	}


	if (!chainId) {
		return null;
	}
	else if (!chainAllowed) {
		return (
			<Web3StatusError
				onClick={() => {
					// switchChain(connector, SupportedChainId.GOERLI)
					// 	.then(async () => {
					// 		//navigate(navigateTo())
					// 	})
					// 	.catch((err) => {
					// 		console.log("Error occurred while switching");
					// 	});
				}}
			>
				<NetworkIcon />
				<Text>
					<Trans>Wrong Network</Trans>
				</Text>
			</Web3StatusError>
		);
	}
	else if (error) {
		return (
			<Web3StatusError onClick={toggleWalletModal}>
				<NetworkIcon />
				<Text>
					<Trans>Error</Trans>
				</Text>
			</Web3StatusError>
		);
	}
	else if (account) {
		return (
			<Web3StatusConnected
				data-testid="web3-status-connected"
				onClick={toggleWalletModal}
				pending={hasPendingTransactions}
			>
				<div style={{display:'flex',alignItems:'center'}}>
				{
					!hasPendingTransactions && (
						// <StatusIcon connectionType={connectionType} />
						// <img src={dogIcon} alt="dog-icon" />
						<Avatar name={user?.name} wallet={account}/>
					)
				}
				{/* {
					hasPendingTransactions
						?
						<RowBetween>
							<Text>{pending?.length} Pending</Text> <Loader stroke="white" />
						</RowBetween>
						:
						<>
							{
								hasSocks
									?
									<Sock />
									:
									null
							}
							<Text>{ ens ? ens : (ENSName || shortenAddress(account))}</Text>
						</>
				} */}
				<div style={{ height: '100%', width: '25%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid #F0F0F0', marginLeft: '10px' }}>
					<span>
						<MdKeyboardArrowDown
							size={20}
							color="#76808D"
						/>
					</span>
				</div>
				</div>
			</Web3StatusConnected>
		);
	}
	else {
		return (
			<Web3StatusConnect onClick={toggleWalletModal} faded={!account}>
				<Text>
					<Trans>Connect Wallet</Trans>
				</Text>
			</Web3StatusConnect>
		);
	}
}

export default function Web3Status() {
	const { ENSName } = useWeb3React();

	const allTransactions = useAllTransactions();

	const sortedRecentTransactions = useMemo(() => {
		const txs = Object.values(allTransactions);
		return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
	}, [allTransactions]);

	const pending = sortedRecentTransactions
		.filter((tx) => !tx.receipt)
		.map((tx) => tx.hash);
	const confirmed = sortedRecentTransactions
		.filter((tx) => tx.receipt)
		.map((tx) => tx.hash);

	return (
		<>
			<Web3StatusInner />
			<WalletModal
				ENSName={ENSName ?? undefined}
				pendingTransactions={pending}
				confirmedTransactions={confirmed}
			/>
		</>
	);
}
