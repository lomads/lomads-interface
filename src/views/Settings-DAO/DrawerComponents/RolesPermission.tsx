
import { Container, Grid, Typography, Box } from "@mui/material"
import { makeStyles } from '@mui/styles';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import statusAccess from '../../../assets/svg/StatusAccess.svg';
import statusNoAccess from '../../../assets/svg/StatusNoAccess.svg';
import statusViewOnly from '../../../assets/svg/StatusViewOnly.svg';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const useStyles = makeStyles((theme: any) => ({
	root: {
		padding: '20px 50px',
		height: '90vh',
		overflow: 'auto'
	},
	topBar: {
		width: '400px',
		position: 'relative',
		left: '15%',
	},
	middleBox: {
		marginTop: '2rem',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: '10px',
		position: 'absolute',
		width: '420px',
		height: '50px',
		background: 'rgba(118, 128, 141, 0.05)',
	},
	accessBox: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		columnGap: '10px',
		marginBottom: '2rem'
	},
	tableBox: {
		marginTop: '5rem'
	},
	notesBox:{
		fontSize:'14px',
		fontStyle:'italic',
		lineHeight:'18px',
		marginTop:'2rem'
	}

}));

function createData(
	name: string,
	admin: number,
	coreContributor: number,
	activeContributor: number,
	contributor: number,
) {
	return { name, admin, coreContributor, activeContributor, contributor };
}

const rows = [
	// 0 means Total access, 1 means No access, 2 means View Only
	createData('Transactions voting', 0, 1, 1, 1),
	createData('Edit Organisation Settings', 0, 1, 1, 1),
	createData('Send transactions', 0, 1, 1, 1),
	createData('View transactions', 0, 0, 1, 1),
	createData('Add members', 0, 0, 1, 1),
	createData('Remove members', 0, 1, 1, 1),
	createData('Change access level of members', 0, 1, 1, 1),
	createData('Create and modify projects', 0, 0, 0, 1),
	createData('View complete details of all the projects', 0, 0, 2, 2),
	createData('Create and modify tasks', 0, 0, 1, 1),
	createData('Review tasks', 0, 0, 1, 1),
	createData('View tasks details', 0, 1, 2, 2),
	createData('See members of project', 0, 2, 2, 2),

];


export default (props: any) => {
	const classes = useStyles();
	const navigate = useNavigate();

	return (
		<>
			<Box className={classes.root}>
				<Box className={classes.topBar}>
					<Typography style={{ textAlign: 'center' }}>
						We have provided certain default permissions for different types of members based on
						the best practices we have seen being followed in many well-functioning organisations.
						In future, we may give options to change the permissions for different types of
						members.
					</Typography>
					<Box className={classes.middleBox}>
						<Box className={classes.accessBox}>
							<img src={statusAccess} />
							<Typography>Total access</Typography>
						</Box>
						<Box className={classes.accessBox}>
							<img src={statusNoAccess} />
							<Typography>No access</Typography>

						</Box>
						<Box className={classes.accessBox}>
							<img src={statusViewOnly} />
							<Typography>View only</Typography>

						</Box>
					</Box>
				</Box>
				<Box className={classes.tableBox}>
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell></TableCell>
									<TableCell style={{ whiteSpace: 'nowrap', fontSize: '14px', fontWeight: 700 }}>Admin</TableCell>
									<TableCell style={{ whiteSpace: 'nowrap', fontSize: '14px', fontWeight: 700 }}>Core Contributor</TableCell>
									<TableCell style={{ whiteSpace: 'nowrap', fontSize: '14px', fontWeight: 700 }}>Active Contributor</TableCell>
									<TableCell style={{ whiteSpace: 'nowrap', fontSize: '14px', fontWeight: 700 }}>Contributor</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.map((row) => (
									<TableRow
										key={row.name}
									>
										<TableCell component="th" scope="row" style={{fontSize:'14px'}}>
											{row.name}
										</TableCell>
										<TableCell align="center">
											{row.admin == 0 ? <img src={statusAccess} /> : row.admin == 1 ? <img src={statusNoAccess} /> : <img src={statusViewOnly} />}
										</TableCell>
										<TableCell align="center">
											{row.coreContributor == 0 ? <img src={statusAccess} /> : row.coreContributor == 1 ? <img src={statusNoAccess} /> : <img src={statusViewOnly} />}

										</TableCell>
										<TableCell align="center">
											{row.activeContributor == 0 ? <img src={statusAccess} /> : row.activeContributor == 1 ? <img src={statusNoAccess} /> : <img src={statusViewOnly} />}

										</TableCell>
										<TableCell align="center">
											{row.contributor == 0 ? <img src={statusAccess} /> : row.contributor == 1 ? <img src={statusNoAccess} /> : <img src={statusViewOnly} />}

										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Box>
				<Box className={classes.notesBox}>
					<Typography style={{fontStyle:'normal', fontWeight:700, fontSize:'16px', marginBottom:'1rem'}}>Notes</Typography>
					<Typography>Admins are by default those who are signatories of the organisation’s safe.</Typography>
					<Typography>If a member is removed as a safe signatory then their status is changed to contributor.</Typography>
					<Typography>If a member is added as a safe signatory, their status is changed to the Admin.</Typography>
				</Box>
			</Box>
		</>
	)
}