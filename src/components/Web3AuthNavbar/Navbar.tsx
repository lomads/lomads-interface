import React from 'react'
import { useAppSelector } from 'state/hooks';
import { Web3AuthPropType } from 'types'
import { useNativeCurrencyBalances } from 'state/connection/hooks'

const Navbar = (props: Web3AuthPropType) => {
    
    const web3authAddress = useAppSelector((state) => state.proposal.Web3AuthAddress)
    const mybalance = useNativeCurrencyBalances(web3authAddress ? [web3authAddress]:[])?.[web3authAddress ?? '']
    
  return (
    <div className='bg-transparent text-sm flex flex-row absolute top-2 right-5 justify-between items-center py-5'>
        <h1 className='mr-4 font-bold'>{mybalance?.toSignificant(5)} <span className='text-sm'>ETH</span></h1>
        <h1 className='px-2 py-2 bg-slate-100 rounded-3xl font-bold'>{web3authAddress}</h1>
    </div>
  )
}

export default Navbar