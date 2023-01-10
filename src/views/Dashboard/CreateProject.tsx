
import { Container, Grid, Typography, Box } from "@mui/material"
import { makeStyles } from '@mui/styles';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import expand from '../../assets/svg/expand.svg';
import archive from '../../assets/svg/archiveIcon.svg';
import Button from "components/Button";
const useStyles = makeStyles((theme: any) => ({
	memberHeadingLeft: {
		display: 'flex',
		alignItems: 'center',
		height: 'auto',
		padding: '20px 15px 15px',

	},
	memberHeadingRight: {
		padding: '20px 15px 15px',
		height: 'auto',
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'flex-end'
	},
	iconBox: {
		alignItems: 'center',
		background: 'linear-gradient(180deg, #fbf4f2, #eef1f5)',
		borderRadius: '5px',
		display: 'flex',
		height: '40px',
		justifyContent: 'center',
		minWidth: '40px',
		cursor: 'pointer',
		marginLeft: '1rem'
	},
	buttonBox: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'center',
		marginLeft: '1rem'
	},
	verticalDivider: {
		backgroundColor: 'rgba(118, 128, 141, 0.3)',
		height: 0,
		transform: 'rotate(90deg)',
		width: '2.18rem',
		marginRight: '1.5rem'
	},

}));

export default (props: any) => {
	const classes = useStyles();
	const navigate = useNavigate();

	const createClickHandler = () => {
		navigate('/createProject')
	}
	return (
		<>
			<Grid container>
				<Grid xs={12} item display="flex" flexDirection="column">
					<Paper elevation={1}>
						<Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<Box className={classes.memberHeadingLeft}>
								<Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<Typography style={{
										color: '#76808d',
										fontSize: '22px',
										fontStyle: 'normal',
										fontWeight: 400,
										letterSpacing: '-.011em',
										lineHeight: "25px",
										opacity: .4,
										marginRight: '2rem'
									}}>My Projects</Typography>
									<hr className={classes.verticalDivider} />

									<Typography style={{
										color: '#76808d',
										fontSize: '22px',
										fontStyle: 'normal',
										fontWeight: 400,
										letterSpacing: '-.011em',
										lineHeight: "25px",
										opacity: 1,
									}}>All Projects</Typography>
								</Box>
							</Box>
							<Box className={classes.memberHeadingRight}>
								<Box display={"flex"} flexDirection="row" alignItems={"center"}>
									<Box className={classes.iconBox}>
										<img src={expand} alt="expand" />
									</Box>
									<Box className={classes.iconBox}>
										<img src={archive} alt="archive" />
									</Box>
									<Box className={classes.buttonBox}>
										<Button variant='contained' color='secondary' size="small" style={{ color: '#C94B32' }} onClick={createClickHandler}>Create</Button>
									</Box>
								</Box>
							</Box>
						</Box>
					</Paper>
				</Grid>
			</Grid >
		</>
	)
}