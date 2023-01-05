
import { Container, Grid, Typography, Box } from "@mui/material"
import { makeStyles } from '@mui/styles';
import Button from "components/Button";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { SelectChangeEvent } from '@mui/material/Select';
import Select from "components/Select";
import TextInput from "components/TextInput";

const useStyles = makeStyles((theme: any) => ({
	root: {
		padding: '20px 100px 20px 100px',
		height: '70vh',
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
		marginBottom: '2.3rem'
	},

	divider: {
		border: '1.5px solid #c94b32',
		width: '210px',
		height: '0px',
		backgroundColor: '#c94b32',
		margin: '30px 0px 30px 0px',
		position: 'relative',
		left: '22%',
	},

	infoBox: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: '1rem',
		marginLeft: '1.875rem'
	},
	editBox: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	buttonBox: {
		marginTop: '2rem',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		columnGap: '2rem'
	}
}));

export default (props: any) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const [editButtonPressed, setEditButtonPressed] = useState(false);

	const workspaceOptions = [
		{ value: 'Workspaces', label: 'Workspaces' },
		{ value: 'Projects', label: 'Projects' },
		{ value: 'Pods', label: 'Pods' },
		{ value: 'Departments', label: 'Departments' },
		{ value: 'Functions', label: 'Functions' },
		{ value: 'Guilds', label: 'Guilds' },
	];
	const tasksOptions = [
		{ value: 'Tasks', label: 'Tasks' },
		{ value: 'Bounties', label: 'Bounties' },
	];

	const [selectedWorkspace, setSelectedWorkspace] = useState('Workspaces');
	const [selectedTask, setSelectedTask] = useState('Tasks');


	const handleWorkspaceChange = (event: SelectChangeEvent) => {
		setSelectedWorkspace(event.target.value);
	}

	const handleTaskChange = (event: SelectChangeEvent) => {
		setSelectedTask(event.target.value);
	}

	useEffect(() => {
		setEditButtonPressed(props.editButton);
	}, [props])
	return (
		<>
			{editButtonPressed === false && <Box className={classes.root}>
				<Box className={classes.title}>
					<Typography>Labels used in all your organisation’s interface.</Typography>
				</Box>
				<Box className={classes.infoBox}>
					<Typography style={{ color: '#76808D', fontSize: '16px', fontWeight: 700, marginRight: '1rem' }}>Workspaces : </Typography>
					<Typography style={{ fontStyle: 'italic', fontSize: '16px' }}>Workspaces</Typography>
				</Box>
				<Box className={classes.infoBox}>
					<Typography style={{ color: '#76808D', fontSize: '16px', fontWeight: 700, marginRight: '1rem' }}>Tasks : </Typography>
					<Typography style={{ fontStyle: 'italic', fontSize: '16px' }}>Tasks</Typography>
				</Box>
				<hr className={classes.divider} />
				<Box className={classes.infoBox}>
					<Typography style={{ color: '#76808D', fontSize: '16px', fontWeight: 700, marginRight: '1rem' }}>role1 : </Typography>
					<Typography style={{ fontStyle: 'italic', fontSize: '16px' }}>Admin</Typography>
				</Box>
				<Box className={classes.infoBox}>
					<Typography style={{ color: '#76808D', fontSize: '16px', fontWeight: 700, marginRight: '1rem' }}>role2 : </Typography>
					<Typography style={{ fontStyle: 'italic', fontSize: '16px' }}>Core Contributor</Typography>
				</Box>
				<Box className={classes.infoBox}>
					<Typography style={{ color: '#76808D', fontSize: '16px', fontWeight: 700, marginRight: '1rem' }}>role3 : </Typography>
					<Typography style={{ fontStyle: 'italic', fontSize: '16px' }}>Active Contributor</Typography>
				</Box>
				<Box className={classes.infoBox}>
					<Typography style={{ color: '#76808D', fontSize: '16px', fontWeight: 700, marginRight: '1rem' }}>role4 : </Typography>
					<Typography style={{ fontStyle: 'italic', fontSize: '16px' }}>Contributor</Typography>
				</Box>
			</Box>}

			{editButtonPressed === true &&
				<Box className={classes.root}>
					<Box className={classes.editBox}>
						<Typography style={{ color: '#76808D', fontSize: '16px', fontWeight: 700, marginRight: '1rem' }}>Workspaces</Typography>
						<Select options={workspaceOptions} value={selectedWorkspace} onChange={handleWorkspaceChange} fullWidth={true} />
					</Box>
					<Box className={classes.editBox}>
						<Typography style={{ color: '#76808D', fontSize: '16px', fontWeight: 700, marginRight: '1rem' }}>Tasks</Typography>
						<Select options={tasksOptions} value={selectedTask} onChange={handleTaskChange} fullWidth={true} />
					</Box>
					<hr className={classes.divider} />

					<Box className={classes.editBox}>
						<Typography style={{ color: '#76808D', fontSize: '16px', fontWeight: 700, marginRight: '1rem' }}>Role 1</Typography>
						<TextInput
							value={"Admin"}
							onChange={(event: any) => {
							}}
						/>
					</Box>
					<Box className={classes.editBox}>
						<Typography style={{ color: '#76808D', fontSize: '16px', fontWeight: 700, marginRight: '1rem' }}>Role 2</Typography>
						<TextInput
							value={"Core Contributor"}
							onChange={(event: any) => {
							}}
						/>
					</Box>
					<Box className={classes.editBox}>
						<Typography style={{ color: '#76808D', fontSize: '16px', fontWeight: 700, marginRight: '1rem' }}>Role 3</Typography>
						<TextInput
							value={"Active Contributor"}
							onChange={(event: any) => {
							}}
						/>
					</Box>
					<Box className={classes.editBox}>
						<Typography style={{ color: '#76808D', fontSize: '16px', fontWeight: 700, marginRight: '1rem' }}>Role 4</Typography>
						<TextInput
							value={"Contributor"}
							onChange={(event: any) => {
							}}
						/>
					</Box>
					<Box className={classes.buttonBox}>
						<Button variant="outlined" size="small">Cancel</Button>
						<Button variant="contained" size="small">Save Changes</Button>
					</Box>

				</Box>}
		</>
	)
}