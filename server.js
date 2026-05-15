import express from "express";
import cors from "cors";
import ytdlp from "yt-dlp-exec";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Downloader Running 🚀");
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

    const formats = (info.formats || [])
      .filter(f => f.url && f.height)
      .map(f => ({
        quality: `${f.height}p`,
        url: f.url
      }));

    return res.json({
      success: true,
      title: info.title,
      thumbnail: info.thumbnail,
      formats
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
