
import { Container, Grid, Typography, Box } from "@mui/material"
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import lomadslogodark from "../../assets/svg/lomadslogodark.svg";
import GroupEnjoy from "../../assets/svg/GroupEnjoy.svg";
import { colors } from "../../assets/colors";
import { Colorstype } from "../../types/UItype";
import { debounce as _debounce } from 'lodash';
const useStyles = makeStyles((theme: any) => ({
	root: {
		height: "100vh",
		maxHeight: 'fit-content',
		display: 'flex',
		flexDirection: 'column',
		// alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden !important'
	},
	colors: {
		height: '1vw',
		width: '2.5vw',
		backgroundColor: 'aqua',
		borderRadius: '30px',
		position: 'absolute',
		top: 0,
		right: 0
	}
}));

export default () => {
	const classes = useStyles();
	const navigate = useNavigate();

	useEffect(() => {
		setTimeout(() => {
			navigate('/dashboard');
		}, 2000);
	}, []);
	return (
		<>
			<Grid container className={classes.root}>
				<Grid xs={12} item display="flex" flexDirection="column" alignItems="center">
					<img src={lomadslogodark} alt="logo" style={{ marginTop: '2rem' }} />
					<Typography style={{ color: '#76808D', fontSize: '22px', marginTop: '6rem', marginBottom: '2rem' }}>Well done!</Typography>
					<Typography style={{ color: '#C94B32', fontSize: '35px', fontFamily: 'Insignia', fontStyle: 'normal', fontWeight: 400, marginBottom: '2rem' }}>Your DAO is live!</Typography>
					<Typography style={{ color: '#76808D', fontStyle: 'italic', fontWeight: 400, lineHeight: '25px', fontSize: '16px' }}>you will be redirected to the dashboard in a few seconds</Typography>
					{colors.map((result: Colorstype) => {
						return (
							<Box
								className={classes.colors}
								style={{
									backgroundColor: result.backgroudColor,
									left: result.left,
									right: result.right,
									top: result.top,
									bottom: result.bottom,
									transform: result.transform,
								}}
							></Box>
						);
					})}
				</Grid>
				<img src={GroupEnjoy} alt="Congrats" className="groupenjoy" />
			</Grid>
		</>
	)
}