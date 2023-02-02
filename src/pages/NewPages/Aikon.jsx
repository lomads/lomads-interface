import {
    AuthProvider,
    OreId,
    UserData,
} from "oreid-js";
import LoginButton from "oreid-login-button";
// ! To use hooks from oreid-react make sure you added the OreidProvider (index.tx shows how to do this)
import { OreidProvider, useIsLoggedIn, useOreId, useUser } from "oreid-react";
import { WebPopup } from "oreid-webpopup";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { setUser } from "state/dashboard/reducer";
import { useNavigate } from "react-router-dom";
import axiosHttp from '../../api';

const REACT_APP_OREID_APP_ID = "t_e5bddabb0190459f9481c581c0e2884e";

// * Initialize OreId
const oreId = new OreId({
    appName: "ORE ID Sample App",
    appId: REACT_APP_OREID_APP_ID,
    plugins: {
        popup: WebPopup(),
    },
});

const NotLoggedInView = () => {
    const oreId = useOreId();
    const [error, setErrors] = useState();

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const navigateTo = async () => {
        const activeDao = sessionStorage.getItem('__lmds_active_dao')
        if (activeDao)
            return `/${activeDao}`
        return "/"
        // return axiosHttp.get('dao').then(res => {
        //   if (res.data && res.data.length > 0) {
        //     const activeDao = sessionStorage.getItem('__lmds_active_dao')
        //     if (activeDao)
        //         return `/${activeDao}`
        //     else
        //       return `/${_get(res.data, '[0].url')}`
        //   } else {
        //     sessionStorage.removeItem('__lmds_active_dao')
        //     return "/namedao"
        //   }
        // })
        //   .finally(() => setCheckLoading(false))
    }

    const setLocalToken = async (token) => {
        return Promise.resolve().then(() => {
            localStorage.setItem('__lmds_web3_token', token);
        });
    }

    const onError = (error) => {
        console.log("Login failed", error.message);
        setErrors(error.message);
    };

    const onSuccess = async (user) => {
        console.log("Login successfull. User Data: ", user);
        localStorage.removeItem('__lmds_web3_token')
        await setLocalToken(user.idToken)
        await axiosHttp.post(`auth/create-account-aikon`, { address: user.user.chainAccounts[1].chainAccount, name: user.user.name })
            .then(res => {
                console.log("70 res : ", res)
                dispatch(setUser(res.data))
            })
        const nTo = await navigateTo();
        setTimeout(() => navigate(nTo), 100);
    };

    const loginWithOreidPopup = (provider) => {
        // launch popup for user to login
        oreId.popup.auth({ provider }).then(onSuccess).catch(onError);
    };

    return (
        <>
            <div>
                <LoginButton
                    provider="google"
                    onClick={() => loginWithOreidPopup(AuthProvider.Google)}
                />
                <LoginButton
                    provider="email"
                    onClick={() => loginWithOreidPopup(AuthProvider.Email)}
                />
            </div>
            {error && <div className="App-error">Error: {error}</div>}
        </>
    );
};

const LoggedInView = () => {
    const oreId = useOreId();
    const user = useUser();

    if (!user) return null;

    const { accountName, email, name, picture, username } = user;
    return (
        <div style={{ marginTop: 50, marginLeft: 40 }}>
            <h4>User Info</h4>
            <img
                src={picture.toString()}
                style={{ width: 100, height: 100, paddingBottom: 30 }}
                alt={"user"}
            />
            <br />
            OreId account: {accountName}
            <br />
            name: {name}
            <br />
            username: {username}
            <br />
            email: {email}
            <br />
            <button onClick={() => oreId.logout()}>Logout</button>
        </div>
    );
};

const AppWithProvider = () => {
    const isLoggedIn = useIsLoggedIn();
    return (
        <div className="App">
            <header className="App-header">
                {isLoggedIn ? <LoggedInView /> : <NotLoggedInView />}
            </header>
        </div>
    );
};

export const Aikon = () => {
    const [oreidReady, setOreidReady] = useState(false);

    useEffect(() => {
        oreId.init().then(() => {
            setOreidReady(true);
        });
    });

    if (!oreidReady) {
        return <>Loading...</>;
    }

    return (
        <OreidProvider oreId={oreId}>
            <AppWithProvider />
        </OreidProvider>
    );
};