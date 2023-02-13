import sendTokenOutline from "../../../../assets/svg/sendTokenOutline.svg";
import React, { useMemo, useState } from 'react'
import { get as _get, find as _find, orderBy as _orderBy } from 'lodash'
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

const ToolTopContainer = React.forwardRef(({ children, ...rest } : any, ref) => (
    <div style={{ flex : 1}} ref={ref} {...rest}>
      {children}
    </div>
))

const RecurringTxnTreasury = ({ transaction, onExecute }: any) => {
    const dispatch = useAppDispatch()
    const { DAO } = useAppSelector(store => store.dashboard);
    const { createAllowanceTransaction } = useGnosisAllowance(_get(DAO, 'safe.address', null));
    const [loading, setLoading] = useState(false);


    const nextQueue = useMemo(() => {
        if(transaction && transaction.queue) {
            let queue = transaction.queue.filter((q:any) => !q.moduleTxnHash);
            queue = _orderBy(queue, q => q.nonce, 'asc')
            if(queue && queue.length > 0) return queue[0]
        }
        return null
    }, [transaction])
    
    const handleCreateAllowanceTxn = async (queue:any, transaction:any) => {
        try {
            setLoading(true);
            const response = await createAllowanceTransaction({
                tokenAddress: transaction.compensation.currency,
                to: transaction.receiver.wallet, 
                amount: transaction.compensation.amount,
                label: `${transaction.frequency} payment | ${transaction.receiver.name ? transaction.receiver.name : beautifyHexToken(transaction.receiver.wallet)} | ${moment.unix(queue.nonce).local().format('MM/DD/YYYY')}`,
                delegate: toChecksumAddress(transaction.receiver.wallet)
            })
            await axiosHttp.post(`recurring-payment/${queue._id}/complete`, { txHash: response?.transactionHash })
            .then(res =>
                setTimeout(() => {
                    onExecute(res.data)
                    setLoading(false);
                }, 1000)
                )
        } catch (e) {
            console.log(e)
            setLoading(false);
        }
    }

    return (
        <>
                <div className="transactionRow">
                    <div className="coinText">
                        <img src={sendTokenOutline} alt="" />
                        <div className="dashboardTextBold">
                            { `${ _get(transaction, 'compensation.amount') } ${ _get(transaction, 'compensation.symbol') }` }
                        </div>
                    </div>
                    <div className="transactionName">
                        <div className="dashboardText">
                            
                        {
                            transaction.ends && transaction.ends.key === 'NEVER' ?
                            `Recurring Payment | ${_get(transaction, 'frequency', '')} | from ${ moment(transaction.startDate).local().format('MM/DD/YYYY') }` : 
                            transaction.ends && transaction.ends.key === 'ON' ?
                            `Recurring Payment | ${_get(transaction, 'frequency', '')} | from ${ moment(transaction.startDate).local().format('MM/DD/YYYY') } to ${ moment(transaction.ends.value).local().format('MM/DD/YYYY') }` : 
                            transaction.ends && transaction.ends.key === 'AFTER' && !transaction.active ?
                            `Recurring Payment | ${_get(transaction, 'frequency', '')} | ${transaction.ends.value} occurances` :
                            transaction.ends && transaction.ends.key === 'AFTER' && transaction.active && transaction.queue.filter((t:any) => t.moduleTxnHash).length > 0 ?
                            `Recurring Payment | ${_get(transaction, 'frequency', '')} | ${transaction.queue.filter((t:any) => t.moduleTxnHash).length}/${transaction.ends.value} occurances completed` :
                            transaction.ends && transaction.ends.key === 'AFTER' && transaction.active && transaction.queue.filter((t:any) => t.moduleTxnHash).length == 0 ?
                            `Recurring Payment | ${_get(transaction, 'frequency', '')} | ${transaction.ends.value} occurances` :
                            `Recurring Payment | ${_get(transaction, 'frequency', '')} | from ${ moment(transaction.startDate).local().format('MM/DD/YYYY') }`
                        }
                        </div>
                    </div>
                    <div className="transactionAddress">
                        <div className="dashboardText">
                            to {beautifyHexToken(_get(transaction, 'receiver.wallet', ''))}
                        </div>
                    </div>
                    <div id="voteArea">

                    </div>
                    <div className="confirmIconGrp">
                        <Tooltip placement='top' label={`Payment for ${moment.unix(nextQueue.nonce).format(`MM/DD/YYYY`)}`}>
                            <ToolTopContainer>
                                <SimpleLoadButton onClick={() => handleCreateAllowanceTxn(nextQueue, transaction)} condition={loading} width={"100%"}  height={30} title="EXECUTE" bgColor={"#C94B32"} className="button" />
                            </ToolTopContainer>
                        </Tooltip>
                    </div>
                </div>
        </>
    )
}

export default RecurringTxnTreasury