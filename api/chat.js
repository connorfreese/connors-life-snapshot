// Vercel serverless function: proxies chat requests to the Anthropic API.
// Keeps ANTHROPIC_API_KEY server-side and avoids browser CORS errors.
// (This is a Create React App project, so this is a Vercel Node function at
// /api/chat — not a Next.js route, but the path and usage are the same.)

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY is not configured." });
  }

  // Vercel auto-parses JSON bodies, but guard for a raw string just in case.
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const { model, max_tokens, system, messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "`messages` is required." });
  }

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: model || "claude-sonnet-4-6",
        max_tokens: max_tokens || 1500,
        system,
        messages,
      }),
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const message = data?.error?.message || `Anthropic API error (${upstream.status}).`;
      return res.status(upstream.status).json({ error: message });
    }
    return res.status(200).json(data);
  } catch (e) {
    return res.status(502).json({ error: e?.message || "Upstream request failed." });
  }
};
