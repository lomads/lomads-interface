
import { Container, Grid, Typography, Box } from "@mui/material"
import { makeStyles } from '@mui/styles';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import Button from "components/Button";

const useStyles = makeStyles((theme: any) => ({
	root: {
		backgroundColor: '#fff',
		borderRadius: '20px 0 0 20px',
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		overflow: 'hidden',
		padding: '50px 10px 0px 45px',
		position: 'relative',
		width: '800px'
	},
	header: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'space-between',
		marginBottom: '2rem',
		width: '100%',
	},
	bottomBox: {
		alignItems: 'center',
		justifyContent: 'space-around',
		display: 'flex',
	},
	selectStyle: {
		zIndex: 9999,
	}
}));

export default (props: any) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const closeDrawer = () => {
		props.closeSidebar(false);
	}
	return (
		<>
			<Box className={classes.root}>
				<Box className={classes.header}>
					<Typography style={{ fontWeight: 700, fontSize: '16px' }}>Manage Members</Typography>
					<IconButton style={{ background: 'linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%)', borderRadius: '2px' }} onClick={closeDrawer}>
						<CloseIcon style={{ color: '#C94B32' }} />
					</IconButton>
				</Box>
				<Box className={classes.bottomBox}>
					<Button variant='outlined' size="small" onClick={closeDrawer}>Cancel</Button>
					<Button variant='contained' color='primary' size="small" >Save</Button>
				</Box>
			</Box>
		</>
	)
}