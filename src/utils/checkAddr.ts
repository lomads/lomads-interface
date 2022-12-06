import { ethers } from "ethers";

export const isAddressValid = (holderAddress: string) => {
    const isValid: boolean = ethers.utils.isAddress(holderAddress);
    return isValid;
};

export const isENSValid = async (provider : any, ensName : string) => {
    const resolve = await provider.resolveName(ensName);
    return resolve != null ? true : false;
}

