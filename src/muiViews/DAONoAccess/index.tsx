import React, { useEffect, useState } from "react";
import frameicon from "../../assets/svg/frame.svg";
import { useNavigate } from "react-router-dom";
import { loadDao } from 'state/dashboard/actions';
import SideBar from "../../pages/NewPages/DashBoard/SideBar";
import { useAppDispatch } from "state/hooks";
import { useWeb3React } from "@web3-react/core";
import { Box, Typography, Container, Grid } from "@mui/material"
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({
  root: {
		height: "100vh",
		maxHeight: 'fit-content',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden !important'
	},
  DAOsuccess: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100vh',
    textAlign: 'center'
  },
  itemsGroup: {
    marginTop: '2%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  },
  message: {
    fontFamily: 'Inter, sans-serif',
    fontStyle: 'normal',
    color: '#C94B32',
    fontWeight: 400,
    fontSize: 30,
    textAlign: 'center',
    letterSpacing: '-0.011em',
    maxWidth: 500,
    margin: '60px 0px 13.5px 0px'
  },
  messageSubtext: {
    fontFamily: 'Inter, sans-serif',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: '-0.011em',
    color: '#76808D'
  },
}));

export default () => {
  const classes = useStyles()
  const { chainId } = useWeb3React();
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const [showNavBar, setShowNavBar] = useState<boolean>(false);
  useEffect(() => {
    dispatch(loadDao({ chainId }))
    sessionStorage.removeItem('__lmds_active_dao')
  }, [chainId])

  const showSideBar = (_choice: boolean) => {
    setShowNavBar(_choice);
  };

  return (
    <Container>
			<Grid container className={classes.root}>
      <Box className={classes.DAOsuccess}>
        <Box className={classes.itemsGroup}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={frameicon} style={{ width: 250, height: 250 }} alt="logo" />
          </Box>
          <Box className={classes.message}>You are currently not on the member list</Box>
          <Box className={classes.messageSubtext}>Please contact the admin through email or other social channels</Box>
        </Box>
      </Box>
      <SideBar
        name={""}
        showSideBar={showSideBar}
        showNavBar={showNavBar}
      />
    </Grid>
		</Container>
  );
};
