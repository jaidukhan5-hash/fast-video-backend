import express from "express";
import cors from "cors";
import ytdlp from "yt-dlp-exec";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Downloader Backend Running");
});

app.post("/download", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: "URL required"
      });
    }

    // yt-dlp extraction
    const info = await ytdlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificates: true,
      preferFreeFormats: true
    });

    // best format selection
    const formats = info.formats || [];

    const best = formats
      .filter(f => f.url && f.ext === "mp4")
      .sort((a, b) => (b.height || 0) - (a.height || 0))[0];

    if (!best) {
      return res.status(400).json({
        success: false,
        error: "No downloadable format found"
      });
    }

    return res.json({
      success: true,
      title: info.title,
      platform: info.extractor,
      thumbnail: info.thumbnail,
      videoUrl: best.url
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on", PORT));
