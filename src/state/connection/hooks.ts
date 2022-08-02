import { CurrencyAmount, Token } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import JSBI from 'jsbi'
import { useTokenBalance, useTokenBalancesWithLoadingIndicator } from 'hooks/useCurrencyBalance'
import { useMemo } from 'react'

import { UNI } from '../../constants/tokens'
import { useAllTokens } from '../../hooks/Tokens'

export {
  default as useCurrencyBalance,
  useCurrencyBalances,
  useNativeCurrencyBalances,
  useTokenBalance,
  useTokenBalances,
  useTokenBalancesWithLoadingIndicator,
} from 'hooks/useCurrencyBalance'

// mimics useAllBalances
export function useAllTokenBalances(): [{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }, boolean] {
  const { account } = useWeb3React()
  const allTokens = useAllTokens()
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  const [balances, balancesIsLoading] = useTokenBalancesWithLoadingIndicator(account ?? undefined, allTokensArray)
  return [balances ?? {}, balancesIsLoading]
}