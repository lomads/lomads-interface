
import { Container, Grid, Typography, Box } from "@mui/material"
import { makeStyles } from '@mui/styles';
import Button from "components/Button";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';

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
	tokenDetail: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	logoStyle: {
		width: '40px',
		height: '40px',
		borderRadius: '10px',
		border: '1px solid #76808D',
		transform: 'rotate(45deg)',
	},
	buttonStyle: {
		marginTop: '1rem',
		textAlign: 'center'
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

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
	width: 65,
	height: 40,
	padding: 7,
	'& .MuiSwitch-switchBase': {
		margin: '7px 1px',
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
	const [token, setToken] = useState([1]);

	return (
		<>
			<Box className={classes.root}>
				{token && token.length == 0 &&
					<Box>
						<Box className={classes.title}>
							<Typography>The organisation doesn’t have token yet</Typography>
						</Box>
						<Button variant="contained" size="small">Configure Pass Token</Button>
					</Box>
				}
				{
					token && token.length > 0 &&
					<Box>
						<Box className={classes.tokenDetail}>
							<Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
								<Box className={classes.logoStyle}>
									<Typography style={{
										transform: 'rotate(-45deg)',
										fontWeight: 700,
										fontSize: '20px',
										lineHeight: '33px',
										textAlign: 'center',
										color: '#76808D'
									}}>
										hk</Typography>
								</Box>
								<Typography style={{
									marginLeft: '1rem', color: '#1B2B41', opacity: 0.7, fontSize: '18px'
								}}
								>Token Name</Typography>
							</Box>
							<Typography> X 100</Typography>
						</Box>
						<Box className={classes.buttonStyle}>
							<Button variant='contained' color='secondary' size="small" style={{ color: '#C94B32' }}><AddIcon /> Create More</Button>
						</Box>
						<hr className={classes.divider} />
						<Box>
							<Typography style={{ color: '#76808D', fontSize: '16px', fontWeight: 700 }}>Membership policy: </Typography>
							<FormControlLabel
								control={<MaterialUISwitch sx={{ m: 1 }} />}
								label="WHITELISTED"
							/>
						</Box>
						<Box style={{ width: '300px', marginTop: '1.5rem' }}>
							<Typography style={{ color: '#76808D', fontSize: '16px', fontWeight: 700, marginBottom: '0.875rem' }}>Contact details </Typography>
							<Typography style={{
								color: 'rgba(118, 128, 141, 0.5)', lineHeight: '16px'
							}}>Get certain member details could be useful for the smooth functioning of your organisation</Typography>
							<FormControlLabel
								control={<MaterialUISwitch sx={{ m: 1 }} />}
								label="Email"
							/>
							<Typography style={{
								color: 'rgba(118, 128, 141, 0.5)', lineHeight: '16px', fontStyle: 'italic'
							}}>Please select if you intend to use services such as Notion, Google Workspace and Github.</Typography>
							<FormControlLabel
								control={<MaterialUISwitch sx={{ m: 1 }} />}
								label="Discord user-id"
							/>
							<Typography style={{
								color: 'rgba(118, 128, 141, 0.5)', lineHeight: '16px', fontStyle: 'italic'
							}}>Please select if you intend to use access-controlled channels in Discord.</Typography>
							<FormControlLabel
								style={{ color: '#76808D', fontSize: '16px' }}
								control={<MaterialUISwitch sx={{ m: 1 }} />}
								label="Telegram user-id"
							/>
							<Typography style={{
								color: 'rgba(118, 128, 141, 0.5)', lineHeight: '16px', fontStyle: 'italic'
							}}>Please select if you intend to use access-controlled Telegram groups.</Typography>
						</Box>
					</Box>
				}
			</Box>
			<Box style={{
				background: 'linear-gradient(360deg, #FFFFFF 60.12%, rgba(255, 255, 255, 0) 86.31%)',
				borderRadius: '0px 0px 0px 20px'
			}}>

			</Box>
		</>
	)
}