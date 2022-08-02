import useInterval from './useInterval'
import { useState } from 'react'

const useMachineTimeMs = (updateInterval: number): number => {
  const [now, setNow] = useState(Date.now())

  useInterval(() => {
    setNow(Date.now())
  }, updateInterval)
  return now
}

export default useMachineTimeMs