import React, {useState} from 'react'
import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react'

import rightArrow from "../../assets/svg/rightArrow.svg";
import { ChangeComponentType } from '../../types';

const ChangeComponent = (props: ChangeComponentType) => {

    const [value, setValue] = useState(props.value);
    return (
        <>
        <div className='changebutton' style={{minWidth: props.page ? 350: 0}}>
            <div className='property'>
                {props.property}
            </div>
            <div className='flex 0 0' style={{height: "60px"}}>
                <NumberInput 
                    variant='filled' 
                    height="100%" 
                    width={100} 
                    min={0} 
                    value={value}
                    onChange={(val) => setValue(parseInt(val))}
                >
                    <NumberInputField height="100%" borderRadius={0}/>
                    <NumberInputStepper style={{background: "white", borderColor: "white"}}>
                        <NumberIncrementStepper>
                            <div>
                                <img src={rightArrow} alt="" className='rightarrowup'/>
                            </div>
                        </NumberIncrementStepper>
                        <NumberDecrementStepper>
                            <div>
                                <img src={rightArrow} alt="" className='rightarrowdown'/>
                            </div>
                        </NumberDecrementStepper>
                    </NumberInputStepper>
                </NumberInput>
                {props.vote && 
                    <NumberInput 
                        variant='filled' 
                        height="100%" 
                        width={100} 
                        min={0} 
                        value={value}
                        onChange={(val) => setValue(parseInt(val))}
                    >
                        <NumberInputField height="100%" borderRadius={0}/>
                        <NumberInputStepper style={{background: "white"}}>
                            <NumberIncrementStepper>
                                <div>
                                    <img src={rightArrow} alt="" className='rightarrowup'/>
                                </div>
                            </NumberIncrementStepper>
                            <NumberDecrementStepper>
                                <div>
                                    <img src={rightArrow} alt="" className='rightarrowdown'/>
                                </div>
                            </NumberDecrementStepper>
                        </NumberInputStepper>
                    </NumberInput>
                }
            </div>
        </div>
        </>
    )
}

export default ChangeComponent