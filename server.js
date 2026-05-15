import express from "express";
import cors from "cors";
import { exec } from "child_process";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Downloader Running 🚀");
});

app.post("/download", (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: "URL required"
      });
    }

    // safe filename
    const cmd = `yt-dlp -j "${url}"`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({
          success: false,
          error: "yt-dlp failed",
          details: error.message
        });
      }

      try {
        const info = JSON.parse(stdout);

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

      } catch (e) {
        return res.status(500).json({
          success: false,
          error: "Parse error"
        });
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
