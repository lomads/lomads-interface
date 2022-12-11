import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { FeeAmount } from '@uniswap/v3-sdk'
import axios from 'axios'
import { GNOSIS_SAFE_BASE_URLS } from 'constants/chains'
import { SupportedChainId } from "constants/chains";
import { get as _get } from 'lodash'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export const isValidUrl = (urlString: string) => {
  var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
  return !!urlPattern.test(urlString);
}

export const formatAddress = (address: string) => {
  return address.slice(0, 8) + '...' + address.slice(-6);
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// account is not optional
export function getSigner(provider: JsonRpcProvider, account: string): JsonRpcSigner {
  return provider.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(provider: JsonRpcProvider, account?: string): JsonRpcProvider | JsonRpcSigner {
  return account ? getSigner(provider, account) : provider
}

// account is optional
export function getContract(address: string, ABI: any, provider: JsonRpcProvider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(provider, account) as any)
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function formattedFeeAmount(feeAmount: FeeAmount): number {
  return feeAmount / 10000
}

export function beautifyHexToken(token: string): string {
  return (token?.slice(0, 6) + "..." + token?.slice(-4))
}


export async function getSafeTokens(chainId: number, safeAddress: string): Promise<any> {
  if (safeAddress && chainId) {
    return axios
      .get(
        `${GNOSIS_SAFE_BASE_URLS[chainId]}/api/v1/safes/${safeAddress}/balances/usd/`
      )
      .then((tokens) => {
        let tkns = tokens.data;
        tkns = tkns.map((tkn: any) => {
          return {
            ...tkn,
            tokenAddress: tkn.tokenAddress ? tkn.tokenAddress : chainId === SupportedChainId.POLYGON ? process.env.REACT_APP_MATIC_TOKEN_ADDRESS : process.env.REACT_APP_GOERLI_TOKEN_ADDRESS,
            token: {
              ...(tkn.token ? { ...tkn.token } : {
                symbol: _get(tkn, 'token.symbol', chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR')
              })
            }
          }
        })
        return tokens.data
      });
  }
};