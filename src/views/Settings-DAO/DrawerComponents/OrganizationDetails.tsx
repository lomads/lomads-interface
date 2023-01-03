
import { Container, Grid, Typography, Box, IconButton } from "@mui/material"
import { makeStyles } from '@mui/styles';
import TextInput from "components/TextInput";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import Button from "components/Button";
import AddIcon from '@mui/icons-material/Add';

const useStyles = makeStyles((theme: any) => ({
	root: {
		padding: '20px 0px 20px 90px',
		height: '90vh',
		overflow: 'auto',
	},
	visibilityBox: {
		alignItems: 'center',
		fontFamily: 'Open Sans',
		fontStyle: 'italic',
		fontSize: '14px',
		lineHeight: '18px',
		letterSpacing: '-0.011em',
		color: '#76808D',
	},
	divider: {
		border: '2px solid #c94b32',
		width: '210px',
		height: '0px',
		backgroundColor: '#c94b32',
		marginBottom: '25px',
		position:'relative',
		right:'5%'
	},
	buttonBox: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		columnGap: '2rem',
		marginTop: '1rem',
		marginBottom: '1rem',
		background: 'linear-gradient(360deg, #FFFFFF 60.12%, rgba(255, 255, 255, 0) 86.31%)'
	},
	linkBox: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		width:'80%'
	},
	bottomBox: {
		backgroundColor: 'rgba(118, 128, 141, 0.05)',
		borderRadius: '0 0 5px 5px',
		boxShadow: 'inset 1px 0px 4px rgba(27, 43, 65, 0.1)',
		maxHeight: '500px',
		overflow: 'hidden',
		overflowY: 'auto',
		padding: '26px 22px',
		width: '80%',
		margin: '1rem 0rem',

	},
	linkDetailsBox: {
		display: 'flex',
		columnGap: '10rem',
		alignItems: 'center',
		width: '100%',
		marginBottom: '0.875rem',

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

	const [links, setLinks] = useState<any>([]);

	const [linkName, setLinkName] = useState("");
	const [linkAddress, setLinkAddress] = useState("");

	const addLinks = () => {
		setLinks([...links, { linkName: linkName, linkAddress: linkAddress }])

	}
	return (
		<>
			<Box className={classes.root}>
				<Box style={{display:'flex', flexDirection:'column', width:'90%'}}>
					<TextInput
						style={{ marginBottom: '1.5rem', width:'90%'}}
						label={"Name"}
						placeholder={"Fashion Fusion"}
						onChange={(event: any) => {
						}}
					/>
					<TextInput
						style={{ marginBottom: '1.5rem', width: '90%' }}
						multiline
						placeholder="DAO Description"
						minRows={"3"}
						label={"Description"}
					/>
					<TextInput
						style={{ marginBottom: '1.5rem', width: '90%' }}
						label={"Organisation's URL"}
						disabled
					/>
				</Box>
				<hr className={classes.divider} />

				<Box className={classes.visibilityBox}>
					<Typography style={{ marginBottom: '1rem', fontSize: '16px', fontWeight: 700, fontStyle: 'normal' }}>Member Visibility</Typography>
					<Box style={{ width: '90%' }}>
						<Typography>
							If unlocked, everyone in the organisation will be able to see who is part of which
							project. Otherwise, only members part of a project sees the members they are working with.
						</Typography>
					</Box>

					<FormControlLabel
						control={<MaterialUISwitch sx={{ m: 1 }} />}
						label=""
					/>
				</Box>
				<hr className={classes.divider} />
				<Box>
					<Typography style={{ marginBottom: '1rem', fontSize: '16px', fontWeight: 700, fontStyle: 'normal' }}>Links</Typography>
					<Box className={classes.linkBox}>
						<TextInput
							placeholder="Ex Portfolio"
							onChange={(event: any) => {
								setLinkName(event.target.value)
							}}
						/>
						<TextInput
							placeholder="link"
							onChange={(event: any) => {
								setLinkAddress(event.target.value)
							}}
						/>
						<IconButton
							onClick={addLinks}
							style={{
								backgroundColor: 'rgba(27, 43, 65, 0.2)', borderRadius: '5px', height: '42px', width: '42px', marginTop: '0.65rem'
							}}
						>
							<AddIcon
								fontSize="medium"
								sx={{
									color: '#fff'
								}}
							/>
						</IconButton>
					</Box>
				</Box>
				{links.length > 0 && <Box display="flex" flexDirection="column" alignItems="center" className={classes.bottomBox}>
					{links.map((item: any) => {
						return <Box
							className={classes.linkDetailsBox}>
							<Typography style={{ textAlign: 'left' }}>{item.linkName}</Typography>
							<Typography style={{ textAlign: 'left', fontStyle: 'italic' }}>{item.linkAddress}</Typography>
						</Box>
					})
					}
				</Box>}

			</Box>
			<Box className={classes.buttonBox}>
				<Button size="small" variant="outlined">Cancel</Button>
				<Button size="small" variant="contained">Save Changes</Button>
			</Box>
		</>
	)
}