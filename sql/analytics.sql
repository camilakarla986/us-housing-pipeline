SELECT
    region_name,
    COUNT(*) AS months_recorded,
    ROUND(AVG(median_sale_price), 2) AS average_sale_price,
    MIN(median_sale_price) AS lowest_sale_price,
    MAX(median_sale_price) AS highest_sale_price
FROM housing_prices
GROUP BY region_id, region_name
ORDER BY average_sale_price DESC
LIMIT 10;