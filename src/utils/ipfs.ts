
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
    console.log('Trying to upload file to IPFS');
    console.log(ipfs?.stats);
    const { cid } = await (ipfs as IPFSHTTPClient).add(coverImg);
    console.log(cid);
    fetchFile(cid);
    resolve(cid);
  });
}

export const fetchFile = async (cid: CID) => {
  return new Promise(async(resolve, reject)=> {
    if(ipfs) {
      console.log('Trying to fetch file from IPFS');
      console.log(ipfs?.stats);
      // const ipfsPath = '/ipfs/' + hash;
      // console.log(ipfsPath);
      // const result = await ipfs.get(cid);
      for await (const chunk of ipfs.cat(cid)) {
        console.info(chunk)
      }
      // console.log(result);
      // resolve(result);
    }
  });
}