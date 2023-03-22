import React, { useEffect } from "react";
import lomadslogodark from "../../assets/svg/lomadslogodark.svg";
import GroupEnjoy from "../../assets/svg/GroupEnjoy.svg";
import { colors } from "assets/colors";
import { Colorstype } from "types/UItype";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "state/hooks";
import { loadDao } from 'state/dashboard/actions';
import { useWeb3React } from "@web3-react/core";
import { Box, Typography } from "@mui/material"
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({
	DAOsuccess: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		height: '100vh',
		textAlign: 'center'
	},
	itemsGroup: {
		marginTop: '2%',
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column'
	},
	congrats: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: '400',
		fontSize: '22px',
		lineHeight: '25px',
		textAlign: 'center',
		letterSpacing: '-0.011em',
		color: '#76808D',
		margin: '133px 0px 13.5px 0px'
	},
	header: {
		fontFamily: 'Insignia',
		fontStyle: 'normal',
		fontWeight: '400',
		fontSize: '35px',
		lineHeight: '35px',
		paddingBottom: '13px',
		textAlign: 'center',
		color: '#C94B32'
	},
	redirectText: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'italic',
		fontWeight: '400',
		fontSize: '16px',
		lineHeight: '25px',
		textAlign: 'center',
		letterSpacing: '-0.011em',
		color: '#76808D',
		textDecoration: 'underline',
		cursor: 'pointer'
	},
	colors: {
		height: '1vw',
		width: '2.5vw',
		backgroundColor: 'aqua',
		borderRadius: '30px',
		position: 'absolute',
		top: '0',
		right: '0'
	}
}));

export default () => {
	const { chainId } = useWeb3React();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const classes = useStyles()
	const [searchParams, setSearchParams] = useSearchParams();
	const { DAOList } = useAppSelector((state) => state.dashboard);

	useEffect(() => {
		if(chainId)
			dispatch(loadDao({chainId}))
	}, [chainId])

	const handleClick = async () => {
		const dao = searchParams.get("dao")
		navigate(`/${dao}`);
	};

	useEffect(() => {
		setTimeout(() => {
			const dao = searchParams.get("dao")
			navigate(`/${dao}`);
		}, 3000);
	}, []);

	return (
		<>
			<Box className={classes.DAOsuccess}>
				<Box className={classes.itemsGroup}>
					<Box sx={{marginLeft: '110px'}}>
						<img src={lomadslogodark} alt="logo" />
					</Box>
					<Typography className={classes.congrats}>Well done!</Typography>
					<Typography className={classes.header}>Your DAO is live</Typography>
					<Box className={classes.redirectText} onClick={handleClick}>
						you will be redirected to the dashboard in a few seconds
					</Box>
					<img src={GroupEnjoy} alt="Congrats" className="groupenjoy" />
				</Box>
				<img src={GroupEnjoy} alt="Congrats" className="groupenjoy" />

				{colors.map((result: Colorstype) => {
					return (
						<Box
							className={classes.colors}
							sx={{
								backgroundColor: result.backgroudColor,
								left: result.left,
								right: result.right,
								top: result.top,
								bottom: result.bottom,
								transform: result.transform,
							}}
						></Box>
					);
				})}
			</Box>
		</>
	);
};
