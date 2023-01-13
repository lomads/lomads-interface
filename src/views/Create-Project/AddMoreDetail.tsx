
import { Container, Grid, Typography, Box, IconButton } from "@mui/material"
import { makeStyles } from '@mui/styles';
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Button from "components/Button";
import createProject from '../../assets/svg/createProject.svg';
import AddIcon from '@mui/icons-material/Add';
import Drawer from '@mui/material/Drawer';
import ProjectResource from "./ProjectResource";
import KeyResults from "./KeyResults";
import Milestones from "./Milestones";

const useStyles = makeStyles((theme: any) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	header: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column',
		marginBottom: '2rem',
	},
	projectDetailBody: {
		alignItems: 'center',
		background: '#fff',
		borderRadius: '5px',
		display: 'flex',
		padding: '30px 22px',
		width: '470px',
		justifyContent: 'space-between'
	},
	projectDetails: {
		display: 'flex',
		flexDirection: 'column',
	},
	divider: {
		border: '1.3px solid #c94b32',
		width: '210px',
		height: '0px',
		backgroundColor: '#c94b32',
		flex: 'none',
		margin: '35px 0px'
	},
	buttonStyle: {
		marginTop: '1rem',
		textAlign: 'center'
	},
	buttonBox: {
		display: 'flex',
		margin: '35px 0',
		paddingBottom: '32px'
	},
	successBox: {
		position: 'absolute',
		left: '40%',
		top: '40%',
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column',
		marginBottom: '2rem',
	}
}))

export default (props: any) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const [createProjectClicked, setCreateProjectClicked] = useState(false);
	const [openProjectResourceDrawer, setOpenProjectResourceDrawer] = useState(false);
	const [openKeyResultsDrawer, setOpenKeyResultsDrawer] = useState(false);
	const [openMilestonesDrawer, setOpenMilestonesDrawer] = useState(false);
	const [openDrawer, setOpenDrawer] = useState(false);

	const handleCloseDrawer = () => {
		setOpenDrawer(false);
		setOpenKeyResultsDrawer(false);
		setOpenMilestonesDrawer(false);
		setOpenProjectResourceDrawer(false);
	}
	const addProjectResourceHandler = () => {
		setOpenDrawer(true);
		setOpenProjectResourceDrawer(true);
	}

	const addkeyResultHandler = () => {
		setOpenDrawer(true);
		setOpenKeyResultsDrawer(true);
	}

	const addMilestonesHandler = () => {
		setOpenDrawer(true);
		setOpenMilestonesDrawer(true);

	}

	const createProjectHandler = () => {
		setCreateProjectClicked(true);
	}

	return (
		<Box className={classes.root}>
			{!createProjectClicked &&
				<>
					<Box className={classes.header}>
						<img src={createProject} />
						<Typography style={{
							color: '#c94b32',
							fontSize: '30px',
							fontStyle: "normal",
							fontWeight: 400,
							margin: '1.5rem 0',

						}}>Project details</Typography>
					</Box>
					<>
						<Box className={classes.projectDetailBody}>
							<Box className={classes.projectDetails}>
								<Typography style={{
									color: '#76808d',
									fontSize: '22px',
									marginBottom: '1rem'
								}}>Project resources</Typography>

								<Typography style={{
									color: '#76808d',
									fontSize: '14px',
									fontStyle: 'italic',
									fontWeight: 400,
									lineHeight: '18px'
								}}>Add links for your team to access</Typography>
							</Box>
							<Box className={classes.buttonStyle}>
								<Button variant='contained' color='secondary' size="small" style={{ color: '#C94B32' }} onClick={addProjectResourceHandler}><AddIcon /> ADD</Button>
							</Box>
						</Box>
						<hr className={classes.divider} />
					</>
					<>
						<Box className={classes.projectDetailBody}>
							<Box className={classes.projectDetails}>
								<Typography style={{
									color: '#76808d',
									fontSize: '22px',
									marginBottom: '1rem'
								}}>Milestones</Typography>

								<Typography style={{
									color: '#76808d',
									fontSize: '14px',
									fontStyle: 'italic',
									fontWeight: 400,
									lineHeight: '18px'
								}}>Organise and link payments to milestones</Typography>
							</Box>
							<Box className={classes.buttonStyle}>
								<Button variant='contained' color='secondary' size="small" style={{ color: '#C94B32' }} onClick={addMilestonesHandler}><AddIcon /> ADD</Button>
							</Box>
						</Box>
						<hr className={classes.divider} />
					</>
					<>
						<Box className={classes.projectDetailBody}>
							<Box className={classes.projectDetails}>
								<Typography style={{
									color: '#76808d',
									fontSize: '22px',
									marginBottom: '1rem'
								}}>Key results</Typography>

								<Typography style={{
									color: '#76808d',
									fontSize: '14px',
									fontStyle: 'italic',
									fontWeight: 400,
									lineHeight: '18px'
								}}>Set objective for your team</Typography>
							</Box>
							<Box className={classes.buttonStyle}>
								<Button variant='contained' color='secondary' size="small" style={{ color: '#C94B32' }} onClick={addkeyResultHandler}><AddIcon /> ADD</Button>
							</Box>
						</Box>
					</>
					<Box className={classes.buttonBox}>
						<Button size="small" variant="contained" onClick={createProjectHandler}>Create Project</Button>
					</Box>
				</>}
			{createProjectClicked &&
				<>
					<Box className={classes.successBox}>
						<img src={createProject} />
						<Typography style={{
							color: '#c94b32',
							fontSize: '30px',
							fontStyle: "normal",
							fontWeight: 400,
							margin: '1.875rem 0',

						}}>Success!</Typography>
						<Typography style={{
							fontStyle: "italic",
							marginBottom: '0.5rem'
						}}>The new project is created.</Typography>
						<Typography style={{
							fontStyle: "italic",

						}}>You will be redirected in few seconds.</Typography>
					</Box>
				</>
			}
			<Drawer
				style={{ zIndex: 1999 }}
				sx={{
					'& .MuiDrawer-paper': { borderRadius: '20px 0 0 20px' },
				}}
				anchor="right"
				open={openDrawer}
				onClose={handleCloseDrawer}
				variant="temporary">
				{openProjectResourceDrawer && <ProjectResource closeSidebar={handleCloseDrawer} />}
				{openKeyResultsDrawer && <KeyResults closeSidebar={handleCloseDrawer} />}
				{openMilestonesDrawer && <Milestones closeSidebar={handleCloseDrawer} />}

			</Drawer>
		</Box >
	)
}