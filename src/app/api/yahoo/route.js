// /app/api/yahoo/route.js  (Next.js 13+ App Router)
// Features:
// - Server-side-only Next.js route handler
// - Fetches Yahoo Finance v8 chart endpoint (no API key required)
// - In-memory caching with TTL (default 10s)
// - Retry + exponential backoff
// - Normalizes output to [{ datetime, open, high, low, close, volume }]
// - Optional fallback to Twelve Data if you set TWELVE_KEY and FALLBACK_PROVIDER=twelvedata

const CACHE = new Map(); // simple in-memory cache: key -> { expiresAt, data }
const DEFAULT_TTL = parseInt(process.env.YAHOO_CACHE_TTL || "10", 10) * 1000; // ms
const MAX_RETRIES = 3;

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function fetchWithRetry(url, opts = {}, retries = MAX_RETRIES) {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      const res = await fetch(url, opts);
      // treat 2xx as success
      if (res.ok) return res;
      // handle 4xx/5xx as error to retry on server errors
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      const backoff = 250 * Math.pow(2, attempt); // exponential backoff
      await sleep(backoff);
    }
  }
}

function normalizeYahooChart(chart) {
  const timestamps = chart.timestamp || [];
  const quote = (chart.indicators && chart.indicators.quote && chart.indicators.quote[0]) || {};
  const opens = quote.open || [];
  const highs = quote.high || [];
  const lows = quote.low || [];
  const closes = quote.close || [];
  const volumes = quote.volume || [];

  const candles = timestamps
    .map((ts, i) => {
      const o = opens[i], h = highs[i], l = lows[i], c = closes[i], v = volumes[i];
      if (c === null || o === null) return null; // skip missing
      return {
        datetime: new Date(ts * 1000).toISOString(),
        open: o,
        high: h,
        low: l,
        close: c,
        volume: v,
      };
    })
    .filter(Boolean);
  return candles;
}

async function fetchFromYahoo(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1m&range=1d`;
  const res = await fetchWithRetry(url, {
    headers: {
      // Setting a User-Agent reduces chance of simple blocking
      "User-Agent": "node-fetch/1.0 (+https://github.com)"
    },
    // keep caches disabled so we always control caching server-side
    cache: "no-store",
  });
  const json = await res.json();
  const chart = json.chart && json.chart.result && json.chart.result[0];
  if (!chart) {
    // propagate the raw error object if available
    const errObj = json.chart && json.chart.error ? json.chart.error : { message: "No chart result" };
    const e = new Error(`Yahoo no chart: ${JSON.stringify(errObj)}`);
    e.raw = json;
    throw e;
  }
  return normalizeYahooChart(chart);
}

// Optional fallback using Twelve Data if env vars are provided
async function fetchFromTwelveData(symbol) {
  const key = process.env.TWELVE_KEY;
  if (!key) throw new Error("TWELVE_KEY not set");
  // Twelve Data accepts exchange suffix like .NS in many cases, so pass symbol as-is
  const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}&interval=1min&outputsize=100&format=json&apikey=${encodeURIComponent(key)}`;
  const res = await fetchWithRetry(url, {
    headers: { "User-Agent": "node-fetch/1.0 (+https://github.com)" },
    cache: "no-store",
  });
  const json = await res.json();
  if (json.status === "error") throw new Error(`TwelveData error: ${JSON.stringify(json)}`);

  // json.values is an array of { datetime, open, high, low, close, volume }
  if (!json.values) throw new Error("TwelveData returned no values");

  // ensure datetime is ISO (TwelveData often returns 'YYYY-MM-DD HH:MM:SS')
  const candles = json.values
    .map((v) => {
      const dt = new Date(v.datetime + " UTC");
      return {
        datetime: dt.toISOString(),
        open: parseFloat(v.open),
        high: parseFloat(v.high),
        low: parseFloat(v.low),
        close: parseFloat(v.close),
        volume: parseInt(v.volume, 10) || 0,
      };
    })
    .reverse(); // TwelveData returns newest-first sometimes; reverse to chronological

  return candles;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbolRaw = searchParams.get("symbol") || "RELIANCE.NS";
    // normalize simple aliasing (allow both RELIANCE.NS and RELIANCE)
    let symbol = symbolRaw.trim();

    // Use simple cache key
    const cacheKey = `yahoo:${symbol}`;
    const now = Date.now();
    const cached = CACHE.get(cacheKey);
    if (cached && cached.expiresAt > now) {
      return new Response(JSON.stringify({ source: cached.source, symbol, data: cached.data }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Try Yahoo first
    let candles = null;
    try {
      candles = await fetchFromYahoo(symbol);
      // Save to cache
      CACHE.set(cacheKey, { expiresAt: now + DEFAULT_TTL, data: candles, source: "yahoo" });
      return new Response(JSON.stringify({ source: "yahoo", symbol, data: candles }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (yErr) {
      // If a fallback provider is configured, try it
      const fallback = (process.env.FALLBACK_PROVIDER || "").toLowerCase();
      if (fallback === "twelvedata" && process.env.TWELVE_KEY) {
        try {
          candles = await fetchFromTwelveData(symbol);
          CACHE.set(cacheKey, { expiresAt: now + DEFAULT_TTL, data: candles, source: "twelvedata" });
          return new Response(JSON.stringify({ source: "twelvedata", symbol, data: candles }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (tdErr) {
          // fall through to error below
          console.warn("TwelveData fallback failed:", tdErr.message);
        }
      }

      // If fallback not configured or failed, propagate a helpful error
      return new Response(
        JSON.stringify({
          error: "Yahoo failed and no working fallback available",
          details: yErr.message,
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
