import React from "react";
import { useState } from "react";

const ORANGE  = "#F97316";
const ORANGE2 = "#FB923C";
const BLUE    = "#1D4ED8";
const BLUE2   = "#1E40AF";
const NAVY    = "#0B1929";
const CARD    = "#0F2237";
const CARD2   = "#142840";
const TEXT    = "#F1F5F9";
const MUTED   = "#64748B";
const GREEN   = "#22C55E";
const RED     = "#EF4444";
const YELLOW  = "#EAB308";

const HABIT_DEFS = [
  { id: 1,  name: "7am Wake Up",              icon: "☀",  points: 10, freq: "daily"      },
  { id: 2,  name: "Read 30 Minutes",           icon: "📖", points: 10, freq: "daily"      },
  { id: 3,  name: "Meditate",                  icon: "🧘", points: 10, freq: "daily"      },
  { id: 4,  name: "Journal",                   icon: "✍",  points: 10, freq: "daily"      },
  { id: 5,  name: "Time With God",             icon: "🙏", points: 10, freq: "daily"      },
  { id: 6,  name: "Workout",                   icon: "💪", points: 10, freq: "daily"      },
  { id: 7,  name: "Floss",                     icon: "🦷", points: 10, freq: "daily"      },
  { id: 8,  name: "Morning Skincare",          icon: "🌅", points: 10, freq: "daily"      },
  { id: 9,  name: "Nightly Skincare",          icon: "🌙", points: 10, freq: "daily"      },
  { id: 10, name: "200g of Protein",           icon: "🥩", points: 10, freq: "daily"      },
  { id: 11, name: "Pre-Sleep Meditation",      icon: "😴", points: 10, freq: "daily"      },
  { id: 12, name: "20+ Min Stretching",        icon: "🤸", points: 10, freq: "daily"      },
  { id: 13, name: "Red Light Therapy",         icon: "🔴", points: 10, freq: { days: 4.5, label: "4–5×/wk" } },
  { id: 14, name: "Cold Therapy",              icon: "🧊", points: 10, freq: { days: 3.5, label: "3–4×/wk" } },
];

const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const STORAGE_KEY = "connors_habits_v1";

function getWeekKey(date = new Date()) {
  const d = new Date(date);
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const wk = 1 + Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${d.getFullYear()}-W${String(wk).padStart(2,"00")}`;
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

function dateKey(date) {
  return date.toISOString().slice(0,10);
}

function scoreColor(pct) {
  if (pct >= 90) return GREEN;
  if (pct >= 60) return ORANGE;
  if (pct > 0)   return YELLOW;
  return RED;
}

function ScoreRing({ score, max, size = 80 }) {
  const pct = max > 0 ? score / max : 0;
  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const color = scoreColor(pct * 100);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.5s ease, stroke 0.5s ease" }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        style={{ transform: "rotate(90deg)", transformOrigin: `${size/2}px ${size/2}px`,
          fill: color, fontSize: size * 0.22, fontWeight: 700, fontFamily: "inherit" }}>
        {score}
      </text>
    </svg>
  );
}

export default function ConnorsLifeSnapshot() {
  const today    = new Date();
  const todayKey = dateKey(today);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + i);
    return d;
  });

  const [allData, setAllData] = useState(() => loadData());
  const [view, setView]       = useState("today");
  const [photoURL, setPhotoURL] = useState(null);

  function getTodayData() { return allData[todayKey] || {}; }

  function toggle(habitId) {
    const prev = allData[todayKey] || {};
    const updated = { ...allData, [todayKey]: { ...prev, [habitId]: !prev[habitId] } };
    setAllData(updated);
    saveData(updated);
  }

  function getDayData(date) { return allData[dateKey(date)] || {}; }

  function getDayScore(date) {
    const data = getDayData(date);
    return HABIT_DEFS.reduce((s, h) => s + (data[h.id] ? h.points : 0), 0);
  }

  function getDayMax() { return HABIT_DEFS.length * 10; }

  const todayData  = getTodayData();
  const todayScore = HABIT_DEFS.reduce((s, h) => s + (todayData[h.id] ? h.points : 0), 0);
  const todayMax   = getDayMax();
  const todayPct   = todayMax > 0 ? Math.round((todayScore / todayMax) * 100) : 0;
  const completedToday = HABIT_DEFS.filter(h => todayData[h.id]).length;

  const weekScores = weekDays.map(d => ({ date: d, score: getDayScore(d), pct: Math.round((getDayScore(d)/getDayMax())*100) }));
  const weekAvg    = Math.round(weekScores.reduce((s, d) => s + d.pct, 0) / 7);
  const todayName  = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", background: NAVY, minHeight: "100vh", color: TEXT }}>

      <div style={{
        background: `linear-gradient(135deg, ${BLUE2} 0%, #0F2237 60%, #1a1a2e 100%)`,
        borderBottom: `3px solid ${ORANGE}`,
        padding: "20px 24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, maxWidth: 860, margin: "0 auto" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: `linear-gradient(135deg, ${ORANGE}, ${BLUE})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: `3px solid ${ORANGE}`, overflow: "hidden",
              boxShadow: `0 0 0 3px rgba(249,115,22,0.3)`,
            }}>
              {photoURL
                ? <img src={photoURL} alt="Connor" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>C</span>
              }
            </div>
            <label style={{
              position: "absolute", bottom: -2, right: -2,
              width: 22, height: 22, borderRadius: "50%",
              background: ORANGE, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, border: "2px solid " + NAVY,
            }}>
              +
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                const f = e.target.files[0];
                if (f) setPhotoURL(URL.createObjectURL(f));
              }} />
            </label>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: ORANGE, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>
              Personal Dashboard
            </div>
            <h1 style={{ margin: "2px 0 0", fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>
              Connor's Life Snapshot
            </h1>
            <div style={{ fontSize: 13, color: "#93C5FD", marginTop: 3 }}>{todayName}</div>
          </div>

          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <ScoreRing score={todayScore} max={todayMax} size={72} />
            <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>TODAY</div>
          </div>

          <div style={{
            flexShrink: 0, background: "rgba(0,0,0,0.25)",
            borderRadius: 12, padding: "12px 18px", textAlign: "center",
            border: "1px solid rgba(249,115,22,0.2)",
          }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: scoreColor(weekAvg) }}>{weekAvg}%</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>WEEK AVG</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 24px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {[["today","Today's Habits"],["week","Weekly View"]].map(([v, label]) => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "8px 18px", borderRadius: 8, cursor: "pointer",
              fontFamily: "inherit", fontSize: 13, fontWeight: 600,
              border: `1px solid ${view === v ? ORANGE : "rgba(255,255,255,0.08)"}`,
              background: view === v ? `rgba(249,115,22,0.18)` : "transparent",
              color: view === v ? ORANGE : MUTED,
              transition: "all 0.15s",
            }}>{label}</button>
          ))}
        </div>

        {view === "today" && (
          <div>
            <div style={{
              background: CARD, borderRadius: 14, padding: "16px 20px",
              marginBottom: 16, border: "1px solid rgba(249,115,22,0.15)",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
            }}>
              <div>
                <div style={{ fontSize: 13, color: MUTED }}>Daily Score</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: scoreColor(todayPct), lineHeight: 1.1 }}>
                  {todayScore} <span style={{ fontSize: 16, color: MUTED, fontWeight: 400 }}>/ {todayMax}</span>
                </div>
                <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>
                  {completedToday} of {HABIT_DEFS.length} habits complete
                </div>
              </div>
              <div style={{ flex: 1, maxWidth: 280 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: MUTED, marginBottom: 6 }}>
                  <span>Progress</span><span style={{ color: scoreColor(todayPct) }}>{todayPct}%</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 10, overflow: "hidden" }}>
                  <div style={{
                    width: `${todayPct}%`, height: "100%", borderRadius: 99,
                    background: `linear-gradient(90deg, ${ORANGE}, ${ORANGE2})`,
                    transition: "width 0.5s ease",
                    boxShadow: todayPct > 0 ? `0 0 12px rgba(249,115,22,0.5)` : "none",
                  }} />
                </div>
                {todayPct === 100 && (
                  <div style={{ fontSize: 12, color: GREEN, marginTop: 6, fontWeight: 700 }}>
                    🔥 Perfect day! Keep it up!
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {HABIT_DEFS.map((h, i) => {
                const done = !!todayData[h.id];
                return (
                  <div key={h.id} onClick={() => toggle(h.id)} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    background: done
                      ? "linear-gradient(90deg, rgba(34,197,94,0.12), rgba(34,197,94,0.04))"
                      : i % 2 === 0 ? CARD : CARD2,
                    border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.05)"}`,
                    borderRadius: 10, padding: "12px 16px", cursor: "pointer",
                    transition: "all 0.15s",
                    borderLeft: `4px solid ${done ? GREEN : "rgba(249,115,22,0.3)"}`,
                  }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                      border: `2px solid ${done ? GREEN : "#475569"}`,
                      background: done ? GREEN : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, color: "#000", fontWeight: 800, transition: "all 0.15s",
                    }}>{done ? "✓" : ""}</div>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{h.icon}</span>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: done ? "#86EFAC" : TEXT }}>{h.name}</span>
                    {h.freq !== "daily" && (
                      <span style={{
                        fontSize: 11, padding: "2px 8px", borderRadius: 99,
                        background: "rgba(249,115,22,0.15)", color: ORANGE,
                        border: "1px solid rgba(249,115,22,0.3)", fontWeight: 600, flexShrink: 0,
                      }}>{h.freq.label}</span>
                    )}
                    <span style={{ fontSize: 13, fontWeight: 700, flexShrink: 0, color: done ? GREEN : MUTED }}>+{h.points}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === "week" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 20 }}>
              {weekDays.map((d, i) => {
                const isToday = dateKey(d) === todayKey;
                const isFuture = d > today && dateKey(d) !== todayKey;
                const sc = weekScores[i];
                return (
                  <div key={i} style={{
                    background: isToday ? `rgba(249,115,22,0.18)` : CARD,
                    border: `1px solid ${isToday ? ORANGE : "rgba(255,255,255,0.06)"}`,
                    borderRadius: 10, padding: "10px 8px", textAlign: "center",
                    opacity: isFuture ? 0.35 : 1,
                  }}>
                    <div style={{ fontSize: 11, color: isToday ? ORANGE : MUTED, fontWeight: 700, marginBottom: 4 }}>
                      {DAYS_SHORT[d.getDay()]}
                    </div>
                    <div style={{ fontSize: 11, color: MUTED, marginBottom: 8 }}>{d.getDate()}</div>
                    <ScoreRing score={isFuture ? 0 : sc.score} max={todayMax} size={46} />
                  </div>
                );
              })}
            </div>

            <div style={{ background: CARD, borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{
                display: "grid", gridTemplateColumns: "1fr repeat(7, 48px)",
                background: `linear-gradient(90deg, ${BLUE2}, #0F2237)`,
                borderBottom: `2px solid ${ORANGE}`,
              }}>
                <div style={{ padding: "10px 16px", fontSize: 12, color: ORANGE, fontWeight: 700, letterSpacing: "0.08em" }}>HABIT</div>
                {weekDays.map((d, i) => {
                  const isToday = dateKey(d) === todayKey;
                  return (
                    <div key={i} style={{
                      padding: "10px 4px", textAlign: "center", fontSize: 11, fontWeight: 700,
                      color: isToday ? ORANGE : "#93C5FD",
                      background: isToday ? "rgba(249,115,22,0.1)" : "transparent",
                    }}>
                      <div>{DAYS_SHORT[d.getDay()]}</div>
                      <div style={{ fontWeight: 400, color: MUTED, fontSize: 10 }}>{d.getDate()}</div>
                    </div>
                  );
                })}
              </div>

              {HABIT_DEFS.map((h, hi) => (
                <div key={h.id} style={{
                  display: "grid", gridTemplateColumns: "1fr repeat(7, 48px)",
                  borderBottom: hi < HABIT_DEFS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  background: hi % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                }}>
                  <div style={{ padding: "9px 16px", fontSize: 13, color: TEXT, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 15 }}>{h.icon}</span>
                    <span>{h.name}</span>
                    {h.freq !== "daily" && (
                      <span style={{ fontSize: 10, color: ORANGE, marginLeft: 4 }}>{h.freq.label}</span>
                    )}
                  </div>
                  {weekDays.map((d, di) => {
                    const isFuture = d > today && dateKey(d) !== todayKey;
                    const isToday2 = dateKey(d) === todayKey;
                    const done2 = !isFuture && !!getDayData(d)[h.id];
                    return (
                      <div key={di} onClick={() => {
                        if (isFuture) return;
                        const dk = dateKey(d);
                        const prev2 = allData[dk] || {};
                        const updated2 = { ...allData, [dk]: { ...prev2, [h.id]: !prev2[h.id] } };
                        setAllData(updated2);
                        saveData(updated2);
                      }} style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: isFuture ? "default" : "pointer",
                        background: isToday2 ? "rgba(249,115,22,0.06)" : "transparent",
                      }}>
                        {isFuture ? (
                          <div style={{ width: 20, height: 20, borderRadius: 4, background: "rgba(255,255,255,0.04)" }} />
                        ) : done2 ? (
                          <div style={{ width: 22, height: 22, borderRadius: 5, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#000", fontWeight: 800 }}>✓</div>
                        ) : (
                          <div style={{ width: 22, height: 22, borderRadius: 5, background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#EF4444" }}>–</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              <div style={{
                display: "grid", gridTemplateColumns: "1fr repeat(7, 48px)",
                background: `linear-gradient(90deg, ${BLUE2}88, #0F223788)`,
                borderTop: `2px solid ${ORANGE}`,
              }}>
                <div style={{ padding: "10px 16px", fontSize: 12, color: ORANGE, fontWeight: 800, letterSpacing: "0.08em" }}>DAILY SCORE</div>
                {weekDays.map((d, i) => {
                  const isFuture2 = d > today && dateKey(d) !== todayKey;
                  const sc2 = isFuture2 ? null : weekScores[i];
                  return (
                    <div key={i} style={{ padding: "10px 4px", textAlign: "center", fontSize: 13, fontWeight: 800, color: sc2 ? scoreColor(sc2.pct) : MUTED }}>
                      {sc2 && sc2.score > 0 ? sc2.score : isFuture2 ? "" : "—"}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
