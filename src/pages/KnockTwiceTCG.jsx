import { useState, useMemo } from "react";

const SETS = ["All Sets","OP-01","OP-02","OP-03","OP-04","OP-05","OP-06","OP-07","OP-08","OP-09","OP-10","OP-11","OP-12","OP-13","OP-14","OP-15","ST-01","ST-02","ST-03","ST-04"];

const BUYBACK_DATA = [
  { id:1,  name:"Monkey D. Luffy",        set:"OP-01", code:"OP01-120", rarity:"SEC", lang:"EN", nm:180, lp:144, mp:108 },
  { id:2,  name:"Monkey D. Luffy (Alt Art)", set:"OP-01", code:"OP01-120", rarity:"SEC", lang:"JP", nm:240, lp:192, mp:144 },
  { id:3,  name:"Roronoa Zoro",            set:"OP-02", code:"OP02-094", rarity:"SEC", lang:"EN", nm:130, lp:104, mp:78 },
  { id:4,  name:"Roronoa Zoro (Parallel)", set:"OP-02", code:"OP02-094", rarity:"SEC", lang:"JP", nm:160, lp:128, mp:96 },
  { id:5,  name:"Shanks",                  set:"OP-04", code:"OP04-060", rarity:"SEC", lang:"JP", nm:360, lp:288, mp:216 },
  { id:6,  name:"Boa Hancock",             set:"OP-03", code:"OP03-099", rarity:"SEC", lang:"EN", nm:90,  lp:72,  mp:54  },
  { id:7,  name:"Trafalgar Law",           set:"OP-05", code:"OP05-060", rarity:"SEC", lang:"JP", nm:165, lp:132, mp:99  },
  { id:8,  name:"Portgas D. Ace",          set:"OP-02", code:"OP02-013", rarity:"L",   lang:"EN", nm:28,  lp:22,  mp:17  },
  { id:9,  name:"Whitebeard",              set:"OP-06", code:"OP06-107", rarity:"SEC", lang:"JP", nm:285, lp:228, mp:171 },
  { id:10, name:"Uta",                     set:"OP-07", code:"OP07-119", rarity:"SEC", lang:"JP", nm:95,  lp:76,  mp:57  },
  { id:11, name:"Nami (Parallel)",         set:"OP-01", code:"OP01-016", rarity:"R",   lang:"JP", nm:48,  lp:38,  mp:29  },
  { id:12, name:"Crocodile",               set:"OP-03", code:"OP03-058", rarity:"SEC", lang:"EN", nm:55,  lp:44,  mp:33  },
  { id:13, name:"Kaido",                   set:"OP-06", code:"OP06-042", rarity:"SEC", lang:"JP", nm:210, lp:168, mp:126 },
  { id:14, name:"Big Mom",                 set:"OP-07", code:"OP07-079", rarity:"SEC", lang:"JP", nm:140, lp:112, mp:84  },
  { id:15, name:"Sabo",                    set:"OP-08", code:"OP08-080", rarity:"SEC", lang:"JP", nm:120, lp:96,  mp:72  },
  { id:16, name:"Yamato",                  set:"OP-09", code:"OP09-119", rarity:"SEC", lang:"JP", nm:180, lp:144, mp:108 },
  { id:17, name:"Edward Newgate",          set:"ST-04", code:"ST04-013", rarity:"L",   lang:"EN", nm:22,  lp:18,  mp:13  },
  { id:18, name:"Eustass Kid",             set:"OP-04", code:"OP04-022", rarity:"SEC", lang:"JP", nm:75,  lp:60,  mp:45  },
];

