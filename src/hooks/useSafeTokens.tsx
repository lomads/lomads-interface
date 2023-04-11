import React, { createContext, useContext, useEffect, useState } from "react";
import {  get as _get } from 'lodash'
import { useAppDispatch, useAppSelector } from "state/hooks";
import axios from "axios";
import { GNOSIS_SAFE_BASE_URLS } from 'constants/chains';
import { CHAIN_INFO } from "constants/chainInfo";
import axiosHttp from '../api'

export const SafeTokensContext = createContext<any>({
    safeTokens: null
})

export function useSafeTokens(): any {
    return useContext(SafeTokensContext);
}

export const SafeTokensProvider = ({ children }: any) => {
    const dispatch = useAppDispatch()
    const { DAO } = useAppSelector(store => store?.dashboard)
    const [safeTokens, setSafeTokens] = useState<any>(null);

    const setTokens = async () => {
        setSafeTokens(null)
        axios.get(`${GNOSIS_SAFE_BASE_URLS[DAO?.chainId]}/api/v1/safes/${DAO?.safe?.address}/balances/usd/`, {withCredentials: false })
            .then((res: any) => {
                let tokens = res.data.map((t: any) => {
                    let tkn = t
                    if(!tkn.tokenAddress){
                        return {
                            ...t,
                            tokenAddress: DAO?.chainId === process.env.REACT_APP_NATIVE_TOKEN_ADDRESS,
                            token: {
                                symbol: CHAIN_INFO[DAO?.chainId].nativeCurrency.symbol,
                                decimal:  CHAIN_INFO[DAO?.chainId].nativeCurrency.decimals
                            }
                        }
                    }
                    return t 
                })
                if(tokens && tokens.length > 0) {
                    let total = tokens.reduce((a:any, b:any) => {
                        return a + parseFloat(_get(b, 'fiatBalance', 0))
                    }, 0);
                    axiosHttp.post(`/safe/${DAO?.safe?.address}/sync`, { tokens, balance: total })
                }
                setSafeTokens(tokens)
            })
    }

    useEffect(() => {
        if(DAO?.url) {
            setTokens()
        }
    }, [DAO?.url])

    const contextProvider = {
        safeTokens
    };
    return <SafeTokensContext.Provider value={contextProvider}>{children}</SafeTokensContext.Provider>;
}