import { Contract } from '@ethersproject/contracts'
import IUniswapV2PairJson from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import IUniswapV2Router02Json from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import UniswapInterfaceMulticallJson from '@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json'
import V3MigratorJson from '@uniswap/v3-periphery/artifacts/contracts/V3Migrator.sol/V3Migrator.json'
import { useWeb3React } from '@web3-react/core'
import ARGENT_WALLET_DETECTOR_ABI from '../abis/argent-wallet-detector.json'
import EIP_2612 from '../abis/eip_2612.json'
import ENS_PUBLIC_RESOLVER_ABI from '../abis/ens-public-resolver.json'
import ENS_ABI from '../abis/ens-registrar.json'
import ERC20_ABI from '../abis/erc20.json'
import ERC20_BYTES32_ABI from '../abis/erc20_bytes32.json'
import ERC721_ABI from '../abis/erc721.json'
import ERC1155_ABI from '../abis/erc1155.json'
import SBTDEPLOYER_ABI from "../abis/SBTDeployer.json";
import SBT_ABI from "../abis/SBT.json";
import { ArgentWalletDetector, EnsPublicResolver, EnsRegistrar, Erc20, Erc721, Erc1155, Weth } from '../abis/types'
import WETH_ABI from '../abis/weth.json'
import {
  ARGENT_WALLET_DETECTOR_ADDRESS,
  ENS_REGISTRAR_ADDRESSES,
  MULTICALL_ADDRESS,
  V2_ROUTER_ADDRESS,
  V3_MIGRATOR_ADDRESSES,
  DAOFACTORY_ADDRESSES,
  SBT_DEPLOYER_ADDRESSES
} from 'constants/addresses'
import { WRAPPED_NATIVE_CURRENCY } from 'constants/tokens'
import { useMemo } from 'react'
import { UniswapInterfaceMulticall } from 'types/v3'
import { V3Migrator } from 'types/v3/V3Migrator'

import { ABI as DAOAbi } from "abis/DaoFactory";
import { getContract } from '../utils'
import { TOKEN_ABI as TokenAbi } from 'abis/DaoToken'
import { SupportedChainId } from 'constants/chains'

const { abi: IUniswapV2PairABI } = IUniswapV2PairJson
const { abi: IUniswapV2Router02ABI } = IUniswapV2Router02Json
const { abi: MulticallABI } = UniswapInterfaceMulticallJson
const { abi: V2MigratorABI } = V3MigratorJson


// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { provider, account, chainId } = useWeb3React()

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !provider || !chainId) return null
    let address: string | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      console.log("useContract", addressOrAddressMap)
      return getContract(address, ABI, provider, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, ABI, provider, chainId, withSignerIfPossible, account]) as T
}

export function useV2MigratorContract() {
  return useContract<V3Migrator>(V3_MIGRATOR_ADDRESSES, V2MigratorABI, true)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean) {
  const { chainId } = useWeb3React()
  return useContract<Weth>(
    chainId ? WRAPPED_NATIVE_CURRENCY[chainId]?.address : undefined,
    WETH_ABI,
    withSignerIfPossible
  )
}

export function useERC721Contract(nftAddress?: string) {
  return useContract<Erc721>(nftAddress, ERC721_ABI, false)
}

export function useERC1155Contract(nftAddress?: string) {
  return useContract<Erc1155>(nftAddress, ERC1155_ABI, false)
}

export function useArgentWalletDetectorContract() {
  return useContract<ArgentWalletDetector>(ARGENT_WALLET_DETECTOR_ADDRESS, ARGENT_WALLET_DETECTOR_ABI, false)
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean) {
  return useContract<EnsRegistrar>(ENS_REGISTRAR_ADDRESSES, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean) {
  return useContract<EnsPublicResolver>(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function useEIP2612Contract(tokenAddress?: string): Contract | null {
  return useContract(tokenAddress, EIP_2612, false)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible)
}

export function useV2RouterContract(): Contract | null {
  return useContract(V2_ROUTER_ADDRESS, IUniswapV2Router02ABI, true)
}

export function useInterfaceMulticall() {
  return useContract<UniswapInterfaceMulticall>(MULTICALL_ADDRESS, MulticallABI, false) as UniswapInterfaceMulticall
}

export function useDAOContract() {
  return useContract(DAOFACTORY_ADDRESSES, DAOAbi, true);
} 
export function DAOTokenContract(_tokenAddress: string) {
  return useContract(_tokenAddress,TokenAbi,true)
}

export function useSBTDeployerContract(){
  const { chainId } = useWeb3React()
  let path = require('../abis/SBTDeployerv0.json')
  return useContract(SBT_DEPLOYER_ADDRESSES, path, true);
}

export function useSBTContract(contractAddr : String) {
  const { chainId } = useWeb3React()
  let path = require('../abis/SBTv0.json')
  return useContract(contractAddr, path, true);
}

export function useAllowanceContract(contractAddr : String) {
  let path = require('../allowanceAbis/AllowanceModule.json')
  return useContract(contractAddr, path, true);
}