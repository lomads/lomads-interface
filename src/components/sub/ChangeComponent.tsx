import React from 'react'
import rightArrow from "../../assets/svg/rightArrow.svg";
import { ChangeComponentType } from '../../types';
const ChangeComponent = (props: ChangeComponentType) => {
  return (
    <>
    <div className='changebutton'>
        <div className='property'>
            {props.property}
        </div>
        <div>
        <input type="number" className='value' name='value' placeholder='0'/>
        </div>
        <div className='changebuttons'>
            <div>
                <img src={rightArrow} alt="" className='rightarrowup'/>
            </div>
            <div>
                <img src={rightArrow} alt="" className='rightarrowdown'/>
            </div>
        </div>
    </div>
    </>
  )
}

export default ChangeComponent