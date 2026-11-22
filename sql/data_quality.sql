SELECT
    COUNT(*) AS total_records,

    COUNT(DISTINCT region_id || '-' || month)
        AS unique_records,

    SUM(CASE
        WHEN median_sale_price IS NULL
          OR median_sale_price <= 0
        THEN 1 ELSE 0
    END) AS invalid_prices,

    SUM(CASE
        WHEN region_name IS NULL
          OR TRIM(region_name) = ''
        THEN 1 ELSE 0
    END) AS missing_regions

FROM housing_prices;
