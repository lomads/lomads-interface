// Import modules
import AvionDB from "aviondb";
import * as IPFS from "ipfs";

let ipfs = null;

const getDatabase = async () => {
  ipfs = await IPFS.create();
  const aviondb = await AvionDB.init("DatabaseName", ipfs, {
    path: "./.aviondb",
  });

  // Returns the List of database names
  await AvionDB.listDatabases();

  return aviondb;
}

const insertProposal = async (aviondb: any) => {
  const collection = await aviondb.initCollection("proposals");
  // Returns the List of collection names
  await aviondb.listCollections();
  // prints ['employees']

  // Adding an employee document
  await collection.insertOne({
    hourly_pay: "$15",
    name: "Elon",
    ssn: "562-48-5384",
    weekly_hours: 100,
  });

  // We also support multi-insert using collection.insert()
  // See https://github.com/dappkit/aviondb/blob/master/API.md

  // Search by a single field Or many!
  var employee = await collection.findOne({
    ssn: "562-48-5384",
  });
}

// const runExample = async () => {
//   // We also support find(), findById()
//   // See https://github.com/dappkit/aviondb/blob/master/API.md

//   var updatedEmployee = await collection.update(
//     { ssn: "562-48-5384" },
//     { $set: { hourly_pay: "$100" } }
//   );

//   console.log(updatedEmployee);

//   // await collection.close(); // Collection will be closed.
//   // await aviondb.drop(); // Drops the database
//   // await aviondb.close(); // Closes all collections and binding database.
//   // await ipfs.stop();
// };

export {
  getDatabase,
  insertProposal
}