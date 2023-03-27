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
                defaultCryptoCurrency: token,
                disablePaymentMethods: "pm_pse,pm_gcash,pm_shopeepay,pm_grabpay,pm_ubp,pm_rcbc,pm_bpi,pm_paymaya,pm_webpay,pm_boleto,pm_pix,pm_scb_easy_pay,pm_scb_bank_mobile,pm_bangkok_bank_ipay,pm_bangkok_bank_mobile,google_pay,apple_pay,mobikwik_wallet,inr_bank_transfer,inr_upi,pm_jwire,pm_jach,pm_cash_app,pm_open_banking,gbp_bank_transfer,sepa_bank_transfer"
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