import useLocalStorage from "hooks/useLocalStorage"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";


const FALLBACK_EXPIRITY = 604800

const DCAuth = () => {
  const navigate = useNavigate();
  const [isUnsupported, setIsUnsupported] = useState(false)
  const [csrfTokenFromLocalStorage, setCsrfToken] = useLocalStorage(
    "dc_auth_csrf_token",
    ""
  )

  useEffect(() => {
    if (
      !window.opener ||
      !csrfTokenFromLocalStorage ||
      csrfTokenFromLocalStorage.length <= 0
    ) {
      setIsUnsupported(true)
      return
    }

    // We navigate to the index page if the dcauth page is used incorrectly
    // For example if someone just manually goes to /dcauth
    // if (!window.location.hash) router.push("/")
    const fragment = new URLSearchParams(window.location.hash.slice(1))

    if (
      !fragment.has("state") ||
      ((!fragment.has("access_token") || !fragment.has("token_type")) &&
        (!fragment.has("error") || !fragment.has("error_description")))
    )
      navigate('/')

    const [accessToken, tokenType, error, errorDescription, state, expiresIn] = [
      fragment.get("access_token"),
      fragment.get("token_type"),
      fragment.get("error"),
      fragment.get("error_description"),
      fragment.get("state"),
      +fragment.get("expires_in"),
    ]

    const { url, csrfToken } = JSON.parse(state)

    const target = `${window.location.origin}${url}`

    if (error) {
      window.opener.postMessage(
        {
          type: "DC_AUTH_ERROR",
          data: { error, errorDescription },
        },
        target
      )
      return
    }

    if (csrfToken !== csrfTokenFromLocalStorage) {
      window.opener.postMessage(
        {
          type: "DC_AUTH_ERROR",
          data: {
            error: "CSRF Error",
            errorDescription:
              "CSRF token mismatch, this indicates possible csrf attack, Discord identification hasn't been fetched.",
          },
        },
        target
      )
      return
    } else {
      //setCsrfToken(undefined)
    }

    window.opener.postMessage(
      {
        type: "DC_AUTH_SUCCESS",
        data: {
          tokenType,
          accessToken,
          expires: Date.now() + (expiresIn || FALLBACK_EXPIRITY) * 1000,
        },
      },
      target
    )
  }, [navigate, csrfTokenFromLocalStorage])

  return isUnsupported ? <div>Unsupported</div> : <div>Closing the authentication window and taking you back to the site...</div>
}
export default DCAuth
