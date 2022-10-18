import { useEffect, useState } from "react"
import useDCAuth from "./useDCAuth"

const useDCAuthWithCallback = (scope: string, callback: () => void) => {
  const { authorization, onOpen, onResetAuth, ...rest } = useDCAuth(scope)
  const [hasClickedAuth, setHasClickedAuth] = useState(false)

  const handleClick = () => {
    console.log("useDCAuthWithCallback", authorization)
    if (authorization) callback()
    else {
      onOpen()
      setHasClickedAuth(true)
    }
  }

  useEffect(() => {
    if (!authorization || !hasClickedAuth) return

    callback()
  }, [authorization, hasClickedAuth])

  return {
    callbackWithDCAuth: handleClick,
    authorization,
    onResetAuth,
    ...rest,
  }
}

export default useDCAuthWithCallback
