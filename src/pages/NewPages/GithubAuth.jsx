import useLocalStorage from "hooks/useLocalStorage"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

import axiosHttp from '../../api';


const FALLBACK_EXPIRITY = 604800

const GithubAuth = () => {
    const navigate = useNavigate();
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
            setIsUnsupported(true)
            return
        }

        // We navigate to the index page if the dcauth page is used incorrectly
        // For example if someone just manually goes to /dcauth
        // if (!window.location.hash) router.push("/")
        // const fragment = new URLSearchParams(window.location.hash.slice(1));
        // if (!fragment.has("code"))
        //     navigate('/')

        // const code = fragment.get("code");
        // console.log("code : ", code);

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const codeParam = urlParams.get("code");
        const stateParam = urlParams.get("state");

        axiosHttp.get('utility/getGithubAccessToken?code=' + codeParam)
            .then((response) => {
                console.log("access token response : ", response.data);
                console.log("state : ", stateParam);

                // const { url = '/', csrfToken } = JSON.parse(stateParam)

                const target = `${window.location.origin}${'/'}`

                console.log("target : ", target);

                // if (csrfToken !== csrfTokenFromLocalStorage) {
                //     window.opener.postMessage(
                //         {
                //             type: "GITHUB_AUTH_ERROR",
                //             data: {
                //                 error: "CSRF Error",
                //                 errorDescription:
                //                     "CSRF token mismatch, this indicates possible csrf attack, Github identification hasn't been fetched.",
                //             },
                //         },
                //         target
                //     )
                //     return
                // } else {
                //     //setCsrfToken(undefined)
                // }

                console.log("window : ", window.opener);

                window.opener.postMessage(
                    {
                        type: "GITHUB_AUTH_SUCCESS",
                        data: {
                            tokenType: 'token',
                            accessToken: response.data.access_token,
                            expires: Date.now() + FALLBACK_EXPIRITY * 1000,
                        },
                    },
                    target
                )
                // axiosHttp.post('utility/create-webhook', { token: response.data.access_token, repoInfo })
                // 	.then((res) => {
                // 		console.log("res : ", res)
                // 	})
            })




    }, [navigate, csrfTokenFromLocalStorage])

    return isUnsupported ? <div>Unsupported</div> : <div>Closing the authentication window and taking you back to the site...</div>
}
export default GithubAuth
