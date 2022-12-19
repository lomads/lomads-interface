
import { Container, Grid, Typography, Box, Button } from "@mui/material"
import { makeStyles } from '@mui/styles';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import TextInput from 'components/TextInput';
import daoMember2 from "../../assets/svg/daoMember2.svg";
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Link from '@mui/material/Link';

const useStyles = makeStyles((theme: any) => ({
	root: {
		minHeight: "100vh",
		maxHeight: 'fit-content',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
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
		width: '55%'
	},
	buttonStyle: {
		borderRadius: '5px',
	},
	ownerButton: {
		display: 'flex',
	},
	tncBox: {
		marginBottom: '3rem',
		width: '55%',
		textAlign: 'center',
		fontStyle: 'italic'
	}

}));

export default () => {
	const classes = useStyles();
	const navigate = useNavigate();
	const [showContinueBtn, setShowContinueBtn] = useState(true);
	const [showNextBtn, setShowNextBtn] = useState(true);
	const [newSafe, setNewSafe] = useState(true);
	const [existingSafe, setExistingSafe] = useState(false);
	const [safeName, setSafeName] = useState('');
	const [errors, setErrors] = useState<any>({});

	const contributor = [
		{ name: 'Test1', contributor: 'Active Contributor' },
		{ name: 'Test2', contributor: 'Contributor' }

	]
	const continueHandler = () => {
		if (safeName.length > 0)
			setShowContinueBtn(false);
		else {
			setErrors({ safeName: '* Safe Name is required' })
		}
	}

	const nextHandler = () => {
		setShowNextBtn(false);
	}

	const confirmBtnHandler = () => {
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
	const options = [
		{ value: 1, label: '1' },
		{ value: 2, label: '2' },
	];
	return (
		<>
			<Container maxWidth="lg">
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
						<Box className={classes.formBox}>
							<TextInput
								style={{ marginBottom: '1.5rem' }}
								fullWidth
								label={"Safe Name"}
								placeholder={"Pied Piper"}
								value={safeName}
								onChange={(event: any) => {
									setSafeName(event.target.value);
									setErrors({ safeName: '' })
								}}
								error={errors.safeName ? true : false}
								helperText={errors.safeName}
							>
							</TextInput>
						</Box>
						{showContinueBtn && <Button variant='contained' className={classes.buttonStyle} onClick={continueHandler} style={{ backgroundColor: safeName.length > 0 ? "#C94B32" : "rgba(27, 43, 65, 0.2)" }}>
							Continue
						</Button>}

						{!showContinueBtn && <hr className={classes.divider} />}
						{!showContinueBtn &&
							<Box className={classes.formBox}>
								{showNextBtn && <Typography variant={"subtitle2"} style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '16px' }}>Select Owners</Typography>}
								{!showNextBtn && <Typography variant={"subtitle2"} style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '16px' }}>Owners</Typography>}
								{contributor.map(item => {
									return <Box display="flex" justifyContent={'space-between'} style={{ marginBottom: '1rem' }}>
										<img src={daoMember2} />
										<Typography style={{ marginTop: '0.5rem' }}>{item.name}</Typography>
										<Checkbox defaultChecked />
									</Box>
								})
								}
								{showNextBtn && <Box>
									<Button variant='contained' color='primary' size={"small"} style={{ left: '35%', marginTop: '1rem' }} onClick={nextHandler}>
										Next
									</Button>
								</Box>}
							</Box>
						}
						{!showNextBtn && <hr className={classes.divider} />}
						{
							!showNextBtn &&
							<Box className={classes.formBox}>
								<Typography>Any transaction requires the confirmation of</Typography>
								<Box style={{ display: 'flex', alignItems: 'center' }}>
									<FormControl sx={{ m: 1, minWidth: 80 }}>
										<Select
											defaultValue={1}
											displayEmpty
											inputProps={{ 'aria-label': 'Without label' }}
										>
											{options.map(item => {
												return <MenuItem value={item.value}>{item.label}</MenuItem>
											})}

										</Select>
									</FormControl>
									<Typography>of {options.length} owner(s)</Typography>
								</Box>


							</Box>
						}
						{!showNextBtn &&
							<Box className={classes.tncBox}>
								<Typography>By continuing you consent to the terms of use and privacy policy of <Link href="https://gnosis-safe.io/" style={{ color: '#76808D', textDecorationColor: "#76808D" }}>Gnosis Safe</Link></Typography>
								<Typography style={{ marginTop: '0.5rem', lineHeight: '1.56rem' }}>You’re about to create a new safe and will have to confirm a transaction with your currently connected wallet.
									<b>The creation will cost approximately 0.01256 GOR.</b>
									The exact amount will be determinated by your wallet.
								</Typography>
								<Button variant='contained' color='primary' size={"small"} style={{ marginTop: '1.5rem' }} onClick={confirmBtnHandler}>
									Create Safe
								</Button>
							</Box>
						}
					</Grid>
				</Grid>
			</Container>
		</>
	)
}