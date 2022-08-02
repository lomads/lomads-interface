import { create } from 'ipfs';
const OrbitDB = require("orbit-db");

// optional settings for the ipfs instance
const ipfsOptions = {
  EXPERIMENTAL: {
    pubsub: true
  }
}

// Create IPFS instance with optional config
const getIPFSInstance = async () => {
  return await create(ipfsOptions)
}

// Create OrbitDB instance
const getOrbitInstance = async (ipfs: any) => {
  return await OrbitDB.createInstance(ipfs)
}

const getDB = async (orbitdb: any) => {
  return await orbitdb.create("lomads-dao-1", "keyvalue", {
    overwrite: true,
    replicate: true,
    accessController: {
      write: ["*"],
    },
  });
}

const getValue = async (orbitdb: any, key: any) => {
  return orbitdb.get(key);
}

const setValue = async (orbitdb: any, key: any, value: any) => {
  return orbitdb.set(key);
}

const closeConnection = (ipfs: any, db: any) => {
  db.close();
  ipfs.stop();
}

export {
  getIPFSInstance,
  getOrbitInstance,
  getDB,
  closeConnection,
  getValue,
  setValue
}