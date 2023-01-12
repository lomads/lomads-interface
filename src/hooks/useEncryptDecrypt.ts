import { useWeb3React } from "@web3-react/core";
import { encrypt } from '@metamask/eth-sig-util';
const ascii85 = require('ascii85');
const ethUtil = require('ethereumjs-util');

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
          const encryptedMessage = ethUtil.bufferToHex(
            Buffer.from(
              JSON.stringify(
                encrypt({
                  publicKey: publicKey.toString('base64'),
                  data: ascii85.encode(message).toString(),
                  version: 'x25519-xsalsa20-poly1305',
                })
              ),
              'utf8'
            )
          );
          console.log(encryptedMessage)
          return encryptedMessage
        }
        return null
    }

    const decryptMessage = async (message: string) => {
      if(window.ethereum) {
        /* @ts-ignore */
        const decrypt = await window.ethereum.request({
          method: 'eth_decrypt',
          params: [message, account],
        });
        return JSON.parse(new TextDecoder("utf-8").decode(ascii85.decode(decrypt)));
      }
      return null;
    }

    return { encryptMessage, decryptMessage }
}