import React from 'react';
import { useState, useEffect } from 'react'
import clsx from 'clsx';
import { get as _get } from 'lodash'
import {
    Drawer, Box, Typography, Paper, Card, CardContent, Radio, Button
} from '@mui/material';
import IconButton from 'muiComponents/IconButton';
import CloseSVG from 'assets/svg/close-new.svg'
import RP from "assets/images/drawer-icons/RP.svg";
import palette from 'muiTheme/palette';
import { makeStyles } from '@mui/styles';
import axiosHttp from 'api';
import { LeapFrog } from "@uiball/loaders";
import { useDispatch } from "react-redux";
import { useAppSelector } from "state/hooks";

import { syncTrelloData } from 'state/dashboard/actions';
import { resetSyncTrelloDataLoader } from "state/dashboard/reducer";

const useStyles = makeStyles((theme) => ({}));

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
            <Box sx={{ width: 768, flex: 1, paddingBottom: '80px', paddingLeft: '40px', borderRadius: '20px 0px 0px 20px' }}>
                <IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={() => onClose()}>
                    <img src={CloseSVG} />
                </IconButton>

                <Box display="flex" flexDirection="column" my={6} alignItems="center">
                    <img src={RP} />
                    <Typography my={2} style={{ color: palette.primary.main, fontSize: '30px', fontWeight: 400 }}>Trello Organizations</Typography>
                </Box>

                <Box sx={{ width: '100%', display: 'flex' }}>
                    {
                        organizationData && organizationData.map((item) => {
                            return (
                                <Box sx={{ width: 275 }}>
                                    <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', marginRight: '1rem' }} >
                                        <CardContent>
                                            <Typography sx={{ fontSize: 14 }}>
                                                {item.displayName}
                                            </Typography>
                                            <Typography sx={{ fontSize: 14 }}>
                                                {item.teamType}
                                            </Typography>
                                        </CardContent>
                                        <Radio
                                            checked={selectedValue === item.id}
                                            onChange={(e) => setSelectedValue(e.target.value)}
                                            value={item.id}
                                            name="radio-buttons"
                                            inputProps={{ 'aria-label': 'A' }}
                                        />
                                    </Card>
                                </Box>
                            );
                        })
                    }
                </Box>
                <Button color="error" variant="contained" onClick={getAllBoards}>
                    {
                        boardsLoading
                            ?
                            <LeapFrog size={24} color="#FFF" />
                            :
                            'Continue'
                    }
                </Button>


            </Box>
        </Drawer>
    )
}