export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      const result = await env.DB.prepare(
        "SELECT COUNT(*) AS total FROM housing_prices"
      ).first();

      return Response.json(result);
    }

    if (url.pathname === "/ingest" && request.method === "POST") {
      if (
        !env.INGEST_API_KEY ||
        request.headers.get("Authorization") !==
          `Bearer ${env.INGEST_API_KEY}`
      ) {
        return new Response("Unauthorized", { status: 401 });
      }

      let records;

      try {
        records = await request.json();
      } catch {
        return new Response("Invalid JSON", { status: 400 });
      }

      if (!Array.isArray(records) || records.length === 0 || records.length > 100) {
        return new Response("Send 1–100 records", { status: 400 });
      }

      if (!records.every(r =>
        Number.isInteger(r.region_id) &&
        typeof r.region_name === "string" &&
        typeof r.month === "string" &&
        Number.isFinite(r.median_sale_price)
      )) {
        return new Response("Invalid records", { status: 400 });
      }

      const statements = records.map(r =>
        env.DB.prepare(
          `INSERT INTO housing_prices
(region_id, region_name, month, median_sale_price)
VALUES (?, ?, ?, ?)
ON CONFLICT(region_id, month)
DO UPDATE SET
    region_name = excluded.region_name,
    median_sale_price = excluded.median_sale_price
WHERE
    region_name IS NOT excluded.region_name
    OR median_sale_price IS NOT excluded.median_sale_price`
        ).bind(r.region_id, r.region_name, r.month, r.median_sale_price)
      );

      await env.DB.batch(statements);

      return Response.json({ received: records.length });
    }

    return new Response("Not Found", { status: 404 });
  }
};