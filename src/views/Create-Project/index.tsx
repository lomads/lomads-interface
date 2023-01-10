
import { Container, Grid, Typography, Box, FormLabel } from "@mui/material"
import { makeStyles } from '@mui/styles';
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Button from "components/Button";
import createProject from '../../assets/svg/createProject.svg';
import TextInput from 'components/TextInput';
import { Editor } from '@tinymce/tinymce-react';
import editIcon from '../../assets/svg/editButton.svg';
import dao from '../../assets/svg/daoMember2.svg';
import Checkbox from '@mui/material/Checkbox';

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
	createProjectBody: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		padding: '26px 22px 30px',
		width: '394px',
		height: '332px',
		background: '#FFFFFF',
		boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)',
		borderRadius: '5px',
		marginBottom: '1rem'
	},
	projectTitle: {
		alignItems: 'center',
		background: '#fff',
		borderRadius: '5px',
		display: 'flex',
		padding: '30px 22px',
		width: '400px',
		justifyContent: 'space-between'
	},
	projectDetails: {
		display: 'flex',
		flexDirection: 'column',
	},
	iconBox: {
		background: 'linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%)',
		width: '40px',
		height: '40px',
		borderRadius: '5px'
	},
	divider: {
		border: '1.3px solid #c94b32',
		width: '210px',
		height: '0px',
		backgroundColor: '#c94b32',
		flex: 'none',
		margin: '35px 0px'
	},
	memberDetails: {
		background: '#fff',
		borderRadius: '5px',
		boxShadow: '3px 5px 4px rgb(27 43 65 / 5%), -3px -3px 8px rgb(201 75 50 / 10%)',
		maxHeight: '75vh',
		padding: '26px 22px',
		position: 'relative',
		width: '480px',
	},
	memberHeader: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'space-between',
		marginBottom: '1.5rem',
		width: '100%'
	},
	bottomButtonBox: {
		display: 'flex',
		marginTop: '2rem'
	}
}))

export default (props: any) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const [description, setDescription] = useState('');
	const [disableButton, setDisableButton] = useState(true);
	const editorRef = useRef<any>(null);
	const [projectName, setProjectName] = useState('');
	const [nextButtonClicked, setNextButtonClicked] = useState(false);
	const [memberList, setMemberList] = useState([
		{ name: 'Alex', walletAddress: '0x340A...2473' },
		{ name: 'Riya', walletAddress: '0x5Af6...9741' },
		{ name: 'Nick', walletAddress: '0xA470...c403' },
		{ name: 'Bob', walletAddress: '0x7b85...2842' },
		{ name: 'John', walletAddress: '0xC38e...ea3b' }
	]);

	useEffect(() => {
		if (projectName.length > 0 && description.length > 0)
			setDisableButton(false);
		else
			setDisableButton(true)
	}, [projectName, description]);

	const nextButtonHandler = () => {
		setNextButtonClicked(true)
	}

	const editButtonClicked = () => {
		setNextButtonClicked(false);
	}

	const createMemberHandler = () => {

	}
	return (
		<Box className={classes.root}>
			<Box className={classes.header}>
				<img src={createProject} />
				<Typography style={{
					color: '#c94b32',
					fontSize: '30px',
					fontStyle: "normal",
					fontWeight: 400,
					margin: '1.5rem 0',

				}}>Create New Project</Typography>
			</Box>
			{!nextButtonClicked &&
				<Box className={classes.createProjectBody}>
					<TextInput
						style={{ marginBottom: '1.5rem' }}
						fullWidth
						label={"Name of the Project"}
						value={projectName}
						placeholder={"Enter Project name"}
						onChange={(event: any) => {
							setProjectName(event.target.value)
						}}
					/>
					<FormLabel style={{ marginBottom: '0.5rem' }}>Short Description</FormLabel>
					<Editor
						apiKey='p0turvzgbtf8rr24txekw7sgjye6xunw2near38hwoohdg13'
						onInit={(evt, editor) => editorRef.current = editor}
						init={{
							height: 300,
							width: '100%',
							menubar: false,
							statusbar: false,
							toolbar: false,
							branding: false,
							body_class: "mceBlackBody",
							default_link_target: "_blank",
							extended_valid_elements: "a[href|target=_blank]",
							link_assume_external_targets: true,
							plugins: [
								'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
								'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
								'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
							],
							content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
						}}
						value={description}
						onEditorChange={(text) => { setDescription(text) }}
					/>
					<Box style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', width: '100%' }}>
						<Button disabled={disableButton} size="small" variant="contained" fullWidth onClick={nextButtonHandler}>Next</Button>
					</Box>
				</Box>
			}
			{nextButtonClicked &&
				<>
					<Box className={classes.projectTitle}>
						<Box className={classes.projectDetails}>
							<Typography style={{ color: '#76808D', fontSize: '22px', marginBottom: '0.5rem' }}>{projectName}</Typography>
							<Typography style={{ color: '#1B2B41' }}>{description.replace(/<[^>]+>/g, '')}</Typography>
						</Box>
						<Box className={classes.iconBox} onClick={editButtonClicked}>
							<img src={editIcon} alt="Edit" />
						</Box>
					</Box>
					<hr className={classes.divider} />
				</>
			}
			{nextButtonClicked &&
				<Box className={classes.memberDetails}>
					<Box className={classes.memberHeader}>
						<Typography style={{
							color: '#76808d',
							fontSize: '16px',
							fontWeight: 700
						}}>Invite members</Typography>
						<Button variant='contained' color='secondary' size="small" onClick={createMemberHandler}>Add New Member</Button>
					</Box>
					{memberList.map(item => {
						return <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom:'1rem'}}>
							<Box style={{ display: 'flex' }}>
								<img src={dao} alt="icon" />
								<Typography style={{marginLeft:'1rem'}}>{item.name}</Typography>
							</Box>
							<Typography style={{fontStyle:'italic'}}>{item.walletAddress}</Typography>
							<Checkbox />

						</Box>
					})}
				</Box>
			}
			{nextButtonClicked &&
				<Box className={classes.bottomButtonBox}>
					<Button size="small" color="primary" style={{ marginRight: '1.5rem', background: '#FFFFFF' }}>Add More Detail</Button>
					<Button size="small" variant="contained">Create Workspace</Button>

				</Box>
			}
		</Box>
	)
}