import { SUPPORTED_CHAIN_IDS, SupportedChainId } from "./chains";
import MumbaiAbi from "../abisPolygon/MetaSBTDeployer.json"

export const domainType = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "verifyingContract", type: "address" },
  { name: "salt", type: "bytes32" },
];

export const metaTransactionType = [
  { name: "nonce", type: "uint256" },
  { name: "from", type: "address" },
  { name: "functionSignature", type: "bytes" },
];

export const META_SIGNATURES = {
  deployNewSBT: "deployNewSBT",
  mint: "mint",
};

export const DOMAIN_DATA = {
  name: "LOMADS-SBT",
  version: "1",
};

export const BICONOMY_SECRETS = {
    [`${SupportedChainId.POLYGON_MUMBAI}`]: process.env.REACT_APP_BICONOMY_KEY_MUMBAI,
}

export const SEND_TRANSACTION = "eth_sendTransaction";

export const SIGNATURE_TYPE = "EIP712_SIGN";

export const SIGN_TYPE_DATA = "eth_signTypedData_v3";

export const PRIMARY_TYPE = "MetaTransaction";

export const META_ABI = {
  [`${SupportedChainId.POLYGON_MUMBAI}`]: MumbaiAbi,
}

export const META_ADDRESS = {
  [`${SupportedChainId.POLYGON_MUMBAI}`]: "0x2E0fb9Ab0e4c7A41054521557Ba5637534743825",
}

// gsf : meta constants 

