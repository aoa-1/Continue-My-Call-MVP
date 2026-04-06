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
      startTime: null,
      baseBalance: 15,
      baseCredit: 50
    };
  }
  return sessions[id];
}

// ---------------- ROUTES ----------------

// Start call
app.post("/start-call", (req, res) => {
  const { sessionId } = req.body;
  const session = getSession(sessionId);

  session.callActive = true;
  session.startTime = Date.now();

  res.json({ status: "call started" });
});

// End call
app.post("/end-call", (req, res) => {
  const { sessionId } = req.body;
  const session = getSession(sessionId);

  session.callActive = false;
  session.startTime = null;

  res.json({ status: "call ended" });
});

// Status (CORE LOGIC HERE 🔥)
app.post("/status", (req, res) => {
  const { sessionId } = req.body;
  const session = getSession(sessionId);

  let balance = session.baseBalance;
  let credit = session.baseCredit;
  let usingCredit = false;

  if (session.callActive && session.startTime) {
    const elapsed = Math.floor((Date.now() - session.startTime) / 1000);

    if (elapsed < session.baseBalance) {
      balance = session.baseBalance - elapsed;
      credit = session.baseCredit;
      usingCredit = false;
    } else {
      const creditUsed = elapsed - session.baseBalance;

      balance = 0;

      if (creditUsed < session.baseCredit) {
        credit = session.baseCredit - creditUsed;
        usingCredit = true;
      } else {
        credit = 0;
        session.callActive = false; // auto end call
      }
    }
  }

  res.json({
    balance,
    credit,
    usingCredit,
    callActive: session.callActive
  });
});

// Reset
app.post("/reset-session", (req, res) => {
  const { sessionId } = req.body;
  delete sessions[sessionId];
  res.json({ status: "session reset" });
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));