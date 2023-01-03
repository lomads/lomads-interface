
import { Container, Grid, Typography, Box } from "@mui/material"
import { makeStyles } from '@mui/styles';
import Button from "components/Button";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme: any) => ({
	root: {
		padding: '20px 100px 20px 100px',
		height: '65vh',
		overflow: 'auto'
	},
	title: {
		fontFamily: 'Open Sans',
		fontStyle: 'italic',
		fontWeight: 400,
		fontSize: '14px',
		lineHeight: '18px',
		textAlign: 'center',
		letterSpacing: '-0.011em',
		color: '#76808D',
		marginBottom: '2rem'
	},

	divider: {
		border: '1px solid #c94b32',
		width: '210px',
		height: '0px',
		backgroundColor: '#c94b32',
		margin: '40px 0px 30px 0px',
		position: 'relative',
		left: '22%',
	},
}));

export default (props: any) => {
	const classes = useStyles();
	const navigate = useNavigate();

	return (
		<>
			<Box className={classes.root}>
				<Box className={classes.title}>
					<Typography>Labels used in all your organisation’s interface.</Typography>
				</Box>
				<Box style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
					<Typography style={{ color: '#76808D', fontSize: '16px', fontWeight: 700, marginRight: '1rem' }}>Workspaces : </Typography>
					<Typography style={{ fontStyle: 'italic', fontSize: '16px' }}>Workspaces</Typography>
				</Box>
				<Box style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
					<Typography style={{ color: '#76808D', fontSize: '16px', fontWeight: 700, marginRight: '1rem' }}>Tasks : </Typography>
					<Typography style={{ fontStyle: 'italic', fontSize: '16px' }}>Tasks</Typography>
				</Box>
				<hr className={classes.divider} />

			</Box>
		</>
	)
}