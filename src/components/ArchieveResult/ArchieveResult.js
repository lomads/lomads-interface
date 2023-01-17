import React from "react";
import { useState } from "react";


const ArchieveResult = () => {
   const[toggle,SetToogle]=useState(false);
 const showarchivedetail=(e)=>{
console.log("toggle function")
    SetToogle(!toggle);
 }
    return (
        <>
        <h1>Archieve Result</h1>
        <div className="container">
        
        <div className="container_Header">
            <div className="date_result">
            <span>10/11/2023</span>
            </div>
            <div className="percent_result">
                <div className="result">85%</div>
            <span className={toggle?"downarrow":"rightarrow"}  onClick={(e)=>{showarchivedetail()}} ></span>
            </div>
        </div>
        <div className="container_Body" style={{ display: toggle ? 'block' : 'none' }}>
            <div className="subscriber_result">
            <span>+500 Subscriber for this month</span>
            </div>
            <div className="subscriber_percent">
           <div className="slider"></div>
           <div class="percent_number"> <span>90%done</span></div>
            </div>
            
       
        
        </div> 
        <div className="container_Body" style={{ display: toggle ? 'block' : 'none' }}>
            <div className="subscriber_result">
            <span>+500 Subscriber for this month</span>
            </div>
            <div className="subscriber_percent">
           <div className="slider"></div>
           <div class="percent_number"> <span>90%done</span></div>
            </div>
            
       
        
        </div> 
        <div className="container_Body" style={{ display: toggle ? 'block' : 'none' }}>
            <div className="subscriber_result">
            <span>+500 Subscriber for this month</span>
            </div>
            <div className="subscriber_percent">
           <div className="slider"></div>
           <div class="percent_number"> <span>90%done</span></div>
            </div>
            
       
        
        </div> 
        <div className="container_Body" style={{ display: toggle ? 'block' : 'none' }}>
            <div className="subscriber_result">
            <span>+500 Subscriber for this month</span>
            </div>
            <div className="subscriber_percent">
           <div className="slider"></div>
           <div class="percent_number"> <span>90%done</span></div>
            </div>
            
       
        
        </div> 
        <div className="container_Body" style={{ display: toggle ? 'block' : 'none' }}>
            <div className="subscriber_result">
            <span>+500 Subscriber for this month</span>
            </div>
            <div className="subscriber_percent">
           <div className="slider"></div>
           <div class="percent_number"> <span>90%done</span></div>
            </div>
            
       
        
        </div> 
        <div className="container_Body" style={{ display: toggle ? 'block' : 'none' }}>
            <div className="subscriber_result">
            <span>+500 Subscriber for this month</span>
            </div>
            <div className="subscriber_percent">
           <div className="slider"></div>
           <div class="percent_number"> <span>90%done</span></div>
            </div>
            
       
        
        </div> 
       
       
        
        </div>
       

            
        </>
    )
}
export default ArchieveResult;
