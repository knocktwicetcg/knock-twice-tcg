export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { name, set } = req.query;
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