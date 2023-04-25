import React from 'react';
import { useState } from 'react'
import { get as _get } from 'lodash'
import {
	Drawer,
	Box,
	Typography,
	Divider,
	Button
} from '@mui/material';
import IconButton from 'muiComponents/IconButton'
import CloseSVG from 'assets/svg/close-new.svg'
import Integrations from "assets/svg/Integrations.svg"
import GreyIconHelp from "assets/svg/GreyIconHelp.svg"
import Integrationtrello from "assets/svg/Integrationtrello.svg"
import Integrationgithub from "assets/svg/Integrationgithub.svg"
import Integrationdiscord from "assets/svg/Integrationdiscord.svg"
import palette from 'muiTheme/palette';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({
	integrationName: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: 600,
		fontSize: 16,
		lineHeight: 22
	}
}));

const integrationAccounts = [
	{
		icon: Integrationgithub,
		name: "GitHub"
	},
	{
		icon: Integrationdiscord,
		name: "Discord"
	},
	{
		icon: Integrationtrello,
		name: "Trello"
	}
];

export default ({ open, onClose }: { open: boolean, onClose: any }) => {
	const classes = useStyles();

	const [panels, setPanels] = useState<any>([]);

	const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
		if (panels.indexOf(panel) > -1) {
			setPanels(panels.filter((i: string) => i !== panel));
		}
		else {
			setPanels([...panels, panel]);
		}
	};

	return (
		<Drawer
			PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
			sx={{ zIndex: 99999 }}
			anchor={'right'}
			open={open}
			onClose={() => onClose()}>
			<Box sx={{ width: 504, flex: 1, paddingBottom: '80px', paddingLeft: '40px', borderRadius: '20px 0px 0px 20px' }}>
				<IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={() => onClose()}>
					<img src={CloseSVG} />
				</IconButton>
				<Box display="flex" flexDirection="column" my={6} alignItems="center">
					<img src={Integrations} />
					<Typography my={2} style={{ color: palette.primary.main, fontSize: '30px', fontWeight: 400 }}>Integrations</Typography>
				</Box>

				<Box display="flex" flexDirection="row" my={6} alignItems="flex-start">
					<Typography sx={{
						fontWeight: '500',
						marginRight: 2,
						color: '#1B2B41',
						fontFamily: 'Inter, sans-serif'
					}}>Connect your accounts</Typography>
					<img src={GreyIconHelp} style={{ cursor: 'pointer' }} />
				</Box>

				{integrationAccounts.map((item, index) => {
					return <>
						<Box key={index} display="flex" flexDirection="row" my={4} justifyContent="space-between" width={440}>
							<Box display="flex" flexDirection="row">
								<img src={item.icon} height={24} style={{ padding: 4 }} />
								<Typography my={2} sx={{
									fontFamily: 'Inter, sans-serif',
									fontStyle: 'normal',
									fontWeight: 600,
									fontSize: 16,
									paddingLeft: 3,
								}}>{item.name}</Typography>
							</Box>
							<Button variant='contained' sx={{
								alignSelf: "flex-end",
								right: 0,
							}}>CONNECT</Button>
						</Box>
						<Divider sx={{ color: '#1B2B41', width: 440 }} variant="middle" />
					</>
				})}

			</Box>
		</Drawer>
	)
}