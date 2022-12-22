
import { Container, Grid, Typography, Box, Icon } from "@mui/material"
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import orgDetail from '../../assets/svg/OD.svg';

const useStyles = makeStyles((theme: any) => ({
	root: {
		backgroundColor: '#fff',
		borderRadius: '20px 0 0 20px',
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		overflow: 'hidden',
		position: 'relative',
		width: '600px'
	},
	header: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'flex-end',
		marginBottom: '2rem',
		padding: '2rem',
		width: '100%',
	},

	detailBox: {
		padding: '1rem 4rem 1rem 4rem',
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'center',
		color: '#c94b32'
	},
	iconBox: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'center',
		color: '#c94b32'
	}

}));

export default (props: any) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const [imageSource, setImageSource]= useState('');

	const closeDrawer = () => {
		props.closeSidebar(false);
	}

	useEffect(()=>{
		if(props.title=='Organisation Details')
			setImageSource(orgDetail);
	},[]);

	return (
		<>
			<Box className={classes.root}>
				<Box className={classes.header}>
					<IconButton style={{ background: 'linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%)', borderRadius: '2px' }} onClick={closeDrawer}>
						<CloseIcon style={{ color: '#C94B32' }} />
					</IconButton>
				</Box>
				<Box className={classes.iconBox}>
					<img src={imageSource} height='50px' width='95px' />
				</Box>
				<Box className={classes.detailBox}>
					<Typography style={{ color: '#c94b32', fontSize: '30px' }}>{props.title}</Typography>
				</Box>
			</Box>
		</>
	)
}