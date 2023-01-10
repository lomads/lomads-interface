
import { Container, Grid, Typography, Box } from "@mui/material"
import { makeStyles } from '@mui/styles';
import Button from "components/Button";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Dialog from '@mui/material/Dialog';
import sweat from '../../../assets/svg/5-xp-points-color.svg';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRef } from 'react';

const useStyles = makeStyles((theme: any) => ({
	root: {
		padding: '20px 100px 20px 100px',
		height: '65vh',
		overflow: 'auto'
	},
	detailBox: {
		width: '400px',
		fontFamily: 'Open Sans',
		fontStyle: 'normal',
		fontWeight: 400,
		fontSize: '14px',
		lineHeight: '16px',
		textAlign: 'center',
		color: '#76808D',
	},
	switchBox: {
		marginTop: '1rem',
		justifyContent: 'center',
		display: 'flex',
		alignItems: 'center'
	},
	buttonBox: {
		marginTop: '2rem'
	},
	outerPopupBox: {
		background: '#fff',
		borderRadius: '20px',
		bottom: 0,
		boxShadow: '3px 5px 4px rgb(27 43 65 / 5%), -3px -3px 8px rgb(201 75 50 / 10%)',
		display: 'flex',
		flexDirection: 'column',
		gap: '25px',
		justifyItems: 'flex-start',
		left: 0,
		margin: 'auto',
		maxHeight: 'fit-content',
		padding: '26px 22px 30px',
		position: 'fixed',
		right: 0,
		top: 0,
		width: 'fit-content',
	},
	titleBox: {
		textAlign: 'center',
		marginBottom: '3rem'
	},
	mainBox: {
		textAlign: 'center',
		alignItems: 'center',
		display: 'flex',
		width: '400px'
	},
	downButtonBox: {
		display: 'flex',
		alignItems: 'center',
		textAlign: 'center',
		justifyContent: 'space-around'
	}
}));

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
	width: 65,
	height: 40,
	padding: 7,
	'& .MuiSwitch-switchBase': {
		margin: '7px 0px',
		padding: 0,
		boxShadow: 'inset 1px 0px 4px rgba(27, 43, 65, 0.1)',
		transform: 'translateX(6px)',
		'&.Mui-checked': {
			color: '#fff',
			transform: 'translateX(22px)',
			margin: '7px 10px',

			'& .MuiSwitch-thumb:before': {
				backgroundColor: '#c94b32',
				borderRadius: '8px',
				backgroundImage: `url(../../../assets/svg/ico-hidden.svg)`,
			},
			'& + .MuiSwitch-track': {
				opacity: 1,
				backgroundColor: '#f0f0f0',
			},
		},
	},
	'& .MuiSwitch-thumb': {
		backgroundColor: '#76808d',
		borderRadius: '8px',
		position: 'absolute',
		left: 2,
		top: 1,
		width: 22,
		height: 22,
		boxShadow: 'inset 1px 0px 4px rgba(27, 43, 65, 0.1)',

		'&:before': {
			content: "''",
			position: 'absolute',
			width: '100%',
			height: '100%',
			left: 0,
			top: 0,
			backgroundRepeat: 'no-repeat',
			backgroundPosition: 'center',

		},
	},
	'& .MuiSwitch-track': {
		opacity: 1,
		backgroundColor: '#f0f0f0',
		boxShadow: 'inset 1px 0px 4px rgba(27, 43, 65, 0.1)',
		borderRadius: '10px'
	},
}));

export default (props: any) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const enabledDisable = useRef<any>(null);

	const [sweatEnabled, setSweatEnabled] = useState(null);
	const [openPopup, setOpenPopup] = useState(false);
	const switchChangeHandler = (e: any) => {
		if (e.target.checked == false) {
			setOpenPopup(true);
			console.log(enabledDisable);
		}
		else {
			setSweatEnabled(e.target.checked)
		}
	}

	const closePopupHandler = () => {
		setOpenPopup(false);
	}
	return (
		<>
			<Box className={classes.root}>
				<Box className={classes.detailBox}>
					<Typography>
						This feature is super useful during the bootstrapping phase of your organisation. You
						can assign Sweat points to members for their contributions. Over time, this serves as a
						measure of the relative contribution of different members of the organisation. When your
						organisation has its own token or it has funds to pay, you can compensate members in
						proportion to the Sweat points they have.
					</Typography>
				</Box>
				{sweatEnabled && sweatEnabled == true &&
					<Box className={classes.buttonBox}>
						<Button size="small" variant="contained">Convert to tokens & Compensate members</Button>
					</Box>}
				<Box className={classes.switchBox}>
					<FormControlLabel
						ref={enabledDisable}
						onChange={switchChangeHandler}
						control={<MaterialUISwitch sx={{ m: 1 }} />}
						label=""
					/>
					<Typography style={{
						color: '#76808D',
						opacity: 0.6
					}}>ENABLED</Typography>
				</Box>

				{openPopup &&
					<Dialog
						open={openPopup}
						onClose={closePopupHandler}
						PaperProps={{ sx: { maxWidth: '100%' } }}
					>
						<Box className={classes.outerPopupBox}>
							<Box style={{
								alignItems: 'center',
								display: 'flex',
								justifyContent: 'flex-end',
							}}>
								<IconButton style={{ background: 'linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%)', borderRadius: '4px', marginBottom: 'auto', height: '38px', width: '38px' }} onClick={closePopupHandler}>
									<CloseIcon style={{ color: '#C94B32' }} />
								</IconButton>
							</Box>
							<Box className={classes.titleBox}>
								<img src={sweat} width={"95px"} height={"50px"} />
								<Typography style={{ fontSize: '30px', color: '#c94b32', marginTop: '10px' }}>Disable SWEAT Points</Typography>
							</Box>
							<Box className={classes.mainBox}>
								<Typography>
									You will no more be able to send SWEAT points and the current SWEAT points accumulated by members will be reset to zero.
								</Typography>
							</Box>
							<Box className={classes.downButtonBox}>
								<Button size="small" variant="outlined">No</Button>
								<Button size="small" variant="contained">Yes</Button>
							</Box>
						</Box>
					</Dialog>
				}
			</Box>
		</>
	)
}