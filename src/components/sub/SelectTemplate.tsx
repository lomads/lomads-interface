import React, { useEffect } from 'react'
import { Icon, IconButton } from '@chakra-ui/react'
import {FaCheckCircle} from 'react-icons/fa'
import '../../styles/CreateDao.css'
import optionalSelect from '../../assets/svg/optionalSelect.svg'
import rightArrow from "../../assets/svg/rightArrow.svg";
import { templateType } from '../../types';

const SelectTemplate = (props: templateType) => {
  return (
    <div className='template' onClick={props.onClick}>
      <div className='template-image'>
        {/* <img src={optionalSelect} className="checkImage" alt="" /> */}
        <Icon color={props.iconColor?props.iconColor:"white"} m={[2,2]} w={46} h={46} as={FaCheckCircle}/>
        
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
            <img src={rightArrow} alt="rightArrow" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SelectTemplate