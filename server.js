import express from "express";
import cors from "cors";
import ytdlp from "yt-dlp-exec";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const app = express();

app.use(cors());
app.use(express.json());

const tempDir = "./temp";
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

app.get("/", (req, res) => {
  res.send("Video Downloader Running 🚀");
});

app.post("/download", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: "URL missing" });
    }

    const fileId = uuidv4();
    const outputPath = path.join(tempDir, `${fileId}.mp4`);

    await ytdlp(url, {
      // 🔥 AUDIO FIX MAIN CHANGE HERE
      format: "best[ext=mp4]/best",

      output: outputPath,
      noPlaylist: true,

      // fallback stability
      noCheckCertificates: true,
      preferFreeFormats: true
    });

    res.download(outputPath, (err) => {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: "Download failed",
      details: err.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
