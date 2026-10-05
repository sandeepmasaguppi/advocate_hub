const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Set MONGODB_URI before importing JSON data");
  process.exit(1);
}

const DATA_DIRECTORY = path.join(__dirname, "data");
const SOURCES = {
  advocates: ["advocates.json"],
  clients: ["clients.json"],
  payments: ["payments.json"],
  clarity_guide: ["clarityguide.json"],
  document_purchases: ["documentspurchase.json", "documentspurchase,json"],
  admin_notifications: ["admin_notifications.json"],
};

function readRecords(filenames) {
  for (const filename of filenames) {
    try {
      const records = JSON.parse(fs.readFileSync(path.join(DATA_DIRECTORY, filename), "utf8"));
      if (!Array.isArray(records)) {
        throw new TypeError(`Expected ${filename} to contain a JSON array`);
      }
      return records;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  return [];
}

async function main() {
  const client = new MongoClient(uri, { appName: "AdvocatesHubDataImport" });
  try {
    await client.connect();
    const database = client.db(process.env.MONGODB_DB_NAME || "advocates_hub");

    for (const [collectionName, filenames] of Object.entries(SOURCES)) {
      const collection = database.collection(collectionName);
      const existingCount = await collection.countDocuments();
      if (existingCount > 0) {
        console.log(`Skipped ${collectionName}: MongoDB already contains ${existingCount} records`);
        continue;
      }

      const records = readRecords(filenames);
      if (records.length > 0) {
        await collection.insertMany(records.map((record, position) => {
          const document = { ...record, _position: position };
          document._id = record.id === undefined || record.id === null
            ? `position:${position}`
            : `${typeof record.id}:${record.id}`;
          return document;
        }));
      }
      console.log(`Imported ${records.length} records into ${collectionName}`);
    }
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error("JSON-to-MongoDB import failed:", error.message);
  process.exitCode = 1;
});
