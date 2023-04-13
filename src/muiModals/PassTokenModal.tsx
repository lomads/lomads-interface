import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { get as _get } from 'lodash'
import { 
    Drawer, Box, Typography, Paper
 } from '@mui/material';
import IconButton from 'muiComponents/IconButton';
import Button from 'muiComponents/Button';
import Switch from "muiComponents/Switch";
import CurrencyInput from "muiComponents/CurrencyInput"
import CloseSVG from 'assets/svg/close-new.svg'
import MintSBTSvg from 'assets/svg/mintsbt.svg'
import palette from 'muiTheme/palette';
import { makeStyles } from '@mui/styles';
import { useAppSelector } from 'state/hooks';
import { usePrevious } from 'hooks/usePrevious';
import axiosHttp from 'api'
import { useWeb3React } from '@web3-react/core';
import { ethers } from "ethers";
import { SupportedChainId } from 'constants/chains';
import useMintSBT from 'hooks/useMintSBT';
import PT from "assets/images/drawer-icons/PT.svg";
import { useNavigate } from 'react-router-dom';
import { USDC } from 'constants/tokens';
import { CHAIN_INFO } from 'constants/chainInfo';
import { setDAO } from 'state/dashboard/reducer';
import SwitchChain from 'components/SwitchChain';
import { toast } from 'react-hot-toast';

const LOCK_SVG = `<svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2971_2676)">
<path d="M10.76 6.22021H2.12C1.50144 6.22021 1 6.72166 1 7.34022V12.9102C1 13.5288 1.50144 14.0302 2.12 14.0302H10.76C11.3786 14.0302 11.88 13.5288 11.88 12.9102V7.34022C11.88 6.72166 11.3786 6.22021 10.76 6.22021Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.70992 5.94V3.77C9.70992 1.96 8.24992 0.5 6.43992 0.5C4.62992 0.5 3.16992 1.96 3.16992 3.77V6.08" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.43994 10.2798V11.9598" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.4402 10.2002C6.98696 10.2002 7.4302 9.75698 7.4302 9.21021C7.4302 8.66345 6.98696 8.22021 6.4402 8.22021C5.89343 8.22021 5.4502 8.66345 5.4502 9.21021C5.4502 9.75698 5.89343 10.2002 6.4402 10.2002Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_2971_2676">
<rect width="11.88" height="14.53" fill="white" transform="translate(0.5)"/>
</clipPath>
</defs>
</svg>
`


 const useStyles = makeStyles((theme: any) => ({
    root: {
        paddingBottom: 60
    },
    title: {
        fontFamily: 'Inter, sans-serif',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '30px !important',
        lineHeight: '33px !important',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        color: '#76808D'
    },
    paperDetails: {
        height: 108,
        background: '#FFFFFF',
        padding: '26px 10px 30px !important',
        //boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1) !important',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    tokenName: {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '22px !important',
        lineHeight: '25px !important',
        marginLeft: '16px !important',
        color: '#76808D !important'
    },
    tokenSupply: {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '16px !important',
        lineHeight: '25px !important',
        marginLeft: '16px !important',
        color: '#76808D !important'
    },
    paperDetailsSocial: {
        background: '#FFFFFF',
        //padding: '26px 22px 30px !important',
        //boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1) !important',
        borderRadius: '5px'
    },
    socialText: {
        fontStyle: 'italic',
        fontWeight: 400,
        marginTop: '8px !important',
        fontSize: '14px !important',
        lineHeight: '16px !important',
        color: 'rgba(118, 128, 141, 0.5) !important',
    }
}));


