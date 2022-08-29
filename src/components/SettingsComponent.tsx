import React,{useState} from 'react'
import { TiPencil } from 'react-icons/ti';
import ChangeComponent from './sub/ChangeComponent'
import { useAppSelector, useAppDispatch } from 'state/hooks'
import { updateTemplate } from 'state/proposal/reducer';

const SettingsComponent = () => {
    const dispatch = useAppDispatch()
    const template = useAppSelector((state) => state.proposal.template)
    const support = useAppSelector((state) => state.proposal.support)
    const minApproval = useAppSelector((state) => state.proposal.minApproval)
    const voteDurDay = useAppSelector((state) => state.proposal.voteDurDay)
    const voteDurHour = useAppSelector((state) => state.proposal.voteDurHour)
    // const [template,setTemplate] = useState("");
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
                            autoFocus placeholder="Enter Title" onChange={(e)=>{dispatch(updateTemplate(e.target.value))}} disabled={disabledButton} />
            </div>
            {/* second */}
            <div style={{ marginLeft: "20px" }}>
                <div className={"tileItemHeader"}>
                    <div>
                        Vote Settings
                    </div>
                </div>
                <ChangeComponent property="Support" page="golive" value1={support}/>
                <ChangeComponent property="Min Approval" page="golive" value1={minApproval}/>
                <ChangeComponent property="Vote duration" page="golive" vote="vote" value1={voteDurDay} value2={voteDurHour}/>
            </div>
        </div>
    </div>
    </>
  )
}

export default SettingsComponent