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
import { useNavigate } from 'react-router-dom';
import { ethers } from "ethers";
import Button from 'components/Button';
import { ExpandMoreOutlined } from '@mui/icons-material';


const useStyles = makeStyles((theme: any) => ({
	boxRoot: {
		alignItems: 'center',
		background: '#fff',
		borderRadius: '5px',
		bottom: 0,
		boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), - 3px - 3px 8px rgba(201, 75, 50, 0.1)',
		display: 'flex',
		flexDirection: 'column',
		gap: '25px',
		margin: 'auto',
		maxHeight: 'fit-content',
		padding: '26px 22px 30px',
		width: 'fit-content',
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
	dropdownStyle: {
		background: 'linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%)'
	},
	bottomBox: {
		display: 'flex',
		justifyContent: 'space-between',
		padding: '0px 20px 20px 20px',
	}
}));

export default (props: any) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const hiddenFileInput = useRef<any>(null);
	const [selectContributor, setSelectedContributor] = useState('CONTRIBUTOR');
	const [ownerAddress, setOwnerAddress] = useState("");
	const [ownerName, setOwnerName] = useState("");
	const [errors, setErrors] = useState<any>({});
	const handleClick = () => {
		hiddenFileInput?.current?.click();
	}

	const addMemberHandler = () => {
		if (!isAddressValid(ownerAddress)) {
			setErrors({ ownerAddress: "* Enter valid address" })
		}
		else {

		}
	}

	const options = [
		{ value: 'CONTRIBUTOR', label: 'Contributor' },
		{ value: 'ACTIVE_CONTRIBUTOR', label: 'Active Contributor' },
		{ value: 'CORE_CONTRIBUTOR', label: 'Core Contributor' },
	];

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

	const closePopup = () => {
		props.closePopup(false);
	}

	return (
		<>
			<Box className={classes.boxRoot}>
				<Box className={classes.upperTitle}>
					<Typography style={{ color: '#76808D', fontWeight: 700, fontSize: '16px' }}>Add Member</Typography>
					<Box className={classes.uploadButtonBox}>
						<Tooltip title="Please upload .xlsx file with columns containing member name and wallet address" placement="bottom-start">
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
							MenuProps={{ classes: { list: classes.dropdownStyle, paper: classes.dropdownStyle } }}
						>
							{options.map(item => {
								return <MenuItem value={item.value} key={item.value}>{item.label}</MenuItem>
							})}

						</Select>
					</FormControl>
				</Box>

			</Box>
			<Box className={classes.bottomBox}>
				<Button variant="outlined" size="small" style={{ border: '2px solid rgb(201, 75, 50)' }} onClick={closePopup}>Cancel</Button>
				<Button variant="contained" size="small" onClick={addMemberHandler}>Ok</Button>
			</Box>
		</>
	)
}