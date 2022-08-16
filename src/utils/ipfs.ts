
import { create, IPFSHTTPClient, CID } from "ipfs-http-client";

let ipfs: IPFSHTTPClient | undefined;

const projectId = process.env.REACT_APP_IPFS_ID;
const projectSecret = process.env.REACT_APP_IPFS_KEY;

try {
  const hash = btoa(projectId + ':' + projectSecret);
  ipfs = create({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
      authorization: 'Basic ' + hash
    }
  });
} catch (error) {
  console.error("IPFS error ", error);
  ipfs = undefined;
}

export const fileUpload = async (coverImg: any) => {
  return new Promise(async(resolve, reject)=> {
    const result = await (ipfs as IPFSHTTPClient).add(coverImg);
    resolve(result);    
  });
}

export const fetchFile = async (hash: string) => {
  return new Promise(async(resolve, reject)=> {
    const result = await (ipfs as IPFSHTTPClient).cat(hash);
    resolve(result);    
  });
}