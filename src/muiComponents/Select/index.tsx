import React, { useEffect, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type propTypes = {
  options: any[],
  selected: number,
  selectStyle?: any,
  setSelectedValue: (event: any) => void
}

export default function MuiSelect({ 
      options,
      selected,
      selectStyle,
      setSelectedValue
    }: propTypes) {
  const [activeOption, setActiveOption] = useState<number | string | undefined | null>(selected);

  useEffect(() => {
    if(selected)
      setActiveOption(selected)
  }, [selected])

  const handleChange = (event: SelectChangeEvent) => {
    if(!!event.target.value){
      setActiveOption(event.target.value);
      setSelectedValue(event.target.value)
    }
  };
  return (
    <FormControl sx={{ width: '100%', ...selectStyle}}>
      <Select
        value={activeOption?.toString()}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label', id: 'mui-dropdown' }}
      >
        {options.map((option, index) => (
          <MenuItem
            value={option?.value.toString()}
            key={index}
          >
            {option.label}
          </MenuItem>))}
      </Select>
    </FormControl>
  );
}