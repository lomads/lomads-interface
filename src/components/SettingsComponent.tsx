import React,{useState} from 'react'
const SettingsComponent = () => {
    const [template,setTemplate] = useState("");
  return (
    <div className={"TitleBar"} style={{paddingBottom:60}}>
                    <div className={"tokentitleTile"} style={{width:750}}>
                    <div>
                    <div className={"tileItemHeader"}>
                        <div>
                            Select template
                        </div>
                    </div>
                        <input className={"inputField"} type="title" name="title" value={template} style={{height:40, width:340}}
                               autoFocus placeholder="Enter Title" onChange={(e)=>{setTemplate(e.target.value)}} />
                    </div>
                    {/* second */}
                    </div>
                </div>
  )
}

export default SettingsComponent