import { ENS } from '@ensdomains/ensjs'
import { ethers } from 'ethers'

const ENSInstance = new ENS()
const mainnetProvider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`)
const goerliProvider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`)
  

export default () => {
    const getENSAddress = async (name: string) => {
        try {
            await ENSInstance.setProvider(mainnetProvider)
            let profile = await ENSInstance.getProfile(name)
            if(!profile) {
                await ENSInstance.setProvider(goerliProvider)
                profile = await ENSInstance.getProfile(name)
            }
            if(profile)
                return profile?.address;
            return null
        } catch (e) {
            console.log(e)
            return null
        }
    }

    const getENSName = async (address: string) => {
        try {
            await ENSInstance.setProvider(mainnetProvider)
            let profile = await ENSInstance.getProfile(address)
            if(!profile) {
                await ENSInstance.setProvider(goerliProvider)
                profile = await ENSInstance.getProfile(address)
            }
            console.log("profile", profile)
            if(profile)
                return profile?.name;
            return null
        } catch (e) {
            console.log(e)
            return null
        }
    }

    return { getENSAddress, getENSName }
}