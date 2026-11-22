const fs = require("fs");
const { parse } = require("csv-parse/sync");

const csv = fs.readFileSync(
  "data/Metro_median_sale_price_now_uc_sfrcondo_month.csv",
  "utf8"
);

console.log(csv.slice(0, 200));

const records = parse(csv, {
  columns: true,
  skip_empty_lines: true
});

console.log("Total regions:", records.length);
console.log("First region:", records[0].RegionName);

const firstRegion = records[0];

console.log("Region:", firstRegion.RegionName);
console.log("February 2008 price:", firstRegion["2008-02-29"]);

const dateColumns = Object.keys(records[0]).filter(
  column => /^\d{4}-\d{2}-\d{2}$/.test(column)
);

console.log("Total months:", dateColumns.length);
console.log("First month:", dateColumns[0]);
console.log("Last month:", dateColumns[dateColumns.length - 1]);

const housingData = dateColumns.map(month => ({
  region_id: Number(firstRegion.RegionID),
  region_name: firstRegion.RegionName,
  month: month,
  median_sale_price: Number(firstRegion[month])
}));

console.log(housingData.slice(0, 3));
const allHousingData = records.flatMap(region =>
  dateColumns.map(month => ({
    region_id: Number(region.RegionID),
    region_name: region.RegionName,
    month: month,
    median_sale_price: region[month] === ""
      ? null
      : Number(region[month])
  }))
);

console.log("Total housing records:", allHousingData.length);

const missingPrices = allHousingData.filter(
  row => row.median_sale_price === null
);

console.log("Missing prices:", missingPrices.length);

const validHousingData = allHousingData.filter(
  row => row.median_sale_price !== null
);

console.log("Valid records:", validHousingData.length);

const keys = validHousingData.map(
  row => `${row.region_id}|${row.month}`
);

const duplicateCount = keys.length - new Set(keys).size;

console.log("Duplicate records:", duplicateCount);

fs.writeFileSync(
  "data/cleaned_housing.json",
  JSON.stringify(validHousingData)
);

console.log("Cleaned data exported!");

const batchSize = 500;
const totalBatches = Math.ceil(validHousingData.length / batchSize);

console.log("Total batches:", totalBatches);

const firstBatch = validHousingData.slice(0, batchSize);

console.log("First batch records:", firstBatch.length);