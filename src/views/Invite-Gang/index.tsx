
import { Container, Grid, Typography, Box, IconButton } from "@mui/material"
import { makeStyles } from '@mui/styles';
import TextInput from 'components/TextInput';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Tooltip from '@mui/material/Tooltip';
import React, { useRef, useState } from "react";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import AddIcon from '@mui/icons-material/Add';
import daoMember2 from "../../assets/svg/daoMember2.svg";
import { useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import { ethers } from "ethers";
import Button from 'components/Button';
import { ExpandMoreOutlined } from '@mui/icons-material';
import UploadMemberPopup from "../Dashboard/UploadMemberPopup";
import Dialog from '@mui/material/Dialog';

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
		width: '60%'
	},
	buttonStyle: {
		borderRadius: '5px',
	},
	upperTitle: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		marginBottom: '1rem'
	},
	uploadButtonBox: {
		boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.10)',
		fontStyle: 'normal',
		fontWeight: 400,
		lineHeight: '18px',
		borderRadius: '6px',
	},
	inputBox: {
		display: 'flex'
	},
	bottomBox: {
		backgroundColor: 'rgba(118, 128, 141, 0.05)',
		borderRadius: '0 0 5px 5px',
		boxShadow: 'inset 1px 0px 4px rgba(27, 43, 65, 0.1)',
		maxHeight: '500px',
		overflow: 'hidden',
		overflowY: 'auto',
		padding: '26px 22px',
		width: '500px',
		marginBottom: '3rem',
	},
	contributorDetailsBox: {
		display: 'flex',
		// justifyContent: 'space-between',
		columnGap: '3rem',
		alignItems: 'center',
		width: '100%',
		marginBottom: '0.875rem',

	},

}));

export default () => {
	const classes = useStyles();
	const hiddenFileInput = useRef<any>(null);
	const [selectContributor, setSelectedContributor] = useState('CONTRIBUTOR');
	const [ownerAddress, setOwnerAddress] = useState("");
	const [ownerName, setOwnerName] = useState("");
	const [errors, setErrors] = useState<any>({});
	const [openAddMemberPopup, setOpenAddMemberPopup] = useState(false);

	const navigate = useNavigate();
	const handleClick = () => {
		hiddenFileInput?.current?.click();
		setOpenAddMemberPopup(true);
	}

	const options = [
		{ value: 'CONTRIBUTOR', label: 'Contributor' },
		{ value: 'ACTIVE_CONTRIBUTOR', label: 'Active Contributor' },
		{ value: 'CORE_CONTRIBUTOR', label: 'Core Contributor' },
	];

	const [contributor, setContributor] = useState<any>([]);

	const handleInvite = () => {
		navigate('/startsafe');

	}

	const handleContributorChange = (event: SelectChangeEvent) => {
		setSelectedContributor(event.target.value);
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

	const addMember = () => {
		if (!isAddressValid(ownerAddress)) {
			setErrors({ ownerAddress: "* Please enter valid address" })
		}
		else {
			setContributor([...contributor, { name: ownerName, contributor: ownerAddress.substring(0, 10) + "....." + ownerAddress.substring(25) }])
		}
	}

	const closeAddMemberDialog = () => {
		setOpenAddMemberPopup(false);
	}

	return (
		<>
			<Container maxWidth="lg">
				<Grid container className={classes.root}>
					<Grid xs={12} item display="flex" flexDirection="column" alignItems="center">
						<Box style={{ marginBottom: '40px' }}>
							<Typography variant="h1" className={classes.headingText}>2/3 Original Gang</Typography>
						</Box>
						<Box className={classes.formBox}>
							<Box className={classes.upperTitle}>
								<Typography style={{ color: '#76808D', fontWeight: 700, fontSize: '16px' }}>Add Member :</Typography>
								<Box className={classes.uploadButtonBox}>
									<Tooltip title="Please upload .xlsx file with columns containing member name and wallet address" placement="top-start">
										<Button variant='contained' color='secondary' size="small" onClick={handleClick}>
											<FileDownloadOutlinedIcon sx={{ fontSize: '1.5rem' }} />OR UPLOAD FILE
											<input
												ref={hiddenFileInput}
												type="file"
												hidden
											/></Button>

									</Tooltip>
								</Box>
							</Box>
							<Box className={classes.inputBox}>
								<TextInput
									fullWidth
									sx={{ marginRight: 1 }}
									placeholder={"Name"}
									value={ownerName}
									onChange={(event: any) => {
										setOwnerName(event.target.value);
									}}
								/>
								<TextInput
									fullWidth
									placeholder={"ENS Domain and Wallet Address"}
									onChange={(event: any) => {
										setOwnerAddress(event.target.value);
										setErrors({ ownerAddress: "" });
									}}
									error={errors.ownerAddress ? true : false}
									helperText={errors.ownerAddress}
								/>
								<FormControl sx={{ m: 1, minWidth: 120 }} fullWidth>
									<Select
										IconComponent={(props) => (<ExpandMoreOutlined {...props} />)}
										value={selectContributor}
										onChange={handleContributorChange}
									>
										{options.map(item => {
											return <MenuItem value={item.value} key={item.value}>{item.label}</MenuItem>
										})}

									</Select>
								</FormControl>
								<IconButton style={{
									backgroundColor: isAddressValid(ownerAddress) ? '#C94B32' : 'rgba(27, 43, 65, 0.2)', borderRadius: '5px', height: '50px', width: '55px', marginTop: '9px'
								}} onClick={addMember}>
									<AddIcon
										fontSize="large"
										sx={{
											color: '#fff'
										}}
									/>
								</IconButton>
							</Box>
						</Box>
						{contributor.length > 0 && <Box display="flex" flexDirection="column" alignItems="center" className={classes.bottomBox}>
							{contributor.map((item: any) => {
								return <Box
									className={classes.contributorDetailsBox}>
									<img src={daoMember2} />
									<Typography style={{ textAlign: 'left' }}>{item.name}</Typography>
									<Typography style={{ textAlign: 'left', fontStyle: 'italic' }}>{item.contributor}</Typography>
								</Box>
							})
							}
						</Box>}
						<Button variant='contained' color='primary' className={classes.buttonStyle} onClick={handleInvite} style={{ marginTop: '3rem' }}>
							Invite
						</Button>
						<Link href="/startsafe" underline="always" style={{ marginTop: '1rem' }}>Skip</Link>
					</Grid>
				</Grid>
			</Container>
			<Dialog
				open={openAddMemberPopup}
				onClose={closeAddMemberDialog}
			>
				<UploadMemberPopup closePopup={closeAddMemberDialog} />
			</Dialog>
		</>
	)
}