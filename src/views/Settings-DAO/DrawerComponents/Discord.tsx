
import { Container, Grid, Typography, Box, IconButton } from "@mui/material"
import { makeStyles } from '@mui/styles';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from "components/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from '@mui/material/styles';
const useStyles = makeStyles((theme: any) => ({
	root: {
		padding: '50px',
		height: '90vh',
		overflow: 'auto'
	},
	notificationBox: {
		padding: '0px 50px',
		marginBottom: '2rem',
		display: 'flex',
		flexDirection: 'column'
	},
	buttonBox: {
		marginTop: '1rem',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		columnGap: '2rem'
	}

}));
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
	width: 65,
	height: 40,
	padding: 7,
	'& .MuiSwitch-switchBase': {
		margin: '7px 1px',
		padding: 0,
		boxShadow: 'inset 1px 0px 4px rgba(27, 43, 65, 0.1)',
		transform: 'translateX(6px)',
		'&.Mui-checked': {
			color: '#fff',
			transform: 'translateX(22px)',
			margin: '7px 10px',

			'& .MuiSwitch-thumb:before': {
				backgroundColor: '#c94b32',
				borderRadius: '8px',
				backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12"><path fill="${encodeURIComponent(
					'#fff',
				)}" d="M0.899902 4.83379L4.92295 10.6715L12.4126 1.09314" /></svg>')`,
			},
			'& + .MuiSwitch-track': {
				opacity: 1,
				backgroundColor: '#f0f0f0',
			},
		},
	},
	'& .MuiSwitch-thumb': {
		backgroundColor: '#76808d',
		borderRadius: '8px',
		position:'absolute',
		left:2,
		top:1,
		width: 24,
		height: 24,
		boxShadow: 'inset 1px 0px 4px rgba(27, 43, 65, 0.1)',

		'&:before': {
			content: "''",
			position: 'absolute',
			width: '100%',
			height: '100%',
			left: 0,
			top: 0,
			backgroundRepeat: 'no-repeat',
			backgroundPosition: 'center',

		},
	},
	'& .MuiSwitch-track': {
		opacity: 1,
		backgroundColor: '#f0f0f0',
		boxShadow: 'inset 1px 0px 4px rgba(27, 43, 65, 0.1)',
		borderRadius: '10px'
	},
}));

export default (props: any) => {
	const classes = useStyles();
	const navigate = useNavigate();

	return (
		<>
			<Box className={classes.root}>
				<Box className={classes.notificationBox}>
					<Typography style={{ color: '#76808d', fontWeight: 700, fontSize: '16px', marginBottom: '1rem' }}>Project Notifications</Typography>
					<FormControlLabel control={<MaterialUISwitch />} label="When a new member is added" />
					<FormControlLabel control={<MaterialUISwitch />} label="When a project is marked as complete" />

				</Box>
				<Box className={classes.notificationBox}>
					<Typography style={{ color: '#76808d', fontWeight: 700, fontSize: '16px', marginBottom: '1rem' }}>Task Notifications</Typography>
					<FormControlLabel control={<MaterialUISwitch />} label="When a task is created" />
					<FormControlLabel control={<MaterialUISwitch />} label="When someone is assigned a task" />
					<FormControlLabel control={<MaterialUISwitch />} label="When a submission is accepted" />
				</Box>
				<Box className={classes.buttonBox}>
					<Button variant="outlined" size="small">Cancel</Button>
					<Button variant="contained" size="small">Save Changes</Button>
				</Box>

			</Box>
		</>
	)
}