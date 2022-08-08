import React, { useState } from 'react'
import { useWeb3React } from "@web3-react/core";
import { useAppSelector } from 'state/hooks'
import { tokenCall } from 'connection/DaoTokenCall'
import { LeapFrog } from '@uiball/loaders'
const SendTokenComponent = () => {
    const {provider} = useWeb3React();
    const [recipient,setRecipient] = useState("");
    const [amount,setamount] = useState("");
    const [isLoading,setisLoading] = useState(false);
    const [message,setMessage] = useState("");

    const tokenAddress = useAppSelector((state) => state.proposal.deployedTokenAddress)

    const transferToken = async () =>{
    setisLoading(true);
      const token = await tokenCall(provider,tokenAddress as string); 
      if(recipient.length>=30 && parseInt(amount)>=1){
        const transferToken = await token.transfer(recipient,amount);
        await transferToken.wait()
        setMessage(`Token have been transferred successfully to address: ${recipient}`)
      }
      setisLoading(false)
    }

    return (
        <div className={"TitleBar"} style={{ paddingBottom: 60 }}>
            <div className={"tokentitleTile"} style={{ width: 750 }}>
                <div>
                    <div className={"tileItemHeader"}>
                        <div>
                            Send token
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <input className={"inputField"} type="title" name="title" value={recipient} style={{ height: 40, width: 340 }}
                            autoFocus placeholder="Recipient Address" onChange={(e) => { setRecipient(e.target.value) }} />
                        <input className={"inputField"} type="title" name="title" value={amount} style={{ height: 40, width: 340, marginTop: 5 }}
                            autoFocus placeholder="Enter Amount" onChange={(e) => { setamount(e.target.value) }} />
                       <div style={{display:"flex"}}>
                       <button id="buttonDeploy" className={"nextButton"} style={{ background: '#C94B32', position: 'relative', left: 0, marginTop: 5 }} onClick={transferToken}>
                            Send
                        </button>
                        <div style={{marginLeft:20}}>
                        {
                            isLoading ? <LeapFrog size={35} color="#C94B32"/> : null
                        }
                        </div>
                       </div>
                    </div>
                    <div className={"message"} style={{ width: "486px" }}>
                        {message}
                    </div>
                </div>
                {/* second */}
            </div>
        </div>
    )
}

export default SendTokenComponent