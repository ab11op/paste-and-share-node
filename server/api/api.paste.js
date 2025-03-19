import express from "express";
import { Paste } from "../models/paste.js";
import crypto from "crypto";
import memcache from "../utils/memeCached.js";

const router = express.Router();

function renderPastePage(pasteId, content) {
  return `
      <html>
      <head>
          <title>Paste - ${pasteId}</title>
          <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
          <h1>Paste Content</h1>
          <textarea readonly style="width: 100%; height: 300px;">${content.replace(
            /<[^>]*>?/gm,
            ""
          )}</textarea>
          <br>
          <button onclick="copyToClipboard()">Copy</button>
          <a href="/">Create New Paste</a>
  
          <script>
           function copyToClipboard() {
    const textArea = document.getElementById('pasteContent');
    const text = textArea.value;

    navigator.clipboard.writeText(text)
        .then(() => {
            alert("Copied to clipboard!");
        })
        .catch(err => {
            console.error("Failed to copy: ", err);
        });
}
          </script>
      </body>
      </html>
    `;
}

router.post("/paste", async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required" });

    const pasteId = crypto.randomBytes(4).toString("hex");
    const newPaste = new Paste({ pasteId, content });

    await newPaste.save();

    // Store in Memcached (expires in 1 hour)
    memcache.set(pasteId, content, { expires: 3600 });
    const baseUrl = process.env.BASE_URL;

    return res.json({ url: `${baseUrl}/${pasteId}`, pasteId });
  } catch (err) {
    logger.error("error in creating paste", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:pasteId", async (req, res) => {
  try {
    const { pasteId } = req.params;

    // Check Memcached first
    memcache.get(pasteId, async (err, cachedData) => {
      if (cachedData) {
        console.log("Cache hit! Serving from Memcached...");
        return res.send(renderPastePage(pasteId, cachedData.toString()));
      }

      console.log("Cache miss! Fetching from MongoDB...");
      const paste = await Paste.findOne({ pasteId });

      if (!paste) return res.status(404).send("Paste not found");

      // Store in Memcached
      memcache.set(pasteId, paste.content, { expires: 3600 });

      return res.send(renderPastePage(pasteId, paste.content));
    });
  } catch (error) {
    logger.error(`error in getting the paste : ${error}`);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
