import React from 'react'
import { useNavigate } from 'react-router-dom';
import rectImage from "../../assets/svg/rect.svg";
import rightArrow from "../../assets/svg/rightArrow.svg";
import vertLine from "../../assets/svg/vertLine.svg";
import {blockType} from '../../types/index'

export const StepBlock = (props: blockType) => {
    const navigate = useNavigate();
    const handleClick =()=>{
        navigate(props.onClickGoToStep || "")
    }
  return (
    <div className={"stepBlock"}>
                <div className={"rect1"}>
                    <img src={rectImage} style={{paddingTop:20}}alt="rectImage"/>
                </div>
                <div>
                    <div style={{display:"flex"}}>
                        <div className={"title"}>
                            {props.blockTitle}
                        </div>
                        <div className={"rect2"}>
                            <div className={"reqText"}>
                                Required
                            </div>
                        </div>
                    </div>
                    <div className={"description"}>
                        {props.blockDescription}
                    </div>
                </div>
                <div style={{marginTop:-10, paddingLeft:20}}> {/* className={"arrow"}*/}
                    <img src={vertLine} alt="vertLine"/>
                </div>
                <div>
                    <button className={"button1"} onClick={handleClick}>
                        <img src={rightArrow} alt="rightArrow"/>
                    </button>
                </div>
            </div>
  )
}
