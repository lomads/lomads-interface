import { Grid, Box, Typography, Paper, Chip, FormControl, FormLabel } from "@mui/material"
import clsx from "clsx"
import { get as _get } from 'lodash'
import SBT_SVG from 'assets/svg/sbt.svg'
import EDIT_SVG from 'assets/svg/edit.svg'
import { makeStyles } from '@mui/styles';
import TextInput from 'muiComponents/TextInput';
import Switch from "muiComponents/Switch";
import Button from "muiComponents/Button";
import Dropzone from "muiComponents/Dropzone";
import { useEffect, useState } from "react";
import IconButton from "muiComponents/IconButton";
import useContractDeployer, { SBTParams } from "hooks/useContractDeployer"
import { useWeb3React } from "@web3-react/core"
import { SupportedChainId } from "constants/chains"
import axiosHttp from 'api'
import CurrencyInput from "muiComponents/CurrencyInput"
import { useNavigate, useParams } from "react-router-dom"
import XlsxUpload from "muiComponents/XlsxUpload"
import toast from 'react-hot-toast';
import { USDC } from 'constants/tokens';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { beautifyHexToken } from "utils"
import { useAppDispatch, useAppSelector } from "state/hooks"
import { getDao, loadDao } from "state/dashboard/actions"

///   0xD123b939B5022608241b08c41ece044059bE00f5

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
        color: '#FFFFFF'
    },
    paper: {
       width: 400,
       marginTop: 20,
       background: '#FFFFFF',
       padding: '26px 22px 30px !important',
       boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1) !important',
       borderRadius: '5px'
    },
    paperDetails: {
        width: 479,
        height: 108,
        marginTop: 20,
        background: '#FFFFFF',
        padding: '26px 22px 30px !important',
        boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1) !important',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    paperDetailsSocial: {
        width: 393,
        background: '#FFFFFF',
        padding: '26px 22px 30px !important',
        boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1) !important',
        borderRadius: '5px'
    },
    description: {
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: "14px",
        maxWidth: 200,
        lineHeight: "18px",
        letterSpacing: "-0.011em",
        color: "rgba(118, 128, 141, 0.5) !important"
    },
    chip: {
        backgroundColor: 'rgba(118, 128, 141, 0.05) !important',
        width: 110,
        height: 25,
        alignSelf: "flex-end",
        padding: "4px 10px",
        '& .MuiChip-label': {
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '14px',
            color: 'rgba(118, 128, 141, 0.5)'
        }
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
    verLine: {
        border: '1px solid rgba(118, 128, 141, 0.5)',
        height: '35px',
        width: '1px',
        margin: '0 16px'
    },
    horLine: {
        border: "2px solid #EA6447 !important",
        width: 200,
        margin: '32px 0'
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


export default () => {
    const classes = useStyles()

    const { daoURL } = useParams()

    const dispatch = useAppDispatch()

    const { DAO } = useAppSelector(store => store?.dashboard)

    const navigate = useNavigate()

    const { account, provider, chainId } = useWeb3React();

    const [deployContractLoading, setDeployContractLoading] = useState(false)

    const [editMode, setEditMode] = useState(true)
    

    const [errors, setErrors] = useState<any>({})

    const [networkError, setNetworkError] = useState<any>(null)

    const [tokens, setTokens] = useState<any>([])

    useEffect(() => {
        if(!DAO)
            dispatch(getDao(daoURL))
    }, [DAO])

    useEffect(() => {
        if(DAO?.safe) {
            setState((prev: any) => { return { ...prev,
                 treasury: account //DAO?.safe?.address
             }})
        }
    }, [DAO?.safe])
    
    useEffect(() => {
        axiosHttp.get('contract')
        .then(res => {
            if(res.data.length > 0)
                navigate('/')
        })
    }, [])

    const [state, setState] = useState<any>({
        logo: null,
        symbol: null,
        supply: null,
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

    const { deploy, deployLoading } = useContractDeployer(
        chainId === SupportedChainId.GOERLI ? require('abis/SBTDeployer.json') :
        chainId === SupportedChainId.POLYGON ? require('abisPolygon/SBTDeployer.json') : ''
    )
    

    const handleContactChange = (key: string) => {
        setState((prev: any) => {
            return {
                ...prev,
                contact: prev?.contact.indexOf(key) > -1 ? prev.contact.filter((c: string) => c !== key) : [...prev?.contact, key]
            }
        })
    }

    const handleSetPreview = () => {
        let err: any = {}
        setErrors(err)
        if(!state?.symbol || state?.symbol === '')
            err['symbol'] = "Enter valid symbol"
        // if(!state?.supply || state?.supply === '')
        //     err['supply'] = "Enter valid supply"
        if(Object.keys(err).length > 0)
            return setErrors(err)
        console.log(state)
        setEditMode(false)
    }

    const deployContract = async () => {
        try {
            //setDeployContractLoading(true)
            const params: SBTParams = {
                name: `${state?.symbol} SBT`,
                symbol: state?.symbol,
                owner: account,
                payToken: state?.price?.token,
                treasury: state?.treasury,
                mintPrice: `${state?.price?.value}`,
                whitelisted: state?.whitelisted ? 1 : 0,
                members: state?.whitelisted ? state?.whitelist?.members : [],
                discounts: state?.whitelisted ? state?.whitelist?.discounts.map((d:any) => parseFloat(d) * 10) : [],
                inviteCodes: state?.whitelisted ? state?.whitelist?.inviteCodes : []
            }

            const contractAddr = await deploy(params)

            if(contractAddr) {
                const contractJSON = {
                    name: `${state?.symbol} SBT`,
                    token: state.symbol,
                    image: state?.logo,
                    tokenSupply: state?.supply,
                    address: contractAddr,
                    treasury: state?.treasury,
                    mintPrice: `${state?.price?.value}`,
                    mintPriceToken: `${state?.price?.token}`,
                    whitelisted: state?.whitelisted,
                    contactDetail: state.contact,
                    metadata: [],
                    membersList: state?.whitelisted ? _get(DAO, 'members', []).map((m:any) => { return { name: m.member.name, address: m.member.wallet }}) : [],
                    daoId: _get(DAO, '_id', null)
                }
                axiosHttp.post('contract', contractJSON)
                .then(res => {
                    toast.success('SBT Deployed successfully')
                    setTimeout(() => navigate('/'), 200)
                })
                .finally(() =>  setDeployContractLoading(false))
            }
        }
        catch(e) {
            setNetworkError(e)
            setTimeout(() => setNetworkError(null), 3000)
            setDeployContractLoading(false)
        }
    }

    const handleUploadWhitelist = (data: Array<any>) => {
        let members: Array<any> = [], discounts: Array<any>=[], inviteCodes: Array<any> = [];
        let arr:Array<any> = []
        let firstItem: any = {}
        const keys = Object.keys(data[0]);
        console.log(keys)
        Object.keys(data[0]).map((key, i) => {
            firstItem[key]= i == 0 ? parseFloat(key) : key
        })
        arr = [firstItem, ...data]
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            members.push(element[keys[1]])
            discounts.push(element[keys[0]])
            inviteCodes.push(element[keys[2]])
        }
        console.log(members, discounts, inviteCodes)
        setState((prev: any) => { return { ...prev, whitelist: { members, discounts, inviteCodes } } })
    }

    return (
        <Grid container className={classes.root}>
            <Grid item sm={12} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Box mt={6} display="flex" alignItems="center" justifyContent="center">
                    <img src={SBT_SVG}/>
                </Box>
                <Typography sx={{ mt: 2 }} className={classes.title}>Create new Pass Token</Typography>
                {
                    editMode ? 
                    <Paper className={classes.paper}>
                        <TextInput value={state?.symbol}
                            error={errors['symbol']}
                            helperText={errors['symbol']}
                            onChange={(e: any) => {
                                setErrors({})
                                setState((prev: any) => { return { ...prev, symbol: e.target.value } } ) 
                            }}
                        sx={{ my: 1 }} placeholder="LMDS" fullWidth label="Symbol of the Pass Token" />
                        <Box mt={4}>
                            <FormControl fullWidth>
                                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                                    <FormLabel>Pass Token Icon</FormLabel>
                                    <Chip sx={{ mr: 1 }} className={classes.chip} size="small" label="Optional" />
                                </Box>
                                <Typography variant="subtitle2" className={classes.description}>Suggested dimensions and format : 800x800, .svg or .png</Typography>
                            </FormControl>
                            <Box>
                                <Dropzone value={state?.logo} onUpload={(url: string) => {
                                    setState((prev: any) => { return { ...prev, logo: url } } )
                                }}/>
                            </Box>
                        </Box>
                        <TextInput value={state?.supply} type="number"
                        error={errors['supply']}
                        helperText={errors['supply']}
                        onChange={(e: any) => {
                            setErrors({})
                            setState((prev: any) => { return { ...prev, supply: e.target.value } } ) 
                        }}
                        placeholder="Number of existing tokens" sx={{ my: 1 }} fullWidth label="Supply" labelChip={<Chip sx={{ m:1 }} className={classes.chip} label="Optional" size="small" />} />
                        
                        <TextInput value={state?.treasury}
                        error={errors['treasury']}
                        helperText={errors['treasury']}
                        onChange={(e: any) => {
                            setErrors({})
                            setState((prev: any) => { return { ...prev, treasury: e.target.value } } ) 
                        }}
                        placeholder="Treasury address" sx={{ my: 1 }} fullWidth label="Treasury" />

                        <Box my={3} display="flex" flexDirection="row" justifyContent="space-between" mx={1}>
                            <Switch onChange={(e: any) => { setState((prev: any) => { return {
                                 ...prev, 
                                 whitelisted: !prev.whitelisted,
                                 whitelist: prev.whitelisted ? { members: [], discounts: [], inviteCodes: [] } : { members: _get(DAO, 'members', []).map((m:any) => m.member.wallet), discounts: _get(DAO, 'members', []).map((m:any) => 0), inviteCodes: _get(DAO, 'members', []).map((m:any) => "") }
                            } } ) }} checked={state?.whitelisted} label="Whitelisted"/>
                            { false && state?.whitelisted && <XlsxUpload onComplete={handleUploadWhitelist} /> }
                        </Box>
                        {
                            false && state?.whitelisted && state?.whitelist?.members.length > 0 &&
                            <Box>
                                <TableContainer component={Box}>
                                    <Table aria-label="simple table">
                                        <TableBody>
                                            {
                                                state?.whitelist?.members.map((m: any, _i: number) => {
                                                    return (
                                                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                            <TableCell width={100}>{ beautifyHexToken(state?.whitelist?.members[_i]) }</TableCell>
                                                            <TableCell width={40}>{state?.whitelist?.discounts[_i]}%</TableCell>
                                                            <TableCell width={100}>{state?.whitelist?.inviteCodes[_i]}</TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        }
                        <Box my={3} mx={1}>
                            <Switch onChange={(e: any) => { setState((prev: any) => { return { ...prev, priced: !prev.priced } } ) }} checked={state?.priced} label="Priced"/>
                        </Box>
                        {
                            state['priced'] ?
                            <Box my={3}>
                                <CurrencyInput
                                    value={_get(state, 'price.value')} 
                                    onChange={(value: any) => {
                                        setState((prev: any)=> { return { ...prev, price : { ...prev.price, value: value } } })
                                    }} 
                                    options={tokens} 
                                    dropDownvalue={_get(state, 'price.token')} 
                                    onDropDownChange = {(value: string) => {
                                        setState((prev: any)=> { return { ...prev, price : { ...prev.price, token: value } } })
                                    }} 
                                    />
                            </Box> : null
                        }
                        <Button sx={{ mt:2 }} onClick={() => handleSetPreview()} fullWidth size="small" variant='contained'>Next</Button>
                    </Paper> :
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Paper className={classes.paperDetails}>
                            <Box display="flex" flexDirection="row" alignItems="center">
                                { state?.logo ?
                                <img style={{ width: 40, borderRadius: 10, height: 40, objectFit: 'cover' }} src={state?.logo} /> : 
                                state?.symbol && state?.symbol !== "" ?
                                <Box style={{
                                    display:'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 10,
                                    textTransform: 'uppercase',
                                    width: 40, height: 40,
                                    border: '1px solid #76808D',
                                    transform: 'matrix(0.71, -0.71, 0.71, 0.71, 0, 0)'
                                }}>
                                    <div style={{ fontSize: 20, fontWeight: 700, transform: 'rotate(45deg)' }}>{ state?.symbol[0] }</div>
                                </Box> : null
                                }
                                <Typography className={classes.tokenName}>{ state?.symbol }</Typography>
                            </Box>
                            <Box display="flex" flexDirection="row" alignItems="center">
                               { state?.supply && <Typography className={classes.tokenSupply}>{ `X ${ state?.supply }` }</Typography> }
                                <div className={classes.verLine}></div>
                                <IconButton onClick={() => setEditMode(true)}>
                                    <img src={EDIT_SVG} />
                                </IconButton>
                            </Box>
                        </Paper>
                        <Box className={classes.horLine}></Box>
                        <Paper className={classes.paperDetailsSocial}>
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
                        </Paper>
                        <Box width={393} my={3}>
                            <Button sx={{ mt:2 }} onClick={() => deployContract()} disabled={deployContractLoading} loading={deployContractLoading} fullWidth size="small" variant='contained'>Create pass token</Button>
                            {networkError && <Typography my={2} style={{
                                overflow: "hidden", whiteSpace: 'nowrap', textOverflow: "ellipsis",
                             }} textAlign="center" color="error" variant="body2">{ networkError }</Typography> }
                        </Box>
                    </Box>
                }
            </Grid>
        </Grid>
    )
}