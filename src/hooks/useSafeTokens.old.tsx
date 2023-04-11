import { useEffect, useState, useCallback } from "react"
import { get as _get, find as _find } from 'lodash'
import axios from "axios";
import { GNOSIS_SAFE_BASE_URLS, SupportedChainId } from 'constants/chains';
import { useWeb3React } from "@web3-react/core";
import { usePrevious } from "./usePrevious";
import axiosHttp from '../api'
import { setSafeTokens } from "state/dashboard/reducer";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { CHAIN_INFO } from "constants/chainInfo";

const useSafeTokens = (safeAddress: string | null) => {
    const { DAO } = useAppSelector(store => store.dashboard)
    // const { chainId } = useWeb3React();
    const [chainId, setChainId] = useState(null)
    useEffect(() => {
        if(DAO?.chainId) {
            setChainId(DAO?.chainId)
        }
    }, [DAO])
    const dispatch = useAppDispatch();
    //const [safeTokens, setSafeTokens] = useState([]);
    const { safeTokens } = useAppSelector(store => store.dashboard)

    const tokenBalance = (token: any) => {
        if(safeTokens && safeTokens.length > 0) {
            let selToken = _find(safeTokens, t => _get(t, 'tokenAddress', null) === token)
			if (safeTokens.length > 0 && !selToken)
			    selToken = safeTokens[0];
            return _get(selToken, 'balance', 0) / 10 ** _get(selToken, 'token.decimals', 18)
        }
        return 0
    }

    const prevSafeAddr = usePrevious(_get(DAO, 'safe.address'))

    useEffect(() => {
        if(chainId && DAO && DAO?.safe?.address && (prevSafeAddr !== DAO?.safe?.address)){
            axios.get(`${GNOSIS_SAFE_BASE_URLS[chainId]}/api/v1/safes/${DAO?.safe?.address}/balances/usd/`, {withCredentials: false })
            .then((res: any) => {
                let tokens = res.data.map((t: any) => {
                    let tkn = t
                    if(!tkn.tokenAddress){
                        return {
                            ...t,
                            tokenAddress: chainId === process.env.REACT_APP_NATIVE_TOKEN_ADDRESS,
                            token: {
                                symbol: CHAIN_INFO[chainId].nativeCurrency.symbol,
                                decimal:  CHAIN_INFO[chainId].nativeCurrency.decimals
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
                dispatch(setSafeTokens(tokens))
            })
        }
    }, [chainId, DAO?.safe?.address, prevSafeAddr])

    return { safeTokens, tokenBalance }

}

export default useSafeTokens