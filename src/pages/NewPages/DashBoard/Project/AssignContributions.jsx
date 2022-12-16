/* global BigInt */
import { useState, useEffect, useMemo, useRef } from 'react';
import { find as _find, get as _get, debounce as _debounce, uniqBy as _uniqBy } from 'lodash';
import './ProjectMilestone.css';
import { CgClose } from 'react-icons/cg'
import createTaskSvg from '../../../../assets/svg/milestone.svg';
import memberIcon from '../../../../assets/svg/memberIcon.svg';

import { useWeb3React } from "@web3-react/core";
import { useAppSelector, useAppDispatch } from "state/hooks";
import { SupportedChainId } from "constants/chains";

import SafeButton from "UIpack/SafeButton";

import useSafeTransaction from "hooks/useSafeTransaction";
import useRole from "hooks/useRole";

import { nanoid } from "@reduxjs/toolkit";
import moment from "moment";
import axiosHttp from '../../../../api';

import { getDao } from "state/dashboard/actions";

const AssignContributions = ({ toggleShowAssign, data, selectedMilestone }) => {
    const dispatch = useAppDispatch();
    const { DAO, Project } = useAppSelector((state) => state.dashboard);
    const { chainId, account } = useWeb3React();

    const [compensation, setCompensation] = useState(_get(data, 'compensation', null));
    const [error, setError] = useState(null);
    const [isLoading, setisLoading] = useState(false);

    const { createSafeTransaction, createSafeTxnLoading } = useSafeTransaction(_get(DAO, 'safe.address', ''))

    const safeAddress = useAppSelector((state) => state.flow.safeAddress);

    const { isSafeOwner } = useRole(DAO, account);

    const handleFocusInput = (index) => {
        const e = document.getElementById(`input${index}`);
        e.focus();
    }

    const handleChange = (e, index) => {
        let num = parseFloat(e.target.value);
        const amountElement = document.getElementById(`amount${index}`);

        const allotedAmt = (((parseFloat(selectedMilestone.amount) * compensation?.amount)) / 100).toFixed(2);

        amountElement.innerHTML = ((num / 100) * allotedAmt).toFixed(2);
    }

    const handleSplitEqually = () => {
        _uniqBy(Project?.members, '_id').map((_, index) => {
            const amountElement = document.getElementById(`amount${index}`);
            const percentElement = document.getElementById(`input${index}`);
            const allotedAmt = (((parseFloat(selectedMilestone.amount) * compensation?.amount)) / 100).toFixed(2);
            let userAmount = (allotedAmt / Project?.members?.length).toFixed(2);
            let percent = ((userAmount / allotedAmt) * 100).toFixed(2);
            percentElement.value = percent;
            amountElement.innerHTML = userAmount;
        })
    }

    const handleSubmit = async () => {
        let sendArray = [];
        const allotedAmt = (((parseFloat(selectedMilestone.amount) * compensation?.amount)) / 100).toFixed(2)
        for (var i = 0; i < _get(Project, 'members', []).length; i++) {
            const item = Project.members[i];
            let amt = document.getElementById(`input${i}`).value;
            sendArray.push({
                amount: ((amt * allotedAmt) / 100).toFixed(2),
                name: item.name,
                recipient: item.wallet,
                reason: `${item.name} - ${selectedMilestone.name}`
            })
        }
        console.log("SendArray : ", sendArray);
        await createTransaction(_get(Project, 'compensation.currency', ''), sendArray);
    }

    const createOffChainTxn = (setRecipient) => {
        setisLoading(true);
        const nonce = moment().unix();
        let payload = {}
        // Multi transaction for multi user
        if (setRecipient.length > 1) {
            payload = {
                daoId: _get(DAO, '_id', undefined),
                safe: safeAddress,
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
                        valueDecoded: setRecipient.map(r => {
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
        // Single transaction for single user in the array
        else {
            payload = {
                daoId: _get(DAO, '_id', undefined),
                safe: safeAddress,
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
                        { name: 'to', type: "address", value: setRecipient[0].recipient },
                        { name: 'value', type: "uint256", value: `${BigInt(parseFloat(setRecipient[0].amount) * 10 ** 18)}` },
                    ]
                }
            }
        }
        axiosHttp.post('transaction/off-chain', payload)
            .then(res => {
                console.log(res);
                let payload = [];
                setRecipient.map(r => {
                    payload.push({
                        safeAddress: _get(DAO, 'safe.address', null),
                        safeTxHash: res.data.safeTxHash,
                        recipient: r.recipient,
                        label: _get(r, 'reason', null)
                    })
                })
                axiosHttp.post(`transaction/label`, payload)
                    .then(async () => {
                        dispatch(getDao(DAO.url))
                        // await props.getPendingTransactions();
                        // showNavigation(false, true, false);
                        setisLoading(false);
                    })
            })
            .finally(() => setisLoading(false))
    }

    const createTransaction = async (selectedToken, setRecipient) => {
        setError(null)
        if (selectedToken === 'SWEAT') {
            return createOffChainTxn(setRecipient)
        }
        try {
            const txnResponse = await createSafeTransaction({ tokenAddress: selectedToken, send: setRecipient });
            if (txnResponse?.safeTxHash) {
                dispatch(getDao(DAO.url))
                // await props.getPendingTransactions();
                // showNavigation(false, true, false);
                setisLoading(false);
            }
        } catch (e) {
            console.log(e)
            setError(e)
        }
    };

    return (
        <div className="milestoneOverlay">
            <div className="milestoneContainer">
                <div className='milestone-header'>
                    <button onClick={() => toggleShowAssign()}>
                        <CgClose size={20} color="#C94B32" />
                    </button>
                </div>
                <div style={{ width: '100%', height: '100%', overflow: 'scroll' }}>
                    <div className='milestone-body'>
                        <img src={createTaskSvg} alt="frame-icon" />
                        <h1>Assign Contributions</h1>
                        <span>Mark the milestone as completed and reward the contributors</span>

                        <SafeButton
                            height={40}
                            width={260}
                            titleColor="#C94B32"
                            title="SPLIT EQUALLY"
                            bgColor="#FFFFFF"
                            opacity="1"
                            disabled={false}
                            fontweight={400}
                            fontsize={16}
                            onClick={handleSplitEqually}
                        />

                        <div className='members-section'>
                            {
                                _uniqBy(Project?.members, '_id').map((item, index) => (
                                    <div className='member-row'>
                                        <div>
                                            <img src={memberIcon} alt="memberIcon" />
                                            <span>{item.name}</span>
                                        </div>
                                        <div>
                                            <div className='input-wrapper' onClick={() => handleFocusInput(index)}>
                                                <input
                                                    type={"number"}
                                                    // value={0} 
                                                    min={0}
                                                    max={100}
                                                    placeholder="0"
                                                    id={`input${index}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => handleChange(e, index)}
                                                /> %
                                            </div>
                                        </div>
                                        <div>
                                            <h1> = <span style={{ fontWeight: 'bold' }} id={`amount${index}`}>0</span> {compensation?.symbol}</h1>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                    </div>
                    <div className='milestone-footer'>
                        <button onClick={() => toggleShowAssign()}>
                            CANCEL
                        </button>
                        <button onClick={handleSubmit}>
                            COMPLETE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AssignContributions;