import { useState } from "react";

type SectionKey = "premarket" | "entry" | "during" | "avoid";
type Rule = { id: number; text: string; tag: string };
type Rules = { [K in SectionKey]: Rule[] };
type CheckedState = { [key: string]: boolean };

const rules: Rules = {
  premarket: [
    { id: 1, text: "Check GIFT Nifty direction — Gap Up or Gap Down?", tag: "BIAS" },
    { id: 2, text: "Check Crude Oil price — Above $90 = bearish bias", tag: "MACRO" },
    { id: 3, text: "Check VIX — Above 20 = high volatility, reduce size mentally", tag: "RISK" },
    { id: 4, text: "Note today's key S/R levels before market opens", tag: "LEVELS" },
    { id: 5, text: "No trades before 9:30 AM — opening noise kills entries", tag: "TIME" },
  ],
  entry: [
    { id: 1, text: "Hull Suite flipped color? Wait for FULL candle close — no forming candles", tag: "HULL" },
    { id: 2, text: "Is BB Width (Bandwidth) EXPANDING vs 3 candles ago?", tag: "BBW ✅" },
    { id: 3, text: "If BBW is flat or contracting → SKIP this signal entirely", tag: "BBW ❌" },
    { id: 4, text: "Hull flipped GREEN → Note LOW of 1st green candle", tag: "CE" },
    { id: 5, text: "Hull flipped RED → Note HIGH of 1st red candle", tag: "PE" },
    { id: 6, text: "Place LIMIT order: Green flip → buy CE at 1st candle LOW + 5pts buffer", tag: "CE" },
    { id: 7, text: "Place LIMIT order: Red flip → buy PE at 1st candle HIGH - 5pts buffer", tag: "PE" },
    { id: 8, text: "Buy ATM strike only — no OTM gambling", tag: "STRIKE" },
    { id: 9, text: "If price never hits your limit on 2nd candle → DO NOT CHASE. Skip.", tag: "DISCIPLINE" },
  ],
  during: [
    { id: 1, text: "Hold position — no panic exits in between", tag: "HOLD" },
    { id: 2, text: "Watch BB Upper Band (CE) — if price touches it, EXIT immediately", tag: "BB EXIT" },
    { id: 3, text: "Watch BB Lower Band (PE) — if price touches it, EXIT immediately", tag: "BB EXIT" },
    { id: 4, text: "Hull flips opposite color? EXIT at next candle open — no second-guessing", tag: "HULL EXIT" },
    { id: 5, text: "Is it after 2:45 PM? No new entries. If in trade, exit by 3:09 PM sharp", tag: "TIME" },
    { id: 6, text: "No overnight holding — EVER. Exit before 3:15 PM no matter what", tag: "RULE" },
  ],
  avoid: [
    { id: 1, text: "Never enter on a Hull flip during BB squeeze (bands contracting)", tag: "❌" },
    { id: 2, text: "Never enter before 9:30 AM", tag: "❌" },
    { id: 3, text: "Never enter after 2:45 PM", tag: "❌" },
    { id: 4, text: "Never chase a missed entry — next signal will come", tag: "❌" },
    { id: 5, text: "Never hold overnight — gap risk will ruin your month", tag: "❌" },
    { id: 6, text: "Never increase lots after a winning streak — stay at 1 lot for 3 months", tag: "❌" },
    { id: 7, text: "Never trade on Hull flip if candle is still forming", tag: "❌" },
    { id: 8, text: "Never ignore BB band touch — it overrides everything", tag: "❌" },
  ],
};

const tagColors: { [key: string]: string } = {
  "BIAS": "#3b82f6", "MACRO": "#f59e0b", "RISK": "#ef4444", "LEVELS": "#8b5cf6",
  "TIME": "#06b6d4", "HULL": "#10b981", "BBW ✅": "#22c55e", "BBW ❌": "#ef4444",
  "CE": "#10b981", "PE": "#f43f5e", "STRIKE": "#8b5cf6", "DISCIPLINE": "#f59e0b",
  "HOLD": "#3b82f6", "BB EXIT": "#f97316", "HULL EXIT": "#ec4899", "RULE": "#ef4444",
  "❌": "#ef4444",
};

