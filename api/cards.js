export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { name, set, img } = req.query;

  // Image proxy
  if (img) {
    const imgUrl = `https://en.onepiece-cardgame.com/images/cardlist/card/${img}.png`;
    try {
      const response = await fetch(imgUrl, {
        headers: {
          "Referer": "https://en.onepiece-cardgame.com/",
          "User-Agent": "Mozilla/5.0"
        }
      });
      if (!response.ok) return res.status(404).end();
      const buffer = await response.arrayBuffer();
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.status(200).send(Buffer.from(buffer));
    } catch (e) {
      res.status(404).end();
    }
    return;
  }

  // Card search
  if (!name) return res.status(400).json({ error: "name required" });
  let url = `https://optcgapi.com/api/sets/filtered/?card_name=${encodeURIComponent(name)}`;
  if (set) url += `&set_name=${encodeURIComponent(set)}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "Upstream API error" });
  }
}