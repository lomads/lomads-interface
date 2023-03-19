import { Biconomy } from "@biconomy/mexa";
import { useWeb3React } from "@web3-react/core";
import { getSigner } from "utils";
import {
  BICONOMY_SECRETS,
  DOMAIN_DATA,
  domainType,
  META_SIGNATURES,
  metaTransactionType,
  PRIMARY_TYPE,
  SEND_TRANSACTION,
  SIGN_TYPE_DATA,
  SIGNATURE_TYPE,
  META_ABI,
  META_ADDRESS,
} from "constants/meta";
import { JsonRpcSigner } from "@ethersproject/providers";
import { getContract } from "utils";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";

const useMeta = () => {
  const { provider, account, chainId } = useWeb3React();
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [biconomySecret, setBiconomySecret] = useState<string | null>(null);

  const sendMetaTransaction = async (
    contractInstance: any,
    metaAddress: string,
    abi: any,
    fnSignature: string,
    fnParams: any[]
  ) => {
    if (!signer || !provider || !account || !biconomySecret) return;
    try {
      console.log("sending meta transaction");
      const biconomy = await getBiconomy(biconomySecret, [metaAddress], signer);

      const domainData = getDomainData(metaAddress, chainId!);
      const functionSignature = getFunctionSignature(
        abi,
        fnSignature,
        fnParams
      );
      const nonce = await getNonce(contractInstance, account);
      const message = getMessage(nonce, account, functionSignature);

      const dataToSign = getDataTosign(domainData, message);

      const signature = await getSignature(account, dataToSign);

      let { r, s, v } = getSignatureParametersEthers(signature);

      const tx = await sendSignedTransaction(
        biconomy,
        abi,
        metaAddress,
        account,
        functionSignature,
        r,
        s,
        v
      );

      if (!tx) {
        throw "Error during deployment";
      }
    } catch (error) {
      console.log(`sendMetatransaction error`, error);
    }
  };

  const getContractAdress = async (
    contract: any,
    currentTokenId: BigNumber
  ) => {
    return await retry(
      () => getContractById(contract, currentTokenId),
      () => {
        console.log("retry called...");
      },
      50
    );
  };

  const deploy = async (
    metaAddress: string,
    abi: any,
    fnSignature: string,
    fnParams: any[]
  ) => {
    if (!provider) return;

    try {
      const contractInstance = getContract(metaAddress, abi, provider, account);
      const currentTokenId: BigNumber = await contractInstance?.counter();
      await sendMetaTransaction(
        contractInstance,
        metaAddress,
        abi,
        fnSignature,
        fnParams
      );
      const contractAdress = await getContractAdress(
        contractInstance,
        currentTokenId
      );
      return contractAdress;
    } catch (error) {
      console.log("failed to deploy contract", error);
    }
  };

  useEffect(() => {
    if (!provider || !account) return;
    const s = getSigner(provider, account);
    setSigner(s);
  }, [provider, account, chainId]);

  useEffect(() => {
    if (!chainId) return;
    const bs = BICONOMY_SECRETS[chainId];
    if (!bs) return;
    setBiconomySecret(bs);
  }, [chainId]);

  return { deploy, biconomySecret, signer, sendMetaTransaction };
};

export default useMeta;

export const getBiconomy = async (
  key: string,
  metaAddresses: string[],
  signer: JsonRpcSigner
) => {
  if (!key || !metaAddresses || !signer) return;
  console.log("initializing biconomy");

  let biconomy = new Biconomy((signer?.provider as any).provider, {
    apiKey: key,
    debug: true,
    contractAddresses: metaAddresses,
  });

  await biconomy.init();

  console.log("initialized biconomy");
  return biconomy;
};

const getDomainData = (metaAddress: string, chainId: number) => {
  return {
    name: DOMAIN_DATA.name,
    version: DOMAIN_DATA.version,
    verifyingContract: metaAddress,
    salt: generateChainSalt(chainId),
  };
};

const generateChainSalt = (chainId: number) => {
  return "0x" + chainId.toString(16).padStart(64, "0");
};

