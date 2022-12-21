
import { Container, Grid, Typography, Box } from "@mui/material"
import { makeStyles } from '@mui/styles';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Button from 'components/Button';
import membersIcon from "../../assets/svg/membersIcon.svg";
import editIcon from '../../assets/svg/editButton.svg';
import daoMember2 from "../../assets/svg/daoMember2.svg";
import Drawer from '@mui/material/Drawer';
import EditMemberDrawer from "./EditMemberDrawer";
import Dialog from '@mui/material/Dialog';
import AddMemberPopup from "./AddMemberPopup";
const useStyles = makeStyles((theme: any) => ({
	memberHeading: {
		padding: '20px 15px 15px',
		width: '44rem',
		height: 'auto',
		background: "#FFFFFF",
		borderRadius: '5px !important',
		marginBottom: '0.1rem'
	},
	outerBox: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
	},
	verticalDivider: {
		backgroundColor: 'rgba(118, 128, 141, 0.3)',
		height: 0,
		transform: 'rotate(90deg)',
		width: '2.18rem'
	},
	memberDetails: {
		padding: "26px 22px",
		width: '44rem',
		height: 'auto',
		background: "#FFFFFF",
		borderRadius: '5px !important',
		marginBottom: '0.1rem'
	}
}));

export default (props: any) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const [openDrawer, setOpenDrawer] = useState(false);
	const [openAddMemberPopup, setOpenAddMemberPopup] = useState(false);
	const editMember = () => {
		setOpenDrawer(true);
	}

	const handleCloseDrawer = () => {
		setOpenDrawer(false);
	}

	const addMember = () => {
		setOpenAddMemberPopup(true);
	}

	const closeAddMemberDialog = () => {
		setOpenAddMemberPopup(false);
	}

	const memberDetails = [
		{ name: 'Test1', walletAddress: '0X989h…jMHg', joinDate: '10/10/2023', contributor: 'Active Contributor' },
		{ name: 'Test2', walletAddress: '0X124h…jMHg', joinDate: '10/10/2022', contributor: 'Active Contributor' },
	]
	return (
		<>
			<Grid container>
				<Grid xs={12} item display="flex" flexDirection="column">
					<Box>
						<Paper elevation={1} className={classes.memberHeading}>
							<Box display={"flex"} flexDirection="row" alignItems={"center"} columnGap={"4rem"}>
								<Typography variant="subtitle1">Members</Typography>
								<Box style={{ display: 'flex', alignItems: 'center' }}>
									<hr className={classes.verticalDivider} />
									<img
										src={membersIcon}
										alt="asset"
										style={{ height: 35, width: 35 }}
									/>
									<Typography variant="subtitle2" style={{ marginLeft: '0.8rem' }}>2 Members</Typography>
								</Box>
								<Button variant='contained' color='secondary' size="small" style={{ color: "#B12F15" }} onClick={addMember}>Add Member</Button>
								<img src={editIcon} alt="edit" style={{ cursor: 'pointer' }} onClick={editMember} />
							</Box>
						</Paper>
						<Paper elevation={1} className={classes.memberDetails}>
							<Box display={"flex"} flexDirection="column" columnGap={"0.625rem"} rowGap={"2rem"}>
								{memberDetails.map(item => {
									return (
										<Box display={"flex"} flexDirection="row" columnGap={"3rem"} alignItems="center">
											<Box style={{display:'flex', alignItems:'center'}}>
												<img src={daoMember2} />
												<Typography style={{marginLeft:'1rem'}}>{item.name}</Typography>
											</Box>
											<Typography style={{fontStyle:'italic'}}>{item.walletAddress}</Typography>
											<Box style={{ display: 'flex', alignItems: 'center' }}>
												<hr className={classes.verticalDivider} />
												<Typography>{item.joinDate}</Typography>
											</Box>
											<Box style={{ display: 'flex', alignItems: 'center' }}>
												<hr className={classes.verticalDivider} />
												<Typography style={{ fontWeight: 700 }}>{item.contributor}</Typography>
											</Box>
										</Box>
									);
								})}
							</Box>
						</Paper>
					</Box>
				</Grid>
			</Grid >
			<Drawer
				style={{ zIndex: 1999 }}
				anchor="right"
				open={openDrawer}
				onClose={handleCloseDrawer}
				variant="temporary">
				<EditMemberDrawer closeSidebar={handleCloseDrawer} />
			</Drawer>

			<Dialog
				open={openAddMemberPopup}
				onClose={closeAddMemberDialog}
			>
				<AddMemberPopup closePopup={closeAddMemberDialog} />
			</Dialog>
		</>
	)
}