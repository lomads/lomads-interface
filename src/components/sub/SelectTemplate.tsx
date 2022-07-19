import React from 'react'
import '../../styles/CreateDao.css'
import optionalSelect from '../../assets/svg/optionalSelect.svg'
import rightArrow from "../../assets/svg/rightArrow.svg";
import { blockType } from '../../types';

const SelectTemplate = (props: blockType) => {
  return (
    <div className='template'>
        <div className='template-image'>
          <img src={optionalSelect} className="checkImage" alt="" />
        </div>
        <div className='template-detail'>
          <div>
            <div className='title'>
              {props.blockTitle}
            </div>
            <div className='description'>
              {props.blockDescription}
            </div>
          </div>
          <div>
            <button className={"button1"}>
                <img src={rightArrow} alt="rightArrow"/>
            </button>
          </div>
        </div>
    </div>
  )
}

export default SelectTemplate