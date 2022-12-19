
import { Container, Grid, Typography, Box, Icon } from "@mui/material"
import { makeStyles } from '@mui/styles';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import daoMember2 from "../../assets/svg/daoMember2.svg";
import TextInput from "components/TextInput";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import bin from "../../assets/svg/bin-red.svg";
import { ExpandMoreOutlined } from '@mui/icons-material';
import Button from "components/Button";

const useStyles = makeStyles((theme: any) => ({
	root: {
		backgroundColor: '#fff',
		borderRadius: '20px 0 0 20px',
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		overflow: 'hidden',
		padding: '60px 45px 0',
		position: 'relative',
		width: '650px'
	},
	header: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'space-between',
		marginBottom: '2rem',
		marginTop: '3rem',
		width: '100%',
	},
	memberDetailsBox: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		height: '80%',
		overflow: 'auto'
	},
	memberDetails: {
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		marginBottom: '2rem',
		display: 'flex'
	},
	bottomBox: {
		alignItems: 'center',
		justifyContent: 'space-around',
		display: 'flex',
		marginBottom: '3rem'
	}
}));

export default (props: any) => {
	const classes = useStyles();
	const navigate = useNavigate();

	const memberDetails = [
		{ name: 'Test1', address: '0xC38e...ea3b', role: 'CONTRIBUTOR' },
		{ name: 'Test2', address: '0xC38e...ea3b', role: 'CORE_CONTRIBUTOR' },
		{ name: 'Test3', address: '0xC38e...ea3b', role: 'CONTRIBUTOR' },
		{ name: 'Test4', address: '0xC38e...ea3b', role: 'CONTRIBUTOR' }
	]
	const options = [
		{ value: 'CONTRIBUTOR', label: 'Contributor' },
		{ value: 'ACTIVE_CONTRIBUTOR', label: 'Active Contributor' },
		{ value: 'CORE_CONTRIBUTOR', label: 'Core Contributor' },
	];
	const handleContributorChange = (event: SelectChangeEvent) => {
		console.log("Selected Evet", event)
	}
	const closeDrawer = () => {
		props.closeSidebar(false);
	}
	return (
		<>
			<Box className={classes.root}>
				<Box className={classes.header}>
					<Typography style={{ fontWeight: 700, fontSize: '16px' }}>Manage Members</Typography>
					<IconButton style={{ background: 'linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%)', borderRadius: '2px' }} onClick={closeDrawer}>
						<CloseIcon style={{ color: '#C94B32' }} />
					</IconButton>
				</Box>
				<Box className={classes.memberDetailsBox}>
					{memberDetails.map(item => {
						return (
							<Box className={classes.memberDetails}>
								<img src={daoMember2} alt="dao" style={{ marginTop: '0.75rem', marginRight: '1rem' }} />
								<TextInput label="" value={item.name} style={{ width: '65%' }} />
								<Typography style={{ fontStyle: 'italic', paddingRight: '1rem' }}>{item.address}</Typography>
								<FormControl sx={{ width: 150 }}>
									<Select
										onChange={handleContributorChange}
										IconComponent={(props) => (<ExpandMoreOutlined {...props} />)}
										value={item.role}
									>
										{options.map(item => {
											return <MenuItem value={item.value} key={item.value}>{item.label}</MenuItem>
										})}

									</Select>
								</FormControl>
								<IconButton style={{ background: 'linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%)', borderRadius: '5px', marginLeft: '1rem' }}><img src={bin} alt="delete" /></IconButton>
							</Box>
						);
					})}
				</Box>
				<Box className={classes.bottomBox}>
					<Button variant='outlined' size="small" onClick={closeDrawer}>Cancel</Button>
					<Button variant='contained' color='primary' size="small" >Save</Button>
				</Box>
			</Box>
		</>
	)
}