import { Connector } from '@web3-react/types'
import { ConnectionType, gnosisSafeConnection, injectedConnection, networkConnection } from 'connection'
import { getConnection } from 'connection/utils'
import { useEffect } from 'react'
import { isMobile } from 'utils/userAgent'

async function connect(connector: Connector) {
  try {
    if (connector.connectEagerly) {
      await connector.connectEagerly()
    } else {
      await connector.activate()
    }
  } catch (error) {
    console.debug(`web3-react eager connection error: ${error}`)
  }
}

export default function useEagerlyConnect() {
  const selectedWallet = ConnectionType.INJECTED

  const isMetaMask = !!window.ethereum?.isMetaMask

  useEffect(() => {
    connect(gnosisSafeConnection.connector)
    connect(networkConnection.connector)

    if (isMobile && isMetaMask) {
      injectedConnection.connector.activate()
    } else if (selectedWallet) {
      connect(getConnection(selectedWallet).connector)
    }
    // The dependency list is empty so this is only run once on mount
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}