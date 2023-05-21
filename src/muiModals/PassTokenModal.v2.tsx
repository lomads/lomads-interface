import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { get as _get, find as _find } from 'lodash';
import { Drawer, Box, Typography, Paper, FormControl, List, ListItem, ListItemText } from '@mui/material';
import { LeapFrog } from '@uiball/loaders';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import IconButton from "muiComponents/IconButton";
import { CHAIN_INFO } from 'constants/chainInfo';
import Button from 'muiComponents/Button';
import axiosHttp from 'api'
import CloseSVG from 'assets/svg/close.svg'
import MintSBTSvg from 'assets/svg/mintsbt.svg'
import TextInput from 'muiComponents/TextInput';
import palette from 'muiTheme/palette';
import CloseIcon from '@mui/icons-material/Close';
import { useWeb3React } from '@web3-react/core';
import toast from 'react-hot-toast';
import Dropzone from "muiComponents/Dropzone";
import { useAppDispatch, useAppSelector } from 'state/hooks';
import Switch from "muiComponents/Switch";
import CurrencyInput from "muiComponents/CurrencyInput"
import XlsxUpload from "muiComponents/XlsxUpload"
import { ethers } from 'ethers';
import { USDC } from 'constants/tokens';
import AddIcon from '@mui/icons-material/Add';
import useBiconomyGasless from 'hooks/useBiconomyGasless';
import SwitchChain from 'components/SwitchChain';
import useMintSBT from 'hooks/useMintSBT.v2';
import { getCurrentUser, getDao } from 'state/dashboard/actions';

