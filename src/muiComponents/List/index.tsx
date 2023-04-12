import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type propTypes = {
  options: string[],
  defaultText: string | number,
  updateThresholdValue: (event: React.MouseEvent<HTMLElement>) => void
}

export default function SelectLabels({ options, defaultText, updateThresholdValue }: propTypes) {
  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
    updateThresholdValue(event)
  };

  return (
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel variant="standard" htmlFor="mui-dropdown">
          Age
        </InputLabel>
        <Select
          value={age}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label',  id: 'mui-dropdown' }}
        >
           {options.map((option, index) => (
          <MenuItem
            value={option}
          >
            {option}
          </MenuItem>))}
        </Select>
      </FormControl>
  );
}