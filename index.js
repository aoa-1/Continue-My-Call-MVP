const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// Default route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---------------- SESSION STORAGE ----------------
let sessions = {};

// Create / get session
function getSession(id) {
  if (!sessions[id]) {
    sessions[id] = {
      callActive: false,
      balance: 15,
      credit: 50,
      usingCredit: false,
      interval: null
    };
  }
  return sessions[id];
}

// ---------------- REAL-TIME DEDUCTION ----------------
function startDeduction(session) {
  if (session.interval) return; // prevent multiple timers

  session.interval = setInterval(() => {
  if (!session.callActive) return;

  if (session.balance > 0) {
    session.balance -= 1;
    session.usingCredit = false;
  } else if (session.credit > 0) {
    session.usingCredit = true;
    session.credit -= 1;
  } else {
    session.callActive = false;
    clearInterval(session.interval);
    session.interval = null;
  }

  console.log("Deducting:", session.balance, session.credit);

}, 1000);
}

// ---------------- ROUTES ----------------

// Start call
app.post("/start-call", (req, res) => {
  const { sessionId } = req.body;
  const session = getSession(sessionId);

  session.callActive = true;

  startDeduction(session);

  res.json(session);
});

// End call
app.post("/end-call", (req, res) => {
  const { sessionId } = req.body;
  const session = getSession(sessionId);

  session.callActive = false;

  if (session.interval) {
    clearInterval(session.interval);
    session.interval = null;
  }

  session.balance = 15;
  session.credit = 50;
  session.usingCredit = false;

  res.json(session);
});

// Status
app.post("/status", (req, res) => {
  const { sessionId } = req.body;
  res.json(getSession(sessionId));
});

// Reset
app.post("/reset-session", (req, res) => {
  const { sessionId } = req.body;

  if (sessions[sessionId]?.interval) {
    clearInterval(sessions[sessionId].interval);
  }

  delete sessions[sessionId];

  res.json({ status: "session reset" });
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));