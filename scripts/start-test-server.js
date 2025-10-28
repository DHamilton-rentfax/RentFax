import express from "express";
const app = express();
app.get("/", (_, res) => res.send("✅ RentFAX Test Server Running"));
app.listen(3000, () =>
  console.log("✅ Test server listening on http://localhost:3000")
);