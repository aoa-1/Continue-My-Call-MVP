const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Serve frontend from /public
app.use(express.static(path.join(__dirname, 'public')));

// Send index.html for any other route (so direct URL access works)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ----------------- SESSION LOGIC -----------------

// Store sessions per user
let sessions = {}; // { sessionId: { callActive, balance, credit, usingCredit, seconds } }

// Helper: format session if it doesn't exist
function getSession(id) {
    if (!sessions[id]) {
        sessions[id] = {
            callActive: false,
            balance: 100,
            credit: 50,
            usingCredit: false,
            seconds: 0
        };
    }
    return sessions[id];
}

// Start call
app.post("/start-call", (req, res) => {
    const { sessionId } = req.body;
    const session = getSession(sessionId);

    session.callActive = true;
    session.usingCredit = session.balance <= 0;
    res.json({ status: "call started", session });
});

// End call
app.post("/end-call", (req, res) => {
    const { sessionId } = req.body;
    const session = getSession(sessionId);

    session.callActive = false;
    session.balance = 100; // reset balance
    session.credit = 50;   // reset credit
    session.usingCredit = false;
    session.seconds = 0;
    res.json({ status: "call ended", session });
});

// Get session status
app.post("/status", (req, res) => {
    const { sessionId } = req.body;
    const session = getSession(sessionId);
    res.json(session);
});

// Reset demo
app.post("/reset-session", (req, res) => {
    const { sessionId } = req.body;
    delete sessions[sessionId]; // remove session so a new one is created
    res.json({ status: "session reset" });
});

// ----------------- START SERVER -----------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));