const FOR_SALE_DATA = [
  { id:1, name:"Monkey D. Luffy",  set:"OP-01", code:"OP01-120", rarity:"SEC", lang:"EN", condition:"NM", price:265, qty:1 },
  { id:2, name:"Shanks",           set:"OP-04", code:"OP04-060", rarity:"SEC", lang:"JP", condition:"LP", price:430, qty:1 },
  { id:3, name:"Roronoa Zoro",     set:"OP-02", code:"OP02-094", rarity:"SEC", lang:"EN", condition:"NM", price:185, qty:2 },
  { id:4, name:"Trafalgar Law",    set:"OP-05", code:"OP05-060", rarity:"SEC", lang:"JP", condition:"NM", price:230, qty:3 },
  { id:5, name:"Whitebeard",       set:"OP-06", code:"OP06-107", rarity:"SEC", lang:"JP", condition:"LP", price:345, qty:1 },
  { id:6, name:"Boa Hancock",      set:"OP-03", code:"OP03-099", rarity:"SEC", lang:"EN", condition:"NM", price:135, qty:2 },
  { id:7, name:"Kaido",            set:"OP-06", code:"OP06-042", rarity:"SEC", lang:"JP", condition:"NM", price:290, qty:1 },
  { id:8, name:"Yamato",           set:"OP-09", code:"OP09-119", rarity:"SEC", lang:"JP", condition:"NM", price:250, qty:2 },
];

const RARITY_STYLE = {
  SEC: { bg:"#FAC775", color:"#633806" },
  L:   { bg:"#AFA9EC", color:"#26215C" },
  R:   { bg:"#F4C0D1", color:"#4B1528" },
  UC:  { bg:"#D3D1C7", color:"#2C2C2A" },
  C:   { bg:"#B4B2A9", color:"#2C2C2A" },
};

const COND_STYLE = {
  NM:  { background:"#C0DD97", color:"#173404" },
  LP:  { background:"#FAC775", color:"#633806" },
  MP:  { background:"#F7C1C1", color:"#501313" },
  DMG: { background:"#D3D1C7", color:"#2C2C2A" },
};

const WHATSAPP_NUMBER = "6500000000"; // TODO: replace with your real number

function Badge({ label, style }) {
  return (
    <span style={{ fontSize:11, fontWeight:500, padding:"2px 7px", borderRadius:4, lineHeight:1.4, ...style }}>
      {label}
    </span>
  );
}

