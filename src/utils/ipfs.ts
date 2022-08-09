
import { create, CID, IPFSHTTPClient } from "ipfs-http-client";

let ipfs: IPFSHTTPClient | undefined;
try {
  ipfs = create({
    url: "https://ipfs.infura.io:5001/api/v0",
  });
} catch (error) {
  console.error("IPFS error ", error);
  ipfs = undefined;
}

export const fileUpload = async (coverImg: any) => {
  return new Promise(async(resolve, reject)=> {
    const result = await (ipfs as IPFSHTTPClient).add(coverImg);
    console.log("Midas fileUploaad", result)
    resolve(result);    
});
}
