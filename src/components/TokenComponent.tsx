import React,{useState} from 'react'

const TokenComponent = () => {
    const [Name, setName] = useState("");
    const [Symbol, setSymbol] = useState("");
    const [Holder, setHolder] = useState("");
  return (
    <div className={"TitleBar"} style={{paddingBottom:60}}>
    <div className={"tokentitleTile"} style={{width:750}}>
    <div>
    <div className={"tileItemHeader"}>
        <div>
            Token Name
        </div>
    </div>
        <input className={"inputField"} type="title" name="title" value={Name} style={{height:40, width:250}}
               autoFocus placeholder="Enter Token Name" onChange={(e)=>{setName(e.target.value)}} />
    </div>
    {/* second */}
    <div style={{marginLeft:"20px"}}>
    <div className={"tileItemHeader"}>
        <div>
            Symbol
        </div>
    </div>
        <input className={"inputField"} type="title" name="title" value={Symbol} style={{height:40, width:150}}
               placeholder="Symbol" onChange={(e)=>{setSymbol(e.target.value)}} />
    </div>
    {/* third */}
    <div style={{marginLeft:"20px"}}>
    <div className={"tileItemHeader"}>
        <div>
            Holder
        </div>
    </div>
        <input className={"inputField"} type="title" name="title" value={Holder} style={{height:40, width:260}}
               placeholder="Enter Holder Address" onChange={(e)=>{setHolder(e.target.value)}} />
    </div>
    </div>
</div>
  )
}

export default TokenComponent