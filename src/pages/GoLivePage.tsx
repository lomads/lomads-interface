import React from 'react'
import '../styles/App.css'
import '../styles/CreateDao.css'
import '../styles/Dashboard.css'
import '../styles/Modal.css'
import '../styles/Sidebar.css'
import BasicsComponent from '../components/BasicsComponent'
import TokenComponent from '../components/TokenComponent'
import SettingsComponent from '../components/SettingsComponent'

const GoLivePage = () => {
  return (
    <div className={"something"} style={{paddingLeft:480, paddingTop:100,paddingBottom:100}}>
                <div className={"pageTitle"}>
                    Go live
                </div>
                <div className={"pageDescription"} style={{width:"486px"}}>
                    Take your crowdfund public by completing the final checklist, cross-checking the values, and ensuring there aren’t any mis-spellings.
                </div>
                <div>
                   <div className={"gotitle"}>
                     Basics
                   </div>
                   <div>
                    <BasicsComponent/>
                   </div>
                </div>
                <div>
                   <div className={"gotitle"}>
                     Settings
                   </div>
                   <div>
                    <SettingsComponent/>
                   </div>
                </div>
                <div>
                   <div className={"gotitle"}>
                     Token
                   </div>
                   <div>
                    <TokenComponent/>
                   </div>
                </div>

                <div>
                    <button id="buttonDeploy" className={"nextButton"}>
                        DEPLOY
                    </button>
                </div>
    </div>
  )
}

export default GoLivePage