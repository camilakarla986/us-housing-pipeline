import fs from "node:fs";

const records = JSON.parse(
  fs.readFileSync("data/cleaned_housing.json", "utf8")
).slice(0, 10);

const url = process.env.WORKER_URL;
const apiKey = process.env.INGEST_API_KEY;

if (!url || !apiKey) {
  throw new Error("WORKER_URL and INGEST_API_KEY are required");
}

const batchSize = 100;
let uploaded = 0;

for (let i = 0; i < records.length; i += batchSize) {
  const batch = records.slice(i, i + batchSize);

  const response = await fetch(`${url.replace(/\/$/, "")}/ingest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(batch)
  });

  if (!response.ok) {
    throw new Error(
      `Batch ${i / batchSize + 1} failed: ${response.status} ${await response.text()}`
    );
  }

  uploaded += batch.length;
  console.log(`Processed ${uploaded}/${records.length}`);
}

console.log("Data loading complete!");