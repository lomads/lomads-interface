
import { Container, Grid, Typography, Box, Icon } from "@mui/material"
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import rolePermission from '../../assets/svg/RP.svg';
import orgDetail from '../../assets/svg/OD.svg';
import safe from '../../assets/svg/safe.svg';
import token from '../../assets/svg/PT.svg';
import sweat from '../../assets/svg/xp-points.svg';
import terminology from '../../assets/svg/Frameterminology.svg';
import discord from '../../assets/svg/DiscordIcon.svg';
import OrganizationDetails from "./DrawerComponents/OrganizationDetails";
import RolesPermission from "./DrawerComponents/RolesPermission";
import Discord from "./DrawerComponents/Discord";
import PassToken from "./DrawerComponents/PassToken";
import Terminology from "./DrawerComponents/Terminology";
import editIcon from '../../assets/svg/editButton.svg';
const useStyles = makeStyles((theme: any) => ({
	root: {
		backgroundColor: '#fff',
		borderRadius: '20px 0 0 20px',
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		overflow: 'hidden',
		position: 'relative',
		width: 'fit-content',
		maxWidth: '800px',
		minWidth: '570px'
	},
	header: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'flex-end',
		padding: '2rem',
		width: '100%',
	},

	detailBox: {
		padding: '1rem 4rem 1rem 4rem',
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'center',
		color: '#c94b32'
	},
	iconBox: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'center',
		color: '#c94b32'
	}

}));

export default (props: any) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const [editTerminologyBtn, setEditTerminologyBtn] = useState(false);
	const [imageSource, setImageSource] = useState('');

	const closeDrawer = () => {
		props.closeSidebar(false);
	}

	useEffect(() => {
		if (props.title == 'Organisation Details')
			setImageSource(orgDetail);
		else if (props.title == 'Roles & Permissions')
			setImageSource(rolePermission)
		else if (props.title == 'Safe')
			setImageSource(safe)
		else if (props.title == 'Pass Tokens')
			setImageSource(token)
		else if (props.title == 'SWEAT points')
			setImageSource(sweat)
		else if (props.title == 'Terminologies')
			setImageSource(terminology)
		else if (props.title == 'Discord')
			setImageSource(discord)
	}, []);

	const editTerminology = () => {
		setEditTerminologyBtn(true);
	}

	return (
		<>
			<Box className={classes.root}>
				<Box className={classes.header}>
					{props.title == 'Terminologies' &&
						<Box style={{ marginRight: '1rem' }}>
							<img src={editIcon} alt="edit" style={{ cursor: 'pointer' }} onClick={editTerminology} />
						</Box>
					}
					<IconButton style={{ background: 'linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%)', borderRadius: '4px', marginBottom: 'auto', height: '38px', width: '38px' }} onClick={closeDrawer}>
						<CloseIcon style={{ color: '#C94B32' }} />
					</IconButton>
				</Box>
				<Box className={classes.iconBox}>
					<img src={imageSource} height='50px' width='95px' />
				</Box>
				<Box className={classes.detailBox}>
					<Typography style={{ color: '#c94b32', fontSize: '30px' }}>{props.title}</Typography>
				</Box>
				{props.title == 'Organisation Details' && <OrganizationDetails />}
				{props.title == 'Roles & Permissions' && <RolesPermission />}
				{props.title == 'Safe' && <></>}
				{props.title == 'Pass Tokens' && <PassToken />}
				{props.title == 'SWEAT points' && <></>}
				{props.title == 'Terminologies' && <Terminology editButton={editTerminologyBtn} />}
				{props.title == 'Discord' && <Discord />}
			</Box>
		</>
	)
}