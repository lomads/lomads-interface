import React from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from '@mui/styles';
import { Box, Button, Container, Grid } from "@mui/material"

const useStyles = makeStyles((theme: any) => ({
	root: {
		minHeight: "100vh",
		maxHeight: 'fit-content',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden !important'
	},
	infoText: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'italic',
		fontWeight: '400',
		fontSize: '16px',
		lineHeight: '25px',
		textAlign: 'center',
		letterSpacing: '-0.011em',
		color: '#76808D',
		textDecoration: 'underline',
		cursor: 'pointer'
	},
	inputFieldTitle: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: '700',
		fontSize: '16px',
		lineHeight: '18px',
		letterSpacing: '-0.011em',
		color: '#76808D',
		margin: '15px 0px 15px 0px'
	},
	StartSafe: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: 'fit-content',
		padding: '20vh 0vh 10vh 0vh'
	},
	buttonArea: {
		display: 'flex',
		width: '500px',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingBottom: '35px'
	},
	headerText: {
		fontFamily: 'Insignia',
		fontStyle: 'normal',
		fontWeight: '400',
		fontSize: '35px',
		lineHeight: '35px',
		paddingBottom: '30px',
		textAlign: 'center',
		color: '#C94B32'
	},
	centerText: {
		fontSize: '20px',
		fontWeight: '400',
		color: '#C94B32',
		padding: 16
	},
	link: {
		textDecoration: 'underline',
		color: '#76808D'
	}
}));

const StartSafe = () => {
	const classes = useStyles()
	const navigate = useNavigate();
	const createNewSafe = () => {
		navigate("/newsafe");
	};
	const importExistingSafe = () => {
		navigate("/addsafe");
	};
	return (
			<Container>
				<Grid container className={classes.root}>
				<Box className={classes.StartSafe}>
					<Box className={classes.headerText}>3/3 DAO Treasury</Box>
					<Box className={classes.buttonArea}>
						<Box>
							<Button
								sx={{
									color: "#C94B32",
									backgroundColor: "#FFFFFF",
									fontWeight: 400,
									minWidth: 'max-content',
									width: 228,
									boxShadow: '3px 5px 20px rgba(27, 43, 65, 0.12), 0px 0px 20px rgba(201, 75, 50, 0.18)'
								}}
								variant='contained'
								size="medium"
								onClick={createNewSafe}
								>
								CREATE NEW SAFE
							</Button>
						</Box>
						<Box className={classes.centerText}>or</Box>
						<Box>
							<Button sx={{
								color: "#C94B32",
								backgroundColor: "#FFFFFF",
								fontWeight: 400,
								minWidth: 'max-content',
								width: 228,
								boxShadow: '3px 5px 20px rgba(27, 43, 65, 0.12), 0px 0px 20px rgba(201, 75, 50, 0.18)'
							}}
								onClick={importExistingSafe}
								variant='contained'
								size="medium"
								>
								ADD EXISTING SAFE
						</Button>
						</Box>
					</Box>
					<Box className={classes.infoText}>
						Powered By{" "}
						<a href="https://gnosis-safe.io/" className={classes.link}>
							Gnosis Safe
					</a>
					</Box>
				</Box>
				</Grid>
		</Container>
	);
};

export default StartSafe;
