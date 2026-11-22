const fs = require("fs");

const data = JSON.parse(
  fs.readFileSync("data/cleaned_housing.json", "utf8")
);

const firstBatch = data.slice(0, 10);

console.log("Records ready for SQL:", firstBatch.length);

const sql = firstBatch.map(row => {
  const name = row.region_name.replace(/'/g, "''");

  return `INSERT INTO housing_prices
    (region_id, region_name, month, median_sale_price)
    VALUES (${row.region_id}, '${name}', '${row.month}', ${row.median_sale_price});`;
}).join("\n");

console.log("SQL statements generated:", firstBatch.length);

fs.writeFileSync("sql/first_batch.sql", sql);

console.log("SQL file created!");