export default ({ open, onClose }: { open: boolean , onClose: any} ) => {
    const { account, provider, chainId: currentChainId } = useWeb3React();
    const navigate = useNavigate();
    const classes = useStyles()
    const [chainId, setChainId] = useState<any>(null);
    const [networkError, setNetworkError] = useState<any>(null)
    const {  DAO } = useAppSelector(store => store.dashboard)
    const [contract, setContract] = useState<any>(null);
    const [updateContractLoading, setUpdateContractLoading] = useState<boolean | null>(null)
    const { updateContract, getStats, withdraw } = useMintSBT(_get(contract, 'address', ''), _get(contract, 'version', ''))
    const [tokens, setTokens] = useState<any>([])
    const [state, setState] = useState<any>({
        whitelisted: false,
        whitelist: {
            members: [],
            discounts: [],
            inviteCodes: []
        },
        contact: [],
        priced: false,
        price: {
            token: "0x0000000000000000000000000000000000000000",
            value: 0
        }
    })

    useEffect(() => {
        if(DAO) 
            setChainId(_get(DAO, 'chainId', null))
    }, [DAO])

    useEffect(() => {
        getStats().then(res => console.log("MINT_PRICE", res[5]))
    }, [open])

    useEffect(() => {
        if(contract) {
            setState((prev:any) => {
                return {
                    ...prev,
                    contact: contract?.contactDetail,
                    whitelisted: contract?.whitelisted,
                    priced: contract?.mintPrice && contract?.mintPrice !== "" && parseFloat(contract?.mintPrice) > 0 ? true : false,
                    price: {
                        token : _get(contract,  'mintPriceToken', '0x0000000000000000000000000000000000000000'),
                        value : contract?.mintPrice && contract?.mintPrice !== "" && parseFloat(contract?.mintPrice) > 0 ? parseFloat(contract?.mintPrice) : null
                    }
                }
            })
        }
    }, [contract])

    useEffect(() => {
        if(chainId) {
            setTokens([
                {
                    label: 'ETH',
                    value: "0x0000000000000000000000000000000000000000",
                    decimals: 18
                },
                {
                    label: _get(USDC, `[${chainId}].symbol`),
                    value: _get(USDC, `[${chainId}].address`),
                    decimals: _get(USDC, `[${chainId}].decimals`),
                }
            ])
        }
    }, [chainId])

    useEffect(() => {
        if(DAO?.sbt)
            setContract(DAO?.sbt)
    }, [DAO?.sbt])

    const prevState: any = usePrevious(state)

    const saveChanges = async () => {
        // let calls: Array<any> = []
        // if((state?.price?.token !== prevState?.price?.token) || (state?.price?.value !== prevState?.price?.value)) {
        //     calls.push({
        //         target: contract?.address,
        //         function: "setMintPrice",
        //         args: [ethers.utils.parseEther(state?.price?.value)],
        //     })  
        // }

        if(currentChainId !== _get(DAO, 'chainId', '')) {
            return toast.custom(t => <SwitchChain t={t} nextChainId={_get(DAO, 'chainId', '')}/>)
        }

        try {
            setUpdateContractLoading(true)
            if(contract?.version === "1" && (state?.price?.token !== prevState?.price?.token) || (state?.price?.value !== prevState?.price?.value)) {
                await updateContract(state?.price?.value, state?.price?.token)
            }
            return await axiosHttp.patch(`contract/${contract?.address}`, {
                 daoId: DAO?._id,
                 mintPrice: state?.price?.value,
                 whitelisted: state?.whitelisted,
                 contactDetail: state?.contact
            })
            .then(res => { 
                setDAO(res.data)
                setContract(contract) 
                onClose()
            })
            .finally(() => setUpdateContractLoading(false))
        } catch (e) {
            setUpdateContractLoading(false)
            console.log(e)
            return setNetworkError(e)
        }

    }

    const handleContactChange = (key: string) => {
        setState((prev: any) => {
            return {
                ...prev,
                contact: prev?.contact.indexOf(key) > -1 ? prev.contact.filter((c: string) => c !== key) : [...prev?.contact, key]
            }
        })
    }

    return (
        <Drawer
                PaperProps={{ style: {  borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
                sx={{ zIndex: 99999 }}
                anchor={'right'}
                open={open}
                onClose={() => onClose()}>
                {  DAO ?
                    <>
                <Box sx={{ width: 575, flex: 1, paddingBottom:'80px', borderRadius: '20px 0px 0px 20px' }}>
                    <IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={() => onClose()}>
                        <img src={CloseSVG} />
                    </IconButton>
                    <Box display="flex" flexDirection="column" my={6} alignItems="center">
                        <img src={MintSBTSvg} />
                        <Typography my={4} style={{ color: palette.primary.main, fontSize: '30px', fontWeight: 400 }}>Pass Tokens</Typography>
                    </Box>
                    { !contract ?
                    <Box margin="0 auto" display="flex" flexDirection="column" alignItems="center" width={380}>
                        <Typography style={{
                            color: "#76808d",
                            fontSize: '14px',
                            fontStyle: 'italic',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginTop: '20px',
                            textAlign: 'center',
                            width: '300px'
                        }}>The organisation doesn't have a token yet</Typography>
                        <Button sx={{ mt:3 }} onClick={() => {
                            if(currentChainId !== _get(DAO, 'chainId', '')) {
                                return toast.custom(t => <SwitchChain t={t} nextChainId={_get(DAO, 'chainId', '')}/>)
                            }
                            return navigate(`/${DAO?.url}/create-pass-token`)
                        }} variant='contained' size="small">Configure Pass Token</Button>
                    </Box> :
                    <Box margin="0 auto" width={380}>
                        <Box className={classes.paperDetails}>
                            <Box display="flex" flexDirection="row" alignItems="center">
                                { chainId &&
                                <Box onClick={() => window.open(`${_get(CHAIN_INFO, chainId).explorer}address/${contract.address}`)} style={{ cursor: 'pointer' }}>
                                    { contract?.image ?
                                    <img style={{ width: 40, borderRadius: 10, height: 40, objectFit: 'cover' }} src={contract?.image} /> : 
                                    <img style={{ width: 40, borderRadius: 10, height: 40 }} src={PT} />
                                    }
                                </Box> }
                                <Typography className={classes.tokenName}>{ contract?.token }</Typography>
                                { chainId &&
                                <Box onClick={() => window.open(`${_get(CHAIN_INFO, chainId).explorer}address/${contract.address}`)} style={{ cursor: 'pointer' }}>
                                    <img style={{ width: 20, borderRadius: 10, marginLeft: 8, height: 20 }} src={_get(CHAIN_INFO, chainId).logoUrl} />
                                </Box> }
                            </Box>
                            {/* <Box display="flex" flexDirection="row" alignItems="center">
                               { contract?.tokenSupply && <Typography className={classes.tokenSupply}>{ `X ${ contract?.tokenSupply }` }</Typography> }
                            </Box> */}
                        </Box>
                        <Box my={3} mx={1}>
                            <Typography
                                style={{
                                    color: '#76808d',
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    marginBottom: '10px'
                                }}
                            >Membership policy:</Typography>
                            <Box ml={1}>
                                <Switch
                                disabled
                                checkedSVG={LOCK_SVG}
                                onChange={(e: any) => { setState((prev: any) => { return {
                                    ...prev, 
                                    whitelisted: !prev.whitelisted,
                                    whitelist: { members: [], discounts: [], inviteCodes: [] }
                                } } ) }}
                                checked={state?.whitelisted} label="WHITELISTED"/>
                            </Box>
                        </Box>
                        { contract?.version === "1" &&
                        <Box my={4} mx={1}>
                            <Typography
                                style={{
                                    color: '#76808d',
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    marginBottom: '10px'
                                }}
                            >Price:</Typography>
                            <Box ml={1} display="flex" flexDirection="row" justifyContent="space-between">
                                <Switch
                                onChange={(e: any) => { setState((prev: any) => { return {
                                    ...prev, 
                                    priced: !prev.priced,
                                } } ) }}
                                checked={state?.priced} label=""/>
                                <Box width={300}>
                                    { state?.priced &&
                                    <CurrencyInput
                                        value={_get(state, 'price.value', 0)} 
                                        onChange={(value: any) => {
                                            setState((prev: any)=> { return { ...prev, price : { ...prev.price, value: value } } })
                                        }} 
                                        options={tokens} 
                                        disableSelect
                                        dropDownvalue={_get(state, 'price.token')} 
                                        onDropDownChange = {(value: string) => {
                                            setState((prev: any)=> { return { ...prev, price : { ...prev.price, token: value } } })
                                        }} 
                                    />
                                    }
                                </Box>
                            </Box>
                        </Box> }
                        {/* <Box>
                            <Button onClick={async () => await withdraw()} size="small" variant="contained">Withdraw</Button>
                        </Box> */}
                        <Box style={{ height: 4, width: 200, alignSelf: 'center', margin: '60px auto', backgroundColor: palette.primary.main }}></Box>
                        <Box className={classes.paperDetailsSocial}>
                            <Box>
                                <Typography variant="h6">Contact details</Typography>
                                <Typography variant="body2" className={clsx(classes.socialText, { fontStyle: 'normal !important' })}>Get certain member details could be useful for the smooth functioning of your organisation</Typography>
                                <Box my={3} mx={1}>
                                    <Switch
                                    checked={state?.contact.indexOf('email') > -1}
                                    onChange={() => handleContactChange('email')}
                                    label="Email"/>
                                    <Typography variant="body2" className={classes.socialText}>Get certain member details could be useful for the smooth functioning of your organisation</Typography>
                                </Box>
                                <Box my={3} mx={1}>
                                    <Switch
                                    onChange={() => handleContactChange('discord')}
                                    checked={state?.contact.indexOf('discord') > -1}
                                    label="Discord user-id"/>
                                    <Typography variant="body2" className={classes.socialText}>Please select if you intend to use access-controlled channels in Discord.</Typography>
                                </Box>
                                <Box my={3} mx={1}>
                                    <Switch
                                    onChange={() => handleContactChange('telegram')}
                                    checked={state?.contact.indexOf('telegram') > -1}
                                    label="Telegram user-id"/>
                                    <Typography variant="body2" className={classes.socialText}>Please select if you intend to use access-controlled Telegram groups.</Typography>
                                </Box>
                                <Box my={3} mx={1}>
                                    <Switch
                                    onChange={() => handleContactChange('github')}
                                    checked={state?.contact.indexOf('github') > -1}
                                    label="Github user-id"/>
                                    <Typography variant="body2" className={classes.socialText}>Please select if you intend to use access-controlled github.</Typography>
                                </Box>
                            </Box>
                        </Box>
                        { networkError && <Typography style={{ textAlign: 'center', color: 'red' }}>{ networkError }</Typography> }
                    </Box>
                    }
                </Box>
                { contract &&
                <Box style={{ background: 'linear-gradient(0deg, rgba(255,255,255,1) 70%, rgba(255,255,255,0) 100%)', width: 575, position: 'fixed', bottom: 0, borderRadius: '0px 0px 0px 20px' , padding: "30px 0 20px" }}>
                    <Box display="flex" mt={4} width={380} style={{ margin: '0 auto' }} flexDirection="row">
                        <Button onClick={() => onClose()} sx={{ mr:1 }} fullWidth variant='outlined' size="small">Cancel</Button>
                        <Button disabled={updateContractLoading} loading={updateContractLoading} onClick={() => saveChanges()} sx={{ ml:1 }}  fullWidth variant='contained' size="small">Save</Button>
                    </Box>
                </Box>
                }
                </> : <Box sx={{ width: 575, flex: 1, paddingBottom:'80px', borderRadius: '20px 0px 0px 20px' }}></Box>
                }
            </Drawer>
    )
}