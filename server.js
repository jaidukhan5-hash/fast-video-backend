import express from "express";
import cors from "cors";
import ytdlp from "yt-dlp-exec";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// simple cache for speed
const cache = new Map();

app.get("/", (req, res) => {
  res.send("Video Downloader Backend Running");
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

    // CACHE
    if (cache.has(url)) {
      return res.json(cache.get(url));
    }

    const info = await ytdlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificates: true
    });

    const formats = (info.formats || [])
      .filter(f => f.url && f.height)
      .map(f => ({
        quality: f.height + "p",
        url: f.url
      }));

    if (formats.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No video formats found"
      });
    }

    // AUTO BEST QUALITY
    const best = formats.reduce((a, b) =>
      parseInt(a.quality) > parseInt(b.quality) ? a : b
    );

    const response = {
      success: true,
      title: info.title,
      thumbnail: info.thumbnail,
      bestQuality: best,
      formats: formats
    };

    cache.set(url, response);

    return res.json(response);

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on", PORT));
