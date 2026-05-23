export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { imageData, fileName } = body;

    if (!imageData || !imageData.startsWith("data:")) {
      return res.status(400).json({ error: "No image data" });
    }

    const base64 = imageData.replace(/^data:image\/\w+;base64,/, "");
    const cleanName = (fileName || ("card_" + Date.now() + ".jpg"))
      .replace(/[^a-zA-Z0-9._-]/g, "_");

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO = "knocktwicetcg/knock-twice-tcg";
    const PATH = "public/cards/" + cleanName;

    const ghRes = await fetch(
      "https://api.github.com/repos/" + REPO + "/contents/" + PATH,
      {
        method: "PUT",
        headers: {
          "Authorization": "token " + GITHUB_TOKEN,
          "Content-Type": "application/json",
          "User-Agent": "knock-twice-tcg"
        },
        body: JSON.stringify({
          message: "Upload card image: " + cleanName,
          content: base64
        })
      }
    );

    const ghData = await ghRes.json();

    if (!ghRes.ok) {
      return res.status(500).json({ error: ghData.message || "GitHub upload failed" });
    }

    const imageUrl = "https://raw.githubusercontent.com/" + REPO + "/main/" + PATH;
    return res.status(200).json({ success: true, imageUrl });

  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
