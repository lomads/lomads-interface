//Governor: 0x6580801bd41a9B3dc3E99a93e5E328F401f1528a
// token: 0x8eBfD16CDe9672566D47eed8612FfbB922A3Fc75
//factory : 0xd940F6323F8287F49baE5dE14B6CbaCA641a48F5
import { ethers } from "ethers";
import { TOKEN_ABI } from "abis/DaoToken";



export const tokenCall= async (provider: any,_tokenAddress:string) =>{
    const signer = provider?.getSigner();
    const token = new ethers.Contract(_tokenAddress,TOKEN_ABI,signer);
    return token;
}

