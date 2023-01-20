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
// import "./App.css";

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

    const onError = (error) => {
        console.log("Login failed", error.message);
        setErrors(error.message);
    };

    const onSuccess = (user) => {
        console.log("Login successfull. User Data: ", user);
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