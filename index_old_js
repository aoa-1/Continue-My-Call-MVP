const path = require("path");
const express = require("express");
const app = express();

let user = {
  balance: 20,
  credit: 50,
  usingCredit: false,
  inCall: false
};

let callInterval = null;

app.get("/", (req, res) => {
  res.send("Call Continuity MVP Running 🚀");
});

// START CALL
app.get("/start-call", (req, res) => {
  if (user.inCall) {
    return res.json({ message: "Call already in progress" });
  }

  user.inCall = true;

  callInterval = setInterval(() => {
    if (user.balance > 0) {
      user.balance -= 5;
      console.log("Deducting from MAIN balance");
    } else if (!user.usingCredit) {
      user.usingCredit = true;
      console.log("🔥 Switched to CREDIT");
    } else if (user.credit > 0) {
      user.credit -= 5;
      console.log("Deducting from CREDIT");
    } else {
      console.log("❌ Credit exhausted. Ending call.");
      clearInterval(callInterval);
      user.inCall = false;
    }
  }, 3000); // every 3 seconds

  res.json({ message: "Call started" });
});

app.get("/app", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// STOP CALL
app.get("/end-call", (req, res) => {
  clearInterval(callInterval);
  user.inCall = false;

  res.json({ message: "Call ended" });
});

// CHECK STATUS
app.get("/status", (req, res) => {
  res.json(user);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});