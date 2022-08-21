import React, { useEffect, useState } from 'react'
import Header from 'components/Header';
import Navbar from 'components/Web3AuthNavbar/Navbar';
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { Web3AuthPropType } from 'types';
import { StepBlock } from '../components/sub/StepBlock';
import { StepBlockOptional } from '../components/sub/StepBlockOptional';
import { updateStepNumber } from 'state/proposal/reducer'
import '../styles/App.css'
import '../styles/CreateDao.css'
import '../styles/Dashboard.css'
import '../styles/Modal.css'
import '../styles/Sidebar.css'

const StartDAO = (props: Web3AuthPropType) => {
    const dispatch = useAppDispatch()
    const web3authAddress = useAppSelector((state) => state.proposal.Web3AuthAddress)
    const showHeader = !!web3authAddress ? <Navbar web3Provider={props.web3Provider} /> : <Header />;

    useEffect(() => {
        dispatch(updateStepNumber(1))
    }, [])

    return (
        <>
            <div className='absolute top-0 right-0'>
                {showHeader}
            </div>
            <div className={"createDaoLogin"}>
                <div>
                    <div className={"welcomeText2"} style={{ paddingTop: 100 }}>
                        Start Your DAO
                    </div>
                    <div className={"welcomeText1"}>
                        Rally support, fund your project, and reward your backers by launching a crowdfund. All it takes is a name and a funding goal.
                    </div>
                    <StepBlock blockTitle={"Creation guide"} blockDescription={"Read all the tips on how to succesfully create and run a DAO."} />
                    <StepBlock blockTitle={"Basics"} onClickGoToStep="/sidepage" blockDescription={"Name your project, upload an image, and set the details."} />
                    <StepBlock blockTitle={"Templates & Configurations"} onClickGoToStep="/settings" blockDescription={"Choose your template and set the ... for your DAO."} />
                    <StepBlockOptional blockTitle={"Create your Token"} blockDescription={"Name your token, upload image and set the details."} />
                    <StepBlock blockTitle={"Go live!"} onClickGoToStep="/golive" blockDescription={"Take your DAO public by completing the final checklist, cross-checking the values, and ensuring there aren’t any mis-spellings."} />
                </div>
            </div>
        </>
    )
}

export default StartDAO