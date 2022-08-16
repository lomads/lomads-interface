
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
    const result = await (ipfs as IPFSHTTPClient).add(coverImg);
    // fetchFile(cid);
    resolve(result.path);
  });
}

export const fetchFile = async (cid: string) => {
  return new Promise(async(resolve, reject)=> {
    if(ipfs) {      
      let content: any[] = [];
      for await (const chunk of ipfs.cat(cid)) {
        content = [...content, ...chunk];
      }
      const data = Buffer.from(content).toString('base64');
      resolve(data);
    }
  });
}