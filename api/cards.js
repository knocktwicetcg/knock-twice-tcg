export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { name, set } = req.query;
  if (!name) return res.status(400).json({ error: "name required" });

  const endpoints = [
    `https://optcgapi.com/api/sets/filtered/?card_name=${encodeURIComponent(name)}`,
    `https://optcgapi.com/api/decks/filtered/?card_name=${encodeURIComponent(name)}`,
    `https://optcgapi.com/api/promos/filtered/?card_name=${encodeURIComponent(name)}`,
    `https://optcgapi.com/api/don/filtered/?card_name=${encodeURIComponent(name)}`,
  ].map(url => set ? url + `&set_name=${encodeURIComponent(set)}` : url);

  try {
    const results = await Promise.allSettled(
      endpoints.map(url => fetch(url).then(r => r.json()))
    );

    let cards = [];
    results.forEach(function(result) {
      if (result.status === "fulfilled") {
        const data = result.value;
        const list = Array.isArray(data) ? data : (data.results || data.cards || []);
        cards = cards.concat(list);
      }
    });

    // Deduplicate by card_image_id
    const seen = new Set();
    cards = cards.filter(function(card) {
      const key = card.card_image_id || card.card_set_id || card.card_name;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    res.status(200).json(cards);
  } catch (e) {
    res.status(500).json({ error: "Upstream API error" });
  }
}