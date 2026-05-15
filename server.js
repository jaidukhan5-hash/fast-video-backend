import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Downloader Running 🚀");
});

app.post("/download", (req, res) => {
  return res.json({
    success: true,
    message: "API working",
    formats: [
      { quality: "720p", url: "test" },
      { quality: "1080p", url: "test" }
    ]
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));
