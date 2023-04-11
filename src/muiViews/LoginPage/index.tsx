/* eslint-disable */
import React, { useEffect, useState, useCallback } from "react";
import { KeyboardArrowDown } from '@mui/icons-material';
import { Grid, Typography, Box, MenuItem, Menu, Button } from "@mui/material"
import { get as _get, find as _find, throttle as _throttle, debounce as _debounce } from 'lodash';
import { useLocation, useNavigate } from "react-router-dom";
import LOMADS_LOGO from "../../assets/svg/lomadsfulllogo.svg";
import METAMASK from "../../assets/svg/metamask2.svg";
import { useWeb3React } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import { updateSelectedWallet } from "state/user/reducer";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { injectedConnection, walletConnectConnection } from "connection";
import { getConnection } from "connection/utils";
import { SupportedChainId, SUPPORTED_CHAIN_IDS, CHAIN_IDS_TO_NAMES } from 'constants/chains'
import { CHAIN_INFO } from 'constants/chainInfo';
import { updateConnectionError } from "state/connection/reducer";
import { isChainAllowed, switchChain } from "utils/switchChain";
import { ethers } from "ethers";
import { setUser } from "state/dashboard/reducer";
import Web3Token from 'web3-token';
import axiosHttp from '../../api';
import { getSigner } from 'utils'
import CHEERS from 'assets/svg/cheers.svg'
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({
    root: {
         height: '100vh',
         display: 'flex',
         flexDirection: 'column',
         alignItems: 'center',
         justifyContent: 'center',
         overflow: 'hidden !important'
    },
    logo: {
        width: 138,
        height: 81
    },
    cheers: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyItems: 'center'
    },
    metamaskButton: {
        height: '111px !important',
        cursor: 'pointer',
        alignContent: "inherit",
        background: "#fff",
        borderColor: "#c94b32",
        borderRadius: '10px !important',
        borderWidth: 0,
        filter: "drop-shadow(3px 5px 4px rgba(27,43,65,.05)) drop-shadow(-3px -3px 8px rgba(201,75,50,.1)) !important",
        margin: "10px",
        padding: 40
    },
    select: {
        background: '#FFF',
        borderRadius: '10px !important',
        boxShadow: 'none !important',
        fontSize: '16px !important',
        minWidth: 'inherit !importnt',
        padding: '0px !important'
    }
  }));


