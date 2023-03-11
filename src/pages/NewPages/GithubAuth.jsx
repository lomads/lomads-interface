import useLocalStorage from "hooks/useLocalStorage"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";


const FALLBACK_EXPIRITY = 604800

const GithubAuth = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isUnsupported, setIsUnsupported] = useState(false)
  const [csrfTokenFromLocalStorage, setCsrfToken] = useLocalStorage(
    "github_auth_csrf_token",
    ""
  )

  useEffect(() => {
    if (
      !window.opener ||
      !csrfTokenFromLocalStorage ||
      csrfTokenFromLocalStorage.length <= 0
    ) {
      //setIsUnsupported(true)
      //return
    }

    // We navigate to the index page if the dcauth page is used incorrectly
    // For example if someone just manually goes to /dcauth
    // if (!window.location.hash) router.push("/")
    // const fragment = new URLSearchParams(window.location.hash.slice(1))

    // if (
    //   !fragment.has("state") ||
    //   ((!fragment.has("code")) &&
    //     (!fragment.has("error")))
    // )
    //   navigate('/')

    const [state, code, error] = [
        searchParams.get("state"),
        searchParams.get("code"),
        searchParams.get("error")
    ]

    //const { url, csrfToken } = JSON.parse(state)

    const target = `${window.location.origin}${'/'}`

    if (error) {
      window.opener.postMessage(
        {
          type: "GITHUB_AUTH_ERROR",
          data: { error },
        },
        target
      )
      return
    }

    // if (csrfToken !== csrfTokenFromLocalStorage) {
    //   window.opener.postMessage(
    //     {
    //       type: "GITHUB_AUTH_ERROR",
    //       data: {
    //         error: "CSRF Error",
    //         errorDescription:
    //           "CSRF token mismatch, this indicates possible csrf attack, Discord identification hasn't been fetched.",
    //       },
    //     },
    //     target
    //   )
    //   return
    // } else {
    //   //setCsrfToken(undefined)
    // }

    console.log("target", target)

    window.opener.postMessage(
      {
        type: "GITHUB_AUTH_SUCCESS",
        data: {
          code
        },
      },
      target
    )
  }, [navigate, csrfTokenFromLocalStorage])

  return isUnsupported ? <div>Unsupported</div> : <div>Closing the authentication window and taking you back to the site...</div>
}
export default GithubAuth
