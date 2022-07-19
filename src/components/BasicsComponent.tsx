import React,{useState} from 'react'

const BasicsComponent = () => {
    const [title, setTitle] = useState("");
    const [purpose, setPurpose] = useState("");

    return (
                <div className={"titleBar"} style={{paddingBottom:60}}>
                    <div className={"tokentitleTile"} style={{width:750}}>
                    <div>
                    <div className={"tileItemHeader"}>
                        <div>
                            Title
                        </div>
                    </div>
                        <input className={"inputField"} type="title" name="title" value={title} style={{height:40, width:340}}
                               autoFocus placeholder="Enter Title" onChange={(e)=>{setTitle(e.target.value)}} />
                    </div>
                    {/* second */}
                    <div style={{marginLeft:"20px"}}>
                    <div className={"tileItemHeader"}>
                        <div>
                            Purpose
                        </div>
                    </div>
                        <input className={"inputField"} type="title" name="title" value={purpose} style={{height:40, width:340}}
                               placeholder="Enter Purpose" onChange={(e)=>{setPurpose(e.target.value)}} />
                    </div>
                    </div>
                </div>
    );
}

export default BasicsComponent