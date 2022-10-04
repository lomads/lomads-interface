import axios from 'axios';
import { Contract } from 'ethers';

export type contractAPI = {
    address : string,
    admin : string,
    contactDetail : [string],
    metadata : Array<Object> | Array<null>
}

export type metadataAPI = {
    id : number,
    description: string,
    name: string,
    image: string,
    attributes : [{
        trait_type : string,
        value : any
    }],
    contract: string
}


export const APInewContract = async (contractData : contractAPI) => {
    const config = {
        method : "post",
        url : process.env.REACT_APP_NODE_BASE_URL+"new-contract",
        headers : {
            "Content-Type":"application/json",  
        },
        data : JSON.stringify(contractData)
    }

    try {
        const req = await axios(config);
        return req;
    }
    catch(e){
        return false;
    }
}

export const APInewSBTtoken = async (metadata : metadataAPI) => {
    const config = {
        method : "post",
        url : process.env.REACT_APP_NODE_BASE_URL+`add-metadata/${metadata.contract}`,
        headers : {
            "Content-Type":"application/json",  
        },
        data : JSON.stringify(metadata)
    }

    try {
        const req = await axios(config);
        return req;
    }
    catch(e){
        return false;
    }
}


export const APIgetContract = async (contract : string) => {
    const config = {
        method : "get",
        url : process.env.REACT_APP_NODE_BASE_URL+`get-contract/${contract}`,
        headers : {
            'Access-Control-Allow-Origin' : '*' 
        },
        
    }
    try {   
        const req = await axios(config);
        return req;
    }
    catch(e){
        return false;
    }
}