import React,{useState} from 'react'
import { TiPencil } from 'react-icons/ti';
import ChangeComponent from './sub/ChangeComponent'

const SettingsComponent = () => {
    const [template,setTemplate] = useState("");
    const [disabledButton,setDisabledButton] = useState<boolean>(true)
  return (
    <>
    <div style={{display:'inline-flex',justifyContent:"space-between",width:"100%"}}>
        <div className={"gotitle"}>
          Settings
        </div>
        <div>
            <TiPencil size={25} style={{marginRight:150,color:"#B84E24",cursor:"pointer"}} onClick={()=>{setDisabledButton(!disabledButton)}}/>
        </div>
    </div>
    <div className={"TitleBar"} style={{paddingBottom:60}}>
        <div className={"tokentitleTile"} style={{width:750}}>
            <div>
                <div className={"tileItemHeader"}>
                    <div>
                        Select template
                    </div>
                </div>
                <input className={`${disabledButton ? "focusInputField" : "noInputField"}`} type="title" name="title" value={template} style={{height:40, width:300, marginTop: 20}}
                            autoFocus placeholder="Enter Title" onChange={(e)=>{setTemplate(e.target.value)}} disabled={disabledButton} />
            </div>
            {/* second */}
            <div style={{ marginLeft: "20px" }}>
                <div className={"tileItemHeader"}>
                    <div>
                        Vote Settings
                    </div>
                </div>
                <ChangeComponent property="Support" page="golive" value={5}/>
                <ChangeComponent property="Min Approuval" page="golive" value={5}/>
                <ChangeComponent property="Vote duration" page="golive" vote="vote" value={0}/>
            </div>
        </div>
    </div>
    </>
  )
}

export default SettingsComponent