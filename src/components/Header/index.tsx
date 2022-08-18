import { useContext, useEffect } from 'react'
import { Trans } from '@lingui/macro'
import useScrollPosition from '@react-hook/window-scroll'
import { useWeb3React } from '@web3-react/core'
import { Text } from 'rebass'
import { CHAIN_INFO } from 'constants/chainInfo'
import { SupportedChainId } from 'constants/chains'
import useTheme from 'hooks/useTheme'
import { useNativeCurrencyBalances } from 'state/connection/hooks'
import { useDarkModeManager } from 'state/user/hooks'
import styled from 'styled-components/macro'
import { isChainAllowed, switchChain } from 'utils/switchChain'
import Web3Status from '../Web3Status'
// import NetworkSelector from './NetworkSelector'

const HeaderFrame = styled.div<{ showBackground: boolean }>`
  display: grid;
  grid-template-columns: 120px 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  padding: 1rem;
  z-index: 21;
  position: relative;
  /* Background slide effect on scroll. */
  background-image: ${({ theme }) => `linear-gradient(to bottom, transparent 50%, ${theme.bg0} 50% )}}`};
  background-position: ${({ showBackground }) => (showBackground ? '0 -100%' : '0 0')};
  background-size: 100% 200%;
  box-shadow: 0px 0px 0px 1px ${({ theme, showBackground }) => (showBackground ? theme.bg2 : 'transparent;')};
  transition: background-position 0.1s, box-shadow 0.1s;
  background-blend-mode: hard-light;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-template-columns: 48px 1fr 1fr;
  `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding:  1rem;
    grid-template-columns: 1fr 1fr;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding:  1rem;
    grid-template-columns: 36px 1fr;
  `};
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  &:not(:first-child) {
    margin-left: 0.5em;
  }

  /* addresses safaris lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: center;
  `};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg0 : theme.bg0)};
  border-radius: 16px;
  white-space: nowrap;
  width: 100%;
  height: 40px;

  :focus {
    border: 1px solid blue;
  }
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`

const UniIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }

  position: relative;
`
export default function Header() {
  const { account, chainId, connector } = useWeb3React()

  const chainAllowed = chainId && isChainAllowed(connector, chainId)

  const userEthBalance = useNativeCurrencyBalances(account ? [account] : [])?.[account ?? '']
  const [darkMode] = useDarkModeManager()
  const { white, black } = useTheme()

  const scrollY = useScrollPosition()

  const {
    nativeCurrency: { symbol: nativeCurrencySymbol },
  } = CHAIN_INFO[!chainId || !chainAllowed ? SupportedChainId.MAINNET : chainId]

  return (
    <HeaderFrame showBackground={scrollY > 45}>
      <Title href=".">
        <UniIcon>
          
        </UniIcon>
      </Title>
      <HeaderControls>
        <HeaderElement>
          {/* <NetworkSelector /> */}
        </HeaderElement>
        <HeaderElement>
          <AccountElement active={!!account}>
            {chainAllowed && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0, userSelect: 'none' }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                <Trans>
                  {userEthBalance?.toSignificant(3)} {nativeCurrencySymbol}
                </Trans>
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
      </HeaderControls>
    </HeaderFrame>
  )
}