import React, { useState } from 'react'
import CreateDaoSidebar from '../components/CreateDaoSidebar'
import BasicsPage from './BasicsPage'
import SettingsPage from './SettingsPage'
import TokenPage from './TokenPage'
import GoLivePage from './GoLivePage'
import Dashboard from './Dashboard'
import { sidebarPropType, Web3AuthPropType } from '../types'

const SidebarPage = (props: Web3AuthPropType) => {

  const renderPage = () => {
    if (props.page === "Basics") {
      return (
        <div>
          <BasicsPage web3Provider={props.web3Provider}/>
        </div>
      );
    } else if (props.page === "Token") {
      return (
        <div>
          <TokenPage web3Provider={props.web3Provider}/>
        </div>
      );
    }
    else if (props.page === "Settings") {
      return (
        <div>
          <SettingsPage web3Provider={props.web3Provider}/>
        </div>
      );
    } else if (props.page === "Go Live") {
      return (
        <div>
          <GoLivePage web3Provider={props.web3Provider}/>
        </div>
      );
    } else if (props.page === "Dashboard") {
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
      <CreateDaoSidebar  />
      <div className='combine'>
      {renderPage()}
      </div>
    </div>
  )
}

export default SidebarPage