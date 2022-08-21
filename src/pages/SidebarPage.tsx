import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CreateDaoSidebar from '../components/CreateDaoSidebar'
import BasicsPage from './BasicsPage'
import SettingsPage from './SettingsPage'
import TokenPage from './TokenPage'
import GoLivePage from './GoLivePage'
import Dashboard from './Dashboard'
import { sidebarPropType, Web3AuthPropType } from '../types'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { updateStepNumber } from '../state/proposal/reducer'

const SidebarPage = (props: Web3AuthPropType) => {
  const stepNumber = useAppSelector(state => state.proposal.stepNumber);

  const renderPage = () => {
    // const paths = [
    //   '',
    //   '',
    //   'Basics',
    //   'Settings',
    //   'Token',
    //   'Go Live'
    // ];

    // const step = paths.indexOf(props.page || '');

    // let page;
    // if (step === -1) {
    //   page = props.page;
    // } else if (step > stepNumber) {
    //   page = paths[stepNumber];
    // } else {
    //   page = paths[step];
    // }
    // console.log('midas ------<', props.page, step, stepNumber, page);

    if (props.page === "Basics") {
      return (
        <div>
          <BasicsPage web3Provider={props.web3Provider} />
        </div>
      );
    } else if (props.page === "Token") {
      return (
        <div>
          <TokenPage web3Provider={props.web3Provider} />
        </div>
      );
    }
    else if (props.page === "Settings") {
      return (
        <div>
          <SettingsPage web3Provider={props.web3Provider} />
        </div>
      );
    } else if (props.page === "Go Live") {
      return (
        <div>
          <GoLivePage web3Provider={props.web3Provider} />
        </div>
      );
    } else if (props.page === "Dao") {
      return (
        <div>
          <Dashboard />
        </div>
      );
    }
    return (
      <div></div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <CreateDaoSidebar />
      <div className='combine'>
        {renderPage()}
      </div>
    </div>
  )
}

export default SidebarPage