const useStyles = makeStyles((theme: any) => ({
    root: {
        paddingBottom: 60,
        // paddingTop: theme.spacing(6)
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
    description: {
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: "14px",
        maxWidth: 200,
        lineHeight: "18px",
        letterSpacing: "-0.011em",
        color: "rgba(118, 128, 141, 0.5) !important"
    },
    subtitle: {
        fontSize: '14px !important',
        fontWeight: '500',
        lineHeight: '19px !important',
        color: 'rgba(27, 43, 65, 0.5)'
    },
    paperDetails: {
        background: '#FFFFFF',
        padding: '26px 22px 8px 0px !important',
        //boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1) !important',
        borderRadius: '5px',
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

export default ({ open, onClose }: {  open: boolean, onClose: Function }) => {
    const classes = useStyles();
    const { chainId } = useWeb3React()
    const dispatch = useAppDispatch()
    const { user, DAO } = useAppSelector(store => store.dashboard)
    //const [showDrawer, setShowDrawer] = useState<boolean>(false)
    const [updateContractLoading, setUpdateContractLoading] = useState<boolean | null>(null)
    const [contract, setContract] = useState<any>(null);
    const [errors, setErrors] = useState<any>({})
    const [networkError, setNetworkError] = useState<any>(null)
    const [members, setMembers] = useState<any>([])
    const [tokens, setTokens] = useState<any>([])
    const [discountPlaceholder, setDiscountPlaceholder] = useState<any>({ code: null, percentage: null })
    const { initBiconomyGasless, gasBalance, fillGas } = useBiconomyGasless(contract?.chainId)
    const [fillGasLoading, setFillGasLoading] = useState<any>(false)
    const [gasDeposit, setGasDeposit] = useState<any>(0)
    const [mintEstimate, setMintEstimate] = useState<any>(null);
    const [fillGasError, setFillGasError] = useState<any>(false)
    const [gaslessConfigLoading, setGaslessConfigLoading] = useState<boolean>(false)
    const [refillPrice, setRefillPrice] = useState<any>({
        token: "0x0000000000000000000000000000000000000000",
        value: 5
    })
    const { updateContract } = useMintSBT(_get(contract, 'address', ''), _get(contract, 'version', ''))
    const [state, setState] = useState<any>({
        symbol: null,
        whitelisted: false,
        whitelist: {
            members: [],
            discounts: [],
            inviteCodes: []
        },
        discountCodes: [],
        contact: [],
        priced: false,
        treasury: "0x0000000000000000000000000000000000000000",
        logo: null,
        gasless: false,
        gasConfig: null,
        price: {
            token: "0x0000000000000000000000000000000000000000",
            value: 0
        }
    })

    useEffect(() => {
        if(!user)
            dispatch(getCurrentUser({}))
    }, [user])

    const handleContactChange = (key: string) => {
        setState((prev: any) => {
            return {
                ...prev,
                contact: prev?.contact.indexOf(key) > -1 ? prev.contact.filter((c: string) => c !== key) : [...prev?.contact, key]
            }
        })
    }

    useEffect(() => {
        if(DAO && DAO.sbt) {
            setContract(DAO?.sbt)
        }
    }, [DAO])

    useEffect(() => {
        if(!mintEstimate && contract && chainId && +contract?.version >= 2) {
            axiosHttp.post(`utility/estimate-mint-gas`, {
                chainId,
                address: contract?.address,
                abi: require('abis/SBT.v2.json')
            })
            .then((res: any) => {
                setMintEstimate(res.data)
            })
        }
    }, [contract, chainId, mintEstimate])

    useEffect(() => {
        if (contract && open) {
            setErrors({})
            setState((prev: any) => {
                return {
                    ...prev,
                    symbol: contract?.token,
                    contact: contract?.contactDetail,
                    logo: contract?.image,
                    gasless: contract?.gasless,
                    gasConfig: contract?.gasConfig,
                    whitelisted: contract?.whitelisted,
                    discountCodes: contract?.discountCodes || [],
                    priced: contract?.mintPrice && contract?.mintPrice !== "" && parseFloat(contract?.mintPrice) > 0 ? true : false,
                    treasury: contract?.mintPrice && contract?.mintPrice !== "" && parseFloat(contract?.mintPrice) > 0 ? contract?.treasury : "0x0000000000000000000000000000000000000000",
                    price: {
                        token: _get(contract, 'mintPriceToken', '0x0000000000000000000000000000000000000000'),
                        value: contract?.mintPrice && contract?.mintPrice !== "" && parseFloat(contract?.mintPrice) > 0 ? parseFloat(contract?.mintPrice) : "0"
                    }
                }
            })
        }
    }, [contract, open])

    useEffect(() => {
        if (contract?.chainId) {
            setTokens([
                {
                    label: CHAIN_INFO[contract?.chainId]?.nativeCurrency?.symbol,
                    value: process.env.REACT_APP_NATIVE_TOKEN_ADDRESS,
                    decimals: CHAIN_INFO[contract?.chainId]?.nativeCurrency?.decimals
                },
                {
                    label: _get(USDC, `[${contract?.chainId}].symbol`),
                    value: _get(USDC, `[${contract?.chainId}].address`),
                    decimals: _get(USDC, `[${contract?.chainId}].decimals`),
                }
            ])
        }
    }, [contract])

    const isAddressValid = (holderAddress: string) => {
		const ENSdomain = holderAddress.slice(-4);
		if (ENSdomain === ".eth") {
			return true;
		} else {
			const isValid: boolean = ethers.utils.isAddress(holderAddress);
			return isValid;
		}
	};

    const handleInsertDiscountCode = async (data: { code: string, percentage: number }) => {
        setErrors({})
        if(data?.code && data?.percentage && data?.code !== "" && data?.percentage !== 0) {
            const exists = _find(state?.discountCodes, c => c.code === data?.code)
            if(!exists) {
                let currNPMembers = [...state?.discountCodes, data];
                setState((prev: any) => { return { ...prev, discountCodes: currNPMembers } })
                setDiscountPlaceholder({ code: "", percentage: "" })
                setErrors({})
            } else {
                setErrors((prev: any) => { return { ...prev, code: 'Code already exists' } })
                setTimeout(() => setErrors({}), 2000)
            }
        } else {
            setErrors((prev: any) => { return { ...prev, code: 'Please enter valid Code/Percentage' } })
            setTimeout(() => setErrors({}), 2000)
        }
    }

    const handleGaslessChange = async (value: boolean) => {
        if(chainId) {
            if(value === true) {
                if(!contract?.gasConfig) {
                    setGaslessConfigLoading(true)
                    try {
                        const response  = await initBiconomyGasless({ dappName: contract?.name, chainId, contract: contract?.address })
                        await axiosHttp.patch(`contract/${contract?.address}`, { gasless: true, gasConfig: response })
                        dispatch(getDao(_get(DAO, 'url')))
                        setGaslessConfigLoading(false)
                    } catch (e) {
                        setGaslessConfigLoading(false)
                    }
                }
            }
            setState((prev:any) => { return { ...prev, gasless: value } })
        }
    }

    const getGasBalance = () => {
        return gasBalance({ apiKey: contract?.gasConfig?.apiKey })
        .then(res => { 
             console.log("GAS_BALANCE", res.data) 
             setGasDeposit(res?.data?.dappGasTankData?.effectiveBalanceInStandardForm || 0)
             return res;
         })
    }

    useEffect(() => {
        if(contract && contract?.gasless && contract?.gasConfig) {
            getGasBalance()
        }
    }, [contract])


    const handleFillGas = async () => {
        try {
            console.log(+refillPrice?.value)
            if(+refillPrice?.value < 5){
                setFillGasError("Minimum Deposit Amount: 5 MATIC")
                setTimeout(() => setFillGasError(null), 3000)
                return;
            }
            setFillGasLoading(true)
            const receipt = await fillGas({ fundingKey: state?.gasConfig?.fundingKey, amount: refillPrice?.value || 0 })
            await getGasBalance()
            setFillGasLoading(false)
        } catch (e) {
            console.log(e)
            setFillGasError(_get(e, 'data.message', ''))
            setTimeout(() => setFillGasError(null), 3000)
            setFillGasLoading(false)
        }
    }


    const handleInsertWallets = async (data: Array<{ name: string, address: string }>) => {
		try {
			let validMembers = [];
			let mem: any = {}
			if (data.length > 0) {
				const noHeader = _find(Object.keys(data[0]), key => isAddressValid(key))
				if (noHeader) {
					Object.keys(data[0]).map((key: any) => {
						if (isAddressValid(key))
							mem.address = key
						else
							mem.name = key
					})
				}
				let newData = data;
				if (Object.keys(mem).length > 0)
					newData = [...newData, mem]
				for (let index = 0; index < newData.length; index++) {
					let preParseMember: any = newData[index];
					let member: any = {}
					Object.keys(preParseMember).map((key: any) => {
						if (isAddressValid(preParseMember[key]))
							member.address = preParseMember[key]
						else
							member.name = preParseMember[key]
					})
                    validMembers.push({ ...member, role: 'role2' });
				}
			}
            console.log("validMembers", validMembers)
            setMembers(validMembers)
		} catch (e) {
            console.log(e)
		}
	}

    const saveChanges = async () => {
        if(!chainId) return;
        try {
            let err = {}
            if (state?.priced && (!state?.treasury || state?.treasury === "0x0000000000000000000000000000000000000000")) {
                err = {
                    ...err,
                    treasury: 'Enter valid wallet'
                }
            }
            if (!state?.logo) {
                err = {
                    ...err,
                    logo: 'Upload valid image'
                }
            }
            if (state?.priced && !state?.price?.value || state?.price?.value === "") {
                err = {
                    ...err,
                    price: 'Enter valid price'
                }
            }
            if (Object.keys(err).length > 0)
                return setErrors(err)
            setUpdateContractLoading(true)
            let res: any = { contactDetail: state?.contact }
            console.log(contract?.whitelisted , state?.whitelisted)
            console.log((contract?.mintPrice && contract?.mintPrice !== "" && parseFloat(contract?.mintPrice) > 0 ? true : false), state?.priced)
            console.log(contract?.mintPriceToken, state?.price?.token)
            console.log(contract?.treasury, "--", state?.treasury)
            if(
                (contract?.whitelisted !== state?.whitelisted) ||
                ((contract?.mintPrice && contract?.mintPrice !== "" && parseFloat(contract?.mintPrice) > 0 ? true : false) !== state?.priced) ||
                (contract?.mintPrice !== `${state?.price?.value ? state?.price?.value : "0"}`) ||
                (contract?.mintPriceToken !== state?.price?.token) ||
                (contract?.treasury !== state?.treasury)
            ) {
                console.log(+contract?.chainId, chainId)
                if(+contract?.chainId !== +chainId) {
                    setUpdateContractLoading(false)
                    console.log("Wrong chain..")
                    return toast.custom(t => <SwitchChain t={t} nextChainId={+contract?.chainId} />)
                }
                res = await updateContract(state?.treasury, state?.price?.value.toString(), state?.price?.token, state.whitelisted)
            }
            await axiosHttp.patch(`contract/${contract?.address}`, { ...res, contactDetail: state?.contact, image:  state?.logo, gasless: state?.gasless, token: state?.symbol, name: `${state?.symbol} SBT`, discountCodes: state?.discountCodes })
                .then(result => {
                    dispatch(getDao(_get(DAO,'url')))
                })
                .finally(() => setUpdateContractLoading(false))
        } catch (e) {
            setUpdateContractLoading(false)
            console.log(e)
            setNetworkError(e)
            setTimeout(() => setNetworkError(null), 3000)
        }
    }

    return (
        <Drawer
        PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
        sx={{ zIndex: 99999 }}
        anchor={'right'}
        open={open}
        onClose={() => onClose()}>
        <Box sx={{ position: 'relative', width: 575, paddingBottom: '60px', borderRadius: '20px 0px 0px 20px' }}>
            { gaslessConfigLoading && <Box style={{ position: 'fixed', display: 'flex', alignItems: 'center', justifyContent: 'center', maxHeight: '100vh', zIndex: 9999999, top: 0, left: 0, bottom: 0, right: 0, backgroundColor: "rgba(255, 255, 255, 0.5)" }}>
                <LeapFrog color='#C94B32' />
            </Box> }
            <IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={() => onClose()}>
                <img src={CloseSVG} />
            </IconButton>
            <Box display="flex" flexDirection="column" my={6} alignItems="center">
                <img src={MintSBTSvg} />
                <Typography my={4} style={{ color: palette.primary.main, fontSize: '30px', fontWeight: 400 }}>Pass Token</Typography>
                <Typography variant='subtitle2' sx={{ px: 12, fontSize: 16 }} textAlign="center" color="rgb(118, 128, 141)"> Launch '<span style={{ fontWeight: '700' }}>Soulbound Tokens</span> (SBTs)' with ease and streamline app permissions (eg. Discord, Notion, Github, and Snapshot). Don't worry, <span style={{ fontWeight: '700' }}>member data is always secure</span> with encryption on SBT.</Typography>
            </Box>
            <Box margin="0 auto" width={350}>
                <Paper elevation={0} className={classes.paperDetails}>
                    <Box display="flex" flexDirection="row" alignItems="center">
                       
                        { chainId && contract && contract?.chainId &&
                        <Box sx={{ mr: 2 }} onClick={() => window.open(`${_get(CHAIN_INFO, chainId).explorer}address/${contract.address}`)} style={{ cursor: 'pointer' }}>
                            <img style={{ width: 24, marginLeft: 8, height: 24, objectFit: 'contain' }} src={_get(CHAIN_INFO, contract?.chainId).logoUrl} />
                        </Box> }
                            
                        {/* <Typography className={classes.tokenName}>{contract?.token}</Typography> */}
                        <TextInput value={state?.symbol}
                            error={errors['symbol']}
                            helperText={errors['symbol']}
                            onChange={(e: any) => {
                                setErrors({})
                                setState((prev: any) => { return { ...prev, symbol: e.target.value } })
                            }}
                            sx={{ my: 1 }} placeholder="LMDS" fullWidth
                        />
                    </Box>
                    {/* <Box display="flex" flexDirection="row" alignItems="center">
                        {contract?.tokenSupply && <Typography className={classes.tokenSupply}>{`X ${contract?.tokenSupply}`}</Typography>}
                    </Box> */}
                </Paper>
                <Box mt={0}>
                        <FormControl fullWidth>
                            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                                {/* <Chip sx={{ mr: 1 }} className={classes.chip} size="small" label="Optional" /> */}
                            </Box>
                        </FormControl>
                        <Box style={{ position: 'relative', width: 200 }}>
                            { state?.logo && contract?.admin === user?._id && <Box onClick={() => setState((prev: any) => { return { ...prev, logo: null } })} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', width: 24, borderRadius: 24, right: 8, top: 8, height: 24, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                                <CloseIcon style={{ fontSize: 12 }}/> 
                            </Box> }
                            <Dropzone
                                disabled={contract?.admin !== user?._id}
                                value={state?.logo}
                                info={false}
                                onUpload={(url: string) => {
                                    setState((prev: any) => { return { ...prev, logo: url } })
                                }}
                            />
                            {
                                errors['logo'] &&
                                <Typography mt={-2} sx={{ color: '#e53935', fontSize: '11px', marginLeft: '14px' }}>{errors['logo']}</Typography>
                            }
                        </Box>
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
                    <Box ml={1} display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                        <Switch
                            disabled={contract?.admin !== user?._id}
                            onChange={(e: any) => {
                                setState((prev: any) => {
                                    return {
                                        ...prev,
                                        whitelisted: !prev.whitelisted,
                                        whitelist: { members: [], discounts: [], inviteCodes: [] }
                                    }
                                })
                            }}
                            checked={state?.whitelisted} label={`WHITELISTED ${members.length > 0 ? "(" + members.length + " members)" : ''}`} />
                        {state?.whitelisted && <XlsxUpload onComplete={handleInsertWallets} />}
                    </Box>
                </Box>
                <Box my={4} mx={1}>
                    <Typography
                        style={{
                            color: '#76808d',
                            fontSize: '16px',
                            fontWeight: 700,
                            marginBottom: '10px'
                        }}
                    >Priced:</Typography>
                    <Box ml={0} display="flex" flexDirection="column" justifyContent="space-between">
                        <Switch
                            disabled={contract?.admin !== user?._id}
                            style={{ marginLeft: 1 }}
                            onChange={(e: any) => {
                                setState((prev: any) => {
                                    return {
                                        ...prev,
                                        priced: !prev.priced,
                                        treasury: !e.target.checked ? "0x0000000000000000000000000000000000000000" : contract?.treasury,
                                        price: {
                                            ...prev.price, 
                                            value: !e.target.checked ? 0 : contract?.mintPrice && contract?.mintPrice !== "" && parseFloat(contract?.mintPrice) > 0 ? parseFloat(contract?.mintPrice) : null
                                        }
                                    }
                                })
                            }}
                            checked={state?.priced} label="" />
                        <Box sx={{ mt: 2 }}>
                            {state?.priced &&
                                <CurrencyInput
                                   disabled={contract?.admin !== user?._id}
                                    value={_get(state, 'price.value')}
                                    onChange={(value: any) => {
                                        setState((prev: any) => { return { ...prev, price: { ...prev.price, value: value } } })
                                    }}
                                    options={tokens}
                                    dropDownvalue={_get(state, 'price.token')}
                                    onDropDownChange={(value: string) => {
                                        setState((prev: any) => { return { ...prev, price: { ...prev.price, token: value } } })
                                    }}
                                />
                            }
                        </Box>
                    </Box>
                    <Box sx={{ mt: 4 }}>
                        {state['priced'] &&
                            <TextInput value={state?.treasury}
                                disabled={contract?.admin !== user?._id}
                                error={errors['treasury']}
                                helperText={errors['treasury']}
                                onChange={(e: any) => {
                                    setState((prev: any) => { return { ...prev, treasury: e.target.value } })
                                }}
                                placeholder="Multi-sig Wallet address" sx={{ my: 1 }} fullWidth label="Multi-sig Wallet" />
                        }
                    </Box>
                 { state?.priced && +state?.price?.value > 0 && 
                    <Box>
                        <Box my={3}>
                            <Typography
                                style={{
                                    color: '#76808d',
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    marginBottom: '10px'
                                }}
                            >Discount codes:</Typography>
                            <Box display="flex" flexDirection="row" alignItems="center">
                                <TextInput value={discountPlaceholder?.code} onChange={(e: any) => setDiscountPlaceholder((prev: any) => { return { ...prev, code: e.target.value } })} placeholder="code" sx={{ mr: 1 }} fullWidth />
                                <TextInput value={discountPlaceholder?.percentage} onChange={(e: any) => setDiscountPlaceholder((prev: any) => { return { ...prev, percentage: +e.target.value } })} inputProps={{ step: 1, min: 0, max: 100, type: 'number' }} placeholder="Percentage" sx={{ mr: 1 }} fullWidth />
                                <IconButton onClick={() => handleInsertDiscountCode(discountPlaceholder)} sx={{ height: '52px !important', width: '52px !important' }}>
                                    <AddIcon color="primary" />
                                </IconButton>
                            </Box>
                            {errors['code'] && <Typography style={{
                                marginTop: 8,
                                whiteSpace: 'nowrap',
                                width: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }} color="red">{ errors['code'] }</Typography> }
                        </Box>
                        { +contract?.version >= 1 && state?.discountCodes && state?.discountCodes.length > 0 && 
                        <Box>
                            <List sx={{ maxHeight: 300, overflowY: 'auto', backgroundColor: '#EEE', borderRadius: 2 }} dense>
                            {
                                    state?.discountCodes?.map((discount: any) => {
                                        return (
                                            <ListItem
                                            secondaryAction={<Box onClick={() => {
                                                setState((prev: any) => {
                                                    return {
                                                        ...prev,
                                                        discountCodes: prev?.discountCodes?.filter((m:any) => m?.code !== discount?.code)
                                                    }
                                                })
                                            }} sx={{ cursor: 'pointer' }}><CloseIcon/></Box>}
                                            >
                                                <ListItemText sx={{ width: 250, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} primary={discount.code} />
                                                <ListItemText sx={{ width: 250, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} primary={`${discount.percentage}%`} />
                                            </ListItem>
                                        )
                                    })
                            }
                            </List>
                        </Box> }
                     </Box>
                    }
                </Box>
                { +contract?.version >= 2 &&
                <Box my={4} mx={1}>
                    <Typography
                        style={{
                            color: '#76808d',
                            fontSize: '16px',
                            fontWeight: 700,
                            marginBottom: '10px'
                        }}
                    >Gasless:</Typography>
                    <Box ml={1} display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                        <Switch
                            onChange={(e: any) => handleGaslessChange(e.target.checked) }
                            checked={state?.gasless} label="" />
                        { mintEstimate && <Typography sx={{  }} style={{ fontSize: 11 }}>{ `${ mintEstimate ? "Estimated gas price ~" + (+mintEstimate).toFixed(4) + " " +  CHAIN_INFO[contract?.chainId]?.nativeCurrency?.symbol : '' }` }</Typography> }
                    </Box>
                    { state?.gasless && state?.gasConfig &&
                    <Box my={4}>
                    <Typography
                        style={{
                            color: '#76808d',
                            fontSize: '16px',
                            fontWeight: 700,
                            marginBottom: '10px'
                        }}
                        >Gas Balance:</Typography>
                        <Typography>{ parseFloat(gasDeposit).toFixed(4) } MATIC</Typography>
                    </Box>
                    }
                    { state?.gasless && state?.gasConfig &&
                    <Box my={4}>
                    <Typography
                        style={{
                            color: '#76808d',
                            fontSize: '16px',
                            fontWeight: 700,
                            marginBottom: '10px'
                        }}
                        >Deposit Amount</Typography>
                      <CurrencyInput
                            disableCurrency
                            value={_get(refillPrice, 'value')}
                            onChange={(value: any) => {
                                setRefillPrice((prev: any) => { return { ...prev.price, value: value  } })
                            }}
                            options={tokens}
                            dropDownvalue={_get(refillPrice, 'token')}
                            onDropDownChange={(value: string) => {
                                setRefillPrice((prev: any) => { return { ...prev.price, token: value  } })
                            }}
                        />
                        <Typography sx={{ mt: 2, mb: 1, opacity: 0.6 }}>Minimum Deposit Amount: 5 MATIC</Typography>
                        <Button sx={{ mt: 1 }} onClick={() => handleFillGas()} disabled={fillGasLoading} loading={fillGasLoading} variant="outlined" size="small">Fill gas</Button>
                        {fillGasError && <Typography style={{
                            marginTop: 8,
                            whiteSpace: 'nowrap',
                            width: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }} color="red">{ fillGasError }</Typography> }
                    </Box>
                    }
                </Box> }
                <Box style={{ height: 4, width: 200, alignSelf: 'center', margin: '60px auto', backgroundColor: palette.primary.main }}></Box>
                <Box className={classes.paperDetailsSocial}>
                    <Box>
                        <Typography variant="h6">Contact details</Typography>
                        <Typography variant="body2" className={clsx(classes.socialText, { fontStyle: 'normal !important' })}>Get certain member details could be useful for the smooth functioning of your organisation</Typography>
                        <Box my={3} mx={1}>
                            <Switch
                                checked={state?.contact.indexOf('email') > -1}
                                onChange={() => handleContactChange('email')}
                                label="Email" />
                            <Typography variant="body2" className={classes.socialText}>Please select if you intend to use services such as Notion, Google Workspace and Github</Typography>
                        </Box>
                        <Box my={3} mx={1}>
                            <Switch
                                onChange={() => handleContactChange('discord')}
                                checked={state?.contact.indexOf('discord') > -1}
                                label="Discord user-id" />
                            <Typography variant="body2" className={classes.socialText}>Please select if you intend to use access-controlled channels in Discord.</Typography>
                        </Box>
                        <Box my={3} mx={1}>
                            <Switch
                                onChange={() => handleContactChange('telegram')}
                                checked={state?.contact.indexOf('telegram') > -1}
                                label="Telegram user-id" />
                            <Typography variant="body2" className={classes.socialText}>Please select if you intend to use access-controlled Telegram groups.</Typography>
                        </Box>
                        <Box my={3} mx={1}>
                            <Switch
                                onChange={() => handleContactChange('github')}
                                checked={state?.contact.indexOf('github') > -1}
                                label="Github user-id" />
                            <Typography variant="body2" className={classes.socialText}>Please select if you intend to use access-controlled github.</Typography>
                        </Box>
                        {
                                contract?.contactDetail?.filter((c:string) => ['email', 'discord', 'telegram', 'github'].indexOf(c) === -1).map((item:any, index:number) => (
                                    <Box my={3} mx={1} key={index}>
                                        <Switch
                                            onChange={() => handleContactChange(item)}
                                            checked={state?.contact.indexOf(item) > -1}
                                            label={`${item}`}
                                        />
                                        <Typography variant="body2" className={classes.socialText}>{`Please select if you intend to use ${item}`}</Typography>
                                    </Box>
                                ))
                        }
                    </Box>
                </Box>
                <Box display="flex" mt={4} flexDirection="row">
                    <Button onClick={() => onClose()} sx={{ mr: 1 }} fullWidth variant='outlined' size="small">Cancel</Button>
                    <Button disabled={updateContractLoading} loading={updateContractLoading} onClick={() => saveChanges()} sx={{ ml: 1 }} fullWidth variant='contained' size="small">Save</Button>
                </Box>
                {networkError && <Typography style={{ textAlign: 'center', color: 'red' }}>{networkError}</Typography>}
            </Box>
        </Box>
    </Drawer>
    )
}