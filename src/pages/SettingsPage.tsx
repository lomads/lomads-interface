import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import SelectTemplate from '../components/sub/SelectTemplate'
import '../styles/App.css'
import '../styles/CreateDao.css'
import '../styles/Dashboard.css'
import '../styles/Modal.css'
import '../styles/Sidebar.css'
import ChangeComponent from '../components/sub/ChangeComponent'
import SliderThumbWithTooltip from 'components/sub/SupportSlider'
import ApprovalSliderThumbWithTooltip from 'components/sub/ApprovalSlider'

const SettingsPage = () => {

    const [SupportValue,setSupportValue] = useState<number>(0)
    const [ApprovalValue,setApprovalValue] = useState<number>(0)
  return (
    <div className={"something"} style={{paddingLeft:480, paddingTop:100,paddingBottom:100,height:1600}}>
                <div className={"pageTitle"}>
                    Settings
                </div>
                <div className={"pageDescription"}>
                    Choose your template and more
                </div>
                <div>
                <div className={"subItemHeader"}>
                        <div>
                            Select a Template
                        </div>
                        <div className={"rect2"}>
                            <div className={"reqText"}>
                                Required
                            </div>
                        </div>
                    </div>
                    <div className={"fieldDesc"}>
                        Create your organisation with our pre-configured templates.
                    </div>
                    <div style={{display:"flex",position:"relative",right:120,zIndex: 9999}}>
                        <SelectTemplate blockTitle="template 1" blockDescription="description of block 1"/>
                        <SelectTemplate blockTitle="template 1" blockDescription="description of block 1"/>
                        <SelectTemplate blockTitle="template 1" blockDescription="description of block 1"/>
                    </div>
                </div>
                <div>
                <div className={"subItemHeader"}>
                        <div>
                            Voting
                        </div>
                        <div className={"rect2"}>
                            <div className={"reqText"}>
                                Required
                            </div>
                        </div>
                    </div>
                    <div className={"fieldDesc"}>
                        Choose your voting application settings.
                    </div>
                    <div style={{width:"500px"}}>
                    <div className={"pageSubItemHeader"}>
                        Support
                    </div>
                    <SliderThumbWithTooltip/>
                    </div>

                    <div style={{width:"486px"}}>
                    <div className={"pageSubItemHeader"}>
                        Minimum Approval
                    </div>
                    <ApprovalSliderThumbWithTooltip/>
                    </div>
                    <div className={"pageSubItemHeader"}>
                        Vote Duration
                    </div>
                    <div style={{display:"flex"}}>
                        <ChangeComponent property="Days"/>
                        <ChangeComponent property="Hours"/>
                    </div>
                </div>
                <div>
                    <button id="nextButtonSettings" className={"nextButton"}>
                        <Link to="/token" className='link'>NEXT STEP</Link>
                    </button>
                </div>
            </div>
  )
}

export default SettingsPage