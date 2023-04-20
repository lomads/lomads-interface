import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {  get as _get, find as _find } from 'lodash'
import { useAppDispatch, useAppSelector } from "state/hooks";
import axios from "axios";
import { GNOSIS_SAFE_BASE_URLS } from 'constants/chains';
import { CHAIN_INFO } from "constants/chainInfo";
import axiosHttp from '../api'
import { useWeb3React } from "@web3-react/core";

export const SafeTokensContext = createContext<any>({
    safeTokens: null
})

export function useSafeTokens(): any {
    return useContext(SafeTokensContext);
}

export const SafeTokensProvider = ({ children }: any) => {
    const { chainId: currentChainId } = useWeb3React()
    const [chainId, setChainId] = useState(null)
    const dispatch = useAppDispatch()
    const { DAO } = useAppSelector(store => store?.dashboard)
    const [safeTokens, setSafeTokens] = useState<any>(null);

    useEffect(() => {
        if(DAO && DAO?.url) 
            setChainId(_get(DAO, 'safe.chainId', _get(DAO, 'chainId')))
    }, [DAO?.url])

    const tokenBalance = useCallback((token: any) => {
        if(safeTokens && safeTokens.length > 0) {
            let selToken = _find(safeTokens, t => _get(t, 'tokenAddress', null) === token)
			if (safeTokens.length > 0 && !selToken)
			    selToken = safeTokens[0];
            return _get(selToken, 'balance', 0) / 10 ** _get(selToken, 'token.decimals', 18)
        }
        return 0
    }, [safeTokens])

    const setTokens = async () => {
        if(!chainId) return;
        setSafeTokens(null)
        axios.get(`${GNOSIS_SAFE_BASE_URLS[chainId]}/api/v1/safes/${DAO?.safe?.address}/balances/usd/`, {withCredentials: false })
            .then((res: any) => {
                let tokens = res.data.map((t: any) => {
                    let tkn = t
                    if(!tkn.tokenAddress){
                        return {
                            ...t,
                            tokenAddress: process.env.REACT_APP_NATIVE_TOKEN_ADDRESS,
                            token: {
                                symbol: CHAIN_INFO[chainId].nativeCurrency.symbol,
                                decimal:  CHAIN_INFO[chainId].nativeCurrency.decimals,
                                decimals:  CHAIN_INFO[chainId].nativeCurrency.decimals,
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
        if(chainId) {
            setTokens()
        }
    }, [chainId, currentChainId])

    const contextProvider = {
        safeTokens,
        tokenBalance
    };
    return <SafeTokensContext.Provider value={contextProvider}>{children}</SafeTokensContext.Provider>;
}