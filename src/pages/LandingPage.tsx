import React from 'react'
import { Link } from "react-router-dom";
import '../styles/App.css'
import '../styles/CreateDao.css'
import '../styles/Dashboard.css'
import '../styles/Modal.css'
import '../styles/Sidebar.css'

const LandingPage = () => {
  return (
    <div style={{backgroundColor:'white'}}>
        <button  id="buyToken" className={"page-button"} style={{width:140, marginLeft:250, position:"absolute", top:30,right:80}}>
            <Link to="/login" className='link'>Create DAO</Link>
        </button>
    </div>
  )
}

export default LandingPage