import express from 'express';
import cors from 'cors';
import ytdlp from 'yt-dlp-exec';

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend Running Successfully');
});

app.post('/download', async (req, res) => {

  try {

    const { url } = req.body;

    if (!url) {

      return res.status(400).json({
        success: false,
        error: 'URL required'
      });
    }

    // Extract video info

    const data = await ytdlp(url, {

      dumpSingleJson: true,
      noWarnings: true,
      preferFreeFormats: true
    });

    // Best format

    let video =
      data.formats
      ?.filter(f => f.url && f.ext === 'mp4')
      ?.sort((a, b) =>
        (b.height || 0) - (a.height || 0)
      )[0];

    if (!video) {

      return res.status(400).json({
        success: false,
        error: 'No downloadable video found'
      });
    }

    return res.json({

      success: true,

      platform: data.extractor || 'Video',

      title: data.title,

      thumbnail: data.thumbnail,

      videoUrl: video.url
    });

  } catch (err) {

    return res.status(500).json({

      success: false,

      error: err.message
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
