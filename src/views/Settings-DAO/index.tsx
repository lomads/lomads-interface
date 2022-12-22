
import { Container, Grid, Typography, Box, Toolbar } from "@mui/material"
import { makeStyles } from '@mui/styles';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import OrganizationDetails from "./OrganizationDetails";
import OtherSettings from "./OtherSettings";
import settings from '../../assets/svg/settingsXL.svg';
import Drawer from '@mui/material/Drawer';

const useStyles = makeStyles((theme: any) => ({
	root: {
		height: "100vh",
		maxHeight: 'fit-content',
		display: 'flex',
		flexDirection: 'column',
		overflow: 'hidden !important',
		padding: '0px 25px',
	},
	otherSettings: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	}
}));

export default () => {
	const classes = useStyles();
	const navigate = useNavigate();

	return (
		<>
			<Drawer
				variant="permanent"
				open={true}
				ModalProps={{
					keepMounted: true,
				}}
				sx={{
					display: { xs: 'block', sm: 'block' },
					'& .MuiDrawer-paper': { width: '100px', background: '#C94B32', borderRight: 'none' },
				}}
			>
				<Box style={{ top: '30%', position: 'absolute' }}>
					<img src={settings} />
				</Box>

			</Drawer>
			<Box className={classes.root}>
				<Typography style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1.5rem', marginTop: '1rem' }}>Settings</Typography>
				<OrganizationDetails title={"Organisation Details"} />
				<Box className={classes.otherSettings}>
					<OtherSettings title={"Roles & Permissions"} />
					<OtherSettings title={"Safe"} />
					<OtherSettings title={"Pass Tokens"} />
				</Box>
				<Box className={classes.otherSettings}>
					<OtherSettings title={"SWEAT points"} />
					<OtherSettings title={"Terminology"} />
					<OtherSettings title={"Discord"} />
				</Box>

			</Box>

		</>
	)
}