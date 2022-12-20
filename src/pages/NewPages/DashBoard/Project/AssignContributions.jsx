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

import { getDao, updateMilestone } from "state/dashboard/actions";

import SimpleLoadButton from "UIpack/SimpleLoadButton";

import { resetUpdateMilestoneLoader } from 'state/dashboard/reducer';

const AssignContributions = ({ toggleShowAssign, data, selectedMilestone, daoURL }) => {
    console.log("data : ", data);
    console.log("selectedMilestone : ", selectedMilestone);
    const dispatch = useAppDispatch();
    const { DAO, Project, updateMilestoneLoading } = useAppSelector((state) => state.dashboard);
    const { chainId, account } = useWeb3React();

    const [compensation, setCompensation] = useState(_get(data, 'compensation', null));
    const [error, setError] = useState(null);
    const [isLoading, setisLoading] = useState(false);

    const { createSafeTransaction, createSafeTxnLoading } = useSafeTransaction(_get(DAO, 'safe.address', ''))

    const safeAddress = useAppSelector((state) => state.flow.safeAddress);

    const { isSafeOwner } = useRole(DAO, account);

    const [temp, setTemp] = useState([]);

    const [showSuccess, setShowSuccess] = useState(false);

    const [isSplit, setIsSplit] = useState(false);

    useEffect(() => {
        if (Project) {
            let arr = [];
            for (var i = 0; i < _get(Project, 'members', []).length; i++) {
                const item = Project?.members[i];
                arr.push({ name: item.name, wallet: item.wallet, percent: 0 });
            }
            setTemp(arr);
        }
    }, []);

    // runs after updating milestone
    useEffect(() => {
        if (updateMilestoneLoading === false) {
            dispatch(resetUpdateMilestoneLoader());
            setShowSuccess(true);

            setTimeout(() => {
                setShowSuccess(false);
                toggleShowAssign();
            }, 3000);
        }
    }, [updateMilestoneLoading]);

    const handleFocusInput = (index) => {
        const e = document.getElementById(`input${index}`);
        e.focus();
    }

    const handleChange = (e, index) => {
        const amountElement = document.getElementById(`amount${index}`);
        const allotedAmt = (((parseFloat(selectedMilestone.amount) * parseFloat(compensation?.amount))) / 100).toFixed(5);

        var x = document.getElementById(`amountError`);
        x.innerHTML = '';

        var el = document.getElementById(`inputBox${index}`);
        el.style.background = '';

        if (e <= 100) {
            amountElement.innerHTML = e ? ((parseFloat(e) / 100) * allotedAmt).toFixed(5) : '0';
            const newArray = temp.map((item, i) => {
                if (i === index) {
                    return { ...item, percent: parseFloat(e) };
                } else {
                    return item;
                }
            });
            setTemp(newArray);
            setIsSplit(false);
        }

        // let total = 0;
        // for (let i = 0; i < temp.length; i++) {
        //     if (i !== index) {
        //         total += parseFloat(temp[i].percent)
        //     }
        // }

        // if (parseFloat(e) > (100 - total)) {
        //     console.log("Big")
        // }
        // else {
        //     amountElement.innerHTML = ((parseFloat(e) / 100) * allotedAmt).toFixed(5);
        //     const newArray = temp.map((item, i) => {
        //         if (i === index) {
        //             return { ...item, percent: parseFloat(e) };
        //         } else {
        //             return item;
        //         }
        //     });
        //     setTemp(newArray);
        // }
    }

    const handleSplitEqually = () => {

        const allotedAmt = (((parseFloat(selectedMilestone.amount) * parseFloat(compensation?.amount))) / 100).toFixed(5);
        let userAmount = (allotedAmt / Project?.members?.length).toFixed(5);
        let percentAmt = ((userAmount / allotedAmt) * 100).toFixed(2);

        var x = document.getElementById(`amountError`);
        x.innerHTML = '';

        let arr = temp.map((item, index) => {
            let e = item;
            const amountElement = document.getElementById(`amount${index}`);
            var el = document.getElementById(`inputBox${index}`);
            el.style.background = '';
            amountElement.innerHTML = userAmount;
            return { ...e, percent: parseFloat(percentAmt) };
        })
        setTemp(arr);
        setIsSplit(true);
    }

    const handleSubmit = async () => {
        let sendArray = [];
        const allotedAmt = (((parseFloat(selectedMilestone.amount) * parseFloat(compensation?.amount))) / 100).toFixed(5);

        let total = 0;
        for (var i = 0; i < temp.length; i++) {
            const item = temp[i];
            total += item.percent;
            if (item.percent > 0) {
                sendArray.push({
                    amount: ((item.percent * allotedAmt) / 100).toFixed(5),
                    name: item.name,
                    recipient: item.wallet,
                    reason: `${item.name} | ${_get(data, 'name', '')} | ${selectedMilestone.name}`
                })
            }
        }
        console.log("Send array : ", sendArray);
        if (total !== 100 && !isSplit) {
            var x = document.getElementById(`amountError`);
            x.innerHTML = 'Total Project Value should be 100 %';
            for (var i = 0; i < temp.length; i++) {
                var el = document.getElementById(`inputBox${i}`);
                el.style.background = 'rgba(217, 83, 79, 0.75)';
            }
            return;
        }
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

                        const newArray = _get(data, 'milestones', []).map((item, i) => {
                            if (i === _get(selectedMilestone, 'pos', '')) {
                                return { ...item, complete: true };
                            } else {
                                return item;
                            }
                        });

                        dispatch(updateMilestone({ projectId: data._id, daoUrl: daoURL, payload: { milestones: newArray } }));
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

                const newArray = _get(data, 'milestones', []).map((item, i) => {
                    if (i === _get(selectedMilestone, 'pos', '')) {
                        return { ...item, complete: true };
                    } else {
                        return item;
                    }
                });

                dispatch(updateMilestone({ projectId: data._id, daoUrl: daoURL, payload: { milestones: newArray } }));
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
                {
                    showSuccess
                        ?
                        <div className='milestone-body' style={{ height: '100%', justifyContent: 'center' }}>
                            <img src={createTaskSvg} alt="frame-icon" />
                            <h1>Success</h1>
                            <span>This milestone is completed</span>
                        </div>
                        :
                        <>
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
                                            temp && temp.map((item, index) => (
                                                <div className='member-row' key={item.wallet}>
                                                    <div>
                                                        <img src={memberIcon} alt="memberIcon" />
                                                        <span>{item.name}</span>
                                                    </div>
                                                    <div>
                                                        <div
                                                            id={`inputBox${index}`}
                                                            className='input-wrapper'
                                                            onClick={() => handleFocusInput(index)}
                                                        >
                                                            <input
                                                                type={"number"}
                                                                min={0}
                                                                max={100}
                                                                placeholder="0"
                                                                id={`input${index}`}
                                                                value={+item.percent}
                                                                onClick={(e) => e.stopPropagation()}
                                                                onChange={(e) => handleChange(e.target.value, index)}
                                                            /> %
                                                        </div>

                                                    </div>
                                                    <div>
                                                        <h1>=&nbsp;</h1>
                                                        <span style={{ fontWeight: 'bold' }} id={`amount${index}`}>0</span>
                                                        <h1>&nbsp;{compensation?.symbol}</h1>
                                                    </div>
                                                </div>
                                            ))
                                        }

                                        <span id={`amountError`} style={{ fontSize: '13px', color: '#C84A32', fontStyle: 'normal', margin: '0' }}></span>

                                    </div>

                                </div>
                                <div className='milestone-footer'>
                                    <button onClick={() => toggleShowAssign()} disabled={isLoading} style={isLoading ? { cursor: 'not-allowed' } : null}>
                                        CANCEL
                                    </button>
                                    <SimpleLoadButton
                                        title="COMPLETE"
                                        height={40}
                                        width={180}
                                        fontsize={16}
                                        fontweight={400}
                                        onClick={handleSubmit}
                                        bgColor={"#C94B32"}
                                        condition={isLoading}
                                    />
                                </div>
                            </div>
                        </>
                }
            </div>
        </div>
    )
}

export default AssignContributions;