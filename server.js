import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Root test route
app.get("/", (req, res) => {
  res.send("Downloader Running 🚀");
});

// TEST DOWNLOAD ROUTE (NO external API, only check server + Postman)
app.post("/download", (req, res) => {
  console.log("🔥 /download HIT RECEIVED");
  console.log("Body:", req.body);

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      success: false,
      error: "URL missing"
    });
  }

  return res.json({
    success: true,
    message: "POST /download working perfectly",
    receivedUrl: url,
    time: new Date().toISOString()
  });
});

// Health check (useful for Render debugging)
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: Date.now() });
});

// PORT
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("✅ Server running on port", PORT);
});
