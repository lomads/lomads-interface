import React from 'react'
import {Routes,Route} from "react-router-dom";
import StartDAO from './StartDAO';
import SidebarPage from './SidebarPage';
import Header from 'components/Header'

export default function App() {
  return (
        <>
        <Header />
        <div style={{margin:0}}>
        <Routes>
           <Route path='/' element={<StartDAO/>}/>
           <Route path='/basics' element={<SidebarPage page="Basics"/>}/>
           <Route path='/settings' element={<SidebarPage page="Settings"/>}/>
           <Route path='/token' element={<SidebarPage page="Token"/>}/>
           <Route path='/golive' element={<SidebarPage page="Go Live"/>}/>
           <Route path='/sidepage' element={<SidebarPage page="Basics"/>}/>
       </Routes>
        </div>
        </>
  )
}