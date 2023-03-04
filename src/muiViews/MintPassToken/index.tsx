import React from 'react'
import { Grid, Box, Typography, Paper, Chip, FormControl, FormLabel } from "@mui/material"
import clsx from "clsx"
import { get as _get } from 'lodash'
import SETTINGS_SVG from 'assets/svg/settings.svg'
import LINK_SVG from 'assets/svg/ico-link.svg'
import { makeStyles } from '@mui/styles';
import TextInput from 'muiComponents/TextInput';
import Switch from "components/Switch";
import Drawer from '@mui/material/Drawer';
import Button from "muiComponents/Button";
import Dropzone from "muiComponents/Dropzone";
import { useCallback, useEffect, useState } from "react";
import IconButton from "muiComponents/IconButton";
import useContractDeployer, { SBTParams } from "hooks/useContractDeployer"
import { useWeb3React } from "@web3-react/core"
import { SupportedChainId, SUPPORTED_ASSETS } from "constants/chains"
import axiosHttp from 'api'
import MintSBTSvg from '../../assets/svg/mintsbt.svg'
import DiscordSVG from '../../assets/svg/discord.svg'
import GithubSVG from '../../assets/svg/githubicon.svg'
import ArrowRightSVG from '../../assets/svg/arrowright.svg'
import BackArrowSVG from '../../assets/svg/back-arrow.svg'
import EmailSVG from '../../assets/svg/email.svg'
import TelegramSVG from '../../assets/svg/telegram.svg'
import PaymentSVG from '../../assets/svg/payment.svg'
import CloseSVG from '../../assets/svg/close.svg'
import { useNavigate, useParams } from "react-router-dom"
import useMintSBT from "hooks/useMintSBT"
import FullScreenLoader from "muiComponents/FullScreenLoader"
import palette from "muiTheme/palette"
import toast from 'react-hot-toast';
import axios from "axios"
import { ethers } from "ethers";
import { useSelector } from "react-redux"
import { FormHelperText } from '@mui/material';
import useDCAuth from "hooks/useDCAuth"
import { usePrevious } from "hooks/usePrevious"
import { beautifyHexToken } from "utils"
import { useAppDispatch, useAppSelector } from "state/hooks"
import { addDaoMember, getCurrentUser, getDao, updateCurrentUser } from "state/dashboard/actions"
import { Container } from "@mui/system"
import useEncryptDecrypt from "hooks/useEncryptDecrypt";
import useRole from "hooks/useRole"


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
        color: theme.palette.primary.main
    }
}));


export default () => {
    const { account, provider, chainId } = useWeb3React();
    const navigate = useNavigate()
    const { daoURL } = useParams()
    const classes = useStyles()
    const dispatch = useAppDispatch()
    const { user } = useSelector((store:any) => store.dashboard)
    const { DAO } = useAppSelector(store => store.dashboard)
    const { myRole } = useRole(DAO, account)
    const { contractId = undefined } = useParams()
    const [contractLoading, setContractLoading] = useState<boolean|null>(null)
    const [mintLoading, setMintLoading] = useState<boolean|null>(null)
    const [networkError, setNetworkError] = useState<any>(null)
    const [contract, setContract] = useState<any>(null)
    const [showDrawer, setShowDrawer] = useState<boolean>(false)
    const [errors, setErrors] = useState<any>({})
    const [balance, setBalance] = useState<any>(0)
    const [metadata, setMetadata] = useState<any>(null)
    const [discountCheckLoading, setDiscountCheckLoading] = useState<boolean|null>(null)
    const [state, setState] = useState<any>({
        referralCode: "",
        name: "",
        email: null,
        discord: null,
        telegram: null,
        github: null
    })
    const [price, setPrice] = useState<any>({})
    const [hasClickedAuth, setHasClickedAuth] = useState<any>(false)
    const { mint, estimateGas, getStats, checkDiscount } = useMintSBT(contractId)
    const { onOpen, onResetAuth, authorization, isAuthenticating } = useDCAuth("identify")
    const { encryptMessage, decryptMessage } = useEncryptDecrypt()

    useEffect(() => {
        if(!DAO)
            dispatch(getDao(daoURL))
    }, [DAO])

    useEffect(() => {
        if(DAO?.sbt) {
            setContract(DAO?.sbt)
            setPrice((prev:any) => { return { ...prev, mintPrice: _get(DAO?.sbt, 'mintPrice', 0) } })
        }
    }, [DAO?.sbt])

    useEffect(() => setErrors({}), [state])


    const getDiscordUser = useCallback(async () => {
        if(authorization) {
            return axios.get('https://discord.com/api/users/@me', { headers: { "Authorization": authorization } })
            .then(res => res.data)
            .catch(e => {
                if(e.response.status === 401){
                    setHasClickedAuth(true)
                    onResetAuth()
                    setTimeout(() => onOpen(), 1000) 
                }
                return null;
            })
        }
    }, [authorization, onOpen])

    const prevAuth = usePrevious(authorization)

    useEffect(() => {
        if(( (prevAuth == undefined && authorization) || ( prevAuth && authorization && prevAuth !== authorization ) ) && hasClickedAuth) {
            handleDiscord() 
        }
    }, [prevAuth, authorization, hasClickedAuth])

    const handleDiscord = async () => {
        onResetAuth()
        console.log("authorization")
        setHasClickedAuth(true)
        if(!authorization) 
            return onOpen()
        const discordUser = await getDiscordUser();
        if(discordUser) {
            setState((prev: any) => {
                return {
                    ...prev,
                    discord: _get(discordUser, 'username')
                }
            })
        }
        setHasClickedAuth(false)
    }

    useEffect(() => {
        if(user) {
            setState((prev:any) => {
                return {
                    ...prev,
                    name: _get(user, 'name', '')
                }
            })
        } else {
            dispatch(getCurrentUser({}))
        }
    }, [user])

    // useEffect(() => {
    //     setContractLoading(true)
    //     axiosHttp.get(`contract/${contractId}`)
    //     .then(res => setContract(res.data))
    //     .finally(() => setContractLoading(false))
    // }, [contractId])

    useEffect(() => {
        const calculatePriceAndGasFees = async () => {
            try {
                if (contract?.mintPrice && chainId) {
                    console.log("://api.coingecko.com/api/v3/coins", contract.mintPrice)
                    const request = await axios.get(
                    `https://api.coingecko.com/api/v3/coins/${SUPPORTED_ASSETS[`${chainId}`].id}`
                    );
                    const price = await request.data.market_data?.current_price["usd"];
                    const mintPriceinUsd = parseFloat(contract?.mintPrice) * price;
        
                    setPrice({
                        mintPrice: _get(contract, 'mintPrice', '0'),
                        mintPriceinUsd: mintPriceinUsd.toString()
                    })
                    
                    

                    const estimateTransactionCost = await estimateGas(
                    ethers.utils.parseUnits(contract?.mintPrice, ).toString(),
                    state?.referralCode
                    );
            
                    const estimateinUsd =
                    parseFloat(
                        ethers.utils.formatUnits(estimateTransactionCost.toString(), "gwei")
                    ) * price;
            
            
                    setPrice({
                        mintPrice: _get(contract, 'mintPrice', '0'),
                        mintPriceinUsd: mintPriceinUsd.toString(),
                        estimateinUsd: estimateinUsd.toString(),
                        gas: ethers.utils.formatUnits(estimateTransactionCost.toString(), "gwei")
                    })
                }
            } catch (e) {
                setNetworkError(e)
                setTimeout(() => setNetworkError(null), 2000)
            }
        };
    
        calculatePriceAndGasFees();
      }, [chainId, account, contract?.mintPrice]);
    
    if(!contract || contractLoading || balance == null)
        return <FullScreenLoader/>

    const handleMint = async () => {
        let err: any = {}
        setErrors({})
        if(state?.name == null || state?.name == "") { err['name'] = 'Enter valid name' }
        if(contract?.contactDetail.indexOf('email') > -1 && ( state?.email == null || state?.email == "")) { err['email'] = 'Enter valid email' }
        if(contract?.contactDetail.indexOf('discord') > -1 && ( state?.discord == null || state?.discord == "")) { err['discord'] = 'Enter valid discord' }
        if(contract?.contactDetail.indexOf('github') > -1 && ( state?.github == null || state?.github == "")) { err['github'] = 'Enter valid github' }
        if(contract?.contactDetail.indexOf('telegram') > -1 && ( state?.telegram == null || state?.telegram == "")) { err['telegram'] = 'Enter valid telegram' }
        if(Object.keys(err).length > 0)
            return setErrors(err)
        setMintLoading(true)
        const msg = await encryptMessage(JSON.stringify({ email: _get(state, 'email', ''), discord: _get(state, 'discord', ''), telegram: _get(state, 'telegram', ''), github: _get(state, 'github', '') }))
        try {
            const token = await mint({ referralCode: state?.referralCode, mintPrice: price?.mintPrice })
            const metadataJSON = {
                id: token,
                description: `${contract?.symbol} SBT TOKEN`,
                daoUrl: DAO?.url,
                name: state?.name,
                image: contract?.image,
                attributes: [
                  {
                    trait_type: "Wallet Address/ENS Domain",
                    value: account,
                  },
                  {
                    trait_type: "Discount Code",
                    value: state?.referralCode
                  },
                  {
                    trait_type: "Price",
                    value: price?.mintPrice
                  },
                  {
                    trait_type: "Personal Details",
                    value: msg
                  },
                  {
                    trait_type: "Email",
                    value: contract?.contactDetail.indexOf('email') > -1 && state?.email && state?.email.length > 0 ? true : null
                  },
                  {
                    trait_type: "Discord",
                    value: contract?.contactDetail.indexOf('discord') > -1 && state?.discord && state?.discord.length > 0 ? true : null
                  },
                  {
                    trait_type: "Telegram",
                    value: contract?.contactDetail.indexOf('telegram') > -1 && state?.telegram && state?.telegram.length > 0 ? true : null
                  },
                  {
                    trait_type: "Github",
                    value: contract?.contactDetail.indexOf('github') > -1 && state?.github && state?.github.length > 0 ? true : null
                  },
                ],
                contract: contract?.address,
              };
                await axiosHttp.post(`metadata/${metadataJSON.contract}`, metadataJSON);
                await axiosHttp.patch(`dao/${_get(DAO, 'url', '')}/update-user-discord`, {
                    discordId: state?.discord || null,
                    userId: _get(user, '_id', ''),
                    daoId: _get(DAO, '_id')
                })
                dispatch(updateCurrentUser({ name: state?.name }))
                dispatch(addDaoMember({ url: DAO?.url, payload: { name: '', address: account, role: myRole ? myRole : 'role4' } }))
                dispatch(getDao(DAO?.url));
                setMintLoading(false)
                window.location.href = `/${DAO.url}`
                return;
        } catch (e) {
            setNetworkError(e)
            setTimeout(() => setNetworkError(null), 3000)
            setMintLoading(false)
        }
    }


    const handleApplyDiscount = async () => {
        setDiscountCheckLoading(true)
        try {
            const value = await checkDiscount(state?.referralCode)
            setPrice((prev:any) => { return { ...prev, mintPrice: value } })
            setDiscountCheckLoading(null)
        } catch(e) {
            setDiscountCheckLoading(null)
            console.log(e)
        }
    }


    return (
        <Container>
            <Grid container className={classes.root}>
                <Grid item sm={12} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <Box mt={8} display="flex" alignItems="center" justifyContent="center">
                        <img src={MintSBTSvg}/>
                    </Box>
                    <Typography sx={{ mt: 2 }} className={classes.title}>{ balance === 1 && contract && metadata ? contract.token : 'Mint your SBT' }</Typography>
                    <Box mt={12} style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                        <Box onClick={() => navigate(-1)} height={77} width={50} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' }}>
                            <img src={BackArrowSVG} />
                        </Box>
                        <Grid ml={1} container>
                            <Grid item xs={12} sm={6}>
                                <img src={_get(contract, 'image')} style={{ objectFit: 'cover', width: 530, height: 530, borderRadius: 5 }} />
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <Box mx={2} py={4} px={3} style={{ borderRadius: 5, display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', height: 50, backgroundColor: '#FFF'  }}>
                                    <Typography style={{ fontSize: 26, fontWeight: 700 }}>{ _get(contract, 'name') }</Typography>
                                    { balance === 1 && metadata && <Typography style={{ fontSize: 26, marginLeft: 16, fontWeight: 700 }}>#{ metadata?.id }</Typography> }
                                    {/* <Box>
                                        <IconButton onClick={() => {
                                            navigator.clipboard.writeText(`${process.env.REACT_APP_URL}/mint/${_get(contract, 'address', '')}`);
                                            toast.success('Copied to clipboard')
                                        }} style={{ marginRight: 12 }}>
                                            <img src={LINK_SVG} />
                                        </IconButton>
                                        <IconButton style={{ marginleft: 12 }}>
                                            <img src={SETTINGS_SVG} />
                                        </IconButton>
                                    </Box> */}
                                </Box>
                                { balance === 0 ?
                                <Box mx={2} mt={0.5} px={3} style={{ borderRadius: 5, width: '100%', backgroundColor: '#FFF'  }}>
                                    <Box py={2} style={{  display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Typography style={{ fontSize: 16, fontWeight: 700 }}>
                                            Price
                                        </Typography>
                                        <Box mx={2} mt={1} style={{ flexGrow: 1, borderBottom: '1px dotted rgba(27, 43, 65, 0.2)' }}></Box>
                                        <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: 14, fontWeight: 400, color: "#76808D" }}>${ parseFloat(_get(price, 'mintPriceinUsd', 0)).toFixed(2) } /</Typography>
                                            <Typography ml={2} style={{ fontSize: 16, fontWeight: 700, }}>{ parseFloat(_get(price, 'mintPrice', 0)).toFixed(5) } ETH</Typography>
                                        </Box>
                                    </Box>
                                    <Box py={2} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Typography style={{ fontSize: 16, fontWeight: 700 }}>
                                            Gas Fees
                                        </Typography>
                                        <Box mx={2} mt={1} style={{ flexGrow: 1, borderBottom: '1px dotted rgba(27, 43, 65, 0.2)' }}>

                                        </Box>
                                        <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: 14, fontWeight: 400, color: "#76808D" }}>${ parseFloat(_get(price, 'estimateinUsd', 0)).toFixed(2)} /</Typography>
                                            <Typography ml={2} style={{ fontSize: 16, fontWeight: 700, }}>{ parseFloat(_get(price, 'gas', 0)).toFixed(5) } ETH</Typography>
                                        </Box>
                                    </Box>
                                    {/* <Box py={2} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Typography style={{ fontSize: 16, fontWeight: 700 }}>
                                            Processing Fees
                                        </Typography>
                                        <Box mx={2} mt={1} style={{ flexGrow: 1, borderBottom: '1px dotted rgba(27, 43, 65, 0.2)' }}>

                                        </Box>
                                        <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: 14, fontWeight: 400, color: "#76808D" }}>$4.731 /</Typography>
                                            <Typography ml={2} style={{ fontSize: 16, fontWeight: 700, }}>2 MATIC</Typography>
                                        </Box>
                                    </Box> */}
                                    <Box py={2} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Typography style={{ fontSize: 16, fontWeight: 700 }}>
                                            Total
                                        </Typography>
                                        <Box mx={2} mt={1} style={{ flexGrow: 1, borderBottom: '1px dotted red' }}>

                                        </Box>
                                        <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: 14, fontWeight: 400, color: "#76808D" }}>${ (parseFloat(_get(price, 'mintPriceinUsd', 0)) + parseFloat(_get(price, 'estimateinUsd', 0))).toFixed(2) } /</Typography>
                                            <Typography ml={2} style={{ fontSize: 16, fontWeight: 700, }}>{ (parseFloat(_get(price, 'mintPrice', 0)) + parseFloat(_get(price, 'gas', 0))).toFixed(5) } ETH</Typography>
                                        </Box>
                                    </Box>
                                    { balance == 0 &&
                                    <Box mt={2} display="flex" flexDirection="row" alignItems="center">
                                    <TextInput 
                                        value={state["referralCode"]}
                                        error={errors['referralCode']}
                                        helperText={errors['referralCode']}
                                        onChange={(e: any) => setState((prev: any) => { return { ...prev, referralCode: e.target.value } } )}
                                        placeholder="Go Gondor" sx={{ my: 1 }} fullWidth label="Discount code" />
                                        <Button loading={discountCheckLoading} disabled={ !state?.referralCode || state?.referralCode === "" || discountCheckLoading} onClick={() => handleApplyDiscount()} style={{ marginLeft: 16, marginTop: 22 }} size="small" variant="outlined">Apply</Button>
                                    </Box> }
                                    { balance == 0 &&
                                        <Button onClick={() => setShowDrawer(true)} style={{ margin: '32px 0 16px 0' }} variant="contained" fullWidth>MINT YOUR SBT</Button>
                                    }
                                  {networkError && <Typography my={2} textAlign="center" color="error" variant="body2">{ networkError }</Typography> }
                                </Box> : 
                                <Box mx={2} mt={0.5} px={3} style={{ borderRadius: 5, width: '100%', backgroundColor: '#FFF'  }}>
                                    {
                                        metadata && metadata?.attributes.map((attribute: any) => {
                                            return (
                                                <Box py={2} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                    <Typography style={{ fontSize: 14, fontWeight: 400 }}>{ attribute?.trait_type }</Typography>
                                                    <Box mx={2} mt={1} style={{ flexGrow: 1 }}>
                
                                                    </Box>
                                                    <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                        <Typography style={{ fontSize: 14, fontWeight: 400, color: "#76808D" }}>{ 
                                                            attribute?.trait_type === 'Wallet Address/ENS Domain' ?
                                                            beautifyHexToken(attribute?.value) :
                                                            attribute?.value
                                                        }</Typography>
                                                    </Box>
                                                </Box>
                                            )
                                        })
                                    }
                                </Box>
                                }
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Drawer
                    PaperProps={{ style: {  borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
                    sx={{ zIndex: 99999 }}
                    anchor={'right'}
                    open={showDrawer}
                    onClose={() => setShowDrawer(false)}>
                    <Box sx={{ width: 575, paddingBottom:'60px', borderRadius: '20px 0px 0px 20px' }}>
                        <IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={() => setShowDrawer(false)}>
                            <img src={CloseSVG} />
                        </IconButton>
                        <Box display="flex" flexDirection="column" my={6} alignItems="center">
                            <img src={PaymentSVG} />
                            <Typography my={4} style={{ color: palette.primary.main, fontSize: '30px', fontWeight: 400 }}>Paiement</Typography>
                        </Box>
                        <Box px={12}>
                            <TextInput 
                                value={state["name"]}
                                error={errors['name']}
                                helperText={errors['name']}
                                onChange={(e: any) => setState((prev: any) => { return { ...prev, name: e.target.value } } )}
                                placeholder="Aragron" sx={{ my: 1 }} fullWidth label="Name" />
                            {/* <TextInput 
                                value={state["referralCode"]}
                                error={errors['referralCode']}
                                helperText={errors['referralCode']}
                                onChange={(e: any) => setState((prev: any) => { return { ...prev, referralCode: e.target.value } } )}
                                placeholder="Go Gondor" sx={{ my: 1 }} fullWidth label="Invite code" /> */}
                            <Box mt={4}>
                                <Typography style={{ fontWeight: 700, fontSize: 16 }}>Contact details</Typography>
                                {
                                    contract?.contactDetail.indexOf('email') > -1 &&
                                    <Box my={1} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                                        <img style={{ width: 36, marginRight: 12 }} src={EmailSVG} />
                                        <TextInput 
                                            value={state["email"]}
                                            error={errors['email']}
                                            helperText={errors['email']}
                                            onChange={(e: any) => setState((prev: any) => { return { ...prev, email: e.target.value } } )}
                                            placeholder="Enter your email" sx={{ my: 1 }} fullWidth />
                                    </Box>
                                }
                                {   contract?.contactDetail.indexOf('discord') > -1 &&
                                    <>
                                        { state['discord'] ? 
                                        <Box my={1} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                                            <img style={{ width: 36, marginRight: 12 }} src={DiscordSVG} />
                                            <TextInput 
                                                value={state["discord"]}
                                                disabled={true}
                                                placeholder="Enter your discord" sx={{ my: 1 }} fullWidth />
                                        </Box> : 
                                        <>
                                            <Box mt={2} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                                                <img style={{ width: 36, marginRight: 12 }} src={DiscordSVG} />
                                                <Button onClick={() => handleDiscord()} fullWidth endIcon={<img src={ArrowRightSVG} />} variant="contained" color="secondary">
                                                    <Typography style={{ color: palette.primary.main }}>CONNECT WITH DISCORD</Typography>
                                                </Button>
                                            </Box>
                                            { errors['discord'] && <FormHelperText style={{ marginLeft: 58, marginTop: 4, color: '#e53935' }}>{ errors['discord'] }</FormHelperText> }
                                        </> }
                                    </>
                                }
                                {   contract?.contactDetail.indexOf('github') > -1 &&
                                    // <>
                                    //     <Box mt={2} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                                    //         <img style={{ width: 36, marginRight: 12 }} src={GithubSVG} />
                                    //         <Button fullWidth endIcon={<img src={ArrowRightSVG} />} variant="contained" color="secondary">
                                    //             <Typography style={{ color: palette.primary.main }}>CONNECT WITH GITHUB</Typography>
                                    //         </Button>
                                    //     </Box>
                                    //     { errors['github'] && <FormHelperText style={{ marginLeft: 58,  marginTop: 4, color: '#e53935' }}>{ errors['github'] }</FormHelperText> }
                                    // </>
                                    <Box my={1} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                                        <img style={{ width: 36, marginRight: 12 }} src={GithubSVG} />
                                        <TextInput 
                                            value={state["github"]}
                                            error={errors['github']}
                                            helperText={errors['github']}
                                            onChange={(e: any) => setState((prev: any) => { return { ...prev, github: e.target.value } } )}
                                            placeholder="Enter your github" sx={{ my: 1 }} fullWidth />
                                    </Box>
                                }
                                {   contract?.contactDetail.indexOf('telegram') > -1 &&
                                    <Box my={1} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                                        <img style={{ width: 36, marginRight: 12 }} src={TelegramSVG} />
                                        <TextInput 
                                            verror={errors['telegram']}
                                            helperText={errors['telegram']}
                                            onChange={(e: any) => setState((prev: any) => { return { ...prev, telegram: e.target.value } } )}
                                            placeholder="Enter your telegram" sx={{ my: 1 }} fullWidth />
                                    </Box>
                                }
                            </Box>
                            <Button loading={mintLoading} disabled={mintLoading} onClick={() => handleMint()} style={{ marginTop: 32 }} fullWidth variant="contained" color="primary">PAY</Button>
                            {networkError && typeof networkError === 'string' && <Typography my={2} textAlign="center" color="error" variant="body2">{ networkError }</Typography> }
                        </Box>
                    </Box>
                </Drawer>
            </Grid>
        </Container>
    )
}