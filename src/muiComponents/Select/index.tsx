import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type propTypes = {
  options: string[],
  selected: string | undefined,
  selectStyle?: any,
  setSelectedValue: (event: any) => void
}

export default function MuiSelect({ 
      options,
      selected,
      selectStyle,
      setSelectedValue
    }: propTypes) {
  const [activeOption, setActiveOption] = React.useState(selected);

  const handleChange = (event: SelectChangeEvent) => {
    if(!!event.target.value){
      setActiveOption(event.target.value);
      setSelectedValue(event.target.value)
    }
  };
  return (
    <FormControl sx={{ width: '100%', ...selectStyle}}>
      <Select
        value={activeOption}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label', id: 'mui-dropdown' }}
      >
        {options.map((option, index) => (
          <MenuItem
            value={option}
            key={index}
          >
            {option}
          </MenuItem>))}
      </Select>
    </FormControl>
  );
}