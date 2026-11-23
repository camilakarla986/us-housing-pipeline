# US Housing Market Data Engineering Pipeline

An end-to-end data engineering project using real Zillow Research housing market data, Cloudflare Workers, Cloudflare D1, SQL, JavaScript, PowerShell, and GitHub Actions.

## Project Overview

This project processes monthly US housing market data and stores it in a cloud database for analysis.

The pipeline supports batch ingestion, data cleaning, incremental database updates, SQL analytics, and automated health monitoring.

## Architecture

```text
Zillow Research CSV
        |
        v
JavaScript Data Cleaning
        |
        v
JSON Records
        |
        v
PowerShell Batch Loader
        |
        v
Cloudflare Worker API
        |
        v
Cloudflare D1 (SQLite)
        |
        v
SQL Analytics & Data Quality Checks
```

GitHub Actions runs a scheduled health check against the deployed Cloudflare Worker.

## Technologies

| Technology | Purpose |
|---|---|
| JavaScript / Node.js | CSV processing and transformation |
| PowerShell | Batch data uploads |
| Cloudflare Workers | Secure ingestion API |
| Cloudflare D1 | Cloud SQL database |
| SQL | Analytics, validation, and UPSERT operations |
| Git / GitHub | Version control |
| GitHub Actions | Scheduled health monitoring |

## Dataset

**Source:** Zillow Research

**Metric:** Median sale price (nowcast), all homes, monthly

**Geographic coverage:** US national and metropolitan regions

**Records loaded:** 67,392

**Source website:** https://www.zillow.com/research/data/

The project uses aggregated housing market data rather than individual property listings.

## Key Features

### 1. Data ingestion

- Processes Zillow's monthly housing market CSV.
- Transforms wide-format data into structured records.
- Uploads data in batches of 100 records.
- Uses a protected Cloudflare Worker endpoint.

### 2. Incremental loading

Uses SQL UPSERT operations to:

- Insert new region-month records.
- Update existing records when prices change.
- Avoid duplicate records.
- Leave unchanged records untouched.

### 3. SQL analytics

Calculates average, minimum, and maximum median sale prices by region.

### 4. Data quality

Validates:

- Missing region names
- Invalid or missing prices
- Duplicate region-month combinations
- Total record counts

**Validation result:** 67,392 records, with no invalid prices, missing regions, or duplicate keys.

### 5. Automation

GitHub Actions runs a weekly Cloudflare Worker health check and supports manual execution.

**Note:** New Zillow CSV downloads and ingestion are not yet fully automated.

## Project Results

- Successfully loaded 67,392 housing market records into Cloudflare D1.
- Implemented authenticated batch ingestion.
- Added incremental UPSERT logic.
- Executed SQL analytics and data quality checks.
- Successfully ran a GitHub Actions health check.

## Future Improvements

- Automate permitted source-data updates.
- Add historical housing price trend visualizations.
- Build an interactive analytics dashboard.
- Add pipeline execution logs and