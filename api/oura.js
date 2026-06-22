// Vercel serverless function: proxies Oura Ring v2 API requests.
//
// Keeps OURA_TOKEN server-side. Oura Personal Access Tokens are meant for
// server-to-server use and the Oura API sends no CORS headers, so the
// browser can neither safely hold the token nor call Oura directly. The
// frontend calls /api/oura?start=YYYY-MM-DD&end=YYYY-MM-DD and gets back the
// collections it needs in one response.
//
// Set the token in the Vercel project:  vercel env add OURA_TOKEN

const OURA_BASE = "https://api.ouraring.com/v2/usercollection";

// Response key -> Oura collection path.
const COLLECTIONS = {
  readiness:   "daily_readiness",
  sleep_daily: "daily_sleep",
  activity:    "daily_activity",
  sleep:       "sleep",
};

const isDate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
const iso = (d) => d.toISOString().slice(0, 10);

module.exports = async function handler(req, res) {
  const token = process.env.OURA_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "OURA_TOKEN is not configured on the server." });
  }

  // Date range. Default: last 7 days through tomorrow (so "today" is always
  // covered regardless of inclusive/exclusive end-date handling).
  const now = Date.now();
  const { start, end } = req.query || {};
  const startDate = isDate(start) ? start : iso(new Date(now - 7 * 864e5));
  const endDate   = isDate(end)   ? end   : iso(new Date(now + 864e5));

  const headers = { Authorization: "Bearer " + token };
  const qs = `?start_date=${startDate}&end_date=${endDate}`;

  try {
    const entries = await Promise.all(
      Object.entries(COLLECTIONS).map(async ([key, path]) => {
        const upstream = await fetch(`${OURA_BASE}/${path}${qs}`, { headers });
        const body = await upstream.json().catch(() => ({}));
        if (!upstream.ok) {
          const message =
            body?.detail || body?.message || `Oura ${path} error (${upstream.status}).`;
          throw Object.assign(new Error(message), { status: upstream.status });
        }
        return [key, Array.isArray(body.data) ? body.data : []];
      })
    );

    const out = Object.fromEntries(entries);
    out.range = { start: startDate, end: endDate };
    return res.status(200).json(out);
  } catch (e) {
    const status = e?.status || 502;
    return res.status(status).json({ error: e?.message || "Oura request failed." });
  }
};
