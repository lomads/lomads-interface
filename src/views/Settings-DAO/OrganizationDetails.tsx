
import { Container, Grid, Typography, Box } from "@mui/material"
import { makeStyles } from '@mui/styles';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import orgDetail from '../../assets/svg/organisation-details.svg';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Drawer from '@mui/material/Drawer';
import SideDrawer from "./SideDrawer";
const useStyles = makeStyles((theme: any) => ({
	organizationDetailsBox: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-start',
		padding: '30px 25px',
		gap: '10px',
		height: '130px',
		background: '#FFFFFF',
		boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)',
		borderRadius: '20px',
		marginBottom: '1.5rem',
		cursor: 'pointer'
	},
	bottomBox: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		color: '#C94B32'
	},
	drawerStyle: {
		borderRadius: '20px 0 0 20px'
	}
}));

export default (props: any) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const [openDrawer, setOpenDrawer] = useState(false);

	const openDetailsDrawer = () => {
		setOpenDrawer(true);
	}
	const handleCloseDrawer = () => {
		setOpenDrawer(false);
	}
	return (
		<>
			<Box className={classes.organizationDetailsBox} onClick={openDetailsDrawer}>
				<img src={orgDetail} />
				<Box className={classes.bottomBox}>
					<Typography style={{ fontSize: '1.1rem' }}>{props.title}</Typography>
					<ChevronRightIcon />
				</Box>
			</Box>
			<Drawer
				classes={{ paper: classes.drawerStyle }}
				// style={{ zIndex: 1999 }}
				anchor="right"
				open={openDrawer}
				onClose={handleCloseDrawer}
				variant="temporary">
				<SideDrawer closeSidebar={handleCloseDrawer} title={'Organisation Details'} />
			</Drawer>
		</>
	)
}