export default () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation()
	const from = location?.state?.from;
	const selectedWallet = useAppSelector((state) => state.user.selectedWallet);
	const [checkLoading, setCheckLoading] = useState<boolean>(false)
	const { chainId, connector, account, provider } = useWeb3React();
	const [preferredChain, setPreferredChain] = useState<number>(SupportedChainId?.GOERLI);
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

	console.log('chainId', chainId, connector, account)

	const chainAllowed = chainId && isChainAllowed(connector, chainId) && chainId === +preferredChain;
	console.log("chainAllowed", chainAllowed, chainId);

	useEffect(() => {
		if (chainId) {
			setPreferredChain(chainId ? SUPPORTED_CHAIN_IDS.indexOf(+chainId) > -1 ? +chainId : SupportedChainId?.GOERLI : SupportedChainId?.GOERLI)
		}
	}, [chainId])


	const navigateTo = async () => {
		const activeDao = sessionStorage.getItem('__lmds_active_dao')
	    if(activeDao)
			return `/${activeDao}`
		return "/"
		// const activeDao = sessionStorage.getItem('__lmds_active_dao')
		// if (activeDao)
		// 	return `/${activeDao}`
		// return "/"
		// return axiosHttp.get('dao').then(res => {
		//   if (res.data && res.data.length > 0) {
		//     const activeDao = sessionStorage.getItem('__lmds_active_dao')
		//     if (activeDao)
		//         return `/${activeDao}`
		//     else
		//       return `/${_get(res.data, '[0].url')}`
		//   } else {
		//     sessionStorage.removeItem('__lmds_active_dao')
		//     return "/namedao"
		//   }
		// })
		//   .finally(() => setCheckLoading(false))
	}

	const setLocalToken = (token: string) => {
		return Promise.resolve().then(() => {
			localStorage.setItem('__lmds_web3_token', token);
		});
	}

	const generateToken = useCallback(_throttle(async () => {
		if (!localStorage.getItem('__lmds_web3_token')) {
			if (provider && account) {
				const signer = getSigner(provider, account)
				const token = await Web3Token.sign(async (msg: string) => await signer.signMessage(msg), '365d');
				await setLocalToken(token)
				await axiosHttp.post(`auth/create-account`)
					.then((res: any) => dispatch(setUser(res.data)))
				const nTo = await navigateTo();
				setTimeout(() => navigate(nTo, from ? { state: {
					from
				  } } : undefined), 100);
			}
		} else {
			const nTo = await navigateTo();
			navigate(nTo)
		}
	}, 2000), [account])

	useEffect(() => {
		if (selectedWallet && account && chainAllowed)
			generateToken()
	}, [selectedWallet, account, chainAllowed]);

	const nextLogin = useCallback(async (connector: Connector) => {
		localStorage.removeItem('__lmds_web3_token')
		const connectionType = getConnection(connector).type;
		try {
			dispatch(updateConnectionError({ connectionType, error: undefined }));
			console.log("chainAllowed", chainAllowed)
			if (chainAllowed && !account) {
				await connector.activate()
			} else if (!chainAllowed) {
				switchChain(connector, +preferredChain)
					.then(async () => {
						if (!account)
							await connector.activate()
					})
					.catch(e => { console.log(e) })
			}
			dispatch(updateSelectedWallet({ wallet: connectionType }));
		} catch (error: any) {
			console.debug(`web3-react connection error: ${error}`);
			dispatch(updateConnectionError({ connectionType, error: error.message }));
		}
	}, [chainAllowed, preferredChain]);

	useEffect(() => {
		console.log('window.ethereum', window.ethereum)
	}, [window.ethereum])

	return (
        <>
        <Grid container className={classes.root}>
            <Grid xs={12} item display="flex" flexDirection="column" alignItems="center">
                <Box zIndex={0} position="absolute" bottom={0}>
                    <img src={CHEERS} style={{ marginBottom: '-5px' }} />
                </Box>
                <Box mb={0} mt={3}>
                    <img src={LOMADS_LOGO} />
                </Box>
                <Typography my={1} variant="subtitle1">Hello there !</Typography>
                <Typography mt={2} mb={4} color="primary" variant="h2">Connect Your Wallet</Typography>
                <Button onClick={() => nextLogin(injectedConnection.connector)} className={classes.metamaskButton} variant='contained' color='secondary'>
                    <img src={METAMASK} />
                </Button>
                <Box mt={4} display="flex" flexDirection="row" alignItems="center">
                    <Typography variant='body1' fontWeight="bold" mr={2}>Select Blockchain:</Typography>
                    <Button onClick={() => nextLogin(walletConnectConnection.connector)} aria-controls={open ? 'fade-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined} className={classes.select} variant="contained" color="secondary" disableElevation startIcon={<img style={{ width: 18, height: 18 }} src={CHAIN_INFO[preferredChain].logoUrl}/>} endIcon={<KeyboardArrowDown />}>
                        { CHAIN_INFO[preferredChain].label }
                    </Button>
                    <Menu
                        MenuListProps={{
                        'aria-labelledby': 'fade-button',
                        }}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                        {
                            SUPPORTED_CHAIN_IDS.map((sc: any) => 
                                <MenuItem style={{ textTransform: 'uppercase' }} onClick={() => { handleClose() }}>
                                    <img style={{ marginRight: '8px', width: 18, height: 18 }} src={CHAIN_INFO[sc].logoUrl} />{ CHAIN_INFO[sc].label }</MenuItem>)
                        }
                    </Menu>
                </Box>
                <Box height={200}></Box>
            </Grid>
        </Grid>
    </>
	);
};
