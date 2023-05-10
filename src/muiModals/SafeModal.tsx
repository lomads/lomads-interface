import React, { useState, useCallback, useEffect, useRef } from 'react'
import {
    Drawer, Box, Typography
} from '@mui/material';
import IconButton from 'muiComponents/IconButton';
import { makeStyles } from '@mui/styles';
import CloseSVG from 'assets/svg/close-new.svg'
import { useAppSelector, useAppDispatch } from "state/hooks";
import { get as _get, find as _find } from 'lodash';

const useStyles = makeStyles((theme: any) => ({
}));

export default ({ open, onClose }: { open: boolean, onClose: any }) => {
    const classes = useStyles();
    return (
        <Drawer
            PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
            sx={{ zIndex: 99999 }}
            anchor={'right'}
            open={open}
            onClose={() => onClose()}>
            <Box sx={{ width: 575, flex: 1, paddingBottom: '80px', paddingLeft: '40px', borderRadius: '20px 0px 0px 20px' }}>
                <IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={() => onClose()}>
                    <img src={CloseSVG} />
                </IconButton>
            </Box>
        </Drawer>
    )
}