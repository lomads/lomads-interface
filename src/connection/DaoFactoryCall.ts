
//Governor: 0x576e6a5622dfE1Da0769b8e8072DB29E6303A704
// token: 0x25Ca786741Cb26fD9A03fBD9487f5e4535E6a12f
//factory : 0xb75eC48cE7b47b27772870AE4Ad9712193F1A6A6
import { ethers } from "ethers";
import { ABI } from "abis/DaoFactory";


export const factoryCall= async (provider: any) =>{
    const factoryAddress = "0xb75eC48cE7b47b27772870AE4Ad9712193F1A6A6";
    let signer = provider?.getSigner();
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

