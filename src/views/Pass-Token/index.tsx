
import { Container, Grid, Typography, Box } from "@mui/material"
import { makeStyles } from '@mui/styles';
import Button from "components/Button";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme: any) => ({
	root: {
		padding: '15px 150px 20px 150px',
		height: '90vh',
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
	}
}));


export default (props: any) => {
	const classes = useStyles();
	const navigate = useNavigate();

	return (
		<>
			<Box className={classes.root}>
				<Box className={classes.title}>
					<Typography>The organisation doesn’t have token yet</Typography>
				</Box>
				<Button variant="contained" size="small">Configure Pass Token</Button>
			</Box>
		</>
	)
}