const getNonce = async (contract: any, userAddress: string) => {
  return await contract.getNonce(userAddress);
};

const getFunctionSignature = (abi: any, sig: string, params: any[]) => {
  const contractInterface = new ethers.utils.Interface(abi);
  return contractInterface.encodeFunctionData(sig, params);
};

const getMessage = (
  nonce: any,
  userAddress: string,
  functionSignature: any
) => {
  return {
    nonce: parseInt(nonce),
    from: userAddress,
    functionSignature: functionSignature,
  };
};

const getDataTosign = (domainData: any, message: any) => {
  return JSON.stringify({
    types: {
      EIP712Domain: domainType,
      MetaTransaction: metaTransactionType,
    },
    domain: domainData,
    primaryType: PRIMARY_TYPE,
    message: message,
  });
};

const getSignature = async (userAddress: string, dataToSign: any) => {
  if (!window?.ethereum) return;
  const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
  return await ethersProvider.send(SIGN_TYPE_DATA, [userAddress, dataToSign]);
};

const getSignatureParametersEthers = (signature: any) => {
  if (!ethers.utils.isHexString(signature)) {
    throw new Error(
      'Given value "'.concat(signature, '" is not a valid hex string.')
    );
  }
  const r = signature.slice(0, 66);
  const s = "0x".concat(signature.slice(66, 130));
  let v = "0x".concat(signature.slice(130, 132));
  v = ethers.BigNumber.from(v).toString();
  if (![27, 28].includes(Number(v))) v += 27;
  return {
    r: r,
    s: s,
    v: Number(v),
  };
};

const sendSignedTransaction = async (
  biconomy: any,
  abi: any,
  metaAddress: string,
  userAddress: string,
  functionData: any,
  r: any,
  s: any,
  v: any
) => {
  try {
    console.log(`Sending transaction via Biconomy`);
    const provider = biconomy.provider;

    const contractInstance = new ethers.Contract(
      metaAddress,
      abi,
      biconomy.ethersProvider
    );
    let { data } =
      await contractInstance.populateTransaction.executeMetaTransaction(
        userAddress,
        functionData,
        r,
        s,
        v
      );
    let txParams = {
      data: data,
      to: metaAddress,
      from: userAddress,
      signatureType: SIGNATURE_TYPE,
    };

    const tx = await provider.send(SEND_TRANSACTION, [txParams]);

    console.log(`Sent transaction via Biconomy`);
    return tx;
  } catch (error) {
    console.log(error);
  }
};

export const getDeployParams = (
  name: string,
  symbol: string,
  mintPriceInWei: any,
  mintToken: string,
  treasury: string,
  mustBeWhitelisted: number
) => {
  return {
    sig: META_SIGNATURES.deployNewSBT,
    params: [
      name,
      symbol,
      mintPriceInWei,
      mintToken,
      treasury,
      mustBeWhitelisted,
    ],
  };
};

export const getMintParams = (
  contractAddress: string,
  uri: string,
  id: number,
  signature: any
) => {
  return {
    sig: META_SIGNATURES.mint,
    params: [contractAddress, uri, id, signature],
  };
};

export const getMetaDetails = (chainId: number) => {
  return {
    abi: META_ABI[chainId],
    meta: META_ADDRESS[chainId],
  };
};

const getContractById = async (contract: any, id: BigNumber) => {
  return contract?.getContractByIndex(BigNumber.from(parseInt(id.toString())));
};

const retry = (promise: any, onRetry: any, maxRetries: number) => {
  const retryWithBackoff: any = async (retries: number) => {
    try {
      if (retries > 0) {
        const timeToWait = 2 ** retries * 1000;
        console.log(`waiting for ${timeToWait}ms...`);
        await waitFor(timeToWait);
      }
      return await promise();
    } catch (e) {
      if (retries < maxRetries) {
        onRetry();
        return retryWithBackoff(retries + 1);
      } else {
        console.warn("Max retries reached. Bubbling the error up");
        throw e;
      }
    }
  };
  return retryWithBackoff(0);
};

const waitFor = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
