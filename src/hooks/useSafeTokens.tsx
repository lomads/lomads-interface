import { useEffect, useState, useCallback } from "react"
import { get as _get, find as _find } from 'lodash'
import axios from "axios";
import { GNOSIS_SAFE_BASE_URLS, SupportedChainId } from 'constants/chains';
import { useWeb3React } from "@web3-react/core";

const useSafeTokens = (safeAddress: string) => {

    const { chainId } = useWeb3React();
    const [safeTokens, setSafeTokens] = useState([]);

    const tokenBalance = useCallback((token: any) => {
        if(safeTokens && safeTokens.length > 0) {
            let selToken = _find(safeTokens, t => _get(t, 'tokenAddress', null) === token)
			if (safeTokens.length > 0 && !selToken)
			    selToken = safeTokens[0];
            return _get(selToken, 'balance', 0) / 10 ** _get(selToken, 'token.decimals', 18)
        }
        return 0
    }, [safeTokens])

    useEffect(() => {
        if(chainId && safeAddress){
            axios.get(`${GNOSIS_SAFE_BASE_URLS[chainId]}/api/v1/safes/${safeAddress}/balances/usd/`, {withCredentials: false })
            .then(res => {
                let tokens = res.data.map((t: any) => {
                    let tkn = t
                    if(!tkn.tokenAddress){
                        return {
                            ...t,
                            tokenAddress: chainId === SupportedChainId.POLYGON ? process.env.REACT_APP_MATIC_TOKEN_ADDRESS : process.env.REACT_APP_GOERLI_TOKEN_ADDRESS,
                            token: {
                                symbol: chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR'
                            }
                        }
                    }
                        return t 
                })
                setSafeTokens(tokens)
            })
        }
    }, [chainId, safeAddress])

    return { safeTokens, tokenBalance }

}

export default useSafeTokens