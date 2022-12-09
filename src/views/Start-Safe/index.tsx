
import { Container, Grid, Typography, Box, Button } from "@mui/material"
import { makeStyles } from '@mui/styles';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';

const useStyles = makeStyles((theme: any) => ({
	root: {
		height: "100vh",
		maxHeight: 'fit-content',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden !important'
	},
	headingText: {
		color: '#C94B32 !important'
	},
	detailBox: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: '35px'
	}

}));

export default () => {
	const classes = useStyles();
	const navigate = useNavigate();
	const createNewSafe = () => {
		navigate('/newsafe')
	}

	const addExistingSafe = () => {

	}

	return (
		<>
			<Grid container className={classes.root}>
				<Grid xs={12} item display="flex" flexDirection="column" alignItems="center">
					<Box style={{ marginBottom: '40px' }}>
						<Typography variant="h1" className={classes.headingText}>3/3 DAO Treasury</Typography>
					</Box>
					<Box className={classes.detailBox}>
						<Button
							onClick={createNewSafe}
							style={{
								backgroundColor: '#FFFFFF',
								boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)',
								borderRadius: '5px'
							}}>Create New Safe</Button>
						<Typography style={{ marginLeft: '1rem', marginRight: '1rem', color: '#C94B32', fontSize: '20px' }}>or</Typography>
						<Button
							onClick={addExistingSafe}
							style={{
								backgroundColor: '#FFFFFF',
								boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)',
								borderRadius: '5px'
							}}>Add Existing Safe</Button>
					</Box>
					<Typography style={{ color: '#76808D', fontFamily: 'Inter,sans-serif', fontStyle: 'italic', fontWeight: 400, fontSize: '16px' }}>
						Powered by <Link href="https://gnosis-safe.io/" style={{ color: '#76808D', textDecorationColor: "#76808D" }}>Gnosis Safe</Link>
					</Typography>
				</Grid>
			</Grid>
		</>
	)
}