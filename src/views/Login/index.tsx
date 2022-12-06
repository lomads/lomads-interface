import { useCallback, useEffect, useMemo, useState } from 'react'
import { throttle as _throttle, debounce as _debounce, get as _get } from 'lodash'
import { Container, Grid, Typography, Box, Paper, Menu } from "@mui/material"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { makeStyles } from '@mui/styles';
import Button from "components/Button";
import { getSigner } from 'utils'
import CHEERS from 'assets/svg/cheers.svg'
import { Connector } from "@web3-react/types";
import { injectedConnection } from "connection";
import LOMADS_LOGO from 'assets/svg/lomadsfulllogo.svg'
import METAMASK from 'assets/svg/metamask.svg'
import { KeyboardArrowDown } from '@mui/icons-material';
import { useWeb3React } from "@web3-react/core";
import { SUPPORTED_CHAIN_IDS, CHAIN_IDS_TO_NAMES, SupportedChainId } from 'constants/chain';
import { CHAIN_INFO } from 'constants/chainInfo';
import Web3Token from 'web3-token';
import { isChainAllowed, switchChain } from "utils/switchChain";
import { useAppSelector } from 'hooks/useAppSelector';
import toast from 'react-hot-toast';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { setTokenAction } from 'store/actions/session';
import metamaskError from 'utils/metamaskError';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme: any) => ({
    root: {
         height: "100vh",
         maxHeight: 'fit-content',
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
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token } = useAppSelector((store: any) => store.session);
    const { chainId, connector, account, provider } = useWeb3React();
    const [currentChain, setCurrentChain] = useState(SupportedChainId.GOERLI)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const chainAllowed = useMemo(() => {
        if(!chainId) return false;
        return isChainAllowed(connector, chainId)
    }, [connector, chainId])

    useEffect(() => {
        if(chainId) {
            if(chainAllowed)
                setCurrentChain(chainId)
            else
                setCurrentChain(SupportedChainId.GOERLI)
        }
    }, [chainId, chainAllowed])

    useEffect(() => {
        if(token) 
            navigate('/')
    }, [token])

    const generateToken = async () => {
        if (!token) {
            console.log(provider, account)
          if(provider && account){
            const signer = getSigner(provider, account)
            const token = await Web3Token.sign(async (msg: string) => await signer.signMessage(msg), '365d');
            dispatch(setTokenAction(token))
          }
        }
      }

    const handleSwitchNetwork = useCallback(_throttle(async (chain: number) => {
        try {
            if(!account)
                await connector.activate();
            await switchChain(connector, +chain)
        } catch (e) {
            console.error("handleSwitchNetwork", _get(e, 'code', 0))
            toast.error(metamaskError(`${_get(e, 'code', 0)}`))
        }
    }, 1000), [account])

    const handleLogin = useCallback(_debounce(async (connector: Connector) => {
        dispatch(setTokenAction(null))
            console.log("chainAllowed", chainAllowed, connector, account)
            if (!account) 
                await connector.activate();
            if(!chainAllowed) {
                 switchChain(connector, +currentChain)
                .then(() => handleLogin(connector))
            } else if(chainAllowed && account) {
                console.log("chainAllowed account", account)
                await generateToken()
            }
    }, 1000), [chainAllowed, account, chainId, currentChain])

    return (
        <>
            <Grid container className={classes.root}>
                <Grid xs={12} item display="flex" flexDirection="column" alignItems="center">
                    <Box zIndex={0} position="absolute" bottom={0}>
                        <img src={CHEERS} style={{ marginBottom: '-5px' }} />
                    </Box>
                    <Box mb={12} mt={3}>
                        <img src={LOMADS_LOGO} />
                    </Box>
                    <Typography my={1} variant="subtitle1">Hello there !</Typography>
                    <Typography mt={2} mb={4} color="primary" variant="h2">Connect Your Wallet</Typography>
                    <Button onClick={() => handleLogin(injectedConnection.connector)} className={classes.metamaskButton} variant='contained' color='secondary'>
                        <img src={METAMASK} />
                    </Button>
                    <Box mt={4} display="flex" flexDirection="row" alignItems="center">
                        <Typography variant='body1' fontWeight="bold" mr={2}>Select Blockchain:</Typography>
                        <Button onClick={handleClick} aria-controls={open ? 'fade-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined} className={classes.select} variant="contained" color="secondary" disableElevation startIcon={<img style={{ width: 18, height: 18 }} src={CHAIN_INFO[currentChain].logoUrl}/>} endIcon={<KeyboardArrowDown />}>
                            { CHAIN_INFO[currentChain].label }
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
                                SUPPORTED_CHAIN_IDS.map(sc => 
                                    <MenuItem style={{ textTransform: 'uppercase' }} onClick={() => { handleSwitchNetwork(sc); handleClose() }}>
                                        <img style={{ marginRight: '8px', width: 18, height: 18 }} src={CHAIN_INFO[sc].logoUrl} />{ CHAIN_INFO[sc].label }</MenuItem>)
                            }
                        </Menu>
                    </Box>
                    <Box height={200}></Box>
                </Grid>
            </Grid>
        </>
    )
}