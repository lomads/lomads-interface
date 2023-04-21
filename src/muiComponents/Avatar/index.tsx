import React,{useState,useEffect} from 'react';
import { get as _get} from 'lodash';
import Avatar from "boring-avatars";
import { Box,Typography } from '@mui/material';


export default ({name, wallet, hideDetails, ...props }: any) => {

    return (
        <Box style={{display:'flex',width:'100%'}}>
            <Avatar
                size={32}
                name={wallet}
                variant="bauhaus"
                colors={["#E67C40", "#EDCD27", "#8ECC3E", "#2AB87C", "#188C8C"]}
            />
            {
                !hideDetails &&
                <Box style={{marginLeft:'12px',display:'flex',flexDirection:'column',alignItems:'flex-start',justifyContent:'center'}}>
                    {
                        name && <Typography style={{color:'#1b2b41',fontWeight:'700',fontSize:'12px',margin:'0'}}>{name}</Typography>
                    }
                    <Typography style={{color:'#1b2b41',fontWeight:'400',fontSize:'12px',margin:'0'}}>{wallet.slice(0, 6) + "..." + wallet.slice(-4)}</Typography>
                </Box>
            }
        </Box>
    )
}