const sections: { key: SectionKey; label: string; subtitle: string; color: string }[] = [
  { key: "premarket", label: "☀️ Pre-Market Checklist", subtitle: "Before 9:15 AM", color: "#f59e0b" },
  { key: "entry", label: "🎯 Entry Rules", subtitle: "9:30 AM – 2:45 PM only", color: "#10b981" },
  { key: "during", label: "📊 In-Trade Rules", subtitle: "Once position is open", color: "#3b82f6" },
  { key: "avoid", label: "🚫 Never Break These", subtitle: "Hard rules — no exceptions", color: "#ef4444" },
];

export default function TradingRules() {
  const [checked, setChecked] = useState<CheckedState>({});
  const [activeSection, setActiveSection] = useState<SectionKey>("premarket");
  const [showFlow, setShowFlow] = useState(false);

  const toggle = (section: SectionKey, id: number) => {
    const key = `${section}-${id}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const clearSection = (section: SectionKey) => {
    const newChecked = { ...checked };
    rules[section].forEach((r: Rule) => delete newChecked[`${section}-${r.id}`]);
    setChecked(newChecked);
  };

  const checkedCount = (section: SectionKey) => rules[section].filter((r: Rule) => checked[`${section}-${r.id}`]).length;

  const currentSection = sections.find(s => s.key === activeSection);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#ffffff",
      fontFamily: "'Courier New', monospace",
      color: "#000000",
      padding: "0",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
        borderBottom: "1px solid #e5e7eb",
        padding: "20px 24px",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, color: "#1e40af", letterSpacing: 4, textTransform: "uppercase", marginBottom: 4 }}>
                NIFTY 50 · ATM OPTIONS
              </div>
              <div style={{ fontSize: 22, fontWeight: "bold", color: "#000000", letterSpacing: 1 }}>
                TRADE RULES v1.0
              </div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                Hull Suite + BB(20,3) + BBW Filter
              </div>
            </div>
            <button
              onClick={() => setShowFlow(!showFlow)}
              style={{
                background: showFlow ? "#3b82f6" : "transparent",
                border: "1px solid #3b82f6",
                color: showFlow ? "#ffffff" : "#3b82f6",
                padding: "8px 16px",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 12,
                letterSpacing: 1,
              }}
            >
              {showFlow ? "CHECKLIST" : "DECISION FLOW"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px", flex: 1 }}>

        {/* Decision Flow View */}
        {showFlow ? (
          <div>
            <div style={{ fontSize: 13, color: "#374151", marginBottom: 20, textAlign: "center" }}>
              Follow this EXACT sequence before every trade
            </div>
            {[
              { step: "01", q: "Is it between 9:30 AM – 2:45 PM?", yes: "Proceed →", no: "❌ No Trade", color: "#06b6d4" },
              { step: "02", q: "Did Hull Suite fully close a NEW color candle?", yes: "Proceed →", no: "❌ Wait for close", color: "#8b5cf6" },
              { step: "03", q: "Is BB Width EXPANDING vs 3 candles ago?", yes: "Proceed →", no: "❌ Skip Signal", color: "#10b981" },
              { step: "04", q: "Hull = GREEN? → CE trade. Hull = RED? → PE trade", yes: "Proceed →", no: "", color: "#f59e0b" },
              { step: "05", q: "Note 1st candle LOW (CE) or HIGH (PE)", yes: "Proceed →", no: "", color: "#3b82f6" },
              { step: "06", q: "Place LIMIT order at that level ± 5pts on 2nd candle", yes: "Proceed →", no: "", color: "#6366f1" },
              { step: "07", q: "Got filled? → Hold. NOT filled in 2nd candle?", yes: "Hold trade", no: "❌ Skip. No chase.", color: "#ec4899" },
              { step: "08", q: "In trade: BB band touched OR Hull flipped opposite?", yes: "✅ EXIT NOW", no: "Hold →", color: "#ef4444" },
              { step: "09", q: "Is time past 3:15 PM?", yes: "✅ EXIT ALWAYS", no: "Continue holding", color: "#f97316" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, marginBottom: 8 }}>
                <div style={{
                  minWidth: 40, height: 40, borderRadius: "50%",
                  background: item.color + "22", border: `1px solid ${item.color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, color: item.color, fontWeight: "bold",
                }}>
                  {item.step}
                </div>
                <div style={{
                  flex: 1, background: "#f9fafb", border: "1px solid #e5e7eb",
                  borderLeft: `3px solid ${item.color}`,
                  borderRadius: 8, padding: "12px 16px",
                }}>
                  <div style={{ fontSize: 13, color: "#000000", marginBottom: item.yes ? 8 : 0 }}>{item.q}</div>
                  {item.yes && (
                    <div style={{ display: "flex", gap: 12 }}>
                      <span style={{ fontSize: 11, color: "#22c55e", background: "#dcfce7", padding: "2px 8px", borderRadius: 4 }}>
                        YES → {item.yes}
                      </span>
                      {item.no && (
                        <span style={{ fontSize: 11, color: "#ef4444", background: "#fef2f2", padding: "2px 8px", borderRadius: 4 }}>
                          NO → {item.no}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Section Tabs */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
              {sections.map(s => (
                <button key={s.key} onClick={() => setActiveSection(s.key)} style={{
                  background: activeSection === s.key ? s.color + "22" : "#f9fafb",
                  border: `1px solid ${activeSection === s.key ? s.color : "#e5e7eb"}`,
                  borderRadius: 8, padding: "12px", cursor: "pointer", textAlign: "left",
                  transition: "all 0.2s",
                }}>
                  <div style={{ fontSize: 13, color: activeSection === s.key ? s.color : "#374151", fontWeight: "bold" }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>{s.subtitle}</div>
                  <div style={{ fontSize: 10, color: s.color, marginTop: 4 }}>
                    {checkedCount(s.key)}/{rules[s.key].length} done
                  </div>
                </button>
              ))}
            </div>

            {/* Progress Bar */}
            <div style={{ background: "#e5e7eb", borderRadius: 4, height: 4, marginBottom: 20 }}>
              <div style={{
                background: currentSection?.color,
                height: 4, borderRadius: 4,
                width: `${(checkedCount(activeSection) / rules[activeSection].length) * 100}%`,
                transition: "width 0.3s",
              }} />
            </div>

            {/* Rules List */}
            <div style={{ marginBottom: 16 }}>
              {rules[activeSection].map((rule: Rule) => {
                const key = `${activeSection}-${rule.id}`;
                const done = checked[key];
                return (
                  <div
                    key={rule.id}
                    onClick={() => toggle(activeSection, rule.id)}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 12,
                      padding: "14px 16px", marginBottom: 6, borderRadius: 8, cursor: "pointer",
                      background: done ? "#dcfce7" : "#ffffff",
                      border: `1px solid ${done ? "#16a34a" : "#e5e7eb"}`,
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{
                      minWidth: 20, height: 20, borderRadius: 4,
                      border: `1px solid ${done ? "#22c55e" : "#d1d5db"}`,
                      background: done ? "#22c55e" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginTop: 1,
                    }}>
                      {done && <span style={{ color: "#ffffff", fontSize: 12, fontWeight: "bold" }}>✓</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: done ? "#6b7280" : "#000000", textDecoration: done ? "line-through" : "none" }}>
                        {rule.text}
                      </div>
                    </div>
                    <div style={{
                      fontSize: 9, padding: "2px 7px", borderRadius: 4, letterSpacing: 1,
                      background: (tagColors[rule.tag] || "#f3f4f6") + "22",
                      color: tagColors[rule.tag] || "#374151",
                      border: `1px solid ${(tagColors[rule.tag] || "#d1d5db")}44`,
                      whiteSpace: "nowrap", marginTop: 2,
                    }}>
                      {rule.tag}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Clear Button */}
            <button onClick={() => clearSection(activeSection)} style={{
              background: "transparent", border: "1px solid #e5e7eb",
              color: "#6b7280", padding: "8px 16px", borderRadius: 6,
              cursor: "pointer", fontSize: 11, width: "100%",
            }}>
              RESET SECTION CHECKBOXES
            </button>
          </>
        )}

        {/* Footer */}
        <div style={{
          marginTop: 32, padding: 16, borderRadius: 8,
          background: "#f9fafb", border: "1px solid #e5e7eb", textAlign: "center",
        }}>
          <div style={{ fontSize: 10, color: "#6b7280", letterSpacing: 2 }}>GOLDEN RULE</div>
          <div style={{ fontSize: 14, color: "#f59e0b", marginTop: 8 }}>
            "No signal = No trade. Boring days protect your capital."
          </div>
          <div style={{ fontSize: 10, color: "#6b7280", marginTop: 8 }}>
            Not SEBI advice · For personal reference only
          </div>
        </div>

        {/* Owner Text */}
        <div style={{
          marginTop: 20, textAlign: "center", fontSize: 12, color: "#9ca3af",
          paddingBottom: 20,
        }}>
          Owner: Vinay Kudali
        </div>
      </div>
    </div>
  );
}
