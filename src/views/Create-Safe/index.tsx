
import { Container, Grid, Typography, Box, Button } from "@mui/material"
import { makeStyles } from '@mui/styles';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import TextInput from 'components/TextInput';

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
	},
	divider: {
		border: '1.3px solid #c94b32',
		width: '210px',
		height:'0px',
		backgroundColor: '#c94b32',
		flex: 'none',
		flexGrow: 0,
		marginBottom:'35px'
	},
	formBox: {
		background: '#FFFFFF',
		boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)',
		borderRadius: '5px',
		padding: '26px 22px 30px',
		lineHeight: '35px',
		marginBottom: '3rem',
		width:'55%'
	},
	buttonStyle: {
		borderRadius: '5px',
	},

}));

export default () => {
	const classes = useStyles();
	const navigate = useNavigate();

	return (
		<>
			<Grid container className={classes.root}>
				<Grid xs={12} item display="flex" flexDirection="column" alignItems="center">
					<Box style={{ marginBottom: '40px' }}>
						<Typography variant="h1" className={classes.headingText}>3/3 DAO Treasury</Typography>
					</Box>
					<Box className={classes.detailBox}>
						<Button style={{
							backgroundColor: '#FFFFFF',
							boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)',
							borderRadius: '5px'
						}}>Create New Safe</Button>
						<Typography style={{ marginLeft: '1rem', marginRight: '1rem', color: '#C94B32', fontSize: '20px' }}>or</Typography>
						<Button style={{
							backgroundColor: '#FFFFFF',
							boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)',
							borderRadius: '5px'
						}}>Add Existing Safe</Button>
					</Box>
					<hr className={classes.divider} />
					<Box className={classes.formBox}>
						<TextInput
							style={{ marginBottom: '1.5rem' }}
							fullWidth
							label={"Safe Name"}
							placeholder={"Pied Piper"}
						>
						</TextInput>
					</Box>
					<Button variant='contained' color='primary' className={classes.buttonStyle}>
						Continue
					</Button>
				</Grid>
			</Grid>
		</>
	)
}