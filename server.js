import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Downloader Running 🚀");
});

app.post("/download", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      success: false,
      error: "URL required"
    });
  }

  // SAFE DUMMY RESPONSE (to confirm system works)
  return res.json({
    success: true,
    title: "Test Video",
    thumbnail: "",
    formats: [
      { quality: "720p", url },
      { quality: "1080p", url },
      { quality: "2160p", url }
    ]
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
