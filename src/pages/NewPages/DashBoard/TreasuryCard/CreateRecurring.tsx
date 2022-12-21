import { useState, useEffect, useMemo, useRef } from 'react';
import { find as _find, get as _get, debounce as _debounce } from 'lodash';
import './CreateRecurring.css';
import { CgClose } from 'react-icons/cg'
import createProjectSvg from '../../../../assets/svg/createProject.svg';
import recurrent from '../../../../assets/svg/recurring_payment_XL.svg';
import { ReactComponent as StarIcon } from 'assets/svg/star.svg';
import axiosHttp from '../../../../api'
import SimpleInputField from "UIpack/SimpleInputField";
import {
    Button, Image, Input,
    FormControl,
    FormErrorMessage,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberDecrementStepper,
    NumberIncrementStepper, Select
  } from "@chakra-ui/react";
import polygonIcon from 'assets/svg/polygon.svg';

import { useAppSelector, useAppDispatch } from "state/hooks";

import { ReactComponent as DropdownRed } from 'assets/images/dropdown-red.svg';
import { ReactComponent as DropupRed } from 'assets/images/dropup-red.svg';
import { ReactComponent as ArrowDown } from "assets/images/dropdown.svg";

import { useWeb3React } from "@web3-react/core";
import { GNOSIS_SAFE_BASE_URLS } from 'constants/chains'
import { SupportedChainId } from "constants/chains";
import { beautifyHexToken, getSafeTokens } from '../../../../utils'

import useRole from '../../../../hooks/useRole'
import { ReactComponent as PolygonIcon } from 'assets/svg/polygon.svg';
import useSafeTokens from 'hooks/useSafeTokens'

import axios from "axios";
import { isValidUrl } from 'utils';
import useGnosisAllowance from "hooks/useGnosisAllowance";
import moment from 'moment';
import { createRecurringPayment } from 'state/dashboard/actions';
import SimpleLoadButton from 'UIpack/SimpleLoadButton';
import { setRecurringPayments } from 'state/dashboard/reducer';

const format = (val:string | null) => (val || '0') + ` occurance`
const parse = (val:string | null) => (val || '0').replace(/^\occurance/, '')

