import express from 'express';
import cors from 'cors';

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

    return res.json({
      success: true,
      message: 'Backend working',
      url
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
