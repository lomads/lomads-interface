// @ts-nocheck
import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const CHECKMARK = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2430_2610)">
<path d="M6.3999 10.8676L10.423 16.7053L17.9126 7.12695" stroke="white" stroke-linecap="round"/>
</g>
<defs>
<clipPath id="clip0_2430_2610">
<rect width="12.5529" height="10.7596" fill="white" transform="translate(5.87988 6.58301)"/>
</clipPath>
</defs>
</svg>
`

const MaterialUISwitch = styled(Switch)(({ theme, checkedSVG }) => ({
    width: 65,
    height: 30,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      transform: 'translateX(3px)',
      marginTop: 2,
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(36px)',
        '& .MuiSwitch-thumb': {
            backgroundColor: theme.palette.primary.main,
            boxShadow: 'none',
        },
        '& .MuiSwitch-thumb:before': {
          backgroundImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(checkedSVG)}')`,
        },
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: '#f0f0f0'
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: "#76808d",
      boxShadow: 'none',
      width: 26,
      height: 26,
      borderRadius: 10,
      '&:before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      },
    },
    '& .MuiSwitch-track': {
      boxShadow: 'inset 1px 0 4px rgb(27 43 65 / 10%)',
      cursor: 'pointer',
      backgroundColor: '#f0f0f0',
      opacity: 1,
    //   backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      borderRadius: 10,
    },
  }));

export default ({ label, 
  checkedSVG = CHECKMARK,
   ...props }: any) => {
    return (
        <FormControlLabel
            control={<MaterialUISwitch checkedSVG={checkedSVG} sx={{ mr: 1 }} />}
            label={label}
            { ...props }
        />
    )
}