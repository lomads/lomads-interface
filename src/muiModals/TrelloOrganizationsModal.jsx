import React from 'react';
import { useState, useEffect } from 'react'
import clsx from 'clsx';
import { get as _get } from 'lodash'
import {
    Drawer, Box, Typography, Paper, Card, CardContent, Radio, Button
} from '@mui/material';
import { Image, Input } from "@chakra-ui/react";
import IconButton from 'muiComponents/IconButton';
import CloseSVG from 'assets/svg/close-new.svg'
import SafeIcon from "assets/svg/safe.svg";
import checkmark from "assets/svg/completeCheckmark.svg";
import palette from 'muiTheme/palette';
import { makeStyles } from '@mui/styles';
import axiosHttp from 'api';
import { LeapFrog } from "@uiball/loaders";
import { useDispatch } from "react-redux";
import { useAppSelector } from "state/hooks";

import { syncTrelloData } from 'state/dashboard/actions';
import { resetSyncTrelloDataLoader } from "state/dashboard/reducer";
import { padding } from '@mui/system';

const useStyles = makeStyles((theme) => ({
    card:{
        height:'60px',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom:'20px',
        boxShadow:'3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)',
        borderRadius:'5px',
        padding:'0 15px'
    },
    cardDisabled:{
        background: 'rgba(24, 140, 124, 0.1)',
        height:'60px',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom:'20px',
        borderRadius:'5px',
        boxShadow:'none',
        padding:'0 15px'
    }
}));

export default ({ open, onClose, organizationData }) => {
    const classes = useStyles();
    const dispatch = useDispatch()
    const { DAO,user, syncTrelloDataLoading } = useAppSelector((state) => state.dashboard);
    console.log("User : ",user);

    const [selectedValue, setSelectedValue] = useState(null);
    const [boardsLoading, setBoardsLoading] = useState(false);

    useEffect(() => {
        if (syncTrelloDataLoading === false) {
            dispatch(resetSyncTrelloDataLoader());
            setBoardsLoading(false);
        }
    }, [syncTrelloDataLoading]);

    const getAllBoards = () => {
        // check if webhook already exists
        const trelloOb = _get(DAO, 'trello', null);
        if(trelloOb){
            console.log("trello Ob exists...");
            if (_get(DAO, `trello.${selectedValue}`, null)) {
                console.log("org exists");
                alert("This organisation has already been synced!");
                return;
            }
            else {
                console.log("org doesnt exists...call handleTrello");
                handleTrello(selectedValue);
            }
        }
        else {
            console.log("trello ob doesnt exists...call handleTrello");
            handleTrello(selectedValue);
        }
    }

    const handleTrello = (selectedValue) => {
        setBoardsLoading(true);
        var trelloToken = localStorage.getItem("trello_token");
        axiosHttp.get(`utility/get-trello-boards?orgId=${selectedValue}&accessToken=${trelloToken}`)
            .then((boards) => {
                if (boards.data.type === 'success') {
                    // setBoardsLoading(false);
                    console.log("Boards : ", boards.data.data);
                    var trelloToken = localStorage.getItem("trello_token");
                    dispatch(syncTrelloData({
                        payload: {
                            user:{id:_get(user,'_id',null),address: _get(user,'wallet',null)},
                            daoId: _get(DAO, '_id', null),
                            boardsArray: boards.data.data,
                            accessToken: trelloToken,
                            idModel: selectedValue
                        }
                    }));
                }
                else {
                    setBoardsLoading(false);
                    console.log(boards.data.message);
                }
            })
            .catch((e) => {
                setBoardsLoading(false);
                console.log("Error : ", e)
            })
    }

    return (
        <Drawer
            PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
            sx={{ zIndex: 99999 }}
            anchor={'right'}
            open={open}
            onClose={() => onClose()}>
            <Box sx={{ width: '575px', flex: 1, padding: '0 40px 80px 40px', borderRadius: '20px 0px 0px 20px' }}>
                <IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={() => onClose()}>
                    <img src={CloseSVG} />
                </IconButton>

                <Box display="flex" flexDirection="column" mt={8} alignItems="center">
                    <Image
                        src={SafeIcon}
                        alt="Safe icon"
                        style={{ marginTop: "50px", width: "94.48px", height: "50px" }}
                    />
                    <Typography my={2} style={{ color: palette.primary.main, fontSize: '30px', fontWeight: 400 }}>Integrations: Trello</Typography>
                </Box>

                <Box sx={{ width: '100%', display: 'flex',flexDirection:'column',alignItems:'center' }}>
                    <Typography style={{ color: '#76808D', fontSize: '16px', fontWeight: 700,margin:'30px 0' }}>Select your organisation Trello Workspace </Typography>
                    <Box sx={{ width: '400px',padding:'26px 22px',display:'flex',flexDirection:'column' }}>
                    {
                        organizationData && organizationData.map((item) => {
                            return (
                                <Card className={_get(DAO, `trello.${item.id}`, null) ? classes.cardDisabled : classes.card}>
                                    <CardContent>
                                        <Typography sx={{ fontSize: 14 }}>
                                            {item.displayName}
                                        </Typography>
                                    </CardContent>
                                    {
                                        _get(DAO, `trello.${item.id}`, null) 
                                        ?
                                        <Image 
                                        src={checkmark}
                                        />
                                        :
                                        <Radio
                                            checked={selectedValue === item.id}
                                            onChange={(e) => setSelectedValue(e.target.value)}
                                            value={item.id}
                                            name="radio-buttons"
                                            inputProps={{ 'aria-label': 'A' }}
                                            disabled={_get(DAO, `trello.${item.id}`, null) ? true:false}
                                        />      
                                    }
                                </Card>
                            );
                        })
                    }
                    </Box>
                </Box>
                <Box sx={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <Button color="error" variant="contained" onClick={getAllBoards}>
                        {
                            boardsLoading
                                ?
                                <LeapFrog size={24} color="#FFF" />
                                :
                                'SYNC'
                        }
                    </Button>
                </Box>
            </Box>
        </Drawer>
    )
}