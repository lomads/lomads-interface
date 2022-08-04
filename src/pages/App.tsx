import React from 'react'
import { Routes, Route } from "react-router-dom";
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import StartDAO from './StartDAO';
import SidebarPage from './SidebarPage';
import Header from 'components/Header'
import { Context } from '../constants/context';
import MyTag from './CommunityTag';

export default function App() {
  return (
    <Context.Provider value={{ title: '' }}>
      {/* <Header /> */}
      <div style={{ margin: 0 }}>
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/login' element={[<Header/>,<LoginPage/>]}/>
          <Route path='/createdao' element={[<Header/>,<StartDAO />]} />
          <Route path='/basics' element={<SidebarPage page="Basics" />} />
          <Route path='/settings' element={<SidebarPage page="Settings" />} />
          <Route path='/token' element={<SidebarPage page="Token" />} />
          <Route path='/golive' element={<SidebarPage page="Go Live" />} />
          <Route path='/dashboard' element={<SidebarPage page="Dashboard" />} />
          <Route path='/sidepage' element={<SidebarPage page='Basics'/>} />
          <Route path='/tag' element={<MyTag/>}/>
        </Routes>
      </div>
    </Context.Provider >
  )
}