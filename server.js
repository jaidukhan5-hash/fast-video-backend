import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Home route (test)
app.get("/", (req, res) => {
  res.send("Downloader Running 🚀");
});

// Test download route (NO external API, just check server working)
app.post("/download", (req, res) => {
  console.log("Request received:", req.body);

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      success: false,
      error: "URL missing"
    });
  }

  return res.json({
    success: true,
    message: "Server is working fine",
    receivedUrl: url
  });
});

// PORT
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
