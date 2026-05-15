import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Downloader Running 🚀");
});

app.post("/download", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ success: false, error: "URL required" });

  try {
    const response = await fetch("https://api.cobalt.tools/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ url: url.trim() }),
    });

    const data = await response.json();

    if (data.status === "redirect" || data.status === "stream" || data.status === "tunnel") {
      return res.json({ success: true, videoUrl: data.url });
    }
    if (data.status === "picker") {
      return res.json({ success: true, videoUrl: data.picker?.[0]?.url });
    }

    return res.json({ success: false, error: data.error?.code || "Could not process URL" });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on", PORT));
