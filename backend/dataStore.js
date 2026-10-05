const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

const COLLECTIONS = {
  advocates: "advocates.json",
  clients: null,
  payments: "payments.json",
  clarity_guide: "clarityguide.json",
  document_purchases: "documentspurchase.json",
  admin_notifications: "admin_notifications.json",
};

let client = null;
let database = null;
let collections = null;
let pendingWrite = Promise.resolve();
const writeErrors = [];

function readSeed(dataDirectory, filename) {
  if (!filename) return [];
  const candidates = filename === "documentspurchase.json"
    ? ["documentspurchase.json", "documentspurchase,json"]
    : [filename];

  for (const candidate of candidates) {
    try {
      const value = JSON.parse(fs.readFileSync(path.join(dataDirectory, candidate), "utf8"));
      if (Array.isArray(value)) return value;
    } catch (error) {
      if (error.code !== "ENOENT" && !(error instanceof SyntaxError)) throw error;
    }
  }
  return [];
}

function unpackDocument(document) {
  const { _id, _position, ...record } = document;
  return record;
}

async function persistCollection(name, records) {
  const collection = database.collection(name);
  if (records.length === 0) {
    await collection.deleteMany({});
    return;
  }

  const operations = records.map((record, position) => {
    const document = { ...record };
    delete document._id;
    delete document._position;
    const recordKey = document.id === undefined || document.id === null
      ? `position:${position}`
      : `${typeof document.id}:${document.id}`;
    return {
      replaceOne: {
        filter: { _id: recordKey },
        replacement: { ...document, _id: recordKey, _position: position },
        upsert: true,
      },
    };
  });
  const ids = operations.map((operation) => operation.replaceOne.filter._id);
  await collection.bulkWrite(operations, { ordered: true });
  await collection.deleteMany({ _id: { $nin: ids } });
}

function setCollection(name, records) {
  if (!collections) return false;
  if (!Object.prototype.hasOwnProperty.call(collections, name)) {
    throw new Error(`Unknown MongoDB collection: ${name}`);
  }
  if (!Array.isArray(records)) throw new TypeError(`Collection ${name} must be an array`);

  collections[name] = records;
  const snapshot = structuredClone(records);
  pendingWrite = pendingWrite
    .then(() => persistCollection(name, snapshot))
    .catch((error) => {
      writeErrors.push(error);
    });
  return true;
}

async function flush() {
  await pendingWrite;
  if (writeErrors.length > 0) {
    throw new Error("Failed to persist application data to MongoDB", { cause: writeErrors.shift() });
  }
}

async function initialize({ uri, databaseName = "advocates_hub", dataDirectory }) {
  if (!uri) return false;
  client = new MongoClient(uri, {
    appName: "AdvocatesHub",
    serverSelectionTimeoutMS: 10000,
  });
  await client.connect();
  database = client.db(databaseName);
  await database.command({ ping: 1 });

  collections = {};
  for (const [name, seedFile] of Object.entries(COLLECTIONS)) {
    const collection = database.collection(name);
    let records = (await collection.find({}).sort({ _position: 1, _id: 1 }).toArray())
      .map(unpackDocument);
    if (records.length === 0) {
      records = readSeed(dataDirectory, seedFile);
      if (records.length > 0) await persistCollection(name, records);
    }
    collections[name] = records;
    console.log(`MongoDB collection "${name}" ready (${records.length} records)`);
  }
  return true;
}

function getCollection(name) {
  return collections ? collections[name] : null;
}

function isMongoEnabled() {
  return collections !== null;
}

async function close() {
  if (client) await client.close();
}

module.exports = {
  close,
  flush,
  getCollection,
  initialize,
  isMongoEnabled,
  setCollection,
};
