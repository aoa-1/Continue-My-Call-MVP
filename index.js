const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Send index.html for any route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Session Logic ---
let sessions = {};

function getSession(id) {
  if (!sessions[id]) {
    sessions[id] = {
      callActive: false,
      balance: 15,
      credit: 50,
      usingCredit: false,
      seconds: 0
    };
  }
  return sessions[id];
}

app.post("/start-call", (req, res) => {
  const { sessionId } = req.body;
  const session = getSession(sessionId);
  session.callActive = true;
  session.usingCredit = session.balance <= 0;
  res.json({ status: "call started", session });
});

app.post("/end-call", (req, res) => {
  const { sessionId } = req.body;
  const session = getSession(sessionId);
  session.callActive = false;
  session.balance = 100;
  session.credit = 50;
  session.usingCredit = false;
  session.seconds = 0;
  res.json({ status: "call ended", session });
});

app.post("/status", (req, res) => {
  const { sessionId } = req.body;
  res.json(getSession(sessionId));
});

app.post("/reset-session", (req, res) => {
  const { sessionId } = req.body;
  delete sessions[sessionId];
  res.json({ status: "session reset" });
});

// --- Start server ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));