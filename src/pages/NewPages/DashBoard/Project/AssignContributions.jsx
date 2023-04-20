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
import Button from 'muiComponents/Button'

import { getDao, updateMilestone, generateInvoice } from "state/dashboard/actions";

import SimpleLoadButton from "UIpack/SimpleLoadButton";

import { resetUpdateMilestoneLoader } from 'state/dashboard/reducer';
import { useSafeTokens } from 'hooks/useSafeTokens';
import SwitchChain from 'components/SwitchChain';
import { toast } from 'react-hot-toast';
import Dropdown from 'muiComponents/Dropdown';
import Avatar from 'muiComponents/Avatar';

const AssignContributions = ({ toggleShowAssign, data, selectedMilestone, daoURL }) => {
    console.log("data : ", data);
    console.log("selectedMilestone : ", selectedMilestone);
    const dispatch = useAppDispatch();
    const { DAO, Project, updateMilestoneLoading } = useAppSelector((state) => state.dashboard);
    const { chainId: currentChainId, account } = useWeb3React();

    const [chainId, setChainId] = useState(null)

    const [compensation, setCompensation] = useState(_get(data, 'compensation', null));
    const [error, setError] = useState(null);
    const [isLoading, setisLoading] = useState(false);

    const { createSafeTransaction, createSafeTxnLoading } = useSafeTransaction(_get(DAO, 'safe.address', ''))

    const safeAddress = useAppSelector((state) => state.flow.safeAddress);

    const { isSafeOwner } = useRole(DAO, account);
    const { safeTokens } = useSafeTokens()

    const [temp, setTemp] = useState([]);

    const [showSuccess, setShowSuccess] = useState(false);

    const [isSplit, setIsSplit] = useState(false);

    const [selectedTag, setSelectedTag] = useState(null);

    useEffect(() => {
        if (DAO)
            setChainId(_get(DAO, 'chainId'))
    }, [DAO])

    useEffect(() => {
        if (Project) {
            // let arr = [];
            // for (var i = 0; i < _get(Project, 'members', []).length; i++) {
            //     const item = Project?.members[i];
            //     arr.push({ name: item.name, wallet: item.wallet, percent: 0 });
            // }
            console.log("sada", _get(Project, 'members', []), _uniqBy(_get(Project, 'members', []), m => m.id))
            setTemp(_uniqBy(_get(Project, 'members', []), m => m._id).map(m => { console.log('asdas', m); return { ...m, percent: 0 } }));
        }
    }, [Project]);

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
        let userAmount = (allotedAmt / _uniqBy(Project.members, t => t._id)?.length).toFixed(5);
        let percentAmt = ((userAmount / allotedAmt) * 100).toFixed(2);

        var x = document.getElementById(`amountError`);
        x.innerHTML = '';

        let arr = _uniqBy(temp, t => t._id).map((item, index) => {
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
        for (var i = 0; i < _uniqBy(temp, t => t._id).length; i++) {
            const item = _uniqBy(temp, t => t._id)[i];
            total += item.percent;
            if (item.percent > 0) {
                sendArray.push({
                    amount: ((item.percent * allotedAmt) / 100).toFixed(5),
                    name: item.name,
                    recipient: item.wallet,
                    reason: `${item.name} | ${_get(data, 'name', '')} | ${selectedMilestone.name}`,
                    tag: selectedTag
                })
            }
        }
        console.log("Send array : ", sendArray);
        if (total !== 100 && !isSplit) {
            var x = document.getElementById(`amountError`);
            x.innerHTML = 'Total Project Value should be 100 %';
            for (var i = 0; i < _uniqBy(temp, t => t._id).length; i++) {
                var el = document.getElementById(`inputBox${i}`);
                el.style.background = 'rgba(217, 83, 79, 0.75)';
            }
            return;
        }
        createTxn(sendArray)
        //await createTransaction(_get(Project, 'compensation.currency', ''), sendArray);
    }

    const tokenDecimal = useMemo(() => {
        if (safeTokens && safeTokens.length > 0) {
            const tokenAddr = _get(compensation, 'currency', 'SWEAT');
            if (tokenAddr === 'SWEAT')
                return 18
            const tkn = _find(safeTokens, (stkn) => stkn.tokenAddress === tokenAddr)
            if (tkn) {
                return _get(tkn, 'token.decimals', 18)
            }
        }
        return 18
    }, [safeTokens])

    const createOnChainTxn = async (send) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!chainId) return;
                const txnResponse = await createSafeTransaction({ tokenAddress: _get(compensation, 'currency', null), send, confirm: isSafeOwner, createLabel: true })
                if (txnResponse) {
                    resolve(txnResponse.safeTxHash)
                } else {
                    setisLoading(false);
                }
            } catch (e) {
                setisLoading(false);
                setError(e)
                console.log(e)
                reject(e)
            }
        })
    }

    const createTxn = async (send) => {
        setError(null);
        try {
            let onChainSafeTxHash = undefined;
            if (isSafeOwner && _get(compensation, 'amount', 'SWEAT') !== 'SWEAT') {
                if (currentChainId !== _get(DAO, 'chainId', '')) {
                    return toast.custom(t => <SwitchChain t={t} nextChainId={_get(DAO, 'chainId', '')} />)
                }
                setisLoading(true);
                onChainSafeTxHash = await createOnChainTxn(send);
                const invoiceArrayPayload = send.map((item, index) => ({
                    generalInfo: {
                        paymentToken: _get(compensation, 'currency', 'SWEAT'),
                        chain: currentChainId,
                        transactionId: onChainSafeTxHash
                    },
                    buyerInfo: {
                        name: _get(DAO, 'name', undefined),
                        address: '',
                        email: '',
                        id:  _get(DAO, '_id', undefined)
                    },
                    paymentInfo: {
                        recipientWalletAddress: item.recipient,
                        title: item.reason,
                        labels: '',
                        price: item.amount,
                        tax: '',
                        total: '',
                    },
                    sellerInfo: {
                        name:  item.name,
                        email: temp[index].email,
                        id: temp[index]._id
                    }
                }));
                console.log(invoiceArrayPayload, '......invoiceArrayPayload.....')
                // dispatch(generateInvoice({ projectId: data._id, daoUrl: daoURL, payload: invoicePayload }));

                const newArray = _get(data, 'milestones', []).map((item, i) => {
                    if (i === _get(selectedMilestone, 'pos', '')) {
                        return { ...item, complete: true };
                    } else {
                        return item;
                    }
                });
                dispatch(updateMilestone({ projectId: data._id, daoUrl: daoURL, payload: { milestones: newArray } }));
                setisLoading(false);
                return;
            }
            setisLoading(true);
            const offChainPayload = {
                daoId: _get(DAO, '_id', undefined),
                safe: _get(DAO, 'safe.address', undefined),
                nonce: moment().unix(),
                safeTxHash: nanoid(32),
                executor: account,
                submissionDate: moment().utc().toDate(),
                token: {
                    decimals: tokenDecimal,
                    symbol: _get(compensation, 'symbol', 'SWEAT'),
                    tokenAddress: _get(compensation, 'currency', 'SWEAT')
                },
                confirmations: isSafeOwner && _get(compensation, 'symbol', 'SWEAT') === 'SWEAT' ? [{
                    owner: account,
                    submissionDate: moment().utc().toDate()
                }] : [],

                dataDecoded: (send.length == 1 ? {
                    method: 'transfer',
                    parameters: [
                        { name: 'to', type: "address", value: send[0].recipient },
                        { name: 'value', type: "uint256", value: `${BigInt(parseFloat(send[0].amount) * 10 ** tokenDecimal)}` },
                    ]
                } : {
                    method: 'multiSend',
                    parameters: [
                        {
                            name: 'transactions',
                            valueDecoded: send.map(s => {
                                return {
                                    operation: 0,
                                    to: _get(compensation, 'currency', null),
                                    value: '0',
                                    dataDecoded: {
                                        method: 'transfer',
                                        parameters: [
                                            { name: 'to', type: "address", value: s.recipient },
                                            { name: 'value', type: "uint256", value: `${BigInt(parseFloat(`${s.amount}`) * 10 ** tokenDecimal)}` },
                                        ]
                                    }
                                }
                            })
                        }
                    ]
                })
            }
            await axiosHttp.post('transaction/off-chain', offChainPayload)
                .then(async res => {
                    let payload = [];
                    send.map(r => {
                        payload.push({
                            safeAddress: _get(DAO, 'safe.address', null),
                            safeTxHash: res.data.safeTxHash,
                            recipient: r.recipient,
                            label: _get(r, 'reason', null),
                        tag:_get(r, 'tag', null),
                        })
                    })
                    await axiosHttp.post(`transaction/label`, payload)
                    setisLoading(false);
                    const newArray = _get(data, 'milestones', []).map((item, i) => {
                        if (i === _get(selectedMilestone, 'pos', '')) {
                            return { ...item, complete: true };
                        } else {
                            return item;
                        }
                    });
                dispatch(updateMilestone({ projectId: data._id, daoUrl: daoURL, payload: { milestones: newArray } }));
                })
        } catch (e) {
            console.log(e)
            setError(e)
            setisLoading(false);
        }
    }


    // const createTransaction = async (selectedToken, setRecipient) => {
    //     setError(null);
    //     setisLoading(true);
    //     if (selectedToken === 'SWEAT') {
    //         return createOffChainTxn(setRecipient)
    //     }
    //     try {
    //         const txnResponse = await createSafeTransaction({ tokenAddress: selectedToken, send: setRecipient });
    //         if (txnResponse?.safeTxHash) {

    //             const newArray = _get(data, 'milestones', []).map((item, i) => {
    //                 if (i === _get(selectedMilestone, 'pos', '')) {
    //                     return { ...item, complete: true };
    //                 } else {
    //                     return item;
    //                 }
    //             });

    //             dispatch(updateMilestone({ projectId: data._id, daoUrl: daoURL, payload: { milestones: newArray } }));
    //             setisLoading(false);
    //         }
    //     } catch (e) {
    //         console.log(e)
    //         setError(e)
    //         setisLoading(false);
    //     }
    // };

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

                                    <div style={{ display: 'flex' }}>
                                        <div style={{ marginRight: '16px' }}>
                                            <SafeButton
                                                height={40}
                                                width={140}
                                                titleColor="#C94B32"
                                                title="SPLIT EQUALLY"
                                                bgColor="#FFFFFF"
                                                opacity="1"
                                                disabled={false}
                                                fontweight={400}
                                                fontsize={16}
                                                onClick={() => handleSplitEqually()}
                                            />
                                        </div>
                                        <div style={{ width: '192px' }}>
                                            <Dropdown onChangeOption={(value) => setSelectedTag(value)} />
                                        </div>
                                    </div>

                                    <div className='members-section'>
                                        {
                                            temp && temp.map((item, index) => (
                                                <div className='member-row' key={item.wallet}>
                                                    <div>
                                                        <Avatar name={item.name} wallet={item.wallet} />
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
                                {error && <div style={{ color: 'red', textAlign: 'center', margin: '0 0 8px 0' }}>{error}</div>}
                                <div style={{ display: 'flex', flexDirection: 'row', background: 'linear-gradient(0deg, rgba(255,255,255,1) 70%, rgba(255,255,255,0) 100%)', width: '500px', position: 'fixed', bottom: 0, borderRadius: '0px 0px 0px 20px', padding: "30px 0 20px" }}>
                                    <Button sx={{ mr: 1 }} size="small" variant="outlined" fullWidth onClick={() => toggleShowAssign()}>CANCEL</Button>
                                    <Button fullWidth size="small" variant="contained" loading={false}
                                        onClick={handleSubmit}>SAVE</Button>
                                </div>
                                {/* <div className='milestone-footer'>
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
                                </div> */}
                            </div>
                        </>
                }
            </div>
        </div>
    )
}

export default AssignContributions;