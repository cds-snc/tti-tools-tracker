const admin = require("firebase-admin");

let db;

switch (process.env.NODE_ENV) {
  case "dev":
    const serviceAccount = require("../../../tti-tools-firebase-adminsdk.json");

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIRESTORE_URL
    });
    db = admin.firestore();
    break;
  case "test":
    const MockCloudFirestore = require("mock-cloud-firestore");
    const { fixtureData } = require("../__mocks__/firestore.js");
    let firebase = new MockCloudFirestore(fixtureData);
    db = firebase.firestore();
    break;
  default:
    const functions = require("firebase-functions");
    admin.initializeApp(functions.config().firebase);
    db = admin.firestore();
}

module.exports.copyToMaster = async sha => {
  const reposRef = db.collection("tti_data");

  const branchQuery = reposRef.where("sha", "==", sha).limit(1);

  const branchCollection = await branchQuery.get();
  let branchItems = [];
  branchCollection.forEach(r => branchItems.push(r.data()));

  if (branchItems.length > 0) {
    branchItems[0].environment = "master";
    await this.saveToFirestore(branchItems[0]);
  }
};

module.exports.loadFromFirestore = async (repo, environment) => {
  const reposRef = db.collection("tti_data");

  const branchQuery = reposRef
    .where("repo", "==", repo)
    .where("environment", "==", environment)
    .select("data.audits.interactive")
    .orderBy("timestamp", "desc")
    .limit(1);

  const branchCollection = await branchQuery.get();
  let branchItems = [];
  branchCollection.forEach(r => branchItems.push(r.data()));

  const masterQuery = reposRef
    .where("repo", "==", repo)
    .where("environment", "==", "master")
    .select("data.audits.interactive")
    .orderBy("timestamp", "desc")
    .limit(1);

  const masterCollection = await masterQuery.get();
  let masterItems = [];
  masterCollection.forEach(r => masterItems.push(r.data()));

  const defaultResult = { data: { audits: { interactive: { rawValue: 0 } } } };

  return [
    branchItems.length > 0 ? branchItems[0] : defaultResult,
    masterItems.length > 0 ? masterItems[0] : defaultResult
  ];
};

module.exports.saveToFirestore = async payload => {
  payload["timestamp"] = Date.now();
  return db
    .collection("tti_data")

    .add(payload)
    .then(() => true)
    .catch(() => false);
};
