import express from "express";
import cors from "cors";
import ytdlp from "yt-dlp-exec";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Video Downloader Backend Running 🚀");
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

    const info = await ytdlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificates: true
    });

    if (!info || !info.formats) {
      return res.status(400).json({
        success: false,
        error: "No data found"
      });
    }

    // 🔥 AUDIO + VIDEO SAFE FILTER
    const formats = info.formats
      .filter(f => f.url && f.height)
      .map(f => ({
        quality: `${f.height}p`,
        url: f.url,
        height: f.height
      }));

    if (formats.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No video formats available"
      });
    }

    // 🔥 ONLY 720 / 1080 / 2160
    const allowed = ["720", "1080", "2160"];
    const filtered = [];

    allowed.forEach(q => {
      const match = formats.find(f =>
        f.quality.includes(q)
      );
      if (match) filtered.push(match);
    });

    // fallback if missing
    const finalFormats = filtered.length ? filtered : formats.slice(0, 3);

    return res.json({
      success: true,
      title: info.title,
      thumbnail: info.thumbnail,
      formats: finalFormats
    });

  } catch (err) {
    console.error("ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
