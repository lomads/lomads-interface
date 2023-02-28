import { useWeb3React } from "@web3-react/core";
//import { encrypt } from '@metamask/eth-sig-util';
import axiosHttp from 'api'
const ascii85 = require('ascii85');

export default () => {

    const { account } = useWeb3React();

    const getPublicKey  = async () => {
        if(window.ethereum) {
            /* @ts-ignore */
            const keyB64 = await window.ethereum.request({
                method: 'eth_getEncryptionPublicKey',
                params: [account],
            });
            const publicKey = Buffer.from(keyB64, 'base64');
            return publicKey
        }
        return null
    }

    const encryptMessage = async (message: string) => {
        const publicKey = await getPublicKey()
        if(publicKey) {
          // const encryptedMessage = ethUtil.bufferToHex(
          //   Buffer.from(
          //     JSON.stringify(
          //       encrypt({
          //         publicKey: publicKey.toString('base64'),
          //         data: ascii85.encode(message).toString(),
          //         version: 'x25519-xsalsa20-poly1305',
          //       })
          //     ),
          //     'utf8'
          //   )
          // );
          // const encryptedMessage = Buffer.from(
          //       JSON.stringify(
          //         encrypt({
          //           publicKey: publicKey.toString('base64'),
          //           data: ascii85.encode(message).toString(),
          //           version: 'x25519-xsalsa20-poly1305',
          //         })
          //       ),
          //       'utf8'
          // ).toString('hex')
          // console.log("encryptedMessage", encryptedMessage)
          // return encryptedMessage
          const response = await axiosHttp.post(`utility/encrypt`, { publicKey:  publicKey.toString('base64'), data: ascii85.encode(message).toString() })
          console.log(response.data.message)
          if(response && response?.data?.message)
            return response?.data?.message
        }
        return null
    }

    const decryptMessage = async (message: string) => {
      try {
        if(window.ethereum) {
          /* @ts-ignore */
          const decrypt = await window.ethereum.request({
            method: 'eth_decrypt',
            params: [message, account],
          });
          return JSON.parse(new TextDecoder("utf-8").decode(ascii85.decode(decrypt)));
        }
        return null;
      } catch (e) {
        console.log(e)
      }
    }

    return { encryptMessage, decryptMessage }
}