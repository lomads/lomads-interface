
import { Container, Grid, Typography, Box, Icon } from "@mui/material"
import { makeStyles } from '@mui/styles';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import daoMember2 from "../../assets/svg/daoMember2.svg";
import TextInput from "components/TextInput";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import bin from "../../assets/svg/bin-red.svg";
import createProject from "../../assets/svg/createProject.svg";
import { ExpandMoreOutlined } from '@mui/icons-material';
import Button from "components/Button";


const useStyles = makeStyles((theme: any) => ({
	root: {
		backgroundColor: '#fff',
		borderRadius: '20px 0 0 20px',
		display: 'flex',
		flexDirection: 'column',
		height: '100vh',
		overflow: 'auto',
		padding: '50px 30px 40px 40px',
		position: 'relative',
		width: 'auto'
	},
	memberDetailsBox: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		height: '80%',
		overflow: 'auto'
	},
	memberDetails: {
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		marginBottom: '1rem',
		display: 'flex'
	},
	bottomBox: {
		alignItems: 'center',
		justifyContent: 'space-around',
		display: 'flex',
	}
}));

export default (props: any) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const memberDetails = [
		{ name: 'Test1', address: '0xC38e...ea3b', role: 'CONTRIBUTOR' },
		{ name: 'Test2', address: '0xC38e...ea3b', role: 'CORE_CONTRIBUTOR' },
		{ name: 'Test3', address: '0xC38e...ea3b', role: 'CONTRIBUTOR' },
		{ name: 'Test4', address: '0xC38e...ea3b', role: 'CONTRIBUTOR' },
	]
	const options = [
		{ value: 'CONTRIBUTOR', label: 'Contributor' },
		{ value: 'ACTIVE_CONTRIBUTOR', label: 'Active Contributor' },
		{ value: 'CORE_CONTRIBUTOR', label: 'Core Contributor' },
	];
	const handleContributorChange = (event: SelectChangeEvent) => {
		console.log("Selected Event", event)
	}
	const closePopup = () => {
		props.closePopup(false);
	}
	return (
		<>
			<Box className={classes.root}>
				<Box style={{ textAlign: 'center', marginBottom: '1rem' }}>
					<img src={createProject} />
					<Typography style={{ fontSize: '1.5rem', color: '#C94B32', marginTop: '1rem' }}>Add Members</Typography>
				</Box>
				<Box className={classes.memberDetailsBox}>
					{memberDetails.map(item => {
						return (
							<Box className={classes.memberDetails}>
								<img src={daoMember2} alt="dao" style={{ marginTop: '0.75rem', marginRight: '1rem' }} />
								<TextInput label="" value={item.name} />
								<Typography style={{ fontStyle: 'italic', padding: '0rem 1rem 0rem 1rem' }}>{item.address}</Typography>
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
					<Button variant='outlined' size="small" onClick={closePopup}>Cancel</Button>
					<Button variant='contained' color='primary' size="small" >Add Members</Button>
				</Box>
			</Box>
		</>
	)
}