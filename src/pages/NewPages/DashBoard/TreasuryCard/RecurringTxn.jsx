import './recurringTxn.css';
import React, { useMemo, useState } from 'react'
import { get as _get, orderBy as _orderBy } from 'lodash'
import Bigmember from 'assets/svg/bigMember.svg'
import { beautifyHexToken } from 'utils'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
  } from '@chakra-ui/react'
import moment from 'moment';
import SimpleLoadButton from 'UIpack/SimpleLoadButton';
import { Tooltip } from "@chakra-ui/react";
import useGnosisAllowance from 'hooks/useGnosisAllowance';
import { useAppDispatch, useAppSelector } from 'state/hooks';
import axiosHttp from 'api'
import { setRecurringPayments } from 'state/dashboard/reducer';
import { useWeb3React } from '@web3-react/core';
const { toChecksumAddress } = require('ethereum-checksum-address')


const ToolTopContainer = React.forwardRef(({ children, ...rest }, ref) => (
    <div style={{ flex : 1}} ref={ref} {...rest}>
      {children}
    </div>
))

export default ({ transaction, onExecute, onRecurringEdit }) => {
const dispatch = useAppDispatch()
const { DAO } = useAppSelector(store => store.dashboard);
const { createAllowanceTransaction } = useGnosisAllowance(_get(DAO, 'safe.address', null));
const [loading, setLoading] = useState(false);
const [deleteLoading, setDeleteLoading] = useState(false);
const [showEdit, setShowEdit] = useState(false);
const { account } = useWeb3React()

const nextQueue = useMemo(() => {
    if(transaction && transaction.queue) {
        let queue = transaction.queue.filter((q) => !q.moduleTxnHash);
        queue = _orderBy(queue, q => q.nonce, 'asc')
        if(queue && queue.length > 0) return queue[0]
    }
    return null
}, [transaction])

const handleCreateAllowanceTxn = async (queue, transaction) => {
    try {
        setLoading(true);
        const response = await createAllowanceTransaction({
            tokenAddress: transaction.compensation.currency,
            to: transaction.receiver.wallet, 
            amount: transaction.compensation.amount,
            label: `${transaction.frequency} payment | ${transaction.receiver.name ? transaction.receiver.name : beautifyHexToken(transaction.receiver.wallet)} | ${moment.unix(queue.nonce).local().format('MM/DD/YYYY')}`,
            delegate: toChecksumAddress(transaction.delegate.wallet)
        })
        await axiosHttp.post(`recurring-payment/${queue._id}/complete`, { txHash: response.transactionHash })
        .then(res => onExecute(res.data))
        setLoading(false);
    } catch (e) {
        console.log(e)
        setLoading(false);
    }
}

const renderNextSection = (nextQueue, transaction) => {
    if(nextQueue && nextQueue.nonce < moment().utc().endOf('day').unix())
        return (
            <Tooltip placement='top' label={`Payment for ${moment.unix(nextQueue.nonce).format(`MM/DD/YYYY`)}`}>
                <ToolTopContainer>
                    <SimpleLoadButton onClick={() => handleCreateAllowanceTxn(nextQueue, transaction)} condition={loading} width={"100%"} disabled={account !== toChecksumAddress(transaction.delegate.wallet)}  height={30} title="EXECUTE" bgColor={loading || account !== toChecksumAddress(transaction.delegate.wallet) ? 'grey': "#C94B32"} className="button" />
                </ToolTopContainer>
            </Tooltip>
    )
    else if(nextQueue)
        return <div className="text">Next: { `${ moment.unix(nextQueue.nonce).local().format('MM/DD/YYYY') }` }</div>
    else
        return <div className="text">Payment ended</div>   
}

const handleDeleteRecurringPayment = async tx => {
    setDeleteLoading(true)
    await axiosHttp.delete(`recurring-payment/${tx._id}`)
    .then(res => 
        dispatch(setRecurringPayments(res.data))
    )
    .catch(e => console.log(e))
    .finally(() => setDeleteLoading(false))
}

 return (
    <Tr className='recurringtxn-row' onMouseEnter={() => setShowEdit(true)} onMouseLeave={() => setShowEdit(false)} >
        <Td className='recurringtxn-row-item'>
            <div className="receiver">
                <img className="img" src={Bigmember} alt="" />
                <div className="name">
                    { _get(transaction, 'receiver.name', '') === '' ? beautifyHexToken(_get(transaction, 'receiver.wallet', '')) :  _get(transaction, 'receiver.name', '')}
                </div>
            </div>
        </Td>
        <Td className='recurringtxn-row-item'>
            <div className="frequency">
                <div className="text">
                    { _get(transaction, 'frequency', '') }
                </div>
            </div>
        </Td>
        <Td className='recurringtxn-row-item'>
            <div className="info">
                <div className="text">{
                    transaction.ends && transaction.ends.key === 'NEVER' ?
                    `from ${ moment(transaction.startDate).local().format('MM/DD/YYYY') }` : 
                    transaction.ends && transaction.ends.key === 'ON' ?
                    `from ${ moment(transaction.startDate).local().format('MM/DD/YYYY') } to ${ moment(transaction.ends.value).local().format('MM/DD/YYYY') }` : 
                    transaction.ends && transaction.ends.key === 'AFTER' && !transaction.active ?
                    `${transaction.ends.value} occurances` :
                    transaction.ends && transaction.ends.key === 'AFTER' && transaction.active && transaction.queue.filter(t => t.moduleTxnHash).length > 0 ?
                    `${transaction.queue.filter(t => t.moduleTxnHash).length}/${transaction.ends.value} occurances completed` :
                    transaction.ends && transaction.ends.key === 'AFTER' && transaction.active && transaction.queue.filter(t => t.moduleTxnHash).length == 0 ?
                    `${transaction.ends.value} occurances` :
                    `from ${ moment(transaction.startDate).local().format('MM/DD/YYYY') }`
                }</div>
            </div>
        </Td>
        <Td className='recurringtxn-row-item'>
            <div className="compensation">
                <div className="text">To pay <span>{ `${ _get(transaction, 'compensation.amount') } ${ _get(transaction, 'compensation.symbol') }` }</span></div>
            </div>
        </Td>
        <Td className='recurringtxn-row-item'>
            <div className="status">
                {
                    transaction.active ? renderNextSection(nextQueue, transaction) :
                    <div className="text">Waiting for approval</div>
                }
            </div>
        </Td>
        { account ===  toChecksumAddress(transaction.delegate.wallet) &&
            <Td className='recurringtxn-row-item'>
                <div className="edit">
                        { showEdit && transaction.active && nextQueue &&
                        <SimpleLoadButton bgColor={deleteLoading ? 'grey' : '#FFF'} color="#B12F15" title='EDIT' condition={deleteLoading} onClick={() => onRecurringEdit(transaction)} height={40}  width={180}/> }
                </div>
            </Td>
        }
    </Tr>
 )   
}