const CreateRecurring = ({ transaction, toggleShowCreateRecurring, onRecurringPaymentCreated }: any) => {

    const dispatch = useAppDispatch();
    const { DAO, user, } = useAppSelector((state) => state.dashboard);
    const { chainId, provider, account } = useWeb3React();
    const { myRole, can } = useRole(DAO, account);
    const { gnosisAllowanceLoading, setAllowance, getSpendingAllowance, createAllowanceTransaction } = useGnosisAllowance(_get(DAO, 'safe.address', null));
    const { safeTokens } = useSafeTokens(_get(DAO, 'safe.address', null)) 
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<any>(null)
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [startDate, setStartDate] = useState(moment().startOf('day').format('YYYY-MM-DD'));
    const [ends, setEnds] = useState<any>({ 
        key: 'NEVER',
        value: null
    });
    const [compensation, setCompensation] = useState<any>(null)
    const [frequency, setFrequency] = useState('weekly')
    const [errors, setErrors]= useState<any>({})

    useEffect(() => {
        if(transaction) {
            setSelectedUser(_get(transaction, 'receiver._id', null))
            if(safeTokens) {
                setCompensation({
                    symbol: _get(transaction, 'compensation.symbol', null),
                    currency: _get(transaction, 'compensation.currency', null),
                    amount:_get(transaction, 'compensation.amount', null)
                })
            }
            setFrequency(_get(transaction, 'frequency', null))
            setStartDate(moment(_get(transaction, 'startDate', null)).local().format('YYYY-MM-DD'))
            setEnds(_get(transaction, 'ends', { key: 'NEVER', value: null }))
        }
    }, [transaction, safeTokens])

    useEffect(() => {
        if(chainId) {
            setCompensation({
                symbol: chainId === SupportedChainId.GOERLI ? 'GOR' : chainId === SupportedChainId.POLYGON ? "MATIC" : null,
                currency: chainId === SupportedChainId.GOERLI ? process.env.REACT_APP_GOERLI_TOKEN_ADDRESS : chainId === SupportedChainId.POLYGON ? process.env.REACT_APP_MATIC_TOKEN_ADDRESS : null,
                amount: null
            })
        }
    }, [chainId])

    const eligibleContributors = useMemo(() => {
        return _get(DAO, 'members', []).filter((m:any) => m.member._id !== user._id);
    }, [DAO, selectedUser])

    const handleCreateRecurringPayment = async () => {
        setError(null)
        console.log(ends)
        const currentAllowance = await getSpendingAllowance({ delegate: account as string, token: compensation?.currency });
        setErrors({})
        let err: any = {}
        if(!selectedUser) 
            err['receiver'] = 'Please select valid receiver'
        if(!startDate || moment.utc(startDate, 'YYYY-MM-DD').isBefore(moment.utc().startOf('day'))) 
            err['startDate'] = 'Please select valid startdate'
        if(!ends || (ends && ends.key !== "NEVER" && (!ends.value || ends.value === "" || ends.value === 0 || ends.value === "0"))) 
            err['ends'] = 'Please select valid end'
        if(!compensation || (compensation && (!compensation?.amount || !compensation?.symbol || !compensation?.currency)))
            err['amount'] = 'Please select valid amount'
        if(Object.keys(err).length > 0)  {
            setErrors(err)
            return;
        }

        let amount = _get(compensation, 'amount');
        let resetMins = +moment.duration(moment().startOf('day').add(30, 'days').diff(moment().startOf('day'))).asMinutes()
        let resetBaseMins = Math.floor((moment().unix() / 60))
        if(frequency === 'weekly')
            amount = (amount * 4)
        
        if(currentAllowance && currentAllowance?.amount > 0) {
            amount = amount + currentAllowance?.amount
            resetMins = currentAllowance.resetTimeMin
            resetBaseMins = currentAllowance.lastResetMin
        }

        try {
            const txnHash = await setAllowance({ delegate: account as string, token: compensation?.currency, amount: `${BigInt(parseFloat(amount) * 10 ** _get(compensation, 'decimal', 18))}`, resetMins: `${resetMins}`, resetBaseMins: `${resetBaseMins}`, label: `allowance: ${amount} ${_get(compensation, 'symbol')} resets monthly`})
            const payload = {
                daoId: _get(DAO, '_id', null),
                safeAddress: _get(DAO, 'safe.address', null),
                receiver: selectedUser,
                delegate: user._id,
                compensation,
                frequency,
                startDate: moment(startDate, 'YYYY-MM-DD').startOf('day').utc().toDate(),
                ends,
                allowanceTxnHash: txnHash?.safeTxHash,
            }
            await axiosHttp.post(`recurring-payment`, payload)
            setTimeout(() => { 
                onRecurringPaymentCreated() 
                toggleShowCreateRecurring()
            }, 100)
        } catch (e) {
            console.log(e)
            setError(e)
        }
    }
    
    const handleDeleteRecurringPayment = async  () => {
        await axiosHttp.delete(`recurring-payment/${transaction._id}`)
        .then(res => {
            dispatch(setRecurringPayments(res.data))
            toggleShowCreateRecurring()
        })
    }

    return (
        <div className="recurringOverlay">
            <div className="recurringContainer">
                <div className='recurring-header'>
                    <button onClick={() => toggleShowCreateRecurring()}>
                        <CgClose size={20} color="#C94B32" />
                    </button>
                </div>
                {
                    showSuccess
                        ?
                        <div className='recurring-success'>
                            <img src={recurrent} alt="frame-icon" />
                            <h1>Success!</h1>
                            <span>New recurring payment created.<br />You will be redirected in a few seconds.</span>
                        </div>
                        :
                        <>
                            <div className='recurring-body'>
                                <img src={recurrent} alt="frame-icon" />
                                <h1>Recurring Payment</h1>

                                <div className='recurring-inputRow'>
                                    <span>Receiver</span>
                                    <select
                                        name="member"
                                        id="member"
                                        value={selectedUser || ''}
                                        onChange={e => setSelectedUser(e?.target?.value || null)}
                                        className="tokenDropdown"
                                        style={{ width: '100%' }}
                                    // onChange={(e) => handleSetApplicant(e.target.value)}
                                    >
                                        <option value={""}>Select member</option>
                                        {
                                            eligibleContributors.map((item:any, index:number) => {
                                                return (
                                                    <option value={`${item.member._id}`}>{item.member.name && item.member.name !== "" ? `${item.member.name}  (${beautifyHexToken(item.member.wallet)})` : beautifyHexToken(item.member.wallet)}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    { errors['receiver'] && <span className='error-msg' id="error-applicant">{ errors['receiver'] }</span> }
                                </div>

                                <div className='recurring-inputRow'>
                                    <span>Amount</span>
                                    <div style={{ marginTop: 8, marginBottom: 0 }} className='picker-container'>
                                        <Select value={compensation?.currency} onChange={e => setCompensation((prev: any) => { 
                                            return { ...prev, currency: e.target.value, decimal: _find(safeTokens, (st:any) => st?.tokenAddress === e.target.value)?.token?.decimals, symbol: _get(_find(safeTokens, st => _get(st, 'tokenAddress', '') === e.target.value) , 'token.symbol') } 
                                        })} bg='#FFF' color='#76808D' variant='unstyled' style={{ borderRadius: '10px 0px 0px 10px', borderWidth: 1, borderLeftWidth: 0, borderColor: 'rgba(27, 43, 65, 0.1)', boxShadow: 'inset 1px 0px 4px rgba(27, 43, 65, 0.1)', height: 50, width: 193, padding: '0px 50px 0px 20px' }} iconSize={"15"} icon={<ArrowDown />}>
                                        {
                                        safeTokens.map((result, index) => {
                                            return (
                                            (
                                                <option value={_get(result, 'tokenAddress', '')} key={index}>
                                                    { chainId === SupportedChainId.POLYGON ? <PolygonIcon /> : chainId === SupportedChainId.GOERLI ? <img src={require('assets/images/goerli.png')} /> : <StarIcon/> }
                                                    {_get(result, 'token.symbol', chainId === SupportedChainId.POLYGON ? 'MATIC' : chainId === SupportedChainId.GOERLI ?'GOR':'')}
                                                </option>
                                            )
                                            );
                                        })}
                                        </Select>
                                        <div className='number-input'>
                                            <NumberInput onChange={(e) => setCompensation((prev: any) => { return { ...prev, amount: parseFloat(e) } })} value={compensation && compensation.amount ? parseFloat(compensation.amount) : 0} style={{ width: (64 + 50), height: 50, borderColor: 'rgba(27, 43, 65, 0.1)', borderRightWidth: 0, borderWidth: 0, borderRadius: '0px 0px 0px 0px' }} step={1} min={0}>
                                                <NumberInputField className='input' style={{ padding: 0, textAlign: "center", height: 50, width: 63, backgroundColor: '#F5F5F5', borderTopRightRadius: 0, borderBottomRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderWidth: 0 }} />
                                                <NumberInputStepper style={{ width: 50, height: 50, borderRadius: '0px 10px 10px 0px', background: '#FFFFFF', boxShadow: 'inset -1px 0px 4px rgba(27, 43, 65, 0.1)' }}>
                                                    <NumberIncrementStepper color="#C94B32" children={<DropupRed />} />
                                                    <NumberDecrementStepper color="#C94B32" children={<DropdownRed />} style={{ borderTopWidth: 0 }} />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </div>
                                    </div>
                                    { errors['amount'] && <span className='error-msg' id="error-applicant">{ errors['amount'] }</span> }
                                </div>

                                <div className='recurring-inputRow'>
                                    <span>Frequency</span>
                                    <select
                                        name="frequency"
                                        id="frequency"
                                        value={frequency}
                                        className="tokenDropdown"
                                        style={{ width: '100%' }}
                                        onChange={(e) => setFrequency(e.target.value)}
                                    >
                                        <option value={'weekly'}>Weekly</option>
                                        <option value={'monthly'}>Monthly</option>
                                    </select>
                                    { errors['frequency'] && <span className='error-msg' id="error-applicant">{ errors['frequency'] }</span> }
                                </div>

                                <div className='recurring-inputRow'>
                                    <span>Start Date</span>
                                    <SimpleInputField
                                        className="inputField"
                                        id="startDateInput"
                                        height={50}
                                        width={'100%'}
                                        placeholder="Start Date"
                                        value={startDate}
                                        type="date"
                                        onchange={(e) => { 
                                            setStartDate(e.target.value);
                                            const el = document.getElementById('error-startDate');
                                            if(el && el.innerHTML) el.innerHTML = ''
                                        }}
                                    />
                                    { errors['startDate'] && <span className='error-msg' id="error-applicant">{ errors['startDate'] }</span> }
                                </div>

                                <div className='recurring-inputRow'>
                                    <span>Ends</span>
                                    <div style={{ marginTop: 16 }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                            <input checked={ends.key === 'NEVER'} onChange={e => setEnds((prev: any) => { return { ...prev, key: 'NEVER', value: null } })} type="checkbox" />
                                            <div style={{ marginLeft: 12 }}>Never</div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '24px 0' }}>
                                                <input checked={ends.key === 'ON'} onChange={e => setEnds((prev: any) => { return { ...prev, key: 'ON', value: moment().format('YYYY-MM-DD') } })} type="checkbox" />
                                                <div style={{ marginLeft: 12 }}>On</div>
                                            </div>
                                            <div style={{ width: 189 }}>
                                                <SimpleInputField
                                                    className="inputField"
                                                    id="startDateInput"
                                                    disabled={ends.key !== 'ON'}
                                                    height={50}
                                                    width={'100%'}
                                                    placeholder="Start Date"
                                                    value={ends?.value || moment().format('YYYY-MM-DD')}
                                                    type="date"
                                                    onchange={e => setEnds((prev: any) => { return { ...prev, value: moment(e.target.value).isSameOrBefore(moment()) ? moment().format('YYYY-MM-DD') : e.target.value } })}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <input checked={ends.key === 'AFTER'} onChange={e => setEnds((prev: any) => { return { ...prev, key: 'AFTER', value: null } })} type="checkbox" />
                                                <div style={{ marginLeft: 12 }}>After</div>
                                            </div>
                                            <div style={{ marginTop: 8, marginBottom: 0 }} className='picker-container'>
                                                <div className='number-input-occurance'>
                                                    <NumberInput onChange={(e) => setEnds((prev: any) => { return { ...prev, value: parse(e) } })} value={ends.key === 'AFTER' ? format(ends.value) : format('0')} style={{ width: (139 + 50), height: 50, borderColor: 'rgba(27, 43, 65, 0.1)', borderRightWidth: 0, borderWidth: 0, borderRadius: '10px 0px 0px 10px' }} isDisabled={ends.key !== 'AFTER'} step={1} min={0}>
                                                        <NumberInputField disabled className='input' style={{ padding: 0, textAlign: "center", height: 50, width: 139, backgroundColor: '#F5F5F5', borderTopRightRadius: 0, borderBottomRightRadius: 0, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, borderWidth: 0 }} />
                                                        <NumberInputStepper style={{ width: 50, height: 50, borderRadius: '0px 10px 10px 0px', background: '#FFFFFF', boxShadow: 'inset -1px 0px 4px rgba(27, 43, 65, 0.1)' }}>
                                                            <NumberIncrementStepper color="#C94B32" children={<DropupRed />} />
                                                            <NumberDecrementStepper color="#C94B32" children={<DropdownRed />} style={{ borderTopWidth: 0 }} />
                                                        </NumberInputStepper>
                                                    </NumberInput>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    { errors['ends'] && <span className='error-msg' id="error-applicant">{ errors['ends'] }</span> }
                                </div>
                                { transaction && <div className='recurring-inputRow'>
                                    <div className='stop-payments'>
                                        <SimpleLoadButton onClick={() => handleDeleteRecurringPayment()} width={300} height={40} bgColor={"#C94B32"} title="STOP PAYMENTS" condition={false} />
                                        <span className='info'>All next payments will be cancelled.</span>
                                    </div>
                                </div> }
                            </div>
                            {/* { error && <div style={{ color: 'red', fontSize: 14, margin: '16px 0', width: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ error }</div> } */}
                            <div className='recurring-footer'>
                                    <button onClick={() => toggleShowCreateRecurring()} disabled={gnosisAllowanceLoading}>
                                        CANCEL
                                    </button>
                                    <SimpleLoadButton bgColor={gnosisAllowanceLoading ? 'grey' : "#C94B32"} disabled={gnosisAllowanceLoading}  title={ transaction ? "SAVE" : "CREATE"} condition={gnosisAllowanceLoading} onClick={() => handleCreateRecurringPayment()} />
                            </div>
                        </>
                }
            </div>
        </div>
    )
}

export default CreateRecurring;