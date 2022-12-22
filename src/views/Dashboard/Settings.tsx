
import { Container, Grid, Typography, Box } from "@mui/material"
import { makeStyles } from '@mui/styles';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import settings from '../../assets/svg/settings.svg';

const useStyles = makeStyles((theme: any) => ({
	memberHeading: {
		padding: '20px 15px 15px',
		width: '44rem',
		height: 'auto',
		background: "#FFFFFF",
		borderRadius: '5px !important',
		marginBottom: '0.1rem',
		display: 'flex',
		justifyContent: 'flex-end'
	},
	settingBox: {
		alignItems: 'center',
		background: 'linear-gradient(180deg, #fbf4f2, #eef1f5)',
		borderRadius: '5px',
		display: 'flex',
		height: '40px',
		justifyContent: 'center',
		minWidth: '40px',
		cursor:'pointer'
	}

}));

export default (props: any) => {
	const classes = useStyles();
	const navigate = useNavigate();

	const goToSettings = () =>{
		navigate('/settings');
	}

	return (
		<>
			<Grid container>
				<Grid xs={12} item display="flex" flexDirection="column">
					<Box>
						<Paper elevation={1} className={classes.memberHeading}>
							<Box display={"flex"} flexDirection="row" alignItems={"center"} onClick={goToSettings}>
								<Box className={classes.settingBox}>
									<img src={settings} alt="setting" />
								</Box>
							</Box>
						</Paper>
					</Box>
				</Grid>
			</Grid >
		</>
	)
}