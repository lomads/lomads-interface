
import { Container, Grid, Typography, Box, Button, Paper } from "@mui/material"
import { makeStyles } from '@mui/styles';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import TextInput from 'components/TextInput';
import TextField from '@mui/material/TextField';
import coin from '../../assets/svg/coin.svg'
import { ethers } from "ethers";
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
		height: '0px',
		backgroundColor: '#c94b32',
		flex: 'none',
		flexGrow: 0,
		marginBottom: '35px'
	},
	formBox: {
		background: '#FFFFFF',
		boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)',
		borderRadius: '5px',
		padding: '26px 22px 30px',
		lineHeight: '35px',
		marginBottom: '3rem',
		width: '55%',
		display: 'flex',
	},
	buttonStyle: {
		borderRadius: '5px',
	},
	ownerButton: {
		display: 'flex',
	},
	tncBox: {
		lineHeight: '35px',
		marginBottom: '3rem',
		width: '50%',
		textAlign: 'center'
	},
	safeBox: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flexStart',
		padding: '25px',
		width: '600px',
		background: '#FFFFFF',
		borderRadius: '5px',
		marginBottom: '5px',
		minHeight: ''
	},
	safeDetails: {
		fontSize: '20px',
		lineHeight: '25px',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	costDetails: {
		display: 'flex',
		alignItems: 'center'
	},
	ownerBox: {
		display: 'flex',
		flexDirection: 'column'
	},
	ownerDetails: {
		display: 'flex',
		marginBottom: '1rem',
		alignItems: 'center'
	}

}));

export default () => {
	const classes = useStyles();
	const navigate = useNavigate();

	const [newSafe, setNewSafe] = useState(false);
	const [existingSafe, setExistingSafe] = useState(true);
	const [findSafeBtnClicked, setFindSafeBtnClicked] = useState(true);
	const [safeAddress, setSafeAddress] = useState("");
	const [errors, setErrors] = useState<any>({});

	const ownersAvailable = ['0x248C...3974', '0xbd06...e404'];

	const goToDAOSuccess = () => {
		navigate('/success');
	}
	const selectSafeClicked = (val: any) => () => {
		if (val == 'new') {
			setNewSafe(true);
			setExistingSafe(false);
			if (!newSafe) {
				navigate('/newsafe')
			}
		}
		else {
			setNewSafe(false);
			setExistingSafe(true);
			if (!existingSafe) {
				navigate('/addsafe')
			}
		}
	}
	const findSafeHandler = () => {
		if (isAddressValid(safeAddress))
			setFindSafeBtnClicked(false);
		else {
			setErrors({ safeAddress: '* Enter valid safe address' })
		}
	}

	const changeSafeHandler = () =>{
		setFindSafeBtnClicked(true);
		setSafeAddress("");
	}

	const isAddressValid = (holderAddress: string) => {
		const ENSdomain = holderAddress.slice(-4);
		if (ENSdomain === ".eth") {
			return true;
		} else {
			const isValid: boolean = ethers.utils.isAddress(holderAddress);
			return isValid;
		}
	};

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
							borderRadius: '5px',
							color: newSafe ? 'rgb(201, 75, 50)' : 'rgba(201, 75, 50, 0.6)'
						}} onClick={selectSafeClicked('new')}>Create New Safe</Button>
						<Typography style={{ marginLeft: '1rem', marginRight: '1rem', color: '#C94B32', fontSize: '20px' }}>or</Typography>
						<Button style={{
							backgroundColor: '#FFFFFF',
							boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)',
							borderRadius: '5px',
							color: existingSafe ? 'rgb(201, 75, 50)' : 'rgba(201, 75, 50, 0.6)'
						}} onClick={selectSafeClicked('existing')}>Add Existing Safe</Button>
					</Box>
					<hr className={classes.divider} />
					{findSafeBtnClicked &&
						<Box className={classes.formBox}>
							<TextInput
								style={{ marginRight: '1rem' }}
								fullWidth
								label={"Safe Name"}
								placeholder={"Pied Piper"}
							>
							</TextInput>
							<TextInput
								style={{ marginRight: '1rem' }}
								value={safeAddress}
								fullWidth
								label={"Safe Address"}
								placeholder={"0xbeee39"}
								onChange={(event: any) => {
									setSafeAddress(event.target.value);
									setErrors({ safeAddress: "" })
								}}
								error={errors.safeAddress ? true : false}
								helperText={errors.safeAddress}
							>
							</TextInput>
						</Box>}
					{findSafeBtnClicked &&
						<Button variant='contained' color='primary' size={"medium"} onClick={findSafeHandler} style={{ backgroundColor: isAddressValid(safeAddress) ? "#C94B32" : "rgba(27, 43, 65, 0.2)" }}>
							Find Safe
						</Button>
					}

					{!findSafeBtnClicked &&
						<>
							<Paper elevation={2} className={classes.safeBox}>
								<Box className={classes.safeDetails}>
									<TextField id="outlined-basic" label="" variant="outlined" size="small" placeholder="Pied Piper" />
									<Box style={{ borderLeft: '1.5px solid rgba(118, 128, 141, 0.5)', height: '35px' }}></Box>
									<Typography>https://hgghfcxdfXDFXQtreasury</Typography>
								</Box>
							</Paper>
							<Paper elevation={2} className={classes.safeBox}>
								<Box className={classes.costDetails}>
									<img src={coin} />
									<Typography style={{ color: '#188C7C', marginLeft: '1rem' }}>$ 238.3569</Typography>
								</Box>
							</Paper>
							<Paper elevation={2} className={classes.safeBox}>
								<Typography style={{ fontSize: '18px', fontWeight: '800', marginBottom: '1rem' }}>2 Owners :</Typography>
								<Box className={classes.ownerBox}>
									{ownersAvailable.map(item => {
										return (
											<Box className={classes.ownerDetails}>
												<TextField id="outlined-basic" label="" variant="outlined" size="small" placeholder="Name" style={{ marginRight: '1rem' }} />
												<Typography>{item}</Typography>
											</Box>
										)
									})}
								</Box>
							</Paper>
							<Box style={{ textAlign: 'center', marginTop: '1rem' }}>
								<Typography>By continuing you consent to the terms of use and privacy policy of Gnosis Safe</Typography>
							</Box>
							<Box style={{ display: 'flex', justifyContent: 'space-between' }}>
								<Button variant='outlined' color='primary' size={"medium"} style={{ marginTop: '1.5rem', marginRight: '1rem', backgroundColor: 'white' }} onClick={changeSafeHandler}>
									Change Safe
								</Button>
								<Button variant='contained' color='primary' size={"medium"} style={{ marginTop: '1.5rem' }} onClick={goToDAOSuccess}>
									Add Safe
								</Button>
							</Box>
						</>
					}
				</Grid>
			</Grid>
		</>
	)
}