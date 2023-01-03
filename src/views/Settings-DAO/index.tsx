
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
		marginTop: '5rem',
		height: "100vh",
		maxHeight: 'fit-content',
		display: 'flex',
		flexDirection: 'column',
		overflow: 'auto',
		padding: '0px 25px',
	},
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
					display: { xs: 'none', sm: 'none', md: 'block', lg: 'block' },
					'& .MuiDrawer-paper': { width: '90px', background: '#C94B32', borderRight: 'none' },
				}}
			>
				<Box style={{ top: '30%', position: 'absolute' }}>
					<img src={settings} />
				</Box>
			</Drawer>
			<Container maxWidth="lg">
				<Box className={classes.root}>
					{/* <Typography style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1.5rem', marginTop: '1rem' }}>Settings</Typography> */}
					<Grid container>
						<Grid item xs={12} lg={12} md={12}>
							<OrganizationDetails title={"Organisation Details"} />
						</Grid>
						<Grid item xs={12} lg={4} md={6} >
							<OtherSettings title={"Roles & Permissions"} />
						</Grid>
						<Grid item xs={12} lg={4} md={6}>
							<OtherSettings title={"Safe"} />
						</Grid>
						<Grid item xs={12} lg={4} md={6} >
							<OtherSettings title={"Pass Tokens"} />
						</Grid>
						<Grid item xs={12} lg={4} md={6} >
							<OtherSettings title={"SWEAT points"} />

						</Grid>
						<Grid item xs={12} lg={4} md={6} >
							<OtherSettings title={"Terminologies"} />
						</Grid>
						<Grid item xs={12} lg={4} md={6} >
							<OtherSettings title={"Discord"} />
						</Grid>
					</Grid>
				</Box>
			</Container>
		</>
	)
}