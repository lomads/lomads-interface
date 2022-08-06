//Governor: 0x6580801bd41a9B3dc3E99a93e5E328F401f1528a
// token: 0x8eBfD16CDe9672566D47eed8612FfbB922A3Fc75
//factory : 0xd940F6323F8287F49baE5dE14B6CbaCA641a48F5
import { ethers } from "ethers";
import { ABI } from "abis/DaoFactory";
import { SafeEventEmitterProvider } from "@web3auth/base";


export const factoryCall= async (provider: any) =>{
    const factoryAddress = "0x50DABA7aFEACCDc3234875E82152F09174C8f481";
    let signer = provider?.getSigner();
    const factory = new ethers.Contract(factoryAddress,ABI,signer);
    return factory;
}

let web3authProvider: SafeEventEmitterProvider | null;

export const setWeb3authProvider = (provider: SafeEventEmitterProvider | null) =>{
    web3authProvider = provider;
}

export const getweb3authProvider = () =>{
    const factoryAddress = "0x50DABA7aFEACCDc3234875E82152F09174C8f481";
    let provider = new ethers.providers.Web3Provider(web3authProvider as any)
    const signer = provider?.getSigner();
    const factory = new ethers.Contract(factoryAddress,ABI,signer);
    return factory;

}

export const deploywebToken = (provider: any,pvtKey: string) =>{
    const factoryAddress = "0x50DABA7aFEACCDc3234875E82152F09174C8f481";
    let wallet = new ethers.Wallet(pvtKey)
    const signer = wallet.connect(provider)
    const factory = new ethers.Contract(factoryAddress,ABI,signer);
    return factory;
}

