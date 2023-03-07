import { randomBytes } from "crypto"
import useLocalStorage from "../hooks/useLocalStorage";
import capitalize from "utils/capitalize";
import usePopupWindow from "../hooks/usePopupWindow"
import useToast from "hooks/useToast"
import { useEffect, useState } from "react"
import { nanoid } from "@reduxjs/toolkit";


const processDiscordError = (error: any): any => ({
  title: capitalize(error.error.replaceAll("_", " ")),
  description: error.errorDescription,
})

type Auth = {
  accessToken: string
  tokenType: string
  expires: number
  authorization: string
}

const fetcherWithGithubAuth = async (authorization: string, endpoint: string) => {
  const response = await fetch(endpoint, {
    headers: {
      authorization,
    },
  }).catch(() => {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw {
      error: "Network error",
      errorDescription:
        "Unable to connect to Discord server. If you're using some tracking blocker extension, please try turning that off",
    }
  })

  if (!response?.ok) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw {
      error: "Discord error",
      errorDescription: "There was an error, while fetching the user data",
    }
  }

  return response.json()
}


const useGithubAuth = (scope = "identify") => {
  //const router = useRouter()
  const toast = useToast()
  const [csrfToken] = useLocalStorage(
    "github_auth_csrf_token",
    nanoid(16),
    true
  )
  const state = JSON.stringify({ csrfToken, url: '/' })

  const redirectUri =
    typeof window !== "undefined" &&
    `${window.location.href.split("/").slice(0, 3).join("/")}/githubauth`

  // prettier-ignore
  const { onOpen, windowInstance } = usePopupWindow()
  const [error, setError] = useState<any>(null)
  const [auth, setAuth] = useState<any>({})

  /** On a window creation, we set a new listener */
  useEffect(() => {
    if (!windowInstance) return

    const popupMessageListener = async (event: MessageEvent) => {
      /**
       * Conditions are for security and to make sure, the expected messages are
       * being handled (extensions are also communicating with message events)
       */
      console.log("event.origin", event.isTrusted, event.origin, event.data)
      if (
        event.isTrusted &&
        event.origin === window.location.origin &&
        typeof event.data === "object" &&
        "type" in event.data &&
        "data" in event.data
      ) {
        const { data, type } = event.data

        switch (type) {
          case "GITHUB_AUTH_SUCCESS":
            setAuth({
              ...data,
              authorization: data?.code,
            })
            break
          case "GITHUB_AUTH_ERROR":
            setError(data)
            const { title, description } = processDiscordError(data)
            toast({ status: "error", title, description })
            break
          default:
            // Should never happen, since we are only processing events that are originating from us
            setError({
              error: "Invalid message",
              errorDescription:
                "Recieved invalid message from authentication window",
            })
        }

        windowInstance?.close()
      }
    }

    window.addEventListener("message", popupMessageListener)
    return () => window.removeEventListener("message", popupMessageListener)
  }, [windowInstance])

  const authorization = auth?.authorization
  const authData = authorization && {
    access_token: authorization?.split(" ")?.[1],
  }

  return {
    authorization,
    authData,
    error,
    onOpen: (url: string = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&scope=repo%20user%20admin:repo_hook%20admin:org&redirect_uri=${redirectUri}&state=${state}`) => {
      setError(null)
      onOpen(url)
    },
    onResetAuth: () => {
      setAuth({})
    },
    isAuthenticating: !!windowInstance && !windowInstance.closed,
  }
}

export { fetcherWithGithubAuth }
export default useGithubAuth
