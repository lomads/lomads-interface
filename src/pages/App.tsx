import React from 'react'
import { Routes, Route } from "react-router-dom";
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import StartDAO from './StartDAO';
import SidebarPage from './SidebarPage';
import { Context } from '../constants/context';

export default function App() {
  return (
    <Context.Provider value={{ title: '' }}>
      {/* <Header /> */}
      <div style={{ margin: 0 }}>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={[<LoginPage />]} />
          <Route path='/createdao' element={[<StartDAO />]} />
          <Route path='/basics' element={<SidebarPage page="Basics" />} />
          <Route path='/settings' element={<SidebarPage page="Settings" />} />
          <Route path='/token' element={<SidebarPage page="Token" />} />
          <Route path='/golive' element={<SidebarPage page="Go Live" />} />
          <Route path='/dao/:deployedAddress' element={<SidebarPage page="Dao" />} />
          <Route path='/sidepage' element={<SidebarPage page='Basics' />} />
        </Routes>
      </div>
    </Context.Provider >
  )
}