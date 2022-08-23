import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { Icon, Tooltip } from '@chakra-ui/react'
import SelectTemplate from '../components/sub/SelectTemplate'
import '../styles/App.css'
import '../styles/CreateDao.css'
import '../styles/Dashboard.css'
import '../styles/Modal.css'
import '../styles/Sidebar.css'
import ChangeComponent from '../components/sub/ChangeComponent'
import SliderThumbWithTooltip from 'components/sub/SupportSlider'
import ApprovalSliderThumbWithTooltip from 'components/sub/ApprovalSlider'
import Header from 'components/Header';
import { useAppSelector, useAppDispatch } from 'state/hooks'
import { updateTemplate, updateTemplateVal} from 'state/proposal/reducer'
import { updateStepNumber } from 'state/proposal/reducer'
import useStepRouter from 'hooks/useStepRouter';

const SettingsPage = () => {
    useStepRouter(3);
    
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const web3authAddress = useAppSelector((state) => state.proposal.Web3AuthAddress)
    const template = useAppSelector((state) => state.proposal.template)
    const templateVal = useAppSelector((state) => state.proposal.templateVal)
    const voteDurDay = useAppSelector((state) => state.proposal.voteDurDay)
    const voteDurHour = useAppSelector((state) => state.proposal.voteDurHour)
    const showHeader = <Header />;

    const TEMPLATE = [
        "template 1",
        "template 2",
        "template 3"
    ]

    const handleTemplateSelect = (val: number) => {
        if(val === templateVal) {
            dispatch(updateTemplateVal(-1))
            dispatch(updateTemplate(''))
        } else {
            dispatch(updateTemplateVal(val))
            dispatch(updateTemplate(TEMPLATE[val]))
        }
    }

    const handleClick = () => {
        dispatch(updateStepNumber(4))
        navigate("/token")
    }

    return (
        <>
            <div className='absolute top-0 right-0'>
                {showHeader}
            </div>
            <div className={"something"} style={{ paddingLeft: 480, paddingTop: 100, paddingBottom: 100, height: 1600 }}>
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
                    <div style={{ display: "flex", position: "relative", right: 120, zIndex: 9999 }} >
                        <SelectTemplate blockTitle={TEMPLATE[0]} blockDescription="description of block 1" iconColor={templateVal === 0 ? '#C94B32' : 'white'} onClick={() => handleTemplateSelect(0)}/>
                        <SelectTemplate blockTitle={TEMPLATE[1]} blockDescription="description of block 2" iconColor={templateVal === 1 ? '#C94B32' : 'white'} onClick={() => handleTemplateSelect(1)}/>
                        <SelectTemplate blockTitle={TEMPLATE[2]} blockDescription="description of block 3" iconColor={templateVal === 2 ? '#C94B32' : 'white'} onClick={() => handleTemplateSelect(2)}/>
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
                    <div style={{ width: "500px" }}>
                        <div className={"pageSubItemHeader"}>
                            Support
                            <Tooltip hasArrow label="Support" placement="top">
                                <Icon color='gray' w={19} h={19} ml={5} name='question' />
                            </Tooltip>
                        </div>
                        <SliderThumbWithTooltip />
                    </div>

                    <div style={{ width: "486px" }}>
                        <div className={"pageSubItemHeader"}>
                            Minimum Approval
                            <Tooltip hasArrow label="Minimum Approval" placement="top">
                                <Icon color='gray' w={19} h={19} ml={5} name='question' />
                            </Tooltip>
                        </div>
                        <ApprovalSliderThumbWithTooltip />
                    </div>
                    <div className={"pageSubItemHeader"}>
                        Vote Duration
                        <Tooltip hasArrow label="vote Duration" placement="top">
                            <Icon color='gray' w={19} h={19} ml={5} name='question' />
                        </Tooltip>
                    </div>
                    <div style={{ display: "flex" }}>
                        <ChangeComponent property="Days" value1={voteDurDay}/>
                        <ChangeComponent property="Hours" value1={voteDurHour}/>
                    </div>
                </div>
                <div>
                    <button id="nextButtonSettings" className={"nextButton"} onClick={handleClick}>
                        NEXT STEP
                    </button>
                </div>
            </div>
        </>
    )
}

export default SettingsPage