function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function KnockTwiceTCG() {
  const [tab, setTab] = useState("buyback");
  const [bbSearch, setBbSearch] = useState("");
  const [bbSet, setBbSet] = useState("All Sets");
  const [bbLang, setBbLang] = useState("All");
  const [saleSearch, setSaleSearch] = useState("");

  const filteredBuyback = useMemo(() => BUYBACK_DATA.filter(c => {
    const q = bbSearch.toLowerCase();
    return (c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
      && (bbSet === "All Sets" || c.set === bbSet)
      && (bbLang === "All" || c.lang === bbLang);
  }), [bbSearch, bbSet, bbLang]);

  const filteredSale = useMemo(() => FOR_SALE_DATA.filter(c =>
    c.name.toLowerCase().includes(saleSearch.toLowerCase()) ||
    c.code.toLowerCase().includes(saleSearch.toLowerCase())
  ), [saleSearch]);

  const tabs = [
    { id:"buyback", label:"Buyback Prices", icon:"💰" },
    { id:"sale",    label:"Cards for Sale",  icon:"🃏" },
    { id:"howto",   label:"How It Works",    icon:"ℹ️"  },
  ];

  return (
    <div style={{ fontFamily:"system-ui, sans-serif", maxWidth:720, margin:"0 auto", padding:"0 16px" }}>

      {/* Header */}
      <div style={{ padding:"1.5rem 0 0", borderBottom:"1px solid #e5e5e5", marginBottom:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
          <div>
            <div style={{ fontSize:22, fontWeight:700, color:"#111", letterSpacing:"-0.5px" }}>
              Knock Twice TCG
            </div>
            <div style={{ fontSize:13, color:"#666", marginTop:3 }}>
              One Piece TCG · Singapore · Buyback &amp; Sales
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
            <span style={{ fontSize:12, color:"#666" }}>📍 Sembawang, SG</span>
            <span style={{ fontSize:12, color:"#666" }}>🕐 12pm – 9pm daily</span>
            <a href={whatsappLink("Hi Knock Twice TCG!")}
              target="_blank" rel="noreferrer"
              style={{ fontSize:12, color:"#25D366", fontWeight:500, textDecoration:"none" }}>
              💬 WhatsApp Us
            </a>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:16 }}>
          {[
            { label:"Cards on buyback list", value:"18+" },
            { label:"Sets covered",           value:"EN + JP" },
            { label:"Payment",                value:"PayNow / Cash" },
          ].map(m => (
            <div key={m.label} style={{ background:"#f5f5f5", borderRadius:8, padding:"10px 12px" }}>
              <div style={{ fontSize:11, color:"#888", marginBottom:3 }}>{m.label}</div>
              <div style={{ fontSize:15, fontWeight:600, color:"#111" }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:4 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding:"8px 16px", fontSize:13, cursor:"pointer",
              borderRadius:"8px 8px 0 0",
              border: tab === t.id ? "1px solid #e5e5e5" : "1px solid transparent",
              borderBottom: tab === t.id ? "1px solid white" : "none",
              background: tab === t.id ? "white" : "transparent",
              fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? "#111" : "#666",
              position:"relative", bottom:-1,
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ border:"1px solid #e5e5e5", borderTop:"none", borderRadius:"0 0 12px 12px", padding:"1rem 1rem 1.25rem" }}>

        {/* BUYBACK TAB */}
        {tab === "buyback" && (
          <div>
            <p style={{ fontSize:13, color:"#666", margin:"0 0 12px", lineHeight:1.6 }}>
              Prices updated regularly. All prices in SGD. Bring cards in-store or WhatsApp for a quote.
            </p>

            <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
              <input type="text" placeholder="Search card name or code…" value={bbSearch}
                onChange={e => setBbSearch(e.target.value)}
                style={{ flex:1, minWidth:160, fontSize:13, padding:"8px 10px", border:"1px solid #ddd", borderRadius:6, outline:"none" }} />
              <select value={bbSet} onChange={e => setBbSet(e.target.value)}
                style={{ fontSize:13, padding:"8px 10px", border:"1px solid #ddd", borderRadius:6 }}>
                {SETS.map(s => <option key={s}>{s}</option>)}
              </select>
              <select value={bbLang} onChange={e => setBbLang(e.target.value)}
                style={{ fontSize:13, padding:"8px 10px", border:"1px solid #ddd", borderRadius:6 }}>
                <option value="All">EN + JP</option>
                <option value="EN">English only</option>
                <option value="JP">Japanese only</option>
              </select>
            </div>

            <div style={{ display:"flex", gap:12, marginBottom:10, flexWrap:"wrap" }}>
              {[["NM","Near Mint","100%"],["LP","Lightly Played","80%"],["MP","Mod. Played","60%"]].map(([c,desc,pct]) => (
                <span key={c} style={{ fontSize:12, color:"#666", display:"flex", alignItems:"center", gap:5 }}>
                  <Badge label={c} style={COND_STYLE[c]} />
                  {desc} · {pct} of NM
                </span>
              ))}
            </div>

            <div style={{ border:"1px solid #e5e5e5", borderRadius:8, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, tableLayout:"fixed" }}>
                <thead>
                  <tr style={{ background:"#f9f9f9" }}>
                    <th style={{ padding:"10px 12px", textAlign:"left", fontWeight:600, color:"#666", width:"40%" }}>Card</th>
                    <th style={{ padding:"10px 8px", textAlign:"center", fontWeight:600, color:"#666", width:"10%" }}>Lang</th>
                    <th style={{ padding:"10px 8px", textAlign:"right", fontWeight:600, color:"#666", width:"17%" }}>NM</th>
                    <th style={{ padding:"10px 8px", textAlign:"right", fontWeight:600, color:"#666", width:"17%" }}>LP</th>
                    <th style={{ padding:"10px 8px", textAlign:"right", fontWeight:600, color:"#666", width:"16%" }}>MP</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBuyback.length === 0
                    ? <tr><td colSpan={5} style={{ padding:24, textAlign:"center", color:"#999" }}>No cards found</td></tr>
                    : filteredBuyback.map((card, i) => (
                      <tr key={card.id} style={{ borderTop: i === 0 ? "none" : "1px solid #f0f0f0" }}>
                        <td style={{ padding:"10px 12px" }}>
                          <div style={{ fontWeight:600, color:"#111" }}>{card.name}</div>
                          <div style={{ display:"flex", gap:5, marginTop:3, alignItems:"center" }}>
                            <span style={{ fontSize:11, color:"#888" }}>{card.code}</span>
                            <Badge label={card.rarity} style={{ background: RARITY_STYLE[card.rarity]?.bg, color: RARITY_STYLE[card.rarity]?.color }} />
                          </div>
                        </td>
                        <td style={{ padding:"10px 8px", textAlign:"center", fontSize:12, color:"#666" }}>
                          {card.lang === "JP" ? "🇯🇵" : "🇺🇸"}
                        </td>
                        <td style={{ padding:"10px 8px", textAlign:"right", fontWeight:600, color:"#1a7a3c" }}>${card.nm}</td>
                        <td style={{ padding:"10px 8px", textAlign:"right", color:"#111" }}>${card.lp}</td>
                        <td style={{ padding:"10px 8px", textAlign:"right", color:"#888" }}>${card.mp}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>

            <p style={{ fontSize:11, color:"#999", marginTop:8, lineHeight:1.5 }}>
              * Prices are indicative. Final offer subject to in-store grading. Cards ≥$200 require staff verification.
            </p>

            <a href={whatsappLink("Hi! My card isn't on the buyback list. Can I get a quote?")}
              target="_blank" rel="noreferrer"
              style={{ display:"block", marginTop:10, padding:"10px", textAlign:"center", fontSize:13, fontWeight:600,
                background:"#25D366", color:"white", borderRadius:8, textDecoration:"none" }}>
              💬 My card isn't listed — WhatsApp for a quote
            </a>
          </div>
        )}

        {/* FOR SALE TAB */}
        {tab === "sale" && (
          <div>
            <p style={{ fontSize:13, color:"#666", margin:"0 0 12px", lineHeight:1.6 }}>
              All cards verified authentic and staff-graded. Reserve via WhatsApp. Prices in SGD.
            </p>
            <input type="text" placeholder="Search cards for sale…" value={saleSearch}
              onChange={e => setSaleSearch(e.target.value)}
              style={{ width:"100%", fontSize:13, padding:"8px 10px", border:"1px solid #ddd", borderRadius:6, marginBottom:14, boxSizing:"border-box", outline:"none" }} />

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(155px, 1fr))", gap:10 }}>
              {filteredSale.length === 0
                ? <div style={{ gridColumn:"1/-1", padding:24, textAlign:"center", color:"#999" }}>No cards found</div>
                : filteredSale.map(card => (
                  <div key={card.id} style={{ background:"white", border:"1px solid #e5e5e5", borderRadius:12, padding:"0.85rem", display:"flex", flexDirection:"column", gap:6 }}>
                    <div style={{ height:72, background:"#f5f5f5", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, color:"#888", fontWeight:500 }}>
                      {card.lang === "JP" ? "🇯🇵 JP" : "🇺🇸 EN"} · {card.set}
                    </div>
                    <div style={{ fontWeight:600, fontSize:13, color:"#111", lineHeight:1.3 }}>{card.name}</div>
                    <div style={{ fontSize:11, color:"#888" }}>{card.code}</div>
                    <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                      <Badge label={card.rarity} style={{ background: RARITY_STYLE[card.rarity]?.bg, color: RARITY_STYLE[card.rarity]?.color }} />
                      <Badge label={card.condition} style={COND_STYLE[card.condition]} />
                      {card.qty > 1 && <Badge label={`×${card.qty}`} style={{ background:"#e5e5e5", color:"#444" }} />}
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:2 }}>
                      <span style={{ fontSize:17, fontWeight:700, color:"#111" }}>${card.price}</span>
                      <span style={{ fontSize:11, color:"#888" }}>Qty: {card.qty}</span>
                    </div>
                    <a href={whatsappLink(`Hi! I'd like to reserve ${card.name} (${card.code}, ${card.condition}, ${card.lang}) at $${card.price}.`)}
                      target="_blank" rel="noreferrer"
                      style={{ display:"block", textAlign:"center", padding:"7px 0", fontSize:12, fontWeight:600, background:"#25D366", color:"white", borderRadius:6, textDecoration:"none", marginTop:2 }}>
                      💬 Reserve
                    </a>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* HOW IT WORKS TAB */}
        {tab === "howto" && (
          <div>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:15, fontWeight:600, color:"#111", marginBottom:10 }}>Selling your cards to us</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {[
                  { step:"01", title:"Check the buyback list", desc:"Find your card in the Buyback tab. We list NM, LP, and MP prices for all cards we're actively buying." },
                  { step:"02", title:"WhatsApp or walk in",    desc:"Message us your card name, condition, and quantity — or bring them to our Sembawang shop." },
                  { step:"03", title:"Owner grading & authentication", desc:"Every card is personally inspected by the owner for authenticity and graded to our standard. Our grading decision is final for all in-store trades." },
                  { step:"04", title:"Instant payment",        desc:"Paid via PayNow or cash on the spot. Cards ≥$200 may require a 24hr verification hold." },
                ].map((s, i) => (
                  <div key={i} style={{ display:"flex", gap:12, padding:"12px 14px", border:"1px solid #e5e5e5", borderRadius:8 }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:"#f0f0f0", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontWeight:700, fontSize:13, color:"#444" }}>
                      {s.step}
                    </div>
                    <div>
                      <div style={{ fontWeight:600, fontSize:13, color:"#111", marginBottom:3 }}>{s.title}</div>
                      <div style={{ fontSize:12, color:"#666", lineHeight:1.5 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:8, padding:"12px 14px", marginBottom:10 }}>
              <div style={{ fontWeight:600, fontSize:13, marginBottom:4, color:"#166534" }}>🛡️ Anti-scam guarantee</div>
              <div style={{ fontSize:12, color:"#166534", lineHeight:1.5 }}>
                All transactions are personally overseen by the owner. Counterfeit cards result in permanent ban. We follow a formal SOP — zero tolerance for misrepresentation.
              </div>
            </div>

            <div style={{ background:"#f9f9f9", borderRadius:8, padding:"12px 14px" }}>
              <div style={{ fontWeight:600, fontSize:13, marginBottom:8 }}>Condition guide</div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {[
                  ["NM","Near Mint","No visible play wear. Sleeved from pack."],
                  ["LP","Lightly Played","Minor edge/corner wear. No face scratches."],
                  ["MP","Mod. Played","Visible wear but fully playable. No creases."],
                  ["HP","Heavily Played","Significant wear. May affect playability."],
                  ["DMG","Damaged","Creases, tears, writing. Usually not purchased."],
                ].map(([c, label, desc]) => (
                  <div key={c} style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                    <Badge label={c} style={COND_STYLE[c] || { background:"#e5e5e5", color:"#444" }} />
                    <div>
                      <span style={{ fontSize:12, fontWeight:600, color:"#111" }}>{label} — </span>
                      <span style={{ fontSize:12, color:"#666" }}>{desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding:"1rem 0", display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid #e5e5e5", marginTop:14 }}>
        <span style={{ fontSize:12, color:"#888" }}>© 2025 Knock Twice TCG Pte Ltd</span>
        <span style={{ fontSize:12, color:"#888" }}>📍 Sembawang, Singapore</span>
      </div>
    </div>
  );
}
