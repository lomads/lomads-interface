
import { Container, Grid, Typography, Box } from "@mui/material"
import { makeStyles } from '@mui/styles';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import TextInput from "components/TextInput";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import Button from "components/Button";
import AddIcon from '@mui/icons-material/Add';

const useStyles = makeStyles((theme: any) => ({
	root: {
		backgroundColor: '#fff',
		display: 'flex',
		flexDirection: 'column',
		overflow: 'hidden',
		padding: '36px 27px',
		position: 'relative',
		width: 'fit-content'
	},
	header: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'flex-end',
		marginBottom: '2rem',
		width: '100%',
	},
	bottomBox: {
		marginTop: '2rem',
		alignItems: 'center',
		justifyContent: 'space-around',
		display: 'flex',
	},
	titleBox: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column'
	},
	linkBox: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%'
	},
	linkDetailsBox: {
		display: 'flex',
		columnGap: '10rem',
		alignItems: 'center',
		width: '100%',
		marginBottom: '0.875rem',
	},
	linkBottomBox: {
		background: ' hsla(214, 9%, 51%, .05)',
		borderRadius: '5px',
		boxShadow: 'inset 1px 0 4px rgb(27 43 65 / 10%)',
		display: 'flex',
		flexDirection: 'column',
		marginBottom: '20px',
		padding: '26px 22px',
	},
	accessControlBox: {
		alignItems: 'flex-start',
		display: 'flex',
		flexDirection: 'column',
		margin: '20px 0',
	}
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
	const closeDrawer = () => {
		props.closeSidebar(false);
	}
	return (
		<>
			<Box className={classes.root}>
				<Box className={classes.header}>
					<IconButton style={{ background: 'linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%)', borderRadius: '2px' }} onClick={closeDrawer}>
						<CloseIcon style={{ color: '#C94B32' }} />
					</IconButton>
				</Box>
				<Box style={{
					display: 'flex',
					flexDirection: 'column',
					padding: '0 27px',
					width: '100%',
				}}>

					<Box className={classes.titleBox}>
						<img src={""} alt="Milestone" style={{ marginBottom: '1rem' }} />
						<Typography style={{
							color: '#c94b32',
							fontSize: '30px',
							lineHeight: '33px',
							marginBottom: '8px',
						}}>Project Resources</Typography>
						<Typography style={{
							color: '#76808d',
							fontSize: '14px',
							fontStyle: 'italic',
							fontWeight: 400,
							letterSpacing: '-.011em',
							lineHeight: '18px',
							textAlign: 'center',
						}}>Add links for online resources</Typography>
					</Box>
					<Box>
						<Typography style={{
							color: '#76808d',
							fontSize: '16px',
							fontStyle: 'normal',
							fontWeight: 500,
						}}>Add links</Typography>
						<Box className={classes.linkBox}>
							<TextInput
								style={{ marginRight: '0.5rem' }}
								placeholder="Ex Portfolio"
								onChange={(event: any) => {
									setLinkName(event.target.value)
								}}
							/>
							<TextInput
								style={{ marginRight: '0.5rem' }}
								placeholder="Link"
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
					<Box className={classes.accessControlBox}>
						<Typography style={{
							color: '#76808d',
							fontSize: '16px',
							fontWeight: 400,
							letterSpacing: '-.011em',
							margin: 0,
							opacity: .6,
							textTransform: 'uppercase',
							marginBottom: '0.5rem'
						}}>Access Control</Typography>
						<Typography style={{
							color: 'hsla(214, 9%, 51%, .5)',
							fontSize: '14px',
							fontStyle: 'italic',
							fontWeight: 400,
							letterSpacing: '-.011em',
						}}>
							Currently available for Notion and Discord only
						</Typography>
					</Box>
					{links.length > 0 && <Box display="flex" flexDirection="column" alignItems="center" className={classes.linkBottomBox}>
						{links.map((item: any) => {
							return <Box
								className={classes.linkDetailsBox}>
								<Typography style={{ textAlign: 'left' }}>{item.linkName}</Typography>
								<Typography style={{ textAlign: 'left', fontStyle: 'italic' }}>{item.linkAddress}</Typography>
							</Box>
						})
						}
					</Box>}
					<Box className={classes.bottomBox}>
						<Button variant='outlined' size="small" onClick={closeDrawer}>Cancel</Button>
						<Button variant='contained' color='primary' size="small" >Save</Button>
					</Box>
				</Box>

			</Box>
		</>
	)
}