import { ethers } from 'ethers';
import React,{useState,useEffect} from 'react'
import { useAppSelector } from 'state/hooks';
import { Web3AuthPropType } from 'types'

const Navbar = (props: Web3AuthPropType) => {
    
    const web3authAddress = useAppSelector((state) => state.proposal.Web3AuthAddress)
    const [balance,setBalance] = useState<string>("")

    const fetchBalance = async () =>{
      const provider = new ethers.providers.Web3Provider(props.web3Provider as any)
      await provider.getBalance(web3authAddress as string).then((balance)=>{
        const balanceInETH = ethers.utils.formatEther(balance);
        setBalance(balanceInETH)
      })
    }

    useEffect(()=>{
      fetchBalance();
    })

    
  return (
    <div className='bg-transparent text-sm flex flex-row absolute top-2 right-5 justify-between items-center py-5'>
        <h1 className='mr-4 font-bold'>{balance} <span className='text-sm'>ETH</span></h1>
        <h1 className='px-2 py-2 bg-slate-100 rounded-3xl font-bold'>{web3authAddress}</h1>
    </div>
  )
}

export default Navbar