import React, { useMemo } from 'react'
import { Grid, Box, Typography, Paper, Chip, FormControl, FormLabel } from "@mui/material"
import clsx from "clsx"
import { get as _get, find as _find, debounce as _debounce } from 'lodash'
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
import EmailGreenSVG from '../../assets/svg/email-green.svg'
import TelegramGreenSVG from '../../assets/svg/telegram-green.svg'
import DiscordGreenSVG from '../../assets/svg/discord-green.svg'
import GithubGreenSVG from '../../assets/svg/githubicon-green.svg'
import PaymentSVG from '../../assets/svg/payment.svg'
import CheckSVG from '../../assets/svg/check.svg'
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
import { addDaoMember, getCurrentUser, getDao, loadDao, updateCurrentUser } from "state/dashboard/actions"
import { Container } from "@mui/system"
import useEncryptDecrypt from "hooks/useEncryptDecrypt";
import useRole from "hooks/useRole"
import { USDC_GOERLI, USDC_POLYGON } from 'constants/tokens'
import { useTokenContract } from 'hooks/useContract'
import mime from 'mime'
import moment from 'moment'
import useTransak from 'hooks/useTransak'
import SwitchChain from 'components/SwitchChain'
import { CHAIN_INFO } from 'constants/chainInfo'
const { NFTStorage, File } = require("nft.storage")
const client = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE })

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
    const { account, provider, chainId: currentChainId } = useWeb3React();
    const [chainId, setChainId] = useState(undefined);
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
    const [balance, setBalance] = useState<any>(null)
    const [metadata, setMetadata] = useState<any>(null)
    const [payment, setPayment] = useState<any>(null)
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
    const { mint, estimateGas, getStats, checkDiscount, payByCrypto } = useMintSBT(contractId, contract?.version)
    const { onOpen, onResetAuth, authorization, isAuthenticating } = useDCAuth("identify")
    const { encryptMessage, decryptMessage } = useEncryptDecrypt()
    const { initTransak } = useTransak();
    const tokenContract = useTokenContract(contract?.mintPriceToken || undefined)

    useEffect(() => {
        if(DAO && DAO?.sbt)
            setChainId(DAO?.sbt?.chainId || DAO?.chainId)
    }, [DAO])

    useEffect(() => {
        if(account && contract) {
            axiosHttp.get(`mint-payment/${contract?.address}`)
            .then(res => setPayment(res.data))
        }
    }, [account, contract])

    useEffect(() => {
        console.log("balance..getStats", balance)
        if(account && chainId)
            getStats(chainId).then(res => { console.log("balanceof::::", res); setBalance(parseInt(res[0]._hex, 16)) })
    }, [account, chainId])

    useEffect(() => {
        if(!DAO) {
            dispatch(getDao(daoURL))
        }
    }, [DAO])

    const updateMetadata = async () => {
        const personalDetails = _find(metadata?.attributes, (attr: any) => attr.trait_type === 'Personal Details');
        console.log(personalDetails)
        if(personalDetails && personalDetails.value) {
            const decryptMsg = await decryptMessage(personalDetails.value)
            setState((prev: any) => {
                return {
                    ...prev,
                    email: contract?.contactDetail.indexOf('email') > -1 ? _get(decryptMsg, 'email', null) : null,
                    discord: contract?.contactDetail.indexOf('discord') > -1 ? _get(decryptMsg, 'discord', null) : null,
                    telegram: contract?.contactDetail.indexOf('telegram') > -1 ? _get(decryptMsg, 'telegram', null) : null,
                    github: contract?.contactDetail.indexOf('github') > -1 ? _get(decryptMsg, 'github', null) : null,
                }
            })
            setShowDrawer(true)
        } else {
            setShowDrawer(true)
        }
    }

    useEffect(() => {
        console.log("balance..", balance)
        if(balance === 1) {
            axiosHttp.get(`metadata/${contractId}`)
            .then(res => setMetadata(res.data))
        }
    }, [balance])

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

    const isNativeToken = useMemo(() => {
        const tokenId = contract?.mintPriceToken;
        if(tokenId === USDC_GOERLI.address || tokenId === USDC_POLYGON.address)
            return false;
        return true;
    }, [contract])

    useEffect(() => {
        const calculatePriceAndGasFees = async () => {
            try {
                if (contract?.mintPrice && chainId) {
                    let coinId = SUPPORTED_ASSETS[`${chainId}`].id

                    if(!isNativeToken)
                        coinId = 'usd-coin'

                    const request = await axios.get(
                        `https://api.coingecko.com/api/v3/coins/${coinId}`
                    );
                    console.log("://api.coingecko.com/api/v3/coins", request.data)
                    const price = await request.data.market_data?.current_price["usd"];
                    const mintPriceinUsd = parseFloat(contract?.mintPrice) * price;
        
                    setPrice({
                        mintPrice: _get(contract, 'mintPrice', '0'),
                        mintPriceinUsd: mintPriceinUsd.toString()
                    })
                    
                    if(isNativeToken) {
                        let estimateTransactionCost = await estimateGas();
                        let estimateinUsd =
                        parseFloat(
                            ethers.utils.formatUnits(estimateTransactionCost.toString(), "gwei")
                        ) * price;
                
                
                        setPrice({
                            mintPrice: _get(contract, 'mintPrice', '0'),
                            mintPriceinUsd: mintPriceinUsd.toString(),
                            estimateinUsd: estimateinUsd.toString(),
                            gas: ethers.utils.formatUnits(estimateTransactionCost.toString(), "gwei")
                        })
                    } else {
                        setPrice({
                            mintPrice: _get(contract, 'mintPrice', '0'),
                            mintPriceinUsd: mintPriceinUsd.toString(),
                            estimateinUsd: 0,
                            gas: 0
                        })
                    }

                }
            } catch (e) {
                console.log(e)
                if(typeof e === 'string')
                    setNetworkError(e)
                setTimeout(() => setNetworkError(null), 3000)
            }
        };
    
        calculatePriceAndGasFees();
      }, [chainId, account, contract?.mintPrice]);
    
    if(!contract || contractLoading || balance == null)
        return <FullScreenLoader/>
    
    const handleUpdateMetadata = async () => {
        let err: any = {}
        setErrors({})
        if(state?.name == null || state?.name == "") { err['name'] = 'Enter valid name' }
        if(contract?.contactDetail.indexOf('email') > -1 && ( state?.email == null || state?.email == "")) { err['email'] = 'Enter valid email' }
        if(contract?.contactDetail.indexOf('discord') > -1 && ( state?.discord == null || state?.discord == "")) { err['discord'] = 'Enter valid discord' }
        if(contract?.contactDetail.indexOf('github') > -1 && ( state?.github == null || state?.github == "")) { err['github'] = 'Enter valid github' }
        if(contract?.contactDetail.indexOf('telegram') > -1 && ( state?.telegram == null || state?.telegram == "")) { err['telegram'] = 'Enter valid telegram' }
        if(Object.keys(err).length > 0)
            return setErrors(err)
        const msg = await encryptMessage(JSON.stringify({ email: _get(state, 'email', ''), discord: _get(state, 'discord', ''), telegram: _get(state, 'telegram', ''), github: _get(state, 'github', '') }))
        const {  _id, createdAt, updatedAt, archivedAt, ...remaining } = metadata;
        let attrb = remaining?.attributes;
        const entities = ['Email', 'Discord', 'Telegram', 'Github'];
        for (let index = 0; index < entities.length; index++) {
            const entity = entities[index];
            const exists = _find(attrb, a => a.trait_type === entity)
            if(!exists)
                attrb.push({ trait_type: entity, value: null })
        }

        let metadataJSON = {
            ...remaining,
            name: state?.name,
            attributes: attrb.map((attr: any) => {
                if(['Email', 'Discord', 'Telegram', 'Github', 'Personal Details'].indexOf(attr.trait_type) > -1){
                    if(attr?.trait_type === 'Email') {
                         return {
                            trait_type: "Email",
                            value: contract?.contactDetail.indexOf('email') > -1 && state?.email && state?.email.length > 0 ? true : null
                         }
                    }
                    if(attr?.trait_type === 'Discord') {
                        return {
                           trait_type: "Discord",
                           value: contract?.contactDetail.indexOf('discord') > -1 && state?.discord && state?.discord.length > 0 ? true : null
                        }
                    }
                   if(attr?.trait_type === 'Telegram') {
                        return {
                        trait_type: "Telegram",
                        value: contract?.contactDetail.indexOf('telegram') > -1 && state?.telegram && state?.telegram.length > 0 ? true : null
                        }
                    }
                    if(attr?.trait_type === 'Github') {
                        return {
                        trait_type: "Github",
                        value: contract?.contactDetail.indexOf('github') > -1 && state?.github && state?.github.length > 0 ? true : null
                        }
                    }
                    if(attr?.trait_type === 'Personal Details') {
                        return {
                        trait_type: "Personal Details",
                        value: msg
                        }
                    }
                }
                return attr
            })
          };

        if(!_find(metadataJSON.attributes, (attr:any) => attr.trait_type === "Personal Details" )) {
            metadataJSON = { ...metadataJSON, attributes: [ ...metadataJSON.attributes, { trait_type: "Personal Details", value: msg } ] }
        }

        axiosHttp.patch(`metadata/${_get(DAO, 'sbt._id')}`, metadataJSON)
        .then(async res => {
            await axiosHttp.patch(`dao/${_get(DAO, 'url', '')}/update-user-discord`, {
                discordId: state?.discord  || null,
                userId: _get(user, '_id', ''),
                daoId: _get(DAO, '_id')
            })
            dispatch(getDao(_get(DAO, 'url', '')))
            setTimeout(() => window.location.href = `/${DAO.url}`, 1500);
        })
        .catch(e => console.log(e))
    }

    const valid = () => {
        let err: any = {}
        setErrors({})
        if(state?.name == null || state?.name == "") { err['name'] = 'Enter valid name' }
        if(contract?.contactDetail.indexOf('email') > -1 && ( state?.email == null || state?.email == "")) { err['email'] = 'Enter valid email' }
        if(contract?.contactDetail.indexOf('discord') > -1 && ( state?.discord == null || state?.discord == "")) { err['discord'] = 'Enter valid discord' }
        if(contract?.contactDetail.indexOf('github') > -1 && ( state?.github == null || state?.github == "")) { err['github'] = 'Enter valid github' }
        if(contract?.contactDetail.indexOf('telegram') > -1 && ( state?.telegram == null || state?.telegram == "")) { err['telegram'] = 'Enter valid telegram' }
        if(Object.keys(err).length > 0) {
            setErrors(err)
            return false
        }
        return true
    }

    const handlePayByCrypto = async () => {
        if(!valid()) return;
        setMintLoading(true)
        const stats: any = await getStats(chainId);
        let tokenId = parseFloat(stats[1].toString());
        if(!payment) {
            const response = await payByCrypto(tokenContract);
            await axiosHttp.post(`mint-payment/verify`, {
                chainId, 
                contract: contract?.address,
                txnReference: response?.transactionHash,
                tokenId,
                paymentType: 'crypto',
            })
            .then(res => {
                if(res.data) {
                    handleMint(response?.transactionHash, res?.data?.signature)
                }
            })
            .catch(e => {
                console.log(e)
                setMintLoading(false)
            })
        } else {
            await axiosHttp.get(`mint-payment/signature?contract=${contract?.address}&tokenId=${tokenId}`)
            .then(res => {
                if(res.data) {
                    handleMint(payment, res?.data?.signature)
                }
            })
            .catch(e => {
                console.log(e)
                setMintLoading(false)
            })
        }
    }

    const handlePayByCard = async () => {
        if(!valid()) return;
        setMintLoading(true)
        const stats: any = await getStats(chainId);
        let tokenId = parseFloat(stats[1].toString());
        const treasury = stats[5];

        if(!payment) {
            let token = contract?.mintPriceToken === USDC_POLYGON.address ? 'USDC' : 'MATIC'
            let amount: any = +_get(price, 'mintPrice', 0)
            if(token === 'MATIC'){
                amount = (parseFloat(_get(price, 'mintPrice', 0)) + (parseFloat(_get(price, 'gas', 0))) * 2).toFixed(5)
            }
            const order: any = await initTransak({ token, amount, treasury })
            if(order && order?.eventName === "TRANSAK_ORDER_SUCCESSFUL"){
                await axiosHttp.post(`mint-payment/verify`, {
                    chainId, 
                    contract: contract?.address,
                    txnReference: _get(order, 'status.id', null),
                    tokenId,
                    paymentType: 'card',
                })
                .then(res => {
                    if(res.data) {
                        handleMint(_get(order, 'status.id', ''), res?.data?.signature)
                    }
                })
                .catch(e => {
                    console.log(e)
                    setMintLoading(false)
                })
            }
        } else {
            await axiosHttp.get(`mint-payment/signature?contract=${contract?.address}&tokenId=${tokenId}`)
            .then(res => {
                if(res.data) {
                    handleMint(payment, res?.data?.signature)
                }
            })
            .catch(e => {
                console.log(e)
                setMintLoading(false)
            })
        }
    }

    const mintFree = async () => {
        if(!valid()) return;
        setMintLoading(true)
        const stats: any = await getStats(chainId);
        let tokenId = parseFloat(stats[1].toString());
        await axiosHttp.post(`contract/whitelist-signature`, {
            tokenId, 
            payment: "",
            contract: contract?.address,
            chainId
          }).then(res => {
            handleMint("", res?.data?.signature)
          })
          .catch(e => {
            setMintLoading(false)
            console.log(e)
        })
    }

    const handleMint = async (payment: string | undefined, signature: string | undefined) => {
        if(!valid()) return;
        setMintLoading(true)
        try {
            const msg = await encryptMessage(JSON.stringify({ email: _get(state, 'email', ''), discord: _get(state, 'discord', ''), telegram: _get(state, 'telegram', ''), github: _get(state, 'github', '') }))
            const stats: any = await getStats(chainId);
            let tokenId = parseFloat(stats[1].toString());
            const metadataJSON = {
                id: tokenId,
                description: `${contract?.token} SBT TOKEN`,
                daoUrl: DAO?.url,
                name: `${contract?.name}#${tokenId}`,
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
                //const ipfsURL: any =  await uploadNFT(metadataJSON, `${process.env.REACT_APP_NODE_BASE_URL}/v1/${contract?.address}/${tokenId}`)
                if(+contract?.version >= 1) {
                    const ipfsURL: string = await axiosHttp.post(`metadata/ipfs-metadata`, { metadata: metadataJSON, tokenURI: `${process.env.REACT_APP_NODE_BASE_URL}/v1/${contract?.address}/${tokenId}` }).then(res => res.data)
                    const token = await mint(ipfsURL, payment, signature, tokenContract);
                } else {
                    const token = await mint(undefined, undefined, undefined, undefined);
                }
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
            if(typeof e === 'string')
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

    if(!chainId || balance === null) {
        return <FullScreenLoader/>
    }


    return (
        <Container>
            <Grid container className={classes.root}>
                <Grid item sm={12} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <Box mt={8} display="flex" alignItems="center" justifyContent="center">
                        <img src={MintSBTSvg}/>
                    </Box>
                    <Typography sx={{ mt: 2 }} className={classes.title}>{ balance === 1 ? 'Update your pass token' : 'To join the organisation mint your pass token' }</Typography>
                    <Box mt={12} style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                        {/* <Box onClick={() => navigate(-1)} height={77} width={50} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' }}>
                            <img src={BackArrowSVG} />
                        </Box> */}
                        <Grid ml={1} container>
                            <Grid item xs={12} sm={6}>
                                <img src={_get(contract, 'image')} style={{ objectFit: 'cover', width: 530, height: 395, borderRadius: 5 }} />
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
                                { contract?.version && contract?.version !== "0" ?
                                <>
                                { balance === 0 ?
                                <Box mx={2} mt={0.5} px={3} py={2} style={{ borderRadius: 5, width: '100%', backgroundColor: '#FFF'  }}>
                                    { _get(price, 'mintPrice', 0) > 0 &&
                                    <>
                                    <Box py={2} style={{  display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Typography style={{ fontSize: 16, fontWeight: 700 }}>
                                            Price
                                        </Typography>
                                        <Box mx={2} mt={1} style={{ flexGrow: 1, borderBottom: '1px dotted rgba(27, 43, 65, 0.2)' }}></Box>
                                        <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: 14, fontWeight: 400, color: "#76808D" }}>${ parseFloat(_get(price, 'mintPriceinUsd', 0)).toFixed(2) } /</Typography>
                                            <Typography ml={2} style={{ fontSize: 16, fontWeight: 700, }}>{ parseFloat(_get(price, 'mintPrice', 0)).toFixed(5) } { contract?.mintPriceToken === USDC_GOERLI.address || contract?.mintPriceToken === USDC_POLYGON.address ? 'USDC' : CHAIN_INFO[chainId]?.nativeCurrency?.symbol }</Typography>
                                        </Box>
                                    </Box>
                                    { isNativeToken ?
                                    <Box py={2} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Typography style={{ fontSize: 16, fontWeight: 700 }}>
                                            Gas Fees
                                        </Typography>
                                        <Box mx={2} mt={1} style={{ flexGrow: 1, borderBottom: '1px dotted rgba(27, 43, 65, 0.2)' }}>

                                        </Box>
                                        <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: 14, fontWeight: 400, color: "#76808D" }}>${ parseFloat(_get(price, 'estimateinUsd', 0)).toFixed(2)} /</Typography>
                                            <Typography ml={2} style={{ fontSize: 16, fontWeight: 700, }}>{ parseFloat(_get(price, 'gas', 0)).toFixed(5) } {CHAIN_INFO[chainId]?.nativeCurrency?.symbol}</Typography>
                                        </Box>
                                    </Box> : 
                                    <Box py={2} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        {/* <Typography style={{ fontSize: 16, fontWeight: 700 }}>
                                            + Gas Fees
                                        </Typography> */}
                                        <Box mx={2} mt={1} style={{ flexGrow: 1, borderBottom: '1px dotted rgba(27, 43, 65, 0.2)' }}>

                                        </Box>
                                        <Typography style={{ fontSize: 16, fontWeight: 700 }}>
                                            + Gas Fees
                                        </Typography>
                                    </Box>
                                    }
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
                                    { isNativeToken &&
                                        <Box py={2} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: 16, fontWeight: 700 }}>
                                                Total
                                            </Typography>
                                            <Box mx={2} mt={1} style={{ flexGrow: 1, borderBottom: '1px dotted red' }}>

                                            </Box>
                                            <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <Typography style={{ fontSize: 14, fontWeight: 400, color: "#76808D" }}>${ (parseFloat(_get(price, 'mintPriceinUsd', 0)) + parseFloat(_get(price, 'estimateinUsd', 0))).toFixed(2) } /</Typography>
                                                <Typography ml={2} style={{ fontSize: 16, fontWeight: 700, }}>{ (parseFloat(_get(price, 'mintPrice', 0)) + parseFloat(_get(price, 'gas', 0))).toFixed(5) } {contract?.mintPriceToken === USDC_GOERLI.address || contract?.mintPriceToken === USDC_POLYGON.address ? 'USDC' : CHAIN_INFO[chainId]?.nativeCurrency?.symbol}</Typography>
                                            </Box>
                                        </Box>
                                    }
                                    </>
                                    }
                                    {/* { balance == 0 &&
                                    <Box mt={2} display="flex" flexDirection="row" alignItems="center">
                                    <TextInput 
                                        value={state["referralCode"]}
                                        error={errors['referralCode']}
                                        helperText={errors['referralCode']}
                                        onChange={(e: any) => setState((prev: any) => { return { ...prev, referralCode: e.target.value } } )}
                                        placeholder="Go Gondor" sx={{ my: 1 }} fullWidth label="Discount code" />
                                        <Button loading={discountCheckLoading} disabled={ !state?.referralCode || state?.referralCode === "" || discountCheckLoading} onClick={() => handleApplyDiscount()} style={{ marginLeft: 16, marginTop: 22 }} size="small" variant="outlined">Apply</Button>
                                    </Box> } */}
                                    { balance == 0 &&
                                        <Button loading={mintLoading} onClick={() => { 
                                            if(currentChainId !== chainId) {
                                                return toast.custom(t => <SwitchChain t={t} nextChainId={chainId} />)
                                            }
                                            return setShowDrawer(true) 
                                        }} style={{ margin: '32px 0 16px 0' }} variant="contained" fullWidth>MINT YOUR SBT</Button>
                                    }
                                  {networkError && <Typography my={2} textAlign="center" color="error" variant="body2">{ networkError }</Typography> }
                                </Box> : 
                                <Box mx={2} mt={0.5} px={3} pb={1} style={{ borderRadius: 5, width: '100%', backgroundColor: '#FFF'  }}>
                                    {
                                        metadata && metadata?.attributes.map((attribute: any) => {
                                            if(["Personal Details", "projects", "project_names", "tasks", "task_names"].indexOf(attribute.trait_type) === -1) {
                                                return (
                                                    <Box py={2} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                        <Typography style={{ fontSize: 14, fontWeight: 400 }}>{ attribute?.trait_type }</Typography>
                                                        <Box mx={2} mt={1} style={{ flexGrow: 1 }}>
                    
                                                        </Box>
                                                        <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                            <Typography style={{ fontSize: 14, fontWeight: 400, color: "#76808D" }}>{ 
                                                                attribute?.trait_type === 'Wallet Address/ENS Domain' ?
                                                                beautifyHexToken(attribute?.value) :
                                                                typeof attribute?.value === 'boolean' ? attribute?.value ? '********' : '' :
                                                                attribute?.value
                                                            }</Typography>
                                                        </Box>
                                                    </Box>
                                                )
                                            }
                                            return null
                                        })
                                    }
                                    { balance === 1 && metadata &&
                                        <Button onClick={() => { 
                                            if(currentChainId !== chainId) {
                                                return toast.custom(t => <SwitchChain t={t} nextChainId={chainId} />)
                                            }
                                            return updateMetadata()
                                        }} style={{ margin: '32px 0 16px 0' }} variant="contained" fullWidth>UPDATE</Button>
                                    }
                                </Box>
                                }
                                </> : 
                                <Box mx={2} mt={0.5} px={3} py={2} style={{ borderRadius: 5, width: '100%', backgroundColor: '#FFF'  }}>
                                     { balance === 1 && metadata ?
                                        <Button onClick={() => { 
                                            if(currentChainId !== chainId) {
                                                return toast.custom(t => <SwitchChain t={t} nextChainId={chainId} />)
                                            }
                                           return updateMetadata()
                                        }} style={{ margin: '32px 0 16px 0' }} variant="contained" fullWidth>UPDATE</Button> : 
                                        <Button onClick={() => { 
                                            if(currentChainId !== chainId) {
                                                return toast.custom(t => <SwitchChain t={t} nextChainId={chainId} />)
                                            }
                                            return setShowDrawer(true) 
                                        }} style={{ margin: '32px 0 16px 0' }} variant="contained" fullWidth>{"MINT YOUR SBT" }</Button>
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
                            <img src={MintSBTSvg} />
                            <Typography my={4} style={{ color: palette.primary.main, fontSize: '30px', fontWeight: 400 }}>{ balance === 1 ? "Update details" : "Contact details"}</Typography>
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
                                        <img style={{ width: 36, marginRight: 12 }} src={state['email'] ? EmailGreenSVG : EmailSVG} />
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
                                        <>
                                        <Box mt={2} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                                            <img style={{ width: 36, marginRight: 12 }} src={DiscordGreenSVG} />
                                            <Button fullWidth endIcon={<img src={CheckSVG} />} variant="contained" color="success">
                                                    <Typography style={{ color: "#FFF"}}>CONNECTED TO DISCORD</Typography>
                                            </Button>
                                        </Box>
                                    </> : 
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
                                        <img style={{ width: 36, marginRight: 12 }} src={state["github"] ? GithubGreenSVG : GithubSVG} />
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
                                        <img style={{ width: 36, marginRight: 12 }} src={state["telegram"] ? TelegramGreenSVG : TelegramSVG} />
                                        <TextInput 
                                            value={state["telegram"]}
                                            error={errors['telegram']}
                                            helperText={errors['telegram']}
                                            onChange={(e: any) => setState((prev: any) => { return { ...prev, telegram: e.target.value } } )}
                                            placeholder="Enter your telegram" sx={{ my: 1 }} fullWidth />
                                    </Box>
                                }
                            </Box>
                            <Typography mt={2} variant='body1' style={{ textAlign: 'center' }}>Your contact details are encrypted using advanced public key encryption technology, ensuring that your personal information stays safe and secure.</Typography>
                            {   balance === 0 ?
                                <Button loading={mintLoading} disabled={mintLoading} onClick={() => {
                                    if(+contract?.version >= 1) {
                                        if(contract?.mintPrice && contract?.mintPrice !== "0") {
                                            handlePayByCrypto() 
                                        } else {
                                            mintFree()
                                        }
                                    } else {
                                        handleMint(undefined, undefined) 
                                    }
                                }} style={{ marginTop: 32 }} fullWidth variant="contained" color="primary">{ 
                                    contract?.version && +contract?.version >= 1 ? 
                                    payment ? "MINT" : (!contract?.mintPrice || contract?.mintPrice === "0") ? "MINT" : "PAY BY CRYPTO" : "MINT" }</Button> : 
                                <Button loading={mintLoading} disabled={mintLoading} onClick={() => handleUpdateMetadata()} style={{ marginTop: 32 }} fullWidth variant="contained" color="primary">UPDATE</Button>
                            }

                            {   contract.version !== "0" && !payment && balance === 0 && contract && +contract?.mintPrice >= 27 &&
                                <Button loading={mintLoading} disabled={mintLoading} onClick={() => {
                                    if(valid()) {
                                        setShowDrawer(false)
                                        handlePayByCard() 
                                    }
                                }} style={{ marginTop: 32 }} fullWidth variant="contained" color="primary">PAY BY CARD</Button> 
                            }

                            {networkError && typeof networkError === 'string' && <Typography my={2} textAlign="center" color="error" variant="body2">{ networkError }</Typography> }
                        </Box>
                    </Box>
                </Drawer>
            </Grid>
        </Container>
    )
}