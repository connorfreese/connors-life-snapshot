import React from "react";
import { useState, useEffect } from "react";

// ── DESIGN TOKENS ─────────────────────────────────────────────────
const ORANGE  = "#EA6C00";
const ORANGE2 = "#F97316";
const BLUE    = "#2563EB";
const BLUE2   = "#3B82F6";
const CREAM   = "#FDF6EE";
const WHITE   = "#FFFFFF";
const CARD2   = "#FEF3E8";
const TEXT    = "#1C1917";
const MUTED   = "#78716C";
const GREEN   = "#16A34A";
const RED     = "#DC2626";
const YELLOW  = "#CA8A04";
const BORDER  = "rgba(0,0,0,0.08)";

// ── TABS ──────────────────────────────────────────────────────────
const TABS = [
  { id: "today",     label: "Today",           icon: "★" },
  { id: "habits",    label: "Habit Sheet",     icon: "✦" },
  { id: "treasured", label: "Treasured Homes", icon: "⌂" },
  { id: "social",    label: "Social Media",    icon: "◎" },
  { id: "health",    label: "Health & Fitness",icon: "♡" },
  { id: "finance",   label: "Finance",         icon: "◇" },
  { id: "brain",     label: "AI Brain",        icon: "✲" },
];

// ── MOTIVATIONAL QUOTES ───────────────────────────────────────────
const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
  { text: "Little things make big days.", author: "Unknown" },
  { text: "It's going to be hard, but hard does not mean impossible.", author: "Unknown" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
  { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
  { text: "The body achieves what the mind believes.", author: "Unknown" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
  { text: "You are braver than you believe, stronger than you seem.", author: "A.A. Milne" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
];

function getDailyQuote() {
  const day = new Date().getDate() + new Date().getMonth() * 31;
  return QUOTES[day % QUOTES.length];
}

// ── HABITS ────────────────────────────────────────────────────────
const HABIT_DEFS = [
  { id: 1,  name: "7am Wake Up",          icon: "☀",  points: 10, freq: "daily" },
  { id: 2,  name: "Read 30 Minutes",       icon: "📖", points: 10, freq: "daily" },
  { id: 3,  name: "Meditate",              icon: "🧘", points: 10, freq: "daily" },
  { id: 4,  name: "Journal",               icon: "✍",  points: 10, freq: "daily" },
  { id: 5,  name: "Time With God",         icon: "🙏", points: 10, freq: "daily" },
  { id: 6,  name: "Workout",               icon: "💪", points: 10, freq: "daily" },
  { id: 7,  name: "Floss",                 icon: "🦷", points: 10, freq: "daily" },
  { id: 8,  name: "Morning Skincare",      icon: "🌅", points: 10, freq: "daily" },
  { id: 9,  name: "Nightly Skincare",      icon: "🌙", points: 10, freq: "daily" },
  { id: 10, name: "200g of Protein",       icon: "🥩", points: 10, freq: "daily" },
  { id: 11, name: "Pre-Sleep Meditation",  icon: "😴", points: 10, freq: "daily" },
  { id: 12, name: "20+ Min Stretching",    icon: "🤸", points: 10, freq: "daily" },
  { id: 13, name: "Red Light Therapy",     icon: "🔴", points: 10, freq: { label: "4–5×/wk" } },
  { id: 14, name: "Cold Therapy",          icon: "🧊", points: 10, freq: { label: "3–4×/wk" } },
];

const DAYS_SHORT  = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const STORAGE_KEY = "connors_habits_v1";

function loadData() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : {}; }
  catch { return {}; }
}
function saveData(d) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {} }
function dateKey(d) { return d.toISOString().slice(0,10); }
function scoreColor(pct) {
  if (pct >= 90) return GREEN;
  if (pct >= 60) return ORANGE;
  if (pct > 0)   return YELLOW;
  return RED;
}

// ── SCORE RING ────────────────────────────────────────────────────
function ScoreRing({ score, max, size = 72 }) {
  const pct  = max > 0 ? score / max : 0;
  const r    = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const color = scoreColor(pct * 100);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={6} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={`${circ * pct} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.5s ease" }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        style={{ transform: `rotate(90deg)`, transformOrigin: `${size/2}px ${size/2}px`,
          fill: color, fontSize: size * 0.22, fontWeight: 700, fontFamily: "inherit" }}>
        {score}
      </text>
    </svg>
  );
}

// ── TODAY TAB ────────────────────────────────────────────────────
function TodayTab({ habitData, todosData, onToggleTodo, setActiveTab, bills = [], paid = {} }) {
  const today    = new Date();
  const todayKey = today.toISOString().slice(0,10);
  const hour     = today.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const quote    = getDailyQuote();
  const dayMax   = HABIT_DEFS.length * 10;

  const todayData      = habitData[todayKey] || {};
  const todayScore     = HABIT_DEFS.reduce((s,h) => s+(todayData[h.id]?h.points:0),0);
  const todayPct       = Math.round((todayScore/dayMax)*100);
  const completedToday = HABIT_DEFS.filter(h => todayData[h.id]).length;
  const remaining      = HABIT_DEFS.filter(h => !todayData[h.id]);

  const todayFull = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  // Real "Due this week" pulled from the Finance tab's bills.
  const dueThisWeek = getDueThisWeek(bills, today);

  // Real flagged tasks from Treasured Homes to-do list
  const todayTasks = (todosData?.items || []).filter(t => t.showToday);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Greeting + Quote */}
      <div style={{
        background: `linear-gradient(135deg, #FEF3E8, #FFF7ED)`,
        borderRadius: 16, padding: "24px 28px",
        border: `1px solid rgba(234,108,0,0.2)`,
        boxShadow: "0 2px 12px rgba(234,108,0,0.08)",
        borderLeft: `5px solid ${ORANGE}`,
      }}>
        <div style={{ fontSize: 13, color: MUTED, fontWeight: 500, marginBottom: 4 }}>{todayFull}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: TEXT, marginBottom: 16 }}>
          {greeting}, Connor! 👋
        </div>
        <div style={{ borderTop: `1px solid rgba(234,108,0,0.15)`, paddingTop: 16 }}>
          <div style={{ fontSize: 15, color: TEXT, fontStyle: "italic", lineHeight: 1.6, marginBottom: 6 }}>
            "{quote.text}"
          </div>
          <div style={{ fontSize: 12, color: MUTED, fontWeight: 600 }}>— {quote.author}</div>
        </div>
      </div>

      {/* Two column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Habit Progress */}
        <div style={{ background: WHITE, borderRadius: 14, padding: "20px", border: `1px solid ${BORDER}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>✦ Today's Habits</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: scoreColor(todayPct) }}>{todayPct}%</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.06)", borderRadius: 99, height: 10, overflow: "hidden", marginBottom: 12 }}>
            <div style={{
              width: `${todayPct}%`, height: "100%", borderRadius: 99,
              background: `linear-gradient(90deg,${ORANGE},${ORANGE2})`,
              transition: "width 0.5s ease",
              boxShadow: todayPct > 0 ? "0 0 8px rgba(234,108,0,0.4)" : "none",
            }} />
          </div>
          <div style={{ fontSize: 13, color: MUTED, marginBottom: 14 }}>
            {completedToday} of {HABIT_DEFS.length} complete · {todayScore}/{dayMax} pts
          </div>
          {remaining.length > 0 ? (
            <div>
              <div style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Still to do</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {remaining.slice(0,5).map(h => (
                  <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: TEXT }}>
                    <span style={{ fontSize: 14 }}>{h.icon}</span> {h.name}
                  </div>
                ))}
                {remaining.length > 5 && (
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>+{remaining.length - 5} more</div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 14, color: GREEN, fontWeight: 700 }}>🔥 All habits done! Perfect day!</div>
          )}
        </div>

        {/* Payments going out — real "Due this week" from Finance */}
        <div style={{ background: WHITE, borderRadius: 14, padding: "20px", border: `1px solid ${BORDER}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>◇ Due This Week</div>
            <button onClick={() => setActiveTab("finance")} style={{
              fontSize: 12, color: ORANGE, background: "none", border: "none",
              cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
            }}>Go →</button>
          </div>
          {dueThisWeek.length === 0 ? (
            <div style={{ fontSize: 13, color: MUTED, fontStyle: "italic" }}>
              Nothing due in the next 7 days. 🎉
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {dueThisWeek.map(({ bill, due }) => {
                const isPaid  = (paid[monthKey(due)] || {})[bill.id];
                const isToday = startOfDay(due).getTime() === startOfDay(today).getTime();
                const urgent  = isToday && !isPaid;
                return (
                  <div key={bill.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 12px", borderRadius: 8,
                    background: urgent ? "rgba(220,38,38,0.05)" : CREAM,
                    border: `1px solid ${urgent ? "rgba(220,38,38,0.2)" : BORDER}`,
                  }}>
                    <div>
                      <div style={{ fontSize: 13, color: TEXT, fontWeight: 500, textDecoration: isPaid ? "line-through" : "none", opacity: isPaid ? 0.6 : 1 }}>{bill.name}</div>
                      <div style={{ fontSize: 11, color: isPaid ? GREEN : urgent ? RED : MUTED, fontWeight: 600 }}>
                        {isPaid ? "✓ Paid" : urgent ? "⚠ Due today" : dueLabelShort(due, today)}
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: urgent ? RED : TEXT }}>{fmt(bill.amount)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Treasured Homes flagged tasks */}
      <div style={{ background: WHITE, borderRadius: 14, padding: "20px", border: `1px solid ${BORDER}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>⌂ Treasured Homes</div>
          <button onClick={() => setActiveTab("treasured")} style={{
            fontSize: 12, color: ORANGE, background: "none", border: "none",
            cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
          }}>Go → </button>
        </div>
        {todayTasks.length === 0 ? (
          <div style={{ fontSize: 13, color: MUTED, fontStyle: "italic" }}>
            No tasks flagged for today. Star a task in Treasured Homes to show it here.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {todayTasks.map(t => (
              <div key={t.id} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                borderRadius: 8,
                background: t.done ? "#F9F9F9" : CREAM,
                border: `1px solid ${t.done ? BORDER : "rgba(234,108,0,0.15)"}`,
                borderLeft: `3px solid ${t.done ? "#D4B89A" : ORANGE}`,
              }}>
                <div onClick={() => onToggleTodo && onToggleTodo(t.id)} style={{
                  width: 22, height: 22, borderRadius: 5, flexShrink: 0, cursor: "pointer",
                  border: `2px solid ${t.done ? GREEN : "#D4B89A"}`,
                  background: t.done ? GREEN : WHITE,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, color: WHITE, fontWeight: 800,
                }}>{t.done ? "✓" : ""}</div>
                <span style={{
                  flex: 1, fontSize: 13, color: t.done ? MUTED : TEXT,
                  textDecoration: t.done ? "line-through" : "none",
                  fontWeight: t.done ? 400 : 500,
                }}>{t.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}


// ── TREASURED HOMES ───────────────────────────────────────────────
const GRANTS = [
  {
    id: 1,
    name: "HUD Grant",
    funder: "U.S. Department of Housing & Urban Development",
    amount: 1280000,
    status: "Approved",
    notes: "Awarded — funds not yet received. Tied to purchase of 3326 E Marshall St.",
    submitted: "2025-01-01",
    decision: "Awarded",
  },
  {
    id: 2,
    name: "IOT3 Grant",
    funder: "IOT3",
    amount: 840000,
    status: "In Progress",
    notes: "Rolling deadline — targeting submission by end of this week. For purchase of 3316, 3318, 3322 E Marshall St.",
    submitted: null,
    decision: null,
  },
  {
    id: 3,
    name: "Anne & Henry Zarrow Foundation",
    funder: "Zarrow Foundation",
    amount: 216744,
    status: "In Review",
    notes: "Invited to apply. Application submitted 6/1. Childcare Voucher Program.",
    submitted: "2026-06-01",
    decision: null,
  },
  {
    id: 4,
    name: "Chapman Charitable Trust",
    funder: "Chapman Charitable Trust",
    amount: 216744,
    status: "Denied",
    notes: "Invited to apply. Application submitted 6/1. Childcare Voucher Program.",
    submitted: "2026-06-01",
    decision: "Denied",
  },
  {
    id: 5,
    name: "Tulsa Foundation",
    funder: "Tulsa Foundation (JP Morgan Funded)",
    amount: 216744,
    status: "In Review",
    notes: "Invited to apply. Grants not reviewed until Nov/Dec. Childcare Voucher Program.",
    submitted: "2026-06-01",
    decision: null,
  },
  {
    id: 6,
    name: "W.K. Kellogg Foundation",
    funder: "WKKF",
    amount: 216744,
    status: "Not Started",
    notes: "Invited to apply. Year-round applications. Childcare Voucher Program.",
    submitted: null,
    decision: null,
  },
];

const PROPERTIES = [
  {
    id: 1,
    address: "3326 E Marshall St",
    units: 12,
    type: "Apartment Complex",
    stage: "Pending Funding",
    notes: "Pending HUD grant funding. 12-unit apartment complex.",
    linkedGrant: "HUD Grant",
  },
  {
    id: 2,
    address: "3316, 3318, 3322 E Marshall St",
    units: null,
    type: "Multi-Property",
    stage: "Pending Funding",
    notes: "Pending IOT3 grant approval.",
    linkedGrant: "IOT3 Grant",
  },
];

const TODO_KEY = "treasured_todos_v1";

function getWeekStart() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 5=Fri
  // Week resets Saturday 00:00 (i.e. after Friday 11:59pm)
  const diff = day === 6 ? 0 : day + 1; // days since Saturday
  const sat = new Date(now);
  sat.setDate(now.getDate() - diff);
  sat.setHours(0,0,0,0);
  return sat.toISOString().slice(0,10);
}

function loadTodos() {
  try {
    const raw = localStorage.getItem(TODO_KEY);
    if (!raw) return { weekStart: getWeekStart(), items: [] };
    const data = JSON.parse(raw);
    // Reset if new week
    if (data.weekStart !== getWeekStart()) return { weekStart: getWeekStart(), items: [] };
    return data;
  } catch { return { weekStart: getWeekStart(), items: [] }; }
}

function saveTodos(data) {
  try { localStorage.setItem(TODO_KEY, JSON.stringify(data)); } catch {}
}

const STAGES = ["Pending Funding", "Acquired", "In Rehab", "Rent Ready"];

const GRANT_STATUS_COLORS = {
  "Approved":    { bg: "rgba(22,163,74,0.08)",  border: "rgba(22,163,74,0.25)",  text: "#16A34A" },
  "In Review":   { bg: "rgba(37,99,235,0.08)",  border: "rgba(37,99,235,0.25)",  text: "#2563EB" },
  "In Progress": { bg: "rgba(234,108,0,0.08)",  border: "rgba(234,108,0,0.25)",  text: "#EA6C00" },
  "Denied":      { bg: "rgba(220,38,38,0.08)",  border: "rgba(220,38,38,0.25)",  text: "#DC2626" },
  "Not Started": { bg: "rgba(120,113,108,0.08)", border: "rgba(120,113,108,0.2)", text: "#78716C" },
};

function StatusBadge({ status }) {
  const c = GRANT_STATUS_COLORS[status] || GRANT_STATUS_COLORS["Not Started"];
  return (
    <span style={{
      fontSize: 11, padding: "3px 10px", borderRadius: 99, fontWeight: 700,
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      whiteSpace: "nowrap",
    }}>{status}</span>
  );
}

function TodoList({ externalTodos, onToggle, onDelete, onFlagUpdate }) {
  const [todos, setTodos] = useState(() => loadTodos());
  const [input, setInput] = useState("");
  const [showToday, setShowToday] = useState(false);

  // Use external todos if provided (from parent), else use local state
  const activeTodos = externalTodos || todos;
  function updateTodos(next) {
    if (!externalTodos) { setTodos(next); saveTodos(next); }
  }

  function addTodo() {
    if (!input.trim()) return;
    const next = {
      ...activeTodos,
      items: [...activeTodos.items, { id: Date.now(), text: input.trim(), done: false, showToday }]
    };
    updateTodos(next);
    setInput(""); setShowToday(false);
  }

  function toggleTodo(id) {
    if (onToggle) { onToggle(id); return; }
    const next = { ...activeTodos, items: activeTodos.items.map(t => t.id === id ? { ...t, done: !t.done } : t) };
    updateTodos(next);
  }

  function deleteTodo(id) {
    if (onDelete) { onDelete(id); return; }
    const next = { ...activeTodos, items: activeTodos.items.filter(t => t.id !== id) };
    updateTodos(next);
  }

  function flagToday(id) {
    const next = { ...activeTodos, items: activeTodos.items.map(t => t.id === id ? { ...t, showToday: !t.showToday } : t) };
    if (onFlagUpdate) { onFlagUpdate(next); }
    else { updateTodos(next); }
  }

  const remaining = activeTodos.items.filter(t => !t.done).length;

  return (
    <div style={{ background: WHITE, borderRadius: 14, padding: "20px", border: `1px solid ${BORDER}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>Weekly Action Items</div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>Resets every Saturday · {remaining} remaining</div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: remaining === 0 && activeTodos.items.length > 0 ? GREEN : ORANGE }}>
          {activeTodos.items.length > 0 ? `${activeTodos.items.filter(t=>t.done).length}/${activeTodos.items.length}` : ""}
        </div>
      </div>

      {/* Add input */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTodo()}
            placeholder="Add a task for this week..."
            style={{
              flex: 1, padding: "9px 14px", borderRadius: 8, fontSize: 13,
              border: `1px solid ${BORDER}`, fontFamily: "inherit", color: TEXT,
              background: CREAM, outline: "none",
            }}
          />
          <button onClick={addTodo} style={{
            background: ORANGE, border: "none", borderRadius: 8,
            padding: "0 18px", color: WHITE, cursor: "pointer",
            fontFamily: "inherit", fontSize: 18, fontWeight: 700,
            boxShadow: "0 2px 8px rgba(234,108,0,0.25)",
          }}>+</button>
        </div>
        {/* Show on Today toggle */}
        <div
          onClick={() => setShowToday(s => !s)}
          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}
        >
          <div style={{
            width: 36, height: 20, borderRadius: 99, position: "relative",
            background: showToday ? ORANGE : "rgba(0,0,0,0.12)",
            transition: "background 0.2s", flexShrink: 0,
          }}>
            <div style={{
              position: "absolute", top: 2, left: showToday ? 18 : 2,
              width: 16, height: 16, borderRadius: "50%", background: WHITE,
              transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }} />
          </div>
          <span style={{ fontSize: 12, color: showToday ? ORANGE : MUTED, fontWeight: 600 }}>
            Show on Today tab
          </span>
        </div>
      </div>

      {/* Task list */}
      {activeTodos.items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px 0", color: MUTED, fontSize: 13 }}>
          No tasks yet — add one above!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {activeTodos.items.map(t => (
            <div key={t.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 8,
              background: t.done ? "#F9F9F9" : CREAM,
              border: `1px solid ${t.done ? BORDER : "rgba(234,108,0,0.15)"}`,
              borderLeft: `3px solid ${t.done ? "#D4B89A" : ORANGE}`,
              transition: "all 0.15s",
            }}>
              {/* Checkbox */}
              <div onClick={() => toggleTodo(t.id)} style={{
                width: 22, height: 22, borderRadius: 5, flexShrink: 0, cursor: "pointer",
                border: `2px solid ${t.done ? GREEN : "#D4B89A"}`,
                background: t.done ? GREEN : WHITE,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, color: WHITE, fontWeight: 800,
              }}>{t.done ? "✓" : ""}</div>

              {/* Text */}
              <span style={{
                flex: 1, fontSize: 13, color: t.done ? MUTED : TEXT,
                textDecoration: t.done ? "line-through" : "none",
                fontWeight: t.done ? 400 : 500,
              }}>{t.text}</span>

              {/* Today flag */}
              <div
                onClick={() => flagToday(t.id)}
                title={t.showToday ? "Remove from Today tab" : "Show on Today tab"}
                style={{
                  fontSize: 14, cursor: "pointer", flexShrink: 0,
                  color: t.showToday ? ORANGE : "rgba(0,0,0,0.15)",
                  transition: "color 0.15s",
                }}>★</div>

              {/* Delete */}
              <div onClick={() => deleteTodo(t.id)} style={{
                width: 20, height: 20, borderRadius: 5, flexShrink: 0, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, color: MUTED, opacity: 0.4,
              }}>✕</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TreasuredHomesTab({ sharedTodos, onToggle, onDelete, setSharedTodos }) {
  const [view, setView] = useState("grants");
  const [expanded, setExpanded] = useState(null);

  const totalPipeline   = GRANTS.filter(g => g.status !== "Denied").reduce((s,g) => s+g.amount, 0);
  const approvedTotal   = GRANTS.filter(g => g.status === "Approved").reduce((s,g) => s+g.amount, 0);
  const activeGrants    = GRANTS.filter(g => !["Denied","Not Started"].includes(g.status)).length;
  const totalUnits      = PROPERTIES.reduce((s,p) => s+(p.units||0), 0);

  return (
    <div>
      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Grant Pipeline",   value: `$${(totalPipeline/1000000).toFixed(2)}M`, color: "#EA6C00" },
          { label: "Awarded",          value: `$${(approvedTotal/1000000).toFixed(2)}M`, color: "#16A34A" },
          { label: "Active Grants",    value: activeGrants,                               color: "#2563EB" },
          { label: "Current Units",    value: totalUnits,                                 color: "#78716C" },
        ].map(s => (
          <div key={s.label} style={{
            background: WHITE, borderRadius: 12, padding: "14px 16px",
            border: `1px solid ${BORDER}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 3, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* View toggle */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[["grants","Grant Tracker"],["properties","Properties"]].map(([v,label]) => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: "8px 18px", borderRadius: 8, cursor: "pointer",
            fontFamily: "inherit", fontSize: 13, fontWeight: 600,
            border: `1px solid ${view===v ? ORANGE : BORDER}`,
            background: view===v ? ORANGE : WHITE,
            color: view===v ? WHITE : MUTED,
            boxShadow: view===v ? "0 2px 8px rgba(234,108,0,0.25)" : "none",
            transition: "all 0.15s",
          }}>{label}</button>
        ))}
      </div>

      {/* GRANTS VIEW */}
      {view === "grants" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "Housing Grants", ids: [1, 2] },
            { label: "Childcare Voucher Program", ids: [3, 4, 5, 6] },
          ].map(section => (
            <div key={section.label}>
              <div style={{
                fontSize: 11, fontWeight: 700, color: MUTED,
                letterSpacing: "0.1em", textTransform: "uppercase",
                marginBottom: 8, marginTop: 8, paddingLeft: 4,
              }}>{section.label}</div>
              {GRANTS.filter(g => section.ids.includes(g.id)).map(g => {
            const isOpen = expanded === g.id;
            const sc = GRANT_STATUS_COLORS[g.status] || GRANT_STATUS_COLORS["Not Started"];
            return (
              <div key={g.id} style={{
                background: WHITE, borderRadius: 12,
                border: `1px solid ${BORDER}`,
                borderLeft: `4px solid ${sc.text}`,
                boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                overflow: "hidden",
              }}>
                {/* Row */}
                <div onClick={() => setExpanded(isOpen ? null : g.id)} style={{
                  padding: "14px 18px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 14,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{g.name}</div>
                    <div style={{ fontSize: 12, color: MUTED }}>{g.funder}</div>
                  </div>
                  <StatusBadge status={g.status} />
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: TEXT }}>${g.amount.toLocaleString()}</div>
                    {g.submitted && <div style={{ fontSize: 11, color: MUTED }}>Submitted {new Date(g.submitted).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</div>}
                  </div>
                  <div style={{ fontSize: 18, color: MUTED, flexShrink: 0 }}>{isOpen ? "∧" : "∨"}</div>
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div style={{
                    padding: "0 18px 16px",
                    borderTop: `1px solid ${BORDER}`,
                    paddingTop: 14,
                  }}>
                    <div style={{ fontSize: 13, color: TEXT, lineHeight: 1.7, marginBottom: 10 }}>{g.notes}</div>
                    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                      {g.submitted && (
                        <div>
                          <div style={{ fontSize: 11, color: MUTED, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Submitted</div>
                          <div style={{ fontSize: 13, color: TEXT, marginTop: 2 }}>{new Date(g.submitted).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div>
                        </div>
                      )}
                      {g.decision && (
                        <div>
                          <div style={{ fontSize: 11, color: MUTED, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Decision</div>
                          <div style={{ fontSize: 13, color: TEXT, marginTop: 2 }}>{g.decision}</div>
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: 11, color: MUTED, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Amount Requested</div>
                        <div style={{ fontSize: 13, color: TEXT, marginTop: 2 }}>${g.amount.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
            </div>
          ))}
        </div>
      )}

      {/* TWO COLUMN LAYOUT */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, marginTop: 20, alignItems: "start" }}>

        {/* LEFT — grants or properties */}
        <div>

      {/* PROPERTIES VIEW */}
      {view === "properties" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: MUTED }}>
              <span style={{ fontWeight: 700, color: TEXT, fontSize: 15 }}>{totalUnits}</span> total units across {PROPERTIES.length} properties
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {PROPERTIES.map(p => {
              const stageIdx = STAGES.indexOf(p.stage);
              return (
                <div key={p.id} style={{
                  background: WHITE, borderRadius: 12, padding: "18px 20px",
                  border: `1px solid ${BORDER}`, boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: TEXT }}>{p.address}</div>
                      <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>
                        {p.type}{p.units ? ` · ${p.units} units` : ""} · Linked to {p.linkedGrant}
                      </div>
                    </div>
                    <StatusBadge status={p.stage} />
                  </div>

                  {/* Stage progress bar */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {STAGES.map((stage, i) => (
                        <div key={stage} style={{ flex: 1, textAlign: "center" }}>
                          <div style={{
                            height: 6, borderRadius: 99, marginBottom: 6,
                            background: i <= stageIdx ? ORANGE : "rgba(0,0,0,0.08)",
                            transition: "background 0.3s",
                          }} />
                          <div style={{
                            fontSize: 10, fontWeight: i === stageIdx ? 700 : 400,
                            color: i === stageIdx ? ORANGE : MUTED,
                            whiteSpace: "nowrap",
                          }}>{stage}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ fontSize: 13, color: MUTED, fontStyle: "italic" }}>{p.notes}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
        </div>

        {/* RIGHT — action items */}
        <div>
          <TodoList externalTodos={sharedTodos} onToggle={onToggle} onDelete={onDelete} onFlagUpdate={(next) => { setSharedTodos(next); saveTodos(next); }} />
        </div>

      </div>
    </div>
  );
}

// ── COMING SOON PLACEHOLDER ───────────────────────────────────────
function ComingSoon({ label, icon, color }) {
  return (
    <div style={{ textAlign: "center", padding: "80px 24px" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: TEXT, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 15, color: MUTED }}>This section is coming soon.</div>
      <div style={{ marginTop: 24, display: "inline-block", padding: "10px 24px",
        borderRadius: 99, background: `rgba(234,108,0,0.1)`, color: ORANGE,
        fontSize: 13, fontWeight: 600, border: `1px solid rgba(234,108,0,0.2)` }}>
        In progress
      </div>
    </div>
  );
}

// ── HABIT SHEET ───────────────────────────────────────────────────
function HabitSheet() {
  const today    = new Date();
  const todayKey = dateKey(today);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + i);
    return d;
  });

  const [allData, setAllData] = useState(() => loadData());
  const [view, setView]       = useState("today");

  function getDayData(d)  { return allData[dateKey(d)] || {}; }
  function getDayScore(d) { const data = getDayData(d); return HABIT_DEFS.reduce((s,h) => s+(data[h.id]?h.points:0),0); }
  const dayMax = HABIT_DEFS.length * 10;

  function toggle(habitId, d) {
    const dk   = dateKey(d || today);
    const prev = allData[dk] || {};
    const next = { ...allData, [dk]: { ...prev, [habitId]: !prev[habitId] } };
    setAllData(next); saveData(next);
  }

  const todayData      = getDayData(today);
  const todayScore     = HABIT_DEFS.reduce((s,h) => s+(todayData[h.id]?h.points:0),0);
  const todayPct       = Math.round((todayScore/dayMax)*100);
  const completedToday = HABIT_DEFS.filter(h => todayData[h.id]).length;
  const weekScores     = weekDays.map(d => ({ date:d, score:getDayScore(d), pct:Math.round((getDayScore(d)/dayMax)*100) }));
  const weekAvg        = Math.round(weekScores.reduce((s,d)=>s+d.pct,0)/7);

  return (
    <div>
      {/* Score summary bar */}
      <div style={{
        display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap",
      }}>
        <div style={{ background: WHITE, borderRadius: 14, padding: "16px 20px", flex: 2, minWidth: 220,
          border: `1px solid ${BORDER}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          display: "flex", alignItems: "center", gap: 20 }}>
          <ScoreRing score={todayScore} max={dayMax} size={72} />
          <div>
            <div style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>Today's Score</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: scoreColor(todayPct) }}>
              {todayScore}<span style={{ fontSize: 15, color: MUTED, fontWeight: 400 }}> / {dayMax}</span>
            </div>
            <div style={{ fontSize: 13, color: MUTED }}>{completedToday} of {HABIT_DEFS.length} complete</div>
            <div style={{ marginTop: 8, background: "rgba(0,0,0,0.06)", borderRadius: 99, height: 8, width: 180, overflow: "hidden" }}>
              <div style={{ width: `${todayPct}%`, height: "100%", borderRadius: 99,
                background: `linear-gradient(90deg,${ORANGE},${ORANGE2})`,
                transition: "width 0.5s ease",
                boxShadow: todayPct > 0 ? "0 0 8px rgba(234,108,0,0.4)" : "none" }} />
            </div>
            {todayPct === 100 && <div style={{ fontSize: 12, color: GREEN, marginTop: 6, fontWeight: 700 }}>🔥 Perfect day!</div>}
          </div>
        </div>

        <div style={{ background: WHITE, borderRadius: 14, padding: "16px 20px", flex: 1, minWidth: 140,
          border: `1px solid ${BORDER}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", textAlign: "center",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 11, color: MUTED, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Week Avg</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: scoreColor(weekAvg) }}>{weekAvg}%</div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>
            {weekAvg >= 90 ? "Crushing it 🔥" : weekAvg >= 60 ? "On track 👍" : "Keep pushing 💪"}
          </div>
        </div>
      </div>

      {/* View toggle */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[["today","Today's Habits"],["week","Weekly View"]].map(([v,label]) => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: "8px 18px", borderRadius: 8, cursor: "pointer",
            fontFamily: "inherit", fontSize: 13, fontWeight: 600,
            border: `1px solid ${view===v ? ORANGE : BORDER}`,
            background: view===v ? ORANGE : WHITE,
            color: view===v ? "#fff" : MUTED,
            boxShadow: view===v ? "0 2px 8px rgba(234,108,0,0.25)" : "none",
            transition: "all 0.15s",
          }}>{label}</button>
        ))}
      </div>

      {/* TODAY */}
      {view === "today" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {HABIT_DEFS.map((h, i) => {
            const done = !!todayData[h.id];
            return (
              <div key={h.id} onClick={() => toggle(h.id)} style={{
                display: "flex", alignItems: "center", gap: 14,
                background: done ? "#F0FDF4" : i%2===0 ? WHITE : CARD2,
                border: `1px solid ${done ? "rgba(22,163,74,0.2)" : BORDER}`,
                borderLeft: `4px solid ${done ? GREEN : ORANGE}`,
                borderRadius: 10, padding: "12px 16px", cursor: "pointer",
                transition: "all 0.15s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                  border: `2px solid ${done ? GREEN : "#D4B89A"}`,
                  background: done ? GREEN : WHITE,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, color: WHITE, fontWeight: 800,
                }}>{done ? "✓" : ""}</div>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{h.icon}</span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: done ? GREEN : TEXT }}>{h.name}</span>
                {typeof h.freq === "object" && (
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99,
                    background: "rgba(234,108,0,0.1)", color: ORANGE,
                    border: "1px solid rgba(234,108,0,0.2)", fontWeight: 600 }}>{h.freq.label}</span>
                )}
                <span style={{ fontSize: 13, fontWeight: 700, color: done ? GREEN : MUTED }}>+{h.points}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* WEEK */}
      {view === "week" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 8, marginBottom: 20 }}>
            {weekDays.map((d,i) => {
              const isToday  = dateKey(d) === todayKey;
              const isFuture = d > today && dateKey(d) !== todayKey;
              return (
                <div key={i} style={{
                  background: isToday ? CARD2 : WHITE,
                  border: `1px solid ${isToday ? ORANGE : BORDER}`,
                  borderRadius: 10, padding: "10px 8px", textAlign: "center",
                  opacity: isFuture ? 0.4 : 1,
                  boxShadow: isToday ? "0 2px 8px rgba(234,108,0,0.15)" : "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                  <div style={{ fontSize: 11, color: isToday ? ORANGE : MUTED, fontWeight: 700, marginBottom: 4 }}>{DAYS_SHORT[d.getDay()]}</div>
                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 8 }}>{d.getDate()}</div>
                  <ScoreRing score={isFuture ? 0 : weekScores[i].score} max={dayMax} size={46} />
                </div>
              );
            })}
          </div>

          <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            {/* Grid header */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr repeat(7,48px)", background: `linear-gradient(90deg,${ORANGE},${ORANGE2})` }}>
              <div style={{ padding: "10px 16px", fontSize: 12, color: WHITE, fontWeight: 700, letterSpacing: "0.08em" }}>HABIT</div>
              {weekDays.map((d,i) => {
                const isToday = dateKey(d) === todayKey;
                return (
                  <div key={i} style={{ padding: "10px 4px", textAlign: "center", fontSize: 11, fontWeight: 700,
                    color: WHITE, background: isToday ? "rgba(0,0,0,0.12)" : "transparent" }}>
                    <div>{DAYS_SHORT[d.getDay()]}</div>
                    <div style={{ fontWeight: 400, opacity: 0.8, fontSize: 10 }}>{d.getDate()}</div>
                  </div>
                );
              })}
            </div>

            {/* Habit rows */}
            {HABIT_DEFS.map((h, hi) => (
              <div key={h.id} style={{
                display: "grid", gridTemplateColumns: "1fr repeat(7,48px)",
                borderBottom: hi < HABIT_DEFS.length-1 ? `1px solid ${BORDER}` : "none",
                background: hi%2===0 ? WHITE : "#FAFAF9",
              }}>
                <div style={{ padding: "9px 16px", fontSize: 13, color: TEXT, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 15 }}>{h.icon}</span>
                  <span>{h.name}</span>
                  {typeof h.freq === "object" && <span style={{ fontSize: 10, color: ORANGE, fontWeight: 600 }}>{h.freq.label}</span>}
                </div>
                {weekDays.map((d, di) => {
                  const isFuture = d > today && dateKey(d) !== todayKey;
                  const isToday2 = dateKey(d) === todayKey;
                  const done2    = !isFuture && !!getDayData(d)[h.id];
                  return (
                    <div key={di} onClick={() => { if (!isFuture) toggle(h.id, d); }} style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: isFuture ? "default" : "pointer",
                      background: isToday2 ? "rgba(234,108,0,0.04)" : "transparent",
                      minHeight: 40,
                    }}>
                      {isFuture
                        ? <div style={{ width: 20, height: 20, borderRadius: 4, background: "rgba(0,0,0,0.05)" }} />
                        : done2
                        ? <div style={{ width: 22, height: 22, borderRadius: 5, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: WHITE, fontWeight: 800 }}>✓</div>
                        : <div style={{ width: 22, height: 22, borderRadius: 5, background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: RED }}>–</div>
                      }
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Score row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr repeat(7,48px)", background: CARD2, borderTop: `2px solid ${ORANGE}` }}>
              <div style={{ padding: "10px 16px", fontSize: 12, color: ORANGE, fontWeight: 800, letterSpacing: "0.08em" }}>DAILY SCORE</div>
              {weekDays.map((d,i) => {
                const isFuture = d > today && dateKey(d) !== todayKey;
                const sc = isFuture ? null : weekScores[i];
                return (
                  <div key={i} style={{ padding: "10px 4px", textAlign: "center", fontSize: 13, fontWeight: 800, color: sc ? scoreColor(sc.pct) : MUTED }}>
                    {sc && sc.score > 0 ? sc.score : isFuture ? "" : "—"}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────
// ── AI BRAIN TAB ──────────────────────────────────────────────────
// Connects to the connorfreese/obsidian-brain GitHub repo, lists recent
// daily notes, and lets Connor chat with Claude using selected notes as
// context. GitHub token is stored in localStorage; chat uses the same raw
// fetch to the Anthropic API used elsewhere in the dashboard.

const GH_TOKEN_KEY = "connor_github_token";
const GH_CHAT_KEY  = "connor_brain_chat";
const GH_REPO      = "connorfreese/obsidian-brain";
const BRAIN_MODEL  = "claude-sonnet-4-6";

// Anthropic API hook — calls our own /api/chat serverless proxy (avoids
// browser CORS and keeps the API key server-side).
async function askClaude(system, messages) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: BRAIN_MODEL,
      max_tokens: 1500,
      system,
      messages,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Chat request failed (${res.status}).`);
  return data.content?.[0]?.text || "Couldn't get a response.";
}

// Decode GitHub base64 contents to a UTF-8 string.
function decodeB64(b64) {
  const clean = (b64 || "").replace(/\n/g, "");
  try { return decodeURIComponent(escape(atob(clean))); }
  catch { try { return atob(clean); } catch { return ""; } }
}

// A note looks like a daily note if its filename starts with YYYY-MM-DD.
function dailyDateFromPath(path) {
  const name = path.split("/").pop() || "";
  const m = name.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : null;
}

async function ghHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function AIBrainTab() {
  const [token, setToken]       = useState(() => { try { return localStorage.getItem(GH_TOKEN_KEY) || ""; } catch { return ""; } });
  const [tokenInput, setTokenInput] = useState(token);
  const [showSettings, setShowSettings] = useState(!token);

  const [notes, setNotes]       = useState([]);   // [{ path, date }]
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [notesError, setNotesError] = useState("");
  const [onlyDaily, setOnlyDaily] = useState(true);
  const [query, setQuery]       = useState("");

  const [selected, setSelected] = useState({});   // { path: true }
  const contentCache = useState(() => ({}))[0];    // mutable cache: path -> text

  const [chat, setChat]         = useState(() => { try { const r = localStorage.getItem(GH_CHAT_KEY); return r ? JSON.parse(r) : []; } catch { return []; } });
  const [input, setInput]       = useState("");
  const [sending, setSending]   = useState(false);
  const [chatError, setChatError] = useState("");

  function saveToken() {
    const t = tokenInput.trim();
    setToken(t);
    try { localStorage.setItem(GH_TOKEN_KEY, t); } catch {}
    setShowSettings(false);
    if (t) loadNotes(t);
  }

  async function loadNotes(tk = token) {
    if (!tk) { setNotesError("Add your GitHub token first."); setShowSettings(true); return; }
    setLoadingNotes(true); setNotesError("");
    try {
      const headers = await ghHeaders(tk);
      const res = await fetch(`https://api.github.com/repos/${GH_REPO}/git/trees/HEAD?recursive=1`, { headers });
      if (!res.ok) {
        const msg = res.status === 401 ? "Token rejected (401). Check the token has repo read access."
          : res.status === 404 ? "Repo not found (404). Check the name and token scope."
          : `GitHub error (${res.status}).`;
        throw new Error(msg);
      }
      const data = await res.json();
      const md = (data.tree || [])
        .filter(t => t.type === "blob" && /\.md$/i.test(t.path))
        .map(t => ({ path: t.path, date: dailyDateFromPath(t.path) }));
      // Daily notes sorted newest-first; non-daily appended after.
      md.sort((a, b) => {
        if (a.date && b.date) return b.date.localeCompare(a.date);
        if (a.date) return -1;
        if (b.date) return 1;
        return a.path.localeCompare(b.path);
      });
      setNotes(md);
      if (!md.some(n => n.date)) setOnlyDaily(false);
    } catch (e) {
      setNotesError(e.message || "Failed to load notes.");
      setNotes([]);
    } finally {
      setLoadingNotes(false);
    }
  }

  useEffect(() => { if (token) loadNotes(token); /* eslint-disable-next-line */ }, []);

  // Persist chat history so it survives refreshes and tab switches.
  useEffect(() => { try { localStorage.setItem(GH_CHAT_KEY, JSON.stringify(chat)); } catch {} }, [chat]);

  async function fetchNoteContent(path) {
    if (contentCache[path] != null) return contentCache[path];
    const headers = await ghHeaders(token);
    const res = await fetch(`https://api.github.com/repos/${GH_REPO}/contents/${path.split("/").map(encodeURIComponent).join("/")}`, { headers });
    if (!res.ok) throw new Error(`Couldn't read ${path} (${res.status}).`);
    const data = await res.json();
    const text = decodeB64(data.content);
    contentCache[path] = text;
    return text;
  }

  function toggleNote(path) {
    setSelected(s => { const next = { ...s }; if (next[path]) delete next[path]; else next[path] = true; return next; });
  }

  const selectedPaths = Object.keys(selected);

  // When searching, match the query against the full path (case-insensitive)
  // and ignore the daily-only filter so non-daily notes surface too.
  const nq = query.trim().toLowerCase();
  const visibleNotes = notes.filter(n => nq ? n.path.toLowerCase().includes(nq) : (!onlyDaily || n.date));

  async function send() {
    const q = input.trim();
    if (!q || sending) return;
    setInput(""); setChatError(""); setSending(true);
    const history = [...chat, { role: "user", content: q }];
    setChat(history);
    try {
      // Gather selected notes as context (cap each note so the prompt stays sane).
      let context = "";
      for (const path of selectedPaths) {
        let body = await fetchNoteContent(path);
        const CAP = 6000;
        if (body.length > CAP) body = body.slice(0, CAP) + "\n…(truncated)…";
        context += `\n\n=== NOTE: ${path} ===\n${body}`;
      }
      const system =
        "You are Connor's personal AI assistant with access to his Obsidian notes. " +
        "Connor uses these notes as a second brain — daily logs, ideas, tasks, and reflections. " +
        "Answer based on the notes provided as context. Be specific, reference dates/notes when relevant, " +
        "and surface patterns, open loops, and useful summaries. Be warm and concise. Call him Connor." +
        (selectedPaths.length
          ? `\n\nThe following notes are provided as context:${context}`
          : "\n\nNo notes were selected as context. Answer generally and suggest he select notes for a grounded answer.");
      const reply = await askClaude(system, history.map(m => ({ role: m.role, content: m.content })));
      setChat([...history, { role: "assistant", content: reply }]);
    } catch (e) {
      setChatError(e.message || "Something went wrong.");
      setChat([...history, { role: "assistant", content: "⚠️ " + (e.message || "Something went wrong.") }]);
    } finally {
      setSending(false);
    }
  }

  const SUGGESTIONS = [
    "What patterns do you see?",
    "Summarize my week",
    "What are my open loops?",
  ];

  return (
    <div>
      {/* ── SETTINGS / TOKEN ── */}
      <div style={{
        background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 12,
        padding: 14, marginBottom: 16, boxShadow: "0 1px 4px rgba(234,108,0,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>GitHub Connection</span>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99,
              background: token ? "rgba(22,163,74,0.12)" : "rgba(220,38,38,0.1)",
              color: token ? GREEN : RED,
            }}>{token ? "Connected" : "No token"}</span>
          </div>
          <button onClick={() => setShowSettings(s => !s)} style={{
            background: "transparent", border: `1px solid ${BLUE}`, color: BLUE,
            borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
          }}>{showSettings ? "Hide" : "Settings"}</button>
        </div>
        {showSettings && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>
              Personal access token for <code style={{ color: ORANGE }}>{GH_REPO}</code> (stored locally in this browser).
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="password"
                value={tokenInput}
                onChange={e => setTokenInput(e.target.value)}
                placeholder="ghp_… or github_pat_…"
                style={{
                  flex: 1, padding: "9px 12px", borderRadius: 8, fontFamily: "inherit",
                  border: `1px solid ${BORDER}`, fontSize: 13, color: TEXT, background: CREAM,
                }}
              />
              <button onClick={saveToken} style={{
                background: ORANGE, border: "none", color: WHITE, borderRadius: 8,
                padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}>Save</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {/* ── NOTE LIST ── */}
        <div style={{
          flex: "1 1 260px", minWidth: 240, background: WHITE,
          border: `1px solid ${BORDER}`, borderRadius: 12, padding: 14,
          display: "flex", flexDirection: "column", maxHeight: 520,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: TEXT }}>
              {onlyDaily ? "Recent Daily Notes" : "Notes"}
              <span style={{ color: MUTED, fontWeight: 600 }}> · {selectedPaths.length} selected</span>
            </span>
            <button onClick={() => loadNotes()} disabled={loadingNotes} style={{
              background: "transparent", border: `1px solid ${ORANGE}`, color: ORANGE,
              borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 600,
              cursor: loadingNotes ? "default" : "pointer", fontFamily: "inherit", opacity: loadingNotes ? 0.6 : 1,
            }}>{loadingNotes ? "Loading…" : "Refresh"}</button>
          </div>

          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search notes…"
            style={{
              width: "100%", boxSizing: "border-box", padding: "7px 11px", marginBottom: 8,
              borderRadius: 8, fontFamily: "inherit", fontSize: 12.5, color: TEXT,
              background: CREAM, border: `1px solid ${BORDER}`,
            }}
          />

          {notes.some(n => n.date) && !nq && (
            <label style={{ fontSize: 12, color: MUTED, marginBottom: 8, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <input type="checkbox" checked={onlyDaily} onChange={e => setOnlyDaily(e.target.checked)} />
              Daily notes only
            </label>
          )}

          {notesError && <div style={{ fontSize: 12, color: RED, marginBottom: 8 }}>{notesError}</div>}

          <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
            {!loadingNotes && notes.length === 0 && !notesError && (
              <div style={{ fontSize: 12, color: MUTED, padding: "12px 0" }}>No notes yet — add a token and refresh.</div>
            )}
            {!loadingNotes && notes.length > 0 && visibleNotes.length === 0 && (
              <div style={{ fontSize: 12, color: MUTED, padding: "12px 0" }}>No notes match "{query.trim()}".</div>
            )}
            {visibleNotes
              .slice(0, 60)
              .map(n => {
                const isSel = !!selected[n.path];
                const label = n.date || (n.path.split("/").pop() || n.path).replace(/\.md$/i, "");
                return (
                  <button key={n.path} onClick={() => toggleNote(n.path)} title={n.path} style={{
                    textAlign: "left", padding: "8px 10px", borderRadius: 8, cursor: "pointer",
                    fontFamily: "inherit", fontSize: 12.5, fontWeight: isSel ? 700 : 500,
                    color: isSel ? ORANGE : TEXT,
                    background: isSel ? "rgba(234,108,0,0.08)" : "transparent",
                    border: `1px solid ${isSel ? ORANGE : "transparent"}`,
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span style={{ fontSize: 12 }}>{isSel ? "☑" : "☐"}</span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* ── CHAT ── */}
        <div style={{
          flex: "2 1 360px", minWidth: 300, background: WHITE,
          border: `1px solid ${BORDER}`, borderRadius: 12, padding: 14,
          display: "flex", flexDirection: "column", maxHeight: 520,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: TEXT }}>✲ Ask your second brain</span>
            {chat.length > 0 && (
              <button onClick={() => setChat([])} style={{
                background: "transparent", border: `1px solid ${BORDER}`, color: MUTED,
                borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}>Clear</button>
            )}
          </div>

          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
            {chat.length === 0 && (
              <div>
                <div style={{ fontSize: 13, color: MUTED, marginBottom: 12 }}>
                  Select one or more notes on the left, then ask a question. Try:
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => setInput(s)} style={{
                      background: "rgba(37,99,138,0.08)", border: `1px solid ${BLUE}`, color: BLUE,
                      borderRadius: 99, padding: "6px 12px", fontSize: 12, fontWeight: 600,
                      cursor: "pointer", fontFamily: "inherit",
                    }}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {chat.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
                background: m.role === "user" ? ORANGE : CARD2,
                color: m.role === "user" ? WHITE : TEXT,
                borderRadius: 12, padding: "9px 13px", fontSize: 13.5, lineHeight: 1.5,
                whiteSpace: "pre-wrap", border: m.role === "user" ? "none" : `1px solid ${BORDER}`,
              }}>{m.content}</div>
            ))}
            {sending && (
              <div style={{ alignSelf: "flex-start", color: MUTED, fontSize: 13, fontStyle: "italic" }}>Thinking…</div>
            )}
          </div>

          {chatError && <div style={{ fontSize: 12, color: RED, marginBottom: 8 }}>{chatError}</div>}

          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={selectedPaths.length ? `Ask about ${selectedPaths.length} note${selectedPaths.length > 1 ? "s" : ""}…` : "Ask a question…"}
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 10, fontFamily: "inherit",
                border: `1px solid ${BORDER}`, fontSize: 13.5, color: TEXT, background: CREAM,
              }}
            />
            <button onClick={send} disabled={sending || !input.trim()} style={{
              background: sending || !input.trim() ? "rgba(234,108,0,0.4)" : ORANGE,
              border: "none", color: WHITE, borderRadius: 10, padding: "10px 20px",
              fontSize: 13.5, fontWeight: 700, cursor: sending || !input.trim() ? "default" : "pointer",
              fontFamily: "inherit",
            }}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── FINANCE TAB ───────────────────────────────────────────────────
// Recurring charges from 3 months of Amex emails + Apple subscriptions.
// Monthly bills carry a `dueDay` (1–31, clamped to month length); annual
// subscriptions carry `cycle: "annual"` + `renewMonth`/`renewDay` and are
// shown as a yearly amount, never amortized into the monthly total.

const FINANCE_BILLS_KEY = "connor_finance_bills_v1";
const FINANCE_PAID_KEY  = "connor_finance_paid_v1";

const FINANCE_CATEGORIES = ["Streaming", "Apple", "Software/Tools", "Bills", "Insurance", "Business"];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHS_LONG  = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const CAT_META = {
  "Streaming":      { color: "#EA6C00", icon: "🎬" },
  "Apple":          { color: "#2563EB", icon: "🍎" },
  "Software/Tools": { color: "#7C3AED", icon: "🛠️" },
  "Bills":          { color: "#16A34A", icon: "🧾" },
  "Insurance":      { color: "#DC2626", icon: "🛡️" },
  "Business":       { color: "#CA8A04", icon: "💼" },
};

const DEFAULT_BILLS = [
  // Streaming & entertainment
  { id: "netflix",        name: "Netflix",                amount: 26.99,  dueDay: 12, category: "Streaming",      cycle: "monthly" },
  { id: "hbomax",         name: "HBO Max",                amount: 18.49,  dueDay: 28, category: "Streaming",      cycle: "monthly" },
  { id: "youtubetv",      name: "YouTube TV",             amount: 82.99,  dueDay: 5,  category: "Streaming",      cycle: "monthly" },
  { id: "spotify",        name: "Spotify",                amount: 12.99,  dueDay: 25, category: "Streaming",      cycle: "monthly" },
  { id: "amazonprime",    name: "Amazon Prime",           amount: 14.99,  dueDay: 23, category: "Streaming",      cycle: "monthly" },
  { id: "paramount",      name: "Paramount+",             amount: 8.99,   dueDay: 24, category: "Streaming",      cycle: "monthly" },
  { id: "peacock",        name: "Peacock Premium",        amount: 16.99,  dueDay: 24, category: "Streaming",      cycle: "monthly" },
  // Apple subscriptions
  { id: "icloud",         name: "iCloud+ 2TB",            amount: 9.99,   dueDay: 22, category: "Apple",          cycle: "monthly" },
  { id: "capcut",         name: "CapCut Pro",             amount: 19.99,  dueDay: 5,  category: "Apple",          cycle: "monthly", note: "Renews Jul 3" },
  { id: "myfitnesspal",   name: "MyFitnessPal Premium",   amount: 49.99,  dueDay: 29, category: "Apple",          cycle: "monthly" },
  { id: "eufy",           name: "eufy Cloud Storage",     amount: 29.99,  category: "Apple",          cycle: "annual", renewMonth: 3, renewDay: 12 },
  // Software & tools
  { id: "ms365",          name: "Microsoft 365",          amount: 22.99,  dueDay: 21, category: "Software/Tools", cycle: "monthly" },
  { id: "adobe",          name: "Adobe",                  amount: 34.49,  dueDay: null, category: "Software/Tools", cycle: "monthly", note: "Due date unknown" },
  { id: "dochub",         name: "DocHub",                 amount: 14.00,  dueDay: 20, category: "Software/Tools", cycle: "monthly" },
  { id: "zoom",           name: "Zoom",                   amount: 16.99,  dueDay: 9,  category: "Software/Tools", cycle: "monthly" },
  { id: "twilio",         name: "Twilio",                 amount: 40.00,  dueDay: 1,  category: "Software/Tools", cycle: "monthly" },
  { id: "pipedrive",      name: "Pipedrive CRM",          amount: 126.40, dueDay: 30, category: "Software/Tools", cycle: "monthly" },
  { id: "breakdown",      name: "Breakdown Services",     amount: 9.99,   dueDay: 5,  category: "Software/Tools", cycle: "monthly" },
  { id: "seatsaero",      name: "SeatsAero",              amount: 9.99,   dueDay: 6,  category: "Software/Tools", cycle: "monthly" },
  { id: "physicaladdr",   name: "PhysicalAddress.com",    amount: 10.48,  dueDay: 6,  category: "Software/Tools", cycle: "monthly" },
  { id: "recoverpro",     name: "Recover Pro Membership", amount: 129.00, dueDay: 31, category: "Software/Tools", cycle: "monthly" },
  { id: "oura",           name: "Oura Ring",              amount: 5.99,   dueDay: 12, category: "Software/Tools", cycle: "monthly" },
  { id: "googleone2tb",   name: "Google One 2TB",         amount: 9.99,   dueDay: 5,  category: "Software/Tools", cycle: "monthly" },
  { id: "googleone100",   name: "Google One 100GB",       amount: 1.99,   dueDay: 28, category: "Software/Tools", cycle: "monthly" },
  { id: "gworkspace",     name: "Google Workspace (Apex)",amount: 0.00,   dueDay: 1,  category: "Software/Tools", cycle: "monthly", note: "Varies / invoiced" },
  { id: "anthropic",      name: "Anthropic Claude Code",  amount: 20.00,  dueDay: null, category: "Software/Tools", cycle: "monthly", note: "~$20 avg · varies" },
  // Bills
  { id: "tmobile",        name: "T-Mobile",               amount: 98.03,  dueDay: 15, category: "Bills",          cycle: "monthly" },
  { id: "cox",            name: "Cox Internet",           amount: 104.97, dueDay: 25, category: "Bills",          cycle: "monthly" },
  { id: "pso",            name: "PSO Electric",           amount: 153.00, dueDay: 28, category: "Bills",          cycle: "monthly", note: "Varies" },
  { id: "alert360",       name: "Alert 360 (security)",   amount: 62.99,  dueDay: 1,  category: "Bills",          cycle: "monthly" },
  { id: "quickbooks",     name: "Intuit QuickBooks",      amount: 405.00, dueDay: 15, category: "Bills",          cycle: "monthly" },
  { id: "craft",          name: "Craft Concierge Medicine", amount: 175.00, dueDay: 7, category: "Bills",         cycle: "monthly" },
  // Insurance
  { id: "root",           name: "Root Insurance (car)",   amount: 174.68, dueDay: 17, category: "Insurance",      cycle: "monthly" },
  { id: "hiscox",         name: "Hiscox (business)",      amount: 41.67,  dueDay: 1,  category: "Insurance",      cycle: "monthly" },
  { id: "showcase1",      name: "Showcase Insurance — Policy 1", amount: 39.66, dueDay: 22, category: "Insurance", cycle: "monthly" },
  { id: "showcase2",      name: "Showcase Insurance — Policy 2", amount: 44.50, dueDay: 22, category: "Insurance", cycle: "monthly" },
  { id: "showcase3",      name: "Showcase Insurance — Policy 3", amount: 43.84, dueDay: 14, category: "Insurance", cycle: "monthly" },
  { id: "showcase4",      name: "Showcase Insurance — Policy 4", amount: 45.14, dueDay: 15, category: "Insurance", cycle: "monthly" },
  { id: "showcase5",      name: "Showcase Insurance — Policy 5", amount: 46.90, dueDay: 15, category: "Insurance", cycle: "monthly" },
  // Business
  { id: "realtor",        name: "Realtor / MLS",          amount: 140.00, dueDay: 1,  category: "Business",       cycle: "monthly" },
  { id: "broker",         name: "Your Broker",            amount: 175.00, dueDay: 2,  category: "Business",       cycle: "monthly" },
];

function loadBills() {
  try { const r = localStorage.getItem(FINANCE_BILLS_KEY); return r ? JSON.parse(r) : DEFAULT_BILLS; }
  catch { return DEFAULT_BILLS; }
}
function saveBills(b) { try { localStorage.setItem(FINANCE_BILLS_KEY, JSON.stringify(b)); } catch {} }
function loadPaid() {
  try { const r = localStorage.getItem(FINANCE_PAID_KEY); return r ? JSON.parse(r) : {}; }
  catch { return {}; }
}
function savePaid(p) { try { localStorage.setItem(FINANCE_PAID_KEY, JSON.stringify(p)); } catch {} }

function startOfDay(d) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function monthKey(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`; }
function daysInMonth(year, month /* 0-based */) { return new Date(year, month+1, 0).getDate(); }
function ordinal(n) { const s = ["th","st","nd","rd"], v = n % 100; return n + (s[(v-20)%10] || s[v] || s[0]); }
function fmt(n) { return "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

// Next occurrence of a bill on/after `from` (a Date). Returns null if undated.
function nextDueDate(bill, from) {
  const ref = startOfDay(from || new Date());
  if (bill.cycle === "annual") {
    const m = (bill.renewMonth || 1) - 1;
    const d = bill.renewDay || 1;
    let year = ref.getFullYear();
    let due = new Date(year, m, Math.min(d, daysInMonth(year, m)));
    if (due < ref) due = new Date(year+1, m, Math.min(d, daysInMonth(year+1, m)));
    return due;
  }
  if (!bill.dueDay) return null;
  let year = ref.getFullYear(), month = ref.getMonth();
  let due = new Date(year, month, Math.min(bill.dueDay, daysInMonth(year, month)));
  if (due < ref) {
    month += 1; if (month > 11) { month = 0; year += 1; }
    due = new Date(year, month, Math.min(bill.dueDay, daysInMonth(year, month)));
  }
  return due;
}

// Bills due within the next 7 days (inclusive of today).
function getDueThisWeek(bills, ref) {
  const today = startOfDay(ref || new Date());
  const end = new Date(today); end.setDate(today.getDate() + 7);
  return bills
    .map(b => ({ bill: b, due: nextDueDate(b, today) }))
    .filter(x => x.due && x.due >= today && x.due <= end)
    .sort((a, b) => a.due - b.due);
}

function dueLabelShort(due, ref) {
  const today = startOfDay(ref || new Date());
  const diff = Math.round((startOfDay(due) - today) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff < 7) return `in ${diff} days`;
  return `${MONTHS_SHORT[due.getMonth()]} ${due.getDate()}`;
}

function billDueText(b) {
  if (b.cycle === "annual") return `Renews ${MONTHS_SHORT[(b.renewMonth||1)-1]} ${b.renewDay||1} · yearly`;
  if (!b.dueDay) return "Date TBD";
  return `Due ${ordinal(b.dueDay)}`;
}

// ── Add / Edit bill form ──────────────────────────────────────────
function BillForm({ initial, onSave, onCancel, onDelete }) {
  const isEdit = !!initial;
  const [name, setName]         = useState(initial?.name || "");
  const [amount, setAmount]     = useState(initial?.amount != null ? String(initial.amount) : "");
  const [category, setCategory] = useState(initial?.category || "Software/Tools");
  const [cycle, setCycle]       = useState(initial?.cycle === "annual" ? "annual" : "monthly");
  const [dueDay, setDueDay]     = useState(initial?.dueDay != null ? String(initial.dueDay) : "");
  const [renewMonth, setRenewMonth] = useState(String(initial?.renewMonth || 1));
  const [renewDay, setRenewDay] = useState(String(initial?.renewDay || 1));
  const [note, setNote]         = useState(initial?.note || "");
  const [error, setError]       = useState("");

  function submit() {
    if (!name.trim()) { setError("Name is required."); return; }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < 0) { setError("Enter a valid amount."); return; }
    const bill = {
      id: initial?.id || `custom_${Date.now()}`,
      name: name.trim(),
      amount: Math.round(amt * 100) / 100,
      category,
      cycle,
      note: note.trim() || undefined,
    };
    if (cycle === "annual") {
      bill.renewMonth = Math.min(12, Math.max(1, parseInt(renewMonth, 10) || 1));
      bill.renewDay   = Math.min(31, Math.max(1, parseInt(renewDay, 10) || 1));
    } else {
      const dd = parseInt(dueDay, 10);
      bill.dueDay = dueDay === "" || isNaN(dd) ? null : Math.min(31, Math.max(1, dd));
    }
    onSave(bill);
  }

  const inputStyle = {
    width: "100%", boxSizing: "border-box", padding: "9px 12px", borderRadius: 8,
    border: `1px solid ${BORDER}`, fontSize: 13.5, color: TEXT, background: CREAM, fontFamily: "inherit",
  };
  const labelStyle = { fontSize: 11, color: MUTED, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5, display: "block" };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50, background: "rgba(28,25,23,0.45)",
      display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "48px 16px", overflowY: "auto",
    }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{
        background: WHITE, borderRadius: 16, padding: 24, width: "100%", maxWidth: 440,
        border: `1px solid ${BORDER}`, boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
      }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, marginBottom: 16 }}>
          {isEdit ? "Edit bill" : "Add a bill"}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Name</label>
          <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Disney+" autoFocus />
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Amount ($)</label>
            <input style={inputStyle} value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" inputMode="decimal" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Category</label>
            <select style={inputStyle} value={category} onChange={e => setCategory(e.target.value)}>
              {FINANCE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Billing cycle</label>
          <div style={{ display: "flex", gap: 6 }}>
            {[["monthly","Monthly"],["annual","Annual"]].map(([v,l]) => (
              <button key={v} onClick={() => setCycle(v)} style={{
                flex: 1, padding: "8px 0", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
                fontSize: 13, fontWeight: 600,
                border: `1px solid ${cycle===v ? ORANGE : BORDER}`,
                background: cycle===v ? ORANGE : WHITE, color: cycle===v ? WHITE : MUTED,
              }}>{l}</button>
            ))}
          </div>
        </div>

        {cycle === "monthly" ? (
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Due day of month (1–31, optional)</label>
            <input style={inputStyle} value={dueDay} onChange={e => setDueDay(e.target.value)} placeholder="Leave blank if unknown" inputMode="numeric" />
          </div>
        ) : (
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 2 }}>
              <label style={labelStyle}>Renews — month</label>
              <select style={inputStyle} value={renewMonth} onChange={e => setRenewMonth(e.target.value)}>
                {MONTHS_LONG.map((m,i) => <option key={m} value={i+1}>{m}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Day</label>
              <input style={inputStyle} value={renewDay} onChange={e => setRenewDay(e.target.value)} inputMode="numeric" />
            </div>
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Note (optional)</label>
          <input style={inputStyle} value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Varies / invoiced" />
        </div>

        {error && <div style={{ fontSize: 12.5, color: RED, marginBottom: 12 }}>{error}</div>}

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={submit} style={{
            flex: 1, background: ORANGE, border: "none", color: WHITE, borderRadius: 10,
            padding: "11px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 2px 8px rgba(234,108,0,0.25)",
          }}>{isEdit ? "Save changes" : "Add bill"}</button>
          <button onClick={onCancel} style={{
            background: WHITE, border: `1px solid ${BORDER}`, color: MUTED, borderRadius: 10,
            padding: "11px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>Cancel</button>
          {isEdit && (
            <button onClick={() => onDelete(initial.id)} title="Delete bill" style={{
              background: "rgba(220,38,38,0.08)", border: `1px solid rgba(220,38,38,0.25)`, color: RED,
              borderRadius: 10, padding: "11px 14px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            }}>Delete</button>
          )}
        </div>
      </div>
    </div>
  );
}

function FinanceTab({ bills, setBills, paid, setPaid }) {
  const today = new Date();
  const [view, setView] = useState("calendar");
  const [displayMonth, setDisplayMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [editing, setEditing] = useState(null); // null | "new" | bill object

  const year  = displayMonth.getFullYear();
  const month = displayMonth.getMonth();
  const dim   = daysInMonth(year, month);
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  const pKey = monthKey(displayMonth);
  const paidThisMonth = paid[pKey] || {};

  // Totals (annual never amortized into monthly).
  const monthlyBills = bills.filter(b => b.cycle !== "annual");
  const annualBills  = bills.filter(b => b.cycle === "annual");
  const monthlyTotal = monthlyBills.reduce((s, b) => s + (b.amount || 0), 0);
  const annualTotal  = annualBills.reduce((s, b) => s + (b.amount || 0), 0);
  const unpaidBills  = monthlyBills.filter(b => !paidThisMonth[b.id]);
  const unpaidTotal  = unpaidBills.reduce((s, b) => s + (b.amount || 0), 0);
  const dueThisWeek  = getDueThisWeek(bills, today);

  // Category breakdown (monthly only).
  const breakdown = FINANCE_CATEGORIES.map(cat => ({
    cat,
    total: monthlyBills.filter(b => b.category === cat).reduce((s, b) => s + (b.amount || 0), 0),
    count: bills.filter(b => b.category === cat).length,
  })).filter(c => c.count > 0);
  const breakdownMax = Math.max(1, ...breakdown.map(c => c.total));

  // Calendar: map day-of-month -> bills falling on it.
  const billsByDay = {};
  bills.forEach(b => {
    let day = null;
    if (b.cycle === "annual") {
      if ((b.renewMonth || 1) - 1 === month) day = Math.min(b.renewDay || 1, dim);
    } else if (b.dueDay) {
      day = Math.min(b.dueDay, dim);
    }
    if (day) { (billsByDay[day] = billsByDay[day] || []).push(b); }
  });
  const undatedBills = bills.filter(b => b.cycle !== "annual" && !b.dueDay);

  function togglePaid(billId) {
    const next = { ...paid, [pKey]: { ...paidThisMonth, [billId]: !paidThisMonth[billId] } };
    if (!next[pKey][billId]) delete next[pKey][billId];
    setPaid(next);
  }
  function saveBill(bill) {
    const exists = bills.some(b => b.id === bill.id);
    setBills(exists ? bills.map(b => b.id === bill.id ? bill : b) : [...bills, bill]);
    setEditing(null);
  }
  function deleteBill(id) {
    setBills(bills.filter(b => b.id !== id));
    setEditing(null);
  }
  function shiftMonth(delta) {
    setDisplayMonth(new Date(year, month + delta, 1));
  }

  const firstWeekday = new Date(year, month, 1).getDay();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= dim; d++) cells.push(d);

  const statCards = [
    { label: "Monthly Total",  value: fmt(monthlyTotal), sub: `${monthlyBills.length} recurring`, color: ORANGE },
    { label: "Due This Week",  value: dueThisWeek.length, sub: fmt(dueThisWeek.reduce((s,x)=>s+(x.bill.amount||0),0)), color: dueThisWeek.length ? RED : GREEN },
    { label: "Unpaid · " + MONTHS_SHORT[month], value: fmt(unpaidTotal), sub: `${unpaidBills.length} of ${monthlyBills.length} left`, color: unpaidTotal > 0 ? BLUE : GREEN },
    { label: "Annual / yr",    value: fmt(annualTotal),  sub: `${annualBills.length} yearly`, color: "#7C3AED" },
  ];

  return (
    <div>
      {editing && (
        <BillForm
          initial={editing === "new" ? null : editing}
          onSave={saveBill}
          onCancel={() => setEditing(null)}
          onDelete={deleteBill}
        />
      )}

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {statCards.map(s => (
          <div key={s.label} style={{
            background: WHITE, borderRadius: 12, padding: "14px 16px",
            border: `1px solid ${BORDER}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", textAlign: "center",
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 3, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
            <div style={{ fontSize: 11.5, color: MUTED, marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Due this week banner */}
      {dueThisWeek.length > 0 && (
        <div style={{
          background: "linear-gradient(135deg,#FEF3E8,#FFF7ED)", borderRadius: 14, padding: "16px 20px",
          border: `1px solid rgba(234,108,0,0.2)`, borderLeft: `5px solid ${ORANGE}`, marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: TEXT, marginBottom: 12 }}>◇ Due This Week</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {dueThisWeek.map(({ bill, due }) => {
              const isPaid = (paid[monthKey(due)] || {})[bill.id];
              const isToday = startOfDay(due).getTime() === startOfDay(today).getTime();
              return (
                <div key={bill.id} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 10,
                  background: WHITE, border: `1px solid ${isToday && !isPaid ? "rgba(220,38,38,0.3)" : BORDER}`,
                }}>
                  <span style={{ fontSize: 14 }}>{CAT_META[bill.category]?.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, textDecoration: isPaid ? "line-through" : "none", opacity: isPaid ? 0.55 : 1 }}>{bill.name}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: isPaid ? GREEN : isToday ? RED : MUTED }}>
                      {isPaid ? "✓ Paid" : dueLabelShort(due, today)}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: TEXT }}>{fmt(bill.amount)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View toggle + add */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, alignItems: "center" }}>
        {[["calendar","Calendar"],["list","All Bills"]].map(([v,label]) => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
            fontSize: 13, fontWeight: 600,
            border: `1px solid ${view===v ? ORANGE : BORDER}`,
            background: view===v ? ORANGE : WHITE, color: view===v ? WHITE : MUTED,
            boxShadow: view===v ? "0 2px 8px rgba(234,108,0,0.25)" : "none",
          }}>{label}</button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => setEditing("new")} style={{
          padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
          fontSize: 13, fontWeight: 700, border: "none", background: BLUE, color: WHITE,
          boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
        }}>+ Add Bill</button>
      </div>

      {/* CALENDAR VIEW */}
      {view === "calendar" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <button onClick={() => shiftMonth(-1)} style={navBtn}>‹</button>
            <div style={{ fontSize: 17, fontWeight: 800, color: TEXT }}>
              {MONTHS_LONG[month]} {year}{isCurrentMonth ? "" : ""}
            </div>
            <button onClick={() => shiftMonth(1)} style={navBtn}>›</button>
          </div>

          <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            {/* Weekday header */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", background: `linear-gradient(90deg,${ORANGE},${ORANGE2})` }}>
              {DAYS_SHORT.map(d => (
                <div key={d} style={{ padding: "8px 0", textAlign: "center", fontSize: 11, fontWeight: 700, color: WHITE, letterSpacing: "0.04em" }}>{d}</div>
              ))}
            </div>
            {/* Day cells */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
              {cells.map((d, i) => {
                const dayBills = d ? (billsByDay[d] || []) : [];
                const isToday = d && isCurrentMonth && d === today.getDate();
                return (
                  <div key={i} style={{
                    minHeight: 92, borderRight: (i % 7 !== 6) ? `1px solid ${BORDER}` : "none",
                    borderBottom: `1px solid ${BORDER}`, padding: 5,
                    background: d ? (isToday ? "rgba(234,108,0,0.05)" : WHITE) : "#FAFAF9",
                    verticalAlign: "top",
                  }}>
                    {d && (
                      <div style={{
                        fontSize: 11.5, fontWeight: isToday ? 800 : 600, marginBottom: 4,
                        color: isToday ? ORANGE : MUTED, textAlign: "right", paddingRight: 2,
                      }}>{d}</div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      {dayBills.map(b => {
                        const isPaid = !!paidThisMonth[b.id];
                        const c = CAT_META[b.category]?.color || ORANGE;
                        return (
                          <div key={b.id} onClick={() => togglePaid(b.id)} title={`${b.name} — ${fmt(b.amount)}${b.note ? " · " + b.note : ""}\nClick to mark ${isPaid ? "unpaid" : "paid"}`} style={{
                            fontSize: 10, lineHeight: 1.2, padding: "3px 5px", borderRadius: 5, cursor: "pointer",
                            background: isPaid ? "#F3F4F6" : "rgba(0,0,0,0.015)",
                            borderLeft: `3px solid ${isPaid ? "#9CA3AF" : c}`,
                            opacity: isPaid ? 0.6 : 1,
                            textDecoration: isPaid ? "line-through" : "none",
                          }}>
                            <div style={{ fontWeight: 700, color: TEXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {isPaid ? "✓ " : ""}{b.name}
                            </div>
                            <div style={{ color: MUTED, fontWeight: 600 }}>{fmt(b.amount)}{b.cycle === "annual" ? "/yr" : ""}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {undatedBills.length > 0 && (
            <div style={{ marginTop: 12, fontSize: 12, color: MUTED }}>
              <span style={{ fontWeight: 700 }}>No fixed date:</span>{" "}
              {undatedBills.map(b => `${b.name} (${fmt(b.amount)})`).join(" · ")}
            </div>
          )}
          <div style={{ marginTop: 8, fontSize: 11.5, color: MUTED, fontStyle: "italic" }}>
            Tip: click any bill in the calendar to mark it paid for {MONTHS_LONG[month]}. Paid status resets each month.
          </div>
        </div>
      )}

      {/* LIST VIEW (by category) */}
      {view === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {FINANCE_CATEGORIES.filter(cat => bills.some(b => b.category === cat)).map(cat => {
            const catBills = bills.filter(b => b.category === cat).sort((a,b) => (a.dueDay||99) - (b.dueDay||99));
            const catColor = CAT_META[cat]?.color || ORANGE;
            const catMonthly = catBills.filter(b => b.cycle !== "annual").reduce((s,b) => s + (b.amount||0), 0);
            return (
              <div key={cat} style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, borderLeft: `4px solid ${catColor}` }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: TEXT }}>
                    {CAT_META[cat]?.icon} {cat} <span style={{ color: MUTED, fontWeight: 600 }}>· {catBills.length}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: catColor }}>{fmt(catMonthly)}<span style={{ fontSize: 11, color: MUTED, fontWeight: 600 }}>/mo</span></div>
                </div>
                {catBills.map((b, idx) => {
                  const isPaid = !!paidThisMonth[b.id];
                  return (
                    <div key={b.id} style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "11px 16px",
                      background: idx % 2 === 0 ? WHITE : "#FAFAF9",
                      borderBottom: idx < catBills.length-1 ? `1px solid ${BORDER}` : "none",
                    }}>
                      <div onClick={() => togglePaid(b.id)} title={isPaid ? "Mark unpaid" : "Mark paid"} style={{
                        width: 22, height: 22, borderRadius: 6, flexShrink: 0, cursor: "pointer",
                        border: `2px solid ${isPaid ? GREEN : "#D4B89A"}`, background: isPaid ? GREEN : WHITE,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: WHITE, fontWeight: 800,
                      }}>{isPaid ? "✓" : ""}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: isPaid ? MUTED : TEXT, textDecoration: isPaid ? "line-through" : "none" }}>{b.name}</div>
                        <div style={{ fontSize: 11.5, color: MUTED }}>
                          {billDueText(b)}{b.note ? ` · ${b.note}` : ""}
                        </div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: TEXT, textAlign: "right" }}>
                        {fmt(b.amount)}{b.cycle === "annual" && <span style={{ fontSize: 10, color: MUTED, fontWeight: 600 }}>/yr</span>}
                      </div>
                      <button onClick={() => setEditing(b)} title="Edit" style={iconBtn}>✎</button>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* Category breakdown */}
      <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: "18px 20px", marginTop: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: TEXT }}>Monthly Breakdown by Category</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: ORANGE }}>{fmt(monthlyTotal)}<span style={{ fontSize: 11, color: MUTED, fontWeight: 600 }}>/mo</span></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {breakdown.sort((a,b) => b.total - a.total).map(c => (
            <div key={c.cat}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
                <span style={{ color: TEXT, fontWeight: 600 }}>{CAT_META[c.cat]?.icon} {c.cat}</span>
                <span style={{ color: MUTED, fontWeight: 700 }}>{fmt(c.total)} · {monthlyTotal > 0 ? Math.round(c.total/monthlyTotal*100) : 0}%</span>
              </div>
              <div style={{ background: "rgba(0,0,0,0.06)", borderRadius: 99, height: 8, overflow: "hidden" }}>
                <div style={{ width: `${c.total/breakdownMax*100}%`, height: "100%", borderRadius: 99, background: CAT_META[c.cat]?.color || ORANGE, transition: "width 0.4s ease" }} />
              </div>
            </div>
          ))}
        </div>
        {annualTotal > 0 && (
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${BORDER}`, fontSize: 12.5, color: MUTED }}>
            Plus <span style={{ fontWeight: 800, color: "#7C3AED" }}>{fmt(annualTotal)}/yr</span> in annual subscriptions ({annualBills.map(b => b.name).join(", ")}) — not included in the monthly total.
          </div>
        )}
      </div>
    </div>
  );
}

const navBtn = {
  width: 36, height: 36, borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
  fontSize: 20, fontWeight: 700, border: `1px solid ${BORDER}`, background: WHITE, color: ORANGE,
  display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1,
};
const iconBtn = {
  width: 30, height: 30, borderRadius: 7, cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
  fontSize: 13, border: `1px solid ${BORDER}`, background: WHITE, color: MUTED,
  display: "flex", alignItems: "center", justifyContent: "center",
};

export default function ConnorsLifeSnapshot() {
  const [activeTab, setActiveTab] = useState("today");
  const [photoURL,  setPhotoURL]  = useState(null);
  const [allData] = useState(() => { try { const r = localStorage.getItem("connors_habits_v1"); return r ? JSON.parse(r) : {}; } catch { return {}; } });
  const [sharedTodos, setSharedTodos] = useState(() => loadTodos());
  const [bills, setBillsState] = useState(() => loadBills());
  const [paid,  setPaidState]  = useState(() => loadPaid());

  function updateBills(next) { setBillsState(next); saveBills(next); }
  function updatePaid(next)  { setPaidState(next);  savePaid(next); }

  function toggleSharedTodo(id) {
    const next = { ...sharedTodos, items: sharedTodos.items.map(t => t.id === id ? { ...t, done: !t.done } : t) };
    setSharedTodos(next); saveTodos(next);
  }
  function deleteSharedTodo(id) {
    const next = { ...sharedTodos, items: sharedTodos.items.filter(t => t.id !== id) };
    setSharedTodos(next); saveTodos(next);
  }
  const today = new Date();
  const todayName = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", background: CREAM, minHeight: "100vh", color: TEXT }}>

      {/* ── HEADER ── */}
      <div style={{
        background: WHITE, borderBottom: `3px solid ${ORANGE}`,
        padding: "18px 24px",
        boxShadow: "0 2px 12px rgba(234,108,0,0.08)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, maxWidth: 900, margin: "0 auto" }}>

          {/* Photo */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: `linear-gradient(135deg,${ORANGE},${BLUE2})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: `3px solid ${ORANGE}`, overflow: "hidden",
              boxShadow: "0 0 0 3px rgba(234,108,0,0.15)",
            }}>
              {photoURL
                ? <img src={photoURL} alt="Connor" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: 24, fontWeight: 800, color: WHITE }}>C</span>
              }
            </div>
            <label style={{
              position: "absolute", bottom: -2, right: -2,
              width: 20, height: 20, borderRadius: "50%",
              background: ORANGE, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, color: WHITE, border: "2px solid " + WHITE,
            }}>+
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                const f = e.target.files[0]; if (f) setPhotoURL(URL.createObjectURL(f));
              }} />
            </label>
          </div>

          {/* Title */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: ORANGE, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>Personal Dashboard</div>
            <h1 style={{ margin: "2px 0 0", fontSize: 24, fontWeight: 800, color: TEXT, lineHeight: 1.1 }}>Connor's Life Snapshot</h1>
            <div style={{ fontSize: 13, color: BLUE, marginTop: 2, fontWeight: 500 }}>{todayName}</div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{ display: "flex", gap: 8, maxWidth: 900, margin: "16px auto 0", overflowX: "auto", paddingBottom: 2 }}>
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: "9px 18px", cursor: "pointer", fontFamily: "inherit",
                fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
                background: active ? "rgba(234,108,0,0.06)" : "transparent",
                color: TEXT,
                border: `1.5px solid ${active ? ORANGE : BLUE}`,
                borderRadius: 8,
                transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: 6,
                boxShadow: active ? "0 2px 8px rgba(234,108,0,0.15)" : "none",
              }}>
                <span>{tab.icon}</span> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── PAGE CONTENT ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px" }}>
        {activeTab === "today"     && <TodayTab habitData={allData} todosData={sharedTodos} onToggleTodo={toggleSharedTodo} setActiveTab={setActiveTab} bills={bills} paid={paid} />}
        {activeTab === "habits"    && <HabitSheet />}
        {activeTab === "treasured" && <TreasuredHomesTab sharedTodos={sharedTodos} onToggle={toggleSharedTodo} onDelete={deleteSharedTodo} setSharedTodos={setSharedTodos} />}
        {activeTab === "social"    && <ComingSoon label="Social Media" icon="◎" />}
        {activeTab === "health"    && <ComingSoon label="Health & Fitness" icon="♡" />}
        {activeTab === "finance"   && <FinanceTab bills={bills} setBills={updateBills} paid={paid} setPaid={updatePaid} />}
        {activeTab === "brain"     && <AIBrainTab />}
      </div>
    </div>
  );
}
