//Governor: 0x6580801bd41a9B3dc3E99a93e5E328F401f1528a
// token: 0x8eBfD16CDe9672566D47eed8612FfbB922A3Fc75
//factory : 0xd940F6323F8287F49baE5dE14B6CbaCA641a48F5
import { ethers } from "ethers";
import { ABI } from "abis/DaoFactory";


export const factoryCall= async (provider: any) =>{
    const factoryAddress = "0xd940F6323F8287F49baE5dE14B6CbaCA641a48F5";
    const signer = provider?.getSigner();
    const factory = new ethers.Contract(factoryAddress,ABI,signer);
    return factory;
}

