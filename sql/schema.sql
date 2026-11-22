CREATE TABLE IF NOT EXISTS housing_prices (
    region_id INTEGER NOT NULL,
    region_name TEXT NOT NULL,
    month TEXT NOT NULL,
    median_sale_price REAL,
    PRIMARY KEY (region_id, month)
);