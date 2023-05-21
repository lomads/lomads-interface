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
import CheckIcon from '@mui/icons-material/Check';
import { useCallback, useEffect, useState } from "react";
import IconButton from "muiComponents/IconButton";
import useContractDeployer, { SBTParams } from "hooks/useContractDeployer"
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
import github from '../../assets/svg/github-mark.svg'
import trello from '../../assets/svg/trello-mark.svg'
import discord from '../../assets/svg/discord-mark.svg'
import PaymentSVG from '../../assets/svg/payment.svg'
import CheckSVG from '../../assets/svg/check.svg'
import CloseSVG from '../../assets/svg/close.svg'
import METAMASK from 'assets/svg/metamask.svg'
import { useNavigate, useParams } from "react-router-dom"
import useMintSBT from "hooks/useMintSBT.v2"
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
import { useAppDispatch } from 'state/hooks'
import { Container } from "@mui/system"
import useEncryptDecrypt from "hooks/useEncryptDecrypt";
import useRole from "hooks/useRole"
import { USDC, USDC_GOERLI, USDC_POLYGON } from 'constants/tokens'
import { useTokenContract } from 'hooks/useContract'
import mime from 'mime'
import moment from 'moment'
import useTransak from 'hooks/useTransak'
import { CHAIN_INFO } from 'constants/chainInfo'
import SwitchChain from 'components/SwitchChain'
import { useWeb3React } from '@web3-react/core'
import { addDaoMember, getCurrentUser, getDao, loadDao, updateCurrentUser } from "state/dashboard/actions"
const { NFTStorage, File } = require("nft.storage")
const client = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE })

const useStyles = makeStyles((theme: any) => ({
    root: {
        paddingBottom: 60
    },
    title: {
        fontFamily: 'Inter, sans-serif',
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: '24px !important',
        lineHeight: '33px !important',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        color: theme.palette.primary.main
    },
    subtitle: {
        fontSize: '14px !important',
        fontWeight: '500',
        lineHeight: '19px !important',
        color: 'rgba(27, 43, 65, 0.5)'
    },
    createBtn: {
        height: '40px !important',
        width: '136px !important',
        background: '#C94B32 !important',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFF !important',
        fontSize: '14px !important'
    },
    footerBtn: {
        height: '40px !important',
        width: '190px !important',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px !important',
        margin: "0 3px !important"
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
        // margin: "10px",
        padding: 40
    },
}));


export default () => {
    const { chainId, account, provider } = useWeb3React()
    const navigate = useNavigate()
    const { daoURL } = useParams()
    const classes = useStyles()
    const dispatch = useAppDispatch()
    const { user, DAO } = useSelector((store: any) => store.dashboard)
    const { myRole } = useRole(DAO, account)
    const { contractId = undefined } = useParams()
    const [contractLoading, setContractLoading] = useState<boolean | null>(null)
    const [mintLoading, setMintLoading] = useState<boolean | null>(null)
    const [networkError, setNetworkError] = useState<any>(null)
    const [contract, setContract] = useState<any>(null)
    const [showDrawer, setShowDrawer] = useState<boolean>(false)
    const [errors, setErrors] = useState<any>({})
    const [balance, setBalance] = useState<any>(0)
    const [metadata, setMetadata] = useState<any>(null)
    const [payment, setPayment] = useState<any>(null)
    const [discountCheckLoading, setDiscountCheckLoading] = useState<boolean | null>(null)
    const [discountMessage, setDiscountMessage] = useState<any>(null);
    const [state, setState] = useState<any>({
        name: ""
    })
    const [userInfo, setUserInfo] = useState<any>(null)
    const [price, setPrice] = useState<any>({})
    const [hasClickedAuth, setHasClickedAuth] = useState<any>(false)
    const { mint, getTreasury, estimateGas, checkDiscount, payByCrypto, payByCryptoEstimate, balanceOf, getCurrentTokenId } = useMintSBT(contractId, contract?.version)
    const { onOpen, onResetAuth, authorization, isAuthenticating } = useDCAuth("identify")
    const { encryptMessage, decryptMessage } = useEncryptDecrypt()
    const { initTransak } = useTransak();
    const tokenContract = useTokenContract(contract?.mintPriceToken || undefined)

    const [orgData, setOrgData] = useState<any>(null);

    useEffect(() => {
        if(!DAO) {
            dispatch(getDao(daoURL))
        }
    }, [DAO])

    const isWhiteListed = useMemo(() => {
        if(contract && contract.whitelisted && orgData && account) {
            const currMember = _find(orgData.members, (m:any) => m?.member?.wallet.toLowerCase() === account.toLowerCase())
            if(!currMember)
                return false
        }
        return true
    }, [contract, account])

    const canMintFree = useMemo(() => {
        if(account && contract && contract.nonPayingMembers && contract.nonPayingMembers.length > 0) {
            if(+price?.mintPrice > 0) {
                if(userInfo){
                    if(contract?.nonPayingMembers.indexOf(userInfo.email) > -1)
                        return true
                }
                if(contract?.nonPayingMembers.indexOf(account) > -1)
                    return true;
            }
        }
        return false
    }, [contract, account, userInfo])


    useEffect(() => {
        if(account) {
            if (user) {
                setState((prev: any) => {
                    return {
                        ...prev,
                        name: _get(user, 'name', '')
                    }
                })
            }
        }
    }, [user, account])

    useEffect(() => {
        if (account && contract) {
            axiosHttp.get(`mint-payment/${contract?.address}`)
                .then(res => setPayment(res.data))
        }
    }, [account, contract])

    useEffect(() => {
        if (account && contract) {
            console.log("Account", account)
            balanceOf().then(res => 
            { 
                setBalance(parseInt(res._hex, 16)) 
                if(parseInt(res._hex, 16) === 1) {
                    setTimeout(() => { 
                        if (contract?.redirectUrl) {
                            window.open(contract?.redirectUrl.indexOf('http') > -1 ? contract?.redirectUrl : `https://${contract?.redirectUrl}`, '_blank');
                        }
                     }, 3000)
                }
            })
        }
    }, [account, contract])


    const updateMetadata = async () => {
        const personalDetails = _find(metadata?.attributes, (attr: any) => attr.trait_type === 'Personal Details');
        console.log(personalDetails)
        if (personalDetails && personalDetails.value) {
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
        if (balance === 1) {
            axiosHttp.get(`metadata/${contractId}`)
                .then(res => setMetadata(res.data))
        }
    }, [balance, account])

    useEffect(() => {
        if (contractId) {
            setContractLoading(true)
            axiosHttp.get(`contract/${contractId}`)
                .then(res => {
                    console.log("contract data in min page : ", res.data);
                    setContract(res.data)
                    setPrice((prev: any) => { return { ...prev, mintPrice: _get(res.data, 'mintPrice', 0) } })
                    axiosHttp.get(`contract/getContractDao/${res.data._id}`)
                        .then((dao) => {
                            if (dao) {
                                console.log("dao data : ", dao.data);
                                setOrgData(dao.data);
                            }
                        })
                })
                .catch(e => {
                    console.log(e)
                    if (e.response.status === 404) {
                        window.location.href = '/'
                    }
                })
                .finally(() => setContractLoading(false))
        }
    }, [contractId])

    useEffect(() => setErrors({}), [state])

    const getDiscordUser = useCallback(async () => {
        if (authorization) {
            return axios.get('https://discord.com/api/users/@me', { headers: { "Authorization": authorization } })
                .then(res => res.data)
                .catch(e => {
                    if (e.response.status === 401) {
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
        if (((prevAuth == undefined && authorization) || (prevAuth && authorization && prevAuth !== authorization)) && hasClickedAuth) {
            handleDiscord()
        }
    }, [prevAuth, authorization, hasClickedAuth])

    const handleDiscord = async () => {
        onResetAuth()
        console.log("authorization")
        setHasClickedAuth(true)
        if (!authorization)
            return onOpen()
        const discordUser = await getDiscordUser();
        if (discordUser) {
            setState((prev: any) => {
                return {
                    ...prev,
                    discord: _get(discordUser, 'username')
                }
            })
        }
        setHasClickedAuth(false)
    }

    const isNativeToken = useMemo(() => {
        const tokenId = contract?.mintPriceToken;
        if (tokenId === USDC_GOERLI.address || tokenId === USDC_POLYGON.address)
            return false;
        return true;
    }, [contract, account])

    const calculatePriceAndGasFees = async () => {
        try {
            if (price?.mintPrice) {
                let coinId = SUPPORTED_ASSETS[`${contract?.chainId}`].id

                if (!isNativeToken)
                    coinId = 'usd-coin'

                const request = await axios.get(
                    `https://api.coingecko.com/api/v3/coins/${coinId}`
                );
                const currprice = await request.data.market_data?.current_price["eur"];
                const mintPriceinUsd = parseFloat(price?.mintPrice) * currprice;


                setPrice((prev: any) => {
                    return {
                        ...prev,
                        mintPriceinUsd: mintPriceinUsd.toString()
                    }
                })

                if (isNativeToken) {
                    let estimateTransactionCost = await estimateGas();
                    const gasPrice = await provider?.getGasPrice();
                    if(!gasPrice) throw "Something went wrong"
                    const parsed = ethers.utils.formatEther((parseFloat(gasPrice.toString()) * parseFloat(estimateTransactionCost.toString())).toString())
                    let estimateinUsd =
                        parseFloat(
                            parsed
                        ) * price;

                    const pp:any = {
                        mintPriceinUsd: mintPriceinUsd.toString(),
                        estimateinUsd: estimateinUsd.toString(),
                        gas: parsed
                    }
                    setPrice((prev: any) => {
                        return { ...prev, ...pp }
                    })
                    return { mintPrice: price?.mintPrice, ...pp };
                } else {
                    const p: any = {
                        mintPriceinUsd: mintPriceinUsd.toString(),
                        estimateinUsd: 0,
                        gas: 0
                    }
                    setPrice((prev: any) => {
                        return { ...prev, ...p }
                    })
                    return { mintPrice: price?.mintPrice, ...p };
                }
            }
        } catch (e) {
            console.log(e)
        }
    };

    useEffect(() => {
        calculatePriceAndGasFees();
    }, [account, price?.mintPrice]);

    if (!contract || contractLoading || balance == null)
        return <FullScreenLoader />

    const handleUpdateMetadata = async () => {
        let err: any = {}
        setErrors({})
        if (state?.name == null || state?.name == "") { err['name'] = 'Enter valid name' }
        if (contract?.contactDetail.indexOf('email') > -1 && (state?.email == null || state?.email == "")) { err['email'] = 'Enter valid email' }
        if (contract?.contactDetail.indexOf('discord') > -1 && (state?.discord == null || state?.discord == "")) { err['discord'] = 'Enter valid discord' }
        if (contract?.contactDetail.indexOf('github') > -1 && (state?.github == null || state?.github == "")) { err['github'] = 'Enter valid github' }
        if (contract?.contactDetail.indexOf('telegram') > -1 && (state?.telegram == null || state?.telegram == "")) { err['telegram'] = 'Enter valid telegram' }
        if (Object.keys(err).length > 0)
            return setErrors(err)
        const msg = await encryptMessage(JSON.stringify({ email: _get(state, 'email', ''), discord: _get(state, 'discord', ''), telegram: _get(state, 'telegram', ''), github: _get(state, 'github', '') }))
        const { _id, createdAt, updatedAt, archivedAt, ...remaining } = metadata;
        let metadataJSON = {
            ...remaining,
            name: state?.name,
            attributes: remaining?.attributes.map((attr: any) => {
                if (['Email', 'Discord', 'Telegram', 'Github', 'Personal Details'].indexOf(attr.trait_type) > -1) {
                    if (attr?.trait_type === 'Email') {
                        return {
                            trait_type: "Email",
                            value: contract?.contactDetail.indexOf('email') > -1 && state?.email && state?.email.length > 0 ? true : null
                        }
                    }
                    if (attr?.trait_type === 'Discord') {
                        return {
                            trait_type: "Discord",
                            value: contract?.contactDetail.indexOf('discord') > -1 && state?.discord && state?.discord.length > 0 ? true : null
                        }
                    }
                    if (attr?.trait_type === 'Telegram') {
                        return {
                            trait_type: "Telegram",
                            value: contract?.contactDetail.indexOf('telegram') > -1 && state?.telegram && state?.telegram.length > 0 ? true : null
                        }
                    }
                    if (attr?.trait_type === 'Github') {
                        return {
                            trait_type: "Github",
                            value: contract?.contactDetail.indexOf('github') > -1 && state?.github && state?.github.length > 0 ? true : null
                        }
                    }
                    if (attr?.trait_type === 'Personal Details') {
                        return {
                            trait_type: "Personal Details",
                            value: msg
                        }
                    }
                }
                return attr
            })
        };

        if (!_find(metadataJSON.attributes, (attr: any) => attr.trait_type === "Personal Details")) {
            metadataJSON = { ...metadataJSON, attributes: [...metadataJSON.attributes, { trait_type: "Personal Details", value: msg }] }
        }

        // axiosHttp.patch(`metadata/${_get(DAO, 'sbt._id')}`, metadataJSON)
        // .then(async res => {
        //     await axiosHttp.patch(`dao/${_get(DAO, 'url', '')}/update-user-discord`, {
        //         discordId: state?.discord  || null,
        //         userId: _get(user, '_id', ''),
        //         daoId: _get(DAO, '_id')
        //     })
        //     setTimeout(() => window.location.href = `/${DAO.url}`, 1500);
        // })
        // .catch(e => console.log(e))
    }

    const valid = () => {
        if(!chainId || !account) return false;
        if(+contract?.chainId !== +chainId) {
            console.log("Wrong chain..")
            toast.custom(t => <SwitchChain t={t} nextChainId={+contract?.chainId} />)
            return false;
        }
        let err: any = {}
        setErrors({})
        if (state?.name == null || state?.name == "") { err['name'] = 'Enter valid name' }
        if (contract?.contactDetail.indexOf('email') > -1 && (state?.email == null || state?.email == "")) { err['email'] = 'Enter valid email' }
        if (contract?.contactDetail.indexOf('discord') > -1 && (state?.discord == null || state?.discord == "")) { err['discord'] = 'Enter valid discord' }
        if (contract?.contactDetail.indexOf('github') > -1 && (state?.github == null || state?.github == "")) { err['github'] = 'Enter valid github' }
        if (contract?.contactDetail.indexOf('telegram') > -1 && (state?.telegram == null || state?.telegram == "")) { err['telegram'] = 'Enter valid telegram' }
        if (Object.keys(err).length > 0) {
            setErrors(err)
            return false
        }
        return true
    }

    const handlePayByCrypto = async () => {
        if (!valid() || !account || !chainId) return;
        setMintLoading(true)
        const gp = await calculatePriceAndGasFees()
        const stats: any = await getCurrentTokenId();
        let tokenId = parseFloat(stats.toString());
        if (!payment) {
            const gasPrice = await provider?.getGasPrice();
            let balance = await provider?.getBalance(account)
            if(gasPrice == null || gasPrice === undefined || balance === null || balance === undefined) return;
            const accBalance = ethers.utils.formatEther(balance.toString())
            if (contract?.mintPriceToken === process.env.REACT_APP_NATIVE_TOKEN_ADDRESS) {
                const tokenTransferGas = await payByCryptoEstimate(tokenContract, price?.mintPrice)
                const transferGas = ethers.utils.formatEther((parseFloat(gasPrice.toString()) * tokenTransferGas).toString())
                let total = ((contract?.gasless ? 0 : +gp.gas) + (+transferGas) * 2) + (+price.mintPrice)
                if (total > parseFloat(accBalance)) {
                    setNetworkError(`You do not have enough ${CHAIN_INFO[chainId]?.nativeCurrency?.symbol} in your account to pay for transaction fees on network. Mint price + Estimated gas ~${total} ${CHAIN_INFO[chainId]?.nativeCurrency?.symbol}`)
                    setMintLoading(false)
                    return;
                }
            } else {
                const tokbalance = await tokenContract?.balanceOf(account);
                if (!tokbalance) return;
                const tokenBalance = parseFloat(tokbalance.toString()) / 10 ** _get(USDC, `[${chainId}].decimals`)
                if (+price?.mintPrice > tokenBalance) {
                    setNetworkError(`You do not have enough USDC in your account.`)
                    setMintLoading(false)
                    return;
                }
                let tokenTransferGas2 = null;
                try {
                    tokenTransferGas2 = await payByCryptoEstimate(tokenContract, price?.mintPrice)
                } catch (e) {
                    setNetworkError(`You do not have enough ${CHAIN_INFO[chainId]?.nativeCurrency?.symbol} in your account to pay for transaction fees on network.`)
                    setMintLoading(false)
                    return;
                }
                const tokgas = ethers.utils.formatEther((parseFloat(gasPrice.toString()) * parseFloat(tokenTransferGas2.toString())).toString())
                let totalTransferGas = ((contract?.gasless ? 0 : +gp.gas) + (+tokgas) * 1.2)

                if (totalTransferGas > parseFloat(accBalance)) {
                    setNetworkError(`You do not have enough ${CHAIN_INFO[chainId]?.nativeCurrency?.symbol} in your account to pay for transaction fees on network.`)
                    setMintLoading(false)
                    return;
                }
            }

            

            const response = await payByCrypto(tokenContract, price?.mintPrice);
            await axiosHttp.post(`mint-payment/verify`, {
                chainId: contract?.chainId,
                contract: contract?.address,
                txnReference: response?.transactionHash,
                tokenId,
                paymentType: 'crypto',
            })
                .then(res => {
                    if (res.data) {
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
                    if (res.data) {
                        handleMint(payment, res?.data?.signature)
                    }
                })
                .catch(e => {
                    console.log(e)
                    setMintLoading(false)
                })
        }
    }

    const handlePayByCardGasless = async () => {
        if(!valid() || !account || !chainId) return;
        setMintLoading(true)
        const gp = await calculatePriceAndGasFees()
        const stats: any = await getCurrentTokenId();
        let tokenId = parseFloat(stats.toString());
        const treasury = await getTreasury()

        let balance = await provider?.getBalance(account)
        if(balance === null || balance === undefined) return;
        const accBalance = ethers.utils.formatEther(balance.toString())
        
        if(!contract?.gasless) {
            if (contract?.mintPriceToken === process.env.REACT_APP_NATIVE_TOKEN_ADDRESS) {
                let total = (+gp.gas * 2)
                if (total > parseFloat(accBalance)) {
                    setNetworkError(`You do not have enough ${CHAIN_INFO[chainId]?.nativeCurrency?.symbol} in your account to pay for transaction fees on network. Estimated gas ~${total} ${CHAIN_INFO[chainId]?.nativeCurrency?.symbol}`)
                    setMintLoading(false)
                    return;
                }
            }
        }

        if(!payment) {
            let token = contract?.mintPriceToken === USDC_POLYGON.address ? 'USDC' : 'MATIC'
            let amount: any = +_get(price, 'mintPrice', 0)
            if (token === 'MATIC') {
                const tokenTransferGas = await payByCryptoEstimate(tokenContract, price?.mintPrice)
                const gasPrice = await provider?.getGasPrice();
                if(gasPrice == null || gasPrice === undefined) return;
                const transferGas = ethers.utils.formatEther((parseFloat(gasPrice.toString()) * tokenTransferGas).toString())
                const total = ((+gp.gas) + (+transferGas) * 2) + (+gp.mintPrice)
                amount = total
            }
            console.log('AMOUNT', amount)
            if(isNaN(amount) || !amount) return;
            const order: any = await initTransak({ token, amount, treasury })
            if(order && order?.eventName === "TRANSAK_ORDER_SUCCESSFUL"){
                await axiosHttp.post(`mint-payment/verify`, {
                    chainId, 
                    contract: contract?.address,
                    txnReference: _get(order, 'status.id', null),
                    tokenId,
                    paymentType: 'card',
                    gasless: true
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
            } else if(order && order?.eventName === "TRANSAK_WIDGET_CLOSE"){
                setMintLoading(false)
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
        if (!valid() || !account || !chainId) return;
        setMintLoading(true)
        const gp = await calculatePriceAndGasFees()
        const stats: any = await getCurrentTokenId();
        let tokenId = parseFloat(stats.toString());

        if(!contract.gasless) {
            console.log('Checking balance...')
            const gasPrice = await provider?.getGasPrice();
            if(gasPrice == null || gasPrice === undefined) return;
            let balance = await provider?.getBalance(account)
            if( balance === null || balance === undefined) return;
            const accBalance = ethers.utils.formatEther(balance.toString())
            if (contract?.mintPriceToken === process.env.REACT_APP_NATIVE_TOKEN_ADDRESS) {
                const tokenTransferGas = await payByCryptoEstimate(tokenContract, price?.mintPrice)
                const transferGas = ethers.utils.formatEther((parseFloat(gasPrice.toString()) * tokenTransferGas).toString())
                let total = ((+gp.gas) + (+transferGas) * 2) + (+gp.mintPrice)
                if (total > parseFloat(accBalance)) {
                    setNetworkError(`You do not have enough ${CHAIN_INFO[chainId]?.nativeCurrency?.symbol} in your account to pay for transaction fees on network. Estimated gas ~${total} ${CHAIN_INFO[chainId]?.nativeCurrency?.symbol}`)
                    setMintLoading(false)
                    return;
                }
            } else {
                const tokbalance = await tokenContract?.balanceOf(account);
                if (!tokbalance) return;
                const tokenBalance = parseFloat(tokbalance.toString()) / 10 ** _get(USDC, `[${chainId}].decimals`)
                if (+price?.mintPrice > tokenBalance) {
                    setNetworkError(`You do not have enough USDC in your account.`)
                    setMintLoading(false)
                    return;
                }
                let tokenTransferGas2 = null;
                try {
                    tokenTransferGas2 = await payByCryptoEstimate(tokenContract, price?.mintPrice)
                } catch (e) {
                    setNetworkError(`You do not have enough ${CHAIN_INFO[chainId]?.nativeCurrency?.symbol} in your account to pay for transaction fees on network.`)
                    setMintLoading(false)
                    return;
                }
                const tokgas = ethers.utils.formatEther((parseFloat(gasPrice.toString()) * parseFloat(tokenTransferGas2.toString())).toString())
                let totalTransferGas = ((+gp.gas) + (+tokgas) * 1.2)
    
                if (totalTransferGas > parseFloat(accBalance)) {
                    setNetworkError(`You do not have enough ${CHAIN_INFO[chainId]?.nativeCurrency?.symbol} in your account to pay for transaction fees on network.`)
                    setMintLoading(false)
                    return;
                }
            }
        }

        await axiosHttp.post(`contract/whitelist-signature`, {
            tokenId,
            payment: "--",
            contract: contract?.address,
            chainId: contract?.chainId,
        }).then(res => {
            handleMint("--", res?.data?.signature)
        })
        .catch(e => {
            setMintLoading(false)
            console.log(e)
        })
    }

    const handleMint = async (payment: string | undefined, signature: string | undefined) => {
        if (!valid() || !chainId || !account) return;
        setMintLoading(true)
        try {
            const msg = await encryptMessage(JSON.stringify({ email: _get(state, 'email', ''), discord: _get(state, 'discord', ''), telegram: _get(state, 'telegram', ''), github: _get(state, 'github', '') }))
            const stats: any = await getCurrentTokenId();
            let tokenId = parseFloat(stats.toString());
            const metadataJSON = {
                id: tokenId,
                description: `${contract?.token} SBT TOKEN`,
                name: `${contract?.name}#${tokenId}`,
                image: contract?.image,
                attributes: [
                    {
                        trait_type: "Name",
                        value: state?.name,
                    },
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
                        value: canMintFree ? 0 : price?.mintPrice
                    },
                    {
                        trait_type: "Price Token",
                        value: contract?.mintPriceToken
                    },
                    {
                        trait_type: "Personal Details",
                        value: msg
                    },
                    {
                        trait_type: "Email",
                        value: contract?.contactDetail.indexOf('email') > -1 && state?.email && state?.email.length > 0 ? state?.email : null
                    },
                    {
                        trait_type: "Discord",
                        value: contract?.contactDetail.indexOf('discord') > -1 && state?.discord && state?.discord.length > 0 ? state?.discord : null
                    },
                    {
                        trait_type: "Telegram",
                        value: contract?.contactDetail.indexOf('telegram') > -1 && state?.telegram && state?.telegram.length > 0 ? state?.telegram : null
                    },
                    {
                        trait_type: "Github",
                        value: contract?.contactDetail.indexOf('github') > -1 && state?.github && state?.github.length > 0 ? state?.github : null
                    },
                    ...contract?.contactDetail.filter((c:any) => ['email', 'discord', 'telegram', 'github'].indexOf(c) === -1).map((contact: string) => {
                        return {
                            trait_type: contact,
                            value: state[contact]  
                        }
                    })
                ],
                contract: contract?.address,
            };
            //const ipfsURL: any =  await uploadNFT(metadataJSON, `${process.env.REACT_APP_NODE_BASE_URL}/v1/${contract?.address}/${tokenId}`)
            if (+contract?.version >= 1) {
                const ipfsURL: string = await axiosHttp.post(`metadata/ipfs-metadata`, { metadata: metadataJSON, tokenURI: `${process.env.REACT_APP_NODE_BASE_URL}/v1/${contract?.address}/${tokenId}` }).then(res => res.data)
                const token = await mint(ipfsURL, payment, signature, tokenContract, contract?.gasless, contract?.gasConfig?.apiKey);
            } else {
                const token = await mint(undefined, undefined, undefined, undefined, false, undefined);
            }
            await axiosHttp.post(`metadata`, metadataJSON);
            if(state.email) {
                try {
                    await axiosHttp.post(`utility/send-alert`, { alertType: 'mint-success', to: [state?.email], data: {
                        organizationName: orgData ? orgData?.name : '',
                        organizationLogo: orgData ? orgData?.image : null,
                        sbtName: `${contract?.name}#${tokenId}`,
                        mintDate: moment().local().format('DD-MMM-YYYY'),
                        contractAddress:  beautifyHexToken(contract?.address),
                        tokenId: tokenId,
                        chain: CHAIN_INFO[chainId].label,
                        lomadsLink: `${process.env.REACT_APP_URL}/mint/v2/${_get(contract, 'address', '')}`,
                        chainLogo: `https://lomads-dao-development.s3.eu-west-3.amazonaws.com/EmailAssets/${CHAIN_INFO[chainId].chainName}.png`,
                        image: contract?.image,
                        link: `${CHAIN_INFO[chainId]?.explorer}token/${contract?.address}?a=${tokenId}`,
                        openSea: `${CHAIN_INFO[chainId]?.opensea}${contract?.address}/${tokenId}`,
                        redirectUrl: contract?.redirectUrl ? contract?.redirectUrl?.indexOf('http') > -1 ? contract?.redirectUrl : `https://${contract?.redirectUrl}` : null
                    } })
                } catch (e) {
                    console.log(e)
                }
            }
            setMetadata(metadataJSON)
            setBalance(1);
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
            if (typeof e === 'string')
                setNetworkError(e)
            setTimeout(() => setNetworkError(null), 3000)
            setMintLoading(false)
        }
    }


    const handleApplyDiscount = async () => {
        if(!state?.referralCode || state?.referralCode === '') return;
        setDiscountCheckLoading(true)
        try {
            const value = await axiosHttp.get(`contract/${contract?.address}/validate-discount-code?code=${state?.referralCode}`).then(res => res.data)
            const discountValue = +contract?.mintPrice - (+contract?.mintPrice * (value.percentage / 100))
            console.log("discountValue", discountValue)
            setPrice((prev: any) => {
                return {
                     ...prev,
                     mintPrice: `${discountValue}`
                }
            })
            setDiscountMessage(`Discount of ${value.percentage}% applied`)
            setDiscountCheckLoading(null)
        } catch (e) {
            toast.error("Invalid discount code")
            setDiscountCheckLoading(null)
            console.log(e)
        }
    }

    return (
        <Container>
            <Grid container className={classes.root}>
                <Grid item sm={12} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <Box sx={{ mt:5 }} display="flex" alignItems="flex-start" justifyContent={"flex-start"} style={{ width: '100%', height: '100px' }}>
                        <Box>
                            <Typography sx={{ marginLeft: "20px" }} className={classes.title}>{orgData ? orgData.name : ''}</Typography>
                            <Typography sx={{ marginLeft: "20px", maxWidth: 800 }} className={classes.subtitle}>{orgData ? orgData.description : ''}</Typography>
                        </Box>
                    </Box>
                    <Box mt={0} style={{ width: '100%', minHeight: '568px', display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                        <Grid ml={1} container style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', height: '100%' }}>
                            <Grid p={2} item xs={12} sm={4} style={{ backgroundColor: '#FDEEEC', borderRadius: '5px 0 0 5px' }}>
                                <Box style={{ borderRadius: '5px', width: '330px', height: '330px' }}>
                                    <img src={balance === 1 ? _get(metadata, 'image') : _get(contract, 'image')} style={{  backgroundColor: "rgba(234, 100, 71, 0.1)", objectFit: 'contain', width: '100%', height: '100%', borderRadius: 5 }} />
                                </Box>

                                <Box py={4} style={{ maxWidth: '330px', display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                                    <Typography style={{ fontSize: 26, lineHeight: '30px', fontWeight: 700, color: "#B12F15" }}>{_get(contract, 'token')}</Typography>
                                </Box>

                                { balance === 0 ?
                                <Box py={2} style={{ borderRadius: 5, width: '100%' }}>
                                    <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Typography style={{ fontSize: 16, fontWeight: 700, color: '#EA6447' }}>
                                            Price
                                        </Typography>
                                        <Box mx={2} mt={1} style={{ flexGrow: 1, borderBottom: '1px dashed rgba(177, 47, 21, 0.15)' }}></Box>
                                        <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: 14, fontWeight: 700, color: "rgba(234, 100, 71, 0.7)" }}>€{ canMintFree ?  "0.00" : parseFloat(_get(price, 'mintPriceinUsd', 0)).toFixed(2)} /</Typography>
                                            { canMintFree ? 
                                                 <Typography ml={2} style={{ fontSize: 16, fontWeight: 700, color: '#EA6447' }}>{"0.00"} {contract?.mintPriceToken === USDC_GOERLI.address || contract?.mintPriceToken === USDC_POLYGON.address ? 'USDC' : CHAIN_INFO[contract?.chainId]?.nativeCurrency?.symbol} { contract?.gasless ? '' : '+ Gas'}</Typography> :
                                                <Typography ml={2} style={{ fontSize: 16, fontWeight: 700, color: '#EA6447' }}>{parseFloat(_get(price, 'mintPrice', 0)).toFixed(2)} {contract?.mintPriceToken === USDC_GOERLI.address || contract?.mintPriceToken === USDC_POLYGON.address ? 'USDC' : CHAIN_INFO[contract?.chainId]?.nativeCurrency?.symbol} { contract?.gasless ? '' : '+ Gas'}</Typography>
                                            }
                                        </Box>
                                    </Box>
                                </Box> : 
                                 <Box py={2} style={{ borderRadius: 5, width: '100%' }}>
                                    <Box mt={0} mb={2} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Typography style={{ fontSize: 16, fontWeight: 700, color: '#EA6447' }}>
                                            Contract
                                        </Typography>
                                        <Box mx={2} mt={1} style={{ flexGrow: 1, borderBottom: '1px dashed rgba(177, 47, 21, 0.15)' }}></Box>
                                        <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: 14, fontWeight: 700, color: "rgba(234, 100, 71, 0.7)", marginRight: 8 }}>{ beautifyHexToken(contract?.address) }</Typography>
                                            <IconButton onClick={() => {
                                                navigator.clipboard.writeText(`${contract?.address}`);
                                                toast.success('Copied to clipboard')
                                            }} style={{ marginRight: 0 }}>
                                                <img src={LINK_SVG} />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    <Box my={2} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Typography style={{ fontSize: 16, fontWeight: 700, color: '#EA6447' }}>
                                            Token Id
                                        </Typography>
                                        <Box mx={2} mt={1} style={{ flexGrow: 1, borderBottom: '1px dashed rgba(177, 47, 21, 0.15)' }}></Box>
                                        <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: 14, fontWeight: 700, color: "rgba(234, 100, 71, 0.7)" }}>{ metadata?.id }</Typography>
                                        </Box>
                                    </Box>
                                    <Box my={2} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Typography style={{ fontSize: 16, fontWeight: 700, color: '#EA6447' }}>
                                            Token Standard
                                        </Typography>
                                        <Box mx={2} mt={1} style={{ flexGrow: 1, borderBottom: '1px dashed rgba(177, 47, 21, 0.15)' }}></Box>
                                        <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: 14, fontWeight: 700, color: "rgba(234, 100, 71, 0.7)" }}>ERC721</Typography>
                                        </Box>
                                    </Box>
                                    <Box my={2}  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Typography style={{ fontSize: 16, fontWeight: 700, color: '#EA6447' }}>
                                            Chain
                                        </Typography>
                                        <Box mx={2} mt={1} style={{ flexGrow: 1, borderBottom: '1px dashed rgba(177, 47, 21, 0.15)' }}></Box>
                                        <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: 14, fontWeight: 700, color: "rgba(234, 100, 71, 0.7)" }}>{ CHAIN_INFO[+contract?.chainId]?.label }</Typography>
                                        </Box>
                                    </Box>
                                 </Box>
                                }

                            </Grid>
                           
                            <Grid p={2} item xs={12} sm={8} style={{ backgroundColor: '#FFF', borderRadius: '0 5px 5px 0' }}>
                                {                  
                                    user && account ?
                                    <> 
                                        { balance === 0 && !isWhiteListed ?
                                        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" style={{ height: '100%', width: '100%' }}>
                                            {/* <Box style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#B12F15' }}></Box> */}
                                            <Typography style={{ fontSize: '24px', fontWeight: '600', lineHeight: '33px', textAlign: 'center', marginTop: '25px', marginBottom: '15px', color: '#1B2B41' }}>Not whitelisted</Typography>
                                            <Typography style={{ fontSize: '12px', fontWeight: '400', lineHeight: '16px', textAlign: 'center', color: 'rgba(27, 43, 65, 0.5)' }}>You are not whitelisted for this organisation</Typography>
                                        </Box> :
                                        <>
                                        { balance === 1  ? 
                                        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" style={{ height: '100%', width: '100%' }}>
                                            <Box style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#B12F15' }}></Box>
                                            <Typography style={{ fontSize: '24px', fontWeight: '600', lineHeight: '33px', textAlign: 'center', marginTop: '25px', marginBottom: '15px', color: '#1B2B41' }}>Thank you for minting<br />your pass token. </Typography>
                                            <Typography style={{ fontSize: '12px', fontWeight: '400', lineHeight: '16px', textAlign: 'center', color: 'rgba(27, 43, 65, 0.5)' }}>you will be soon redirected to the dashboard in ... 3s</Typography>
                                        </Box> :
                                        <Box display="flex" flexDirection="column" alignItems="center" style={{ marginTop: '50px' }}>
                                            <Box>
                                                <TextInput
                                                    value={state["name"]}
                                                    error={errors['name']}
                                                    helperText={errors['name']}
                                                    onChange={(e: any) => setState((prev: any) => { return { ...prev, name: e.target.value } })}
                                                    placeholder="Aragron"
                                                    sx={{ my: 1, width: '400px', height: '40px' }}
                                                    label="Name"
                                                />
                                            </Box>
                                            {
                                                contract?.contactDetail.map((item: string, index: number) => {
                                                    if (item === 'discord') {
                                                        return (
                                                            <Box sx={{ marginTop: '17px' }}>
                                                                <Box sx={{ width: '400px', padding: '16px 0' }} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                                                                    <Box display={"flex"} alignItems={"center"}>
                                                                        <img src={discord} alt="discord" />
                                                                        <Typography style={{ fontSize: '16px', fontWeight: '600', color: '#1b2b41', marginLeft: '24px' }}>Discord</Typography>
                                                                    </Box>
                                                                    {
                                                                        state?.discord ?
                                                                        <Box style={{  }}>{ state?.discord }</Box> : 
                                                                        <Button onClick={() => handleDiscord()} className={classes.createBtn}>CONNECT</Button>
                                                                    }
                                                                </Box>
                                                            </Box>
                                                        )
                                                    }
                                                    else {
                                                        return (
                                                            <Box sx={{ marginTop: '17px' }}>
                                                                <TextInput
                                                                    value={state[`${item}`]}
                                                                    error={errors[`${item}`]}
                                                                    helperText={errors[`${item}`]}
                                                                    onChange={(e: any) => setState((prev: any) => { return { ...prev, [item]: e.target.value } })}
                                                                    placeholder={item}
                                                                    sx={{ my: 1, width: '400px', height: '40px' }}
                                                                    label={item} />
                                                            </Box>
                                                        )
                                                    }
                                                })
                                            }
                                            { contract?.hasDiscountCodes && 
                                                <Box>
                                                <Box display="flex" flexDirection="row" alignItems="center" sx={{ marginTop: '17px', width: '400px' }}>
                                                    <TextInput
                                                        fullWidth
                                                        disabled={discountMessage}
                                                        value={state["referralCode"]}
                                                        error={errors[`referralCode`]}
                                                        helperText={errors[`referralCode`]}
                                                        onChange={(e: any) => setState((prev: any) => { return { ...prev, referralCode: e.target.value } })}
                                                        placeholder={""}
                                                        sx={{ my: 1, mr: 1, height: '40px' }}
                                                        label={"Discount code"} />
                                                        {
                                                            discountMessage ? 
                                                            <Button loading={discountCheckLoading} onClick={() => {
                                                                setState((prev: any) => { return { ...prev, referralCode: '' } })
                                                                setDiscountMessage(null)
                                                                setPrice((prev: any) => { return { ...prev, mintPrice: contract?.mintPrice } })
                                                            }} sx={{ mt: 4 }} size="small" variant="outlined">Remove</Button> : 
                                                            <Button loading={discountCheckLoading} onClick={() => handleApplyDiscount()} sx={{ mt: 4 }} size="small" variant="outlined">Apply</Button>
                                                        }
                                                </Box> 
                                                {  discountMessage &&
                                                    <Box mt={2} display="flex" flexDirection="row" alignItems="center">
                                                        <CheckIcon color='success'/>
                                                        <Typography fontSize={12} color="#188C7C">{ discountMessage }</Typography>
                                                    </Box>
                                                }
                                                </Box>
                                            }
                                            <Box sx={{ width: '400px', margin: '25px 0' }} display={"flex"} alignItems="center" justifyContent={"center"}>
                                                {/* <Button className={classes.footerBtn} style={{ border: '1px solid #C94B32' }} onClick={handlePayByCard}>PAY BY CARD</Button>
                                                <Button className={classes.footerBtn} sx={{ background: '#C94B32', color: '#FFF' }} onClick={handlePayByCrypto}>PAY BY CRYPTO</Button> */}

                                                {balance === 0 ?
                                                    <>
                                                    {
                                                    canMintFree ?
                                                    <Button className={classes.footerBtn}  loading={mintLoading} disabled={mintLoading} onClick={() => {
                                                        if (+contract?.version >= 1) {
                                                            mintFree()
                                                        } else {
                                                            handleMint(undefined, undefined)
                                                        }
                                                    }} style={{ marginTop: 32 }} fullWidth variant="outlined" color="primary">{"MINT"}</Button>:
                                                    <Button className={classes.footerBtn}  loading={mintLoading} disabled={mintLoading} onClick={() => {
                                                        if (+contract?.version >= 1) {
                                                            if (price?.mintPrice && price?.mintPrice !== "0") {
                                                                handlePayByCrypto()
                                                            } else {
                                                                mintFree()
                                                            }
                                                        } else {
                                                            handleMint(undefined, undefined)
                                                        }
                                                    }} style={{ marginTop: 32 }} fullWidth variant="outlined" color="primary">{
                                                            payment ? "MINT" : price?.mintPrice === "0" ? "MINT" : "PAY BY CRYPTO"}</Button>
                                                    }
                                                    </> :
                                                    <Button className={classes.footerBtn} loading={mintLoading} disabled={mintLoading} onClick={() => handleUpdateMetadata()} style={{ marginTop: 32 }} fullWidth variant="contained" color="primary">UPDATE</Button>
                                                }

                                            {!payment && balance === 0 && contract && +price?.mintPrice >= 27 &&
                                                <Button className={classes.footerBtn} loading={mintLoading} disabled={mintLoading} onClick={() => {
                                                    if (valid()) {
                                                        setShowDrawer(false)
                                                        handlePayByCardGasless()
                                                    }
                                                }} style={{ marginTop: 32 }} fullWidth variant="contained" color="primary">PAY BY CARD</Button>
                                            }

                                            </Box>
                                            {
                                                networkError
                                                &&
                                                <Typography my={2} textAlign="center" color="error" variant="body2">{networkError}</Typography>
                                            }
                                        </Box> }
                                        </> }
                                        </>
                                    :
                                    null
                                }
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Drawer
                    PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
                    sx={{ zIndex: 99999 }}
                    anchor={'right'}
                    open={showDrawer}
                    onClose={() => setShowDrawer(false)}>
                    <Box sx={{ width: 575, paddingBottom: '60px', borderRadius: '20px 0px 0px 20px' }}>
                        <IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={() => setShowDrawer(false)}>
                            <img src={CloseSVG} />
                        </IconButton>
                        <Box display="flex" flexDirection="column" my={6} alignItems="center">
                            <img src={MintSBTSvg} />
                            <Typography my={4} style={{ color: palette.primary.main, fontSize: '30px', fontWeight: 400 }}>{balance === 1 ? "Update details" : "Contact details"}</Typography>
                        </Box>
                        <Box px={12}>
                            <TextInput
                                value={state["name"]}
                                error={errors['name']}
                                helperText={errors['name']}
                                onChange={(e: any) => setState((prev: any) => { return { ...prev, name: e.target.value } })}
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
                                            onChange={(e: any) => setState((prev: any) => { return { ...prev, email: e.target.value } })}
                                            placeholder="Enter your email" sx={{ my: 1 }} fullWidth />
                                    </Box>
                                }
                                {contract?.contactDetail.indexOf('discord') > -1 &&
                                    <>
                                        {state['discord'] ?
                                            <>
                                                <Box mt={2} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                                                    <img style={{ width: 36, marginRight: 12 }} src={DiscordGreenSVG} />
                                                    <Button fullWidth endIcon={<img src={CheckSVG} />} variant="contained" color="success">
                                                        <Typography style={{ color: "#FFF" }}>CONNECTED TO DISCORD</Typography>
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
                                                {errors['discord'] && <FormHelperText style={{ marginLeft: 58, marginTop: 4, color: '#e53935' }}>{errors['discord']}</FormHelperText>}
                                            </>}
                                    </>
                                }
                                {contract?.contactDetail.indexOf('github') > -1 &&
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
                                            onChange={(e: any) => setState((prev: any) => { return { ...prev, github: e.target.value } })}
                                            placeholder="Enter your github" sx={{ my: 1 }} fullWidth />
                                    </Box>
                                }
                                {contract?.contactDetail.indexOf('telegram') > -1 &&
                                    <Box my={1} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                                        <img style={{ width: 36, marginRight: 12 }} src={state["telegram"] ? TelegramGreenSVG : TelegramSVG} />
                                        <TextInput
                                            value={state["telegram"]}
                                            error={errors['telegram']}
                                            helperText={errors['telegram']}
                                            onChange={(e: any) => setState((prev: any) => { return { ...prev, telegram: e.target.value } })}
                                            placeholder="Enter your telegram" sx={{ my: 1 }} fullWidth />
                                    </Box>
                                }
                            </Box>
                            <Typography mt={2} variant='body1' style={{ textAlign: 'center' }}>Your contact details are encrypted using advanced public key encryption technology, ensuring that your personal information stays safe and secure.</Typography>
                            {balance === 0 ?
                                <>
                                { canMintFree ? 
                                <Button loading={mintLoading} disabled={mintLoading} onClick={() => {
                                    if (+contract?.version >= 1) {
                                        mintFree()
                                    } else {
                                        handleMint(undefined, undefined) 
                                    }
                                }} style={{ marginTop: 32 }} fullWidth variant="contained" color="primary">{"MINT"}</Button> : 
                                <Button loading={mintLoading} disabled={mintLoading} onClick={() => {
                                    if (+contract?.version >= 1) {
                                        if (price?.mintPrice && price?.mintPrice !== "0") {
                                            handlePayByCrypto()
                                        } else {
                                            mintFree()
                                        }
                                    } else {
                                        handleMint(undefined, undefined) 
                                    }
                                }} style={{ marginTop: 32 }} fullWidth variant="contained" color="primary">{
                                        payment ? "MINT" : price?.mintPrice === "0" ? "MINT" : "PAY BY CRYPTO"}</Button> 
                                }
                                </> :
                                <Button loading={mintLoading} disabled={mintLoading} onClick={() => handleUpdateMetadata()} style={{ marginTop: 32 }} fullWidth variant="contained" color="primary">UPDATE</Button>
                            }

                            {!payment && balance === 0 && contract && +price?.mintPrice >= 27 &&
                                <Button loading={mintLoading} disabled={mintLoading} onClick={() => {
                                    if (valid()) {
                                        setShowDrawer(false)
                                        handlePayByCardGasless()
                                    }
                                }} style={{ marginTop: 32 }} fullWidth variant="contained" color="primary">PAY BY CARD</Button>
                            }

                            {networkError && typeof networkError === 'string' && <Typography my={2} textAlign="center" color="error" variant="body2">{networkError}</Typography>}
                        </Box>
                    </Box>
                </Drawer>
            </Grid>
        </Container>
    )
}