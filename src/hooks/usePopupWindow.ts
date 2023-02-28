import { useEffect, useState } from "react"

type WindowFeatures = Partial<{
  width: number
  height: number
  left: number
  top: number
  popup: boolean
  noopener: boolean
  noreferrer: boolean
  scrollbars: boolean
}>

const defaultWindowFeatures = {
  width: 600,
  height: 750,
  scrollbars: true,
}

const usePopupWindow = (
  windowFeatures: WindowFeatures = defaultWindowFeatures
) => {
  const [windowInstance, setWindowInstance] = useState<Window | null>(null)

  const onOpen = (uri: string) => {
    console.log("uri : ", uri);
    const dualScreenLeft = window.screenLeft ?? window.screenX
    const dualScreenTop = window.screenTop ?? window.screenY
    //eslint-disable-next-line
    const width = window.innerWidth ?? document.documentElement.clientWidth ?? screen.width
    //eslint-disable-next-line
    const height = window.innerHeight ?? document.documentElement.clientHeight ?? screen.height

    const systemZoom = width / window.screen.availWidth
    const left = (width - (windowFeatures?.width || 0)) / 2 / systemZoom + dualScreenLeft
    const top = (height - (windowFeatures?.height || 0)) / 2 / systemZoom + dualScreenTop

    windowFeatures.left = windowFeatures.left ?? left
    windowFeatures.top = windowFeatures.top ?? top

    const w = window.open(
      uri,
      "_blank",
      Object.entries({ ...defaultWindowFeatures, ...windowFeatures })
        .map(([key, value]) =>
          typeof value === "number" ? `${key}=${value}` : key
        )
        .join(",")
    )
    console.log("w : ", w)

    setWindowInstance(w);
    return w;

  }

  useEffect(() => {
    if (!windowInstance) return
    const timer = setInterval(() => {
      if (windowInstance.closed) {
        setWindowInstance(null)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [windowInstance])

  return {
    onOpen,
    windowInstance,
  }
}

export default usePopupWindow
