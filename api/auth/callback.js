// Vercel serverless function: Google OAuth token exchange + refresh.
//
// Keeps GOOGLE_CLIENT_SECRET server-side — it must NEVER ship in the
// frontend bundle (this repo is public). Set it in the Vercel project:
//   vercel env add GOOGLE_CLIENT_SECRET
//
// Handles two POST bodies:
//   { code }          -> exchanges an authorization code for tokens
//   { refresh_token } -> refreshes an expired access token
//
// The client ID and redirect URI are not secret, so they fall back to
// the known values if the matching env vars aren't set.

const CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  "196860763320-9nslvqc6gq0gbmt08a02kr7llg31jsl6.apps.googleusercontent.com";
const REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI ||
  "https://connors-life-snapshot.vercel.app/auth/callback";

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientSecret) {
    return res.status(500).json({
      error: "GOOGLE_CLIENT_SECRET is not configured on the server.",
    });
  }

  // Vercel auto-parses JSON bodies, but guard for a raw string just in case.
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const params = new URLSearchParams();
  params.set("client_id", CLIENT_ID);
  params.set("client_secret", clientSecret);

  if (body.code) {
    params.set("code", body.code);
    params.set("grant_type", "authorization_code");
    params.set("redirect_uri", REDIRECT_URI);
  } else if (body.refresh_token) {
    params.set("refresh_token", body.refresh_token);
    params.set("grant_type", "refresh_token");
  } else {
    return res.status(400).json({ error: "Provide `code` or `refresh_token`." });
  }

  try {
    const upstream = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const message =
        data.error_description || data.error || `Token exchange failed (${upstream.status}).`;
      return res.status(upstream.status).json({ error: message });
    }

    // Return only what the client needs; refresh_token is only present on the
    // initial code exchange (when access_type=offline + prompt=consent).
    return res.status(200).json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      token_type: data.token_type,
      scope: data.scope,
    });
  } catch (e) {
    return res.status(502).json({ error: e?.message || "Upstream request failed." });
  }
};
