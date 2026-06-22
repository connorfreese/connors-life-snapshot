import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Google OAuth redirect lands on /auth/callback?code=… . Handle it here,
// before mounting the dashboard: exchange the code for tokens via our
// serverless function, stash them in localStorage, then return home.
// Must match GCAL_TOKEN_KEY in App.jsx.
const GCAL_TOKEN_KEY = "connor_gcal_token_v1";

if (window.location.pathname === "/auth/callback") {
  const root = document.getElementById("root");
  const msg = (t) => {
    root.innerHTML =
      '<div style="font-family:Inter,system-ui,sans-serif;min-height:100vh;display:flex;' +
      'align-items:center;justify-content:center;background:#FDF6EE;color:#1C1917;' +
      'font-size:16px;font-weight:600;">' + t + "</div>";
  };
  msg("Finishing Google sign-in…");

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const err = params.get("error");

  if (err || !code) {
    window.location.replace("/");
  } else {
    fetch("/api/auth/callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.access_token) {
          localStorage.setItem(
            GCAL_TOKEN_KEY,
            JSON.stringify({
              access_token: data.access_token,
              refresh_token: data.refresh_token || null,
              expiry: Date.now() + (data.expires_in || 3600) * 1000,
              scope: data.scope || "",
            })
          );
        } else {
          msg("Sign-in failed: " + ((data && data.error) || "unknown error"));
        }
      })
      .catch(() => msg("Sign-in failed. Returning to dashboard…"))
      .finally(() => setTimeout(() => window.location.replace("/"), 500));
  }
} else {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
