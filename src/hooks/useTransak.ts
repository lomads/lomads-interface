// @ts-nocheck
import React from "react";
import transakSDK from '@transak/transak-sdk';
import { useWeb3React } from "@web3-react/core";

export type initTransak = {
    token: string,
    amount: number,
    treasury: string
}

export default () => {
    const { provider, chainId, account } = useWeb3React();
    const initTransak = async ({ token, amount, treasury }: initTransak) => {
        return new Promise((resolve, reject) => {
            let transak = new transakSDK({
                apiKey: '591a2431-8555-4faa-958e-174a5fc45c77',
                environment: 'STAGING',
                cryptoCurrencyList: token,
                fiatCurrency:"EUR",
                networks: "polygon",
                walletAddress: treasury,
                defaultNetwork: 'polygon',
                defaultCryptoAmount: amount < 27 ? 27 : amount,
                defaultCryptoCurrency: token
              });
              transak.init();
    
            // To get all the events
            transak.on(transak.ALL_EVENTS, (data:any) => {
            console.log(data);
            });
    
            // This will trigger when the user closed the widget
            transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData:any) => {
            transak.close();
            });
    
            // This will trigger when the user marks payment is made
            transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData:any) => {
            console.log(orderData);
            resolve(orderData)
            transak.close();
            });
        })
    }

    return { initTransak }
}