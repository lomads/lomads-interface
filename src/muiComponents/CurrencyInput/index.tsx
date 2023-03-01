import { Box } from "@mui/material"
import { ReactComponent as DropdownRed } from 'assets/svg/dropdown-red.svg';
import { ReactComponent as DropupRed } from 'assets/svg/dropup-red.svg';
import { ReactComponent as ArrowDown } from "assets/svg/dropdown.svg";
import MenuItem from '@mui/material/MenuItem';
import {
    Select,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
  } from "@chakra-ui/react";
import { makeStyles } from '@mui/styles';
import TextInput from 'muiComponents/TextInput';
import IconButton from "muiComponents/IconButton";
import { useState } from "react";


const useStyles = makeStyles((theme) => ({
    pickerContainer: {
        display: 'flex',
        flexDirection: 'row',
        height: '50px',
        '& .chakra-select__icon-wrapper' : {
            right: '10px'
        }
    },
    numberInput: {
        background: '#FFFFFF',
        '& input' : {
            fontFamily: `'Inter', sans-serif`,
            fontStyle: 'normal',
            fontWeight: '400',
            fontSize: '16px',
            lineHeight: '18px',
            boxShadow: 'inset 1px 0px 4px rgba(27, 43, 65, 0.1)',
            textAlign: 'center',
            letterSpacing: '-0.011em',
            color: 'rgba(27, 45, 65, 0.6)'
        } 
    },
    select: {
        width: '100%',
        '-webkit-appearance': 'none',
        '-moz-appearance': 'none',
        textIndent: '1px',
        textOverflow: '',
    }
}));

export default ({ options, onChange, value, dropDownvalue, onDropDownChange, disabled, disableSelect }: any) => {
    const classes = useStyles()
    return (
        <div className={classes.pickerContainer}>
            <div className={classes.numberInput}>
                <NumberInput isDisabled={disabled} value={value} onChange={e => onChange(e)} defaultValue={0} style={{ width: (100 + 50), height: 50, borderWidth: 1, borderColor: 'rgba(27, 43, 65, 0.1)', borderRightWidth: 0, borderRadius: '10px 0px 0px 10px' }} step={1} min={0}>
                    <NumberInputField className='input' style={{ padding: 0, textAlign: "center", height: 50, width: 100, backgroundColor: '#F5F5F5', borderTopRightRadius: 0, borderBottomRightRadius: 0, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, borderWidth: 0 }} />
                    <NumberInputStepper style={{ width: 50, backgroundColor: 'transparent', borderRadius: '0px 10px 10px 0px' }}>
                    <NumberIncrementStepper color="#C94B32" children={<DropupRed />} />
                    <NumberDecrementStepper color="#C94B32" children={<DropdownRed />} style={{ borderTopWidth: 0 }} />
                    </NumberInputStepper>
                </NumberInput>
            </div>
            <Select disabled={disabled || disableSelect} className={classes.select} defaultValue={dropDownvalue} onChange={e => onDropDownChange(e.target.value)} bg='#F5F5F5' color='#76808D' variant='unstyled' style={{ borderRadius: '0px 10px 10px 0px', borderWidth: 1, borderLeftWidth: 0, borderColor: 'rgba(27, 43, 65, 0.1)', boxShadow: 'inset -1px 0px 4px rgba(27, 43, 65, 0.1)', height: 50, padding: '0px 50px 0px 20px' }} iconSize={"15"} icon={<ArrowDown />}>
                {
                    options.map((option: any) => {
                        return (
                            <option value={option.value}>{ option.label }</option>
                        )
                    })
                }
            </Select>
      </div>
    )
}