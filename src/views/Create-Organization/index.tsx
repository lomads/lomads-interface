
import { Container, Grid, Typography, Box, Paper, } from "@mui/material"
import { makeStyles } from '@mui/styles';
import TextInput from 'components/TextInput';
import Button from 'components/Button';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

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
	formBox: {
		background: '#FFFFFF',
		boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)',
		borderRadius: '5px !important',
		padding: '26px 22px 30px',
		lineHeight: '35px',
		marginBottom: '3rem'
	},
	buttonStyle: {
		borderRadius: '5px',
	},
	addressInputField: {
		cursor: 'no-drop'
	}

}));

export default () => {
	const classes = useStyles();
	const navigate = useNavigate();
	const [orgName, setOrgName] = useState("");
	const goToInviteGang = () => {
		navigate('/invitegang');
	}

	return (
		<>
			<Grid container className={classes.root}>
				<Grid xs={12} item display="flex" flexDirection="column" alignItems="center">
					<Box style={{ marginBottom: '40px' }}>
						<Typography variant="h1" className={classes.headingText}>1/3 Name of your Organisation</Typography>
					</Box>
					<Box className={classes.formBox}>
						<TextInput
							style={{ marginBottom: '1.5rem' }}
							fullWidth
							label={"Name Your Organisation"}
							placeholder={"Epic Organisation"}
							value={orgName}
							onChange={(event: any) => {
								setOrgName(event.target.value);
							}}
						>
						</TextInput>
						<TextInput
							fullWidth
							label={"Organisation Address"}
							disabled
							placeholder="https://app.lomads.xyz/Name_of_the_Organisation"
						>
						</TextInput>
					</Box>
					<Button variant='contained' color='primary' className={classes.buttonStyle} onClick={goToInviteGang}>
						Create Public Address
					</Button>

					<Typography style={{
						fontStyle: 'italic',
						fontWeight: 400,
						textAlign: 'center',
						letterSpacing: '-0.011em',
						color: '#76808D',
						marginTop:'1rem'
					}}>This infomation is permanent</Typography>
				</Grid>
			</Grid>
		</>
	)
}