import { useEffect, useState, useCallback } from "react"
import { get as _get, find as _find } from 'lodash'
import axios from "axios";
import { GNOSIS_SAFE_BASE_URLS, SupportedChainId } from 'constants/chains';
import { useWeb3React } from "@web3-react/core";
import { usePrevious } from "./usePrevious";
import axiosHttp from '../api'
import { setSafeTokens } from "state/dashboard/reducer";
import { useAppDispatch, useAppSelector } from "state/hooks";

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

    const prevSafeAddress = usePrevious(safeAddress)

    useEffect(() => {
        if(chainId && safeAddress !== "" && safeAddress !== null && !safeTokens){
            console.log('calling safe tokens..', prevSafeAddress, safeAddress)
            axios.get(`${GNOSIS_SAFE_BASE_URLS[chainId]}/api/v1/safes/${safeAddress}/balances/usd/`, {withCredentials: false })
            .then((res: any) => {
                let tokens = res.data.map((t: any) => {
                    let tkn = t
                    if(!tkn.tokenAddress){
                        return {
                            ...t,
                            tokenAddress: chainId === SupportedChainId.POLYGON ? process.env.REACT_APP_MATIC_TOKEN_ADDRESS : process.env.REACT_APP_GOERLI_TOKEN_ADDRESS,
                            token: {
                                symbol: chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR',
                                decimal: 18
                            }
                        }
                    }
                    return t 
                })
                if(tokens && tokens.length > 0) {
                    let total = tokens.reduce((a:any, b:any) => {
                        return a + parseFloat(_get(b, 'fiatBalance', 0))
                    }, 0);
                    axiosHttp.post(`/safe/${safeAddress}/sync`, { tokens, balance: total })
                }
                dispatch(setSafeTokens(tokens))
            })
        }
    }, [chainId, safeAddress, prevSafeAddress, safeTokens])

    return { safeTokens, tokenBalance }

}

export default useSafeTokens