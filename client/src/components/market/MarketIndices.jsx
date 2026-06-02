import { useMarket } from "../../context/MarketContext";

const MarketIndices = () => {
  const { indices } = useMarket();

  const orderedNames = ["NIFTY 50", "SENSEX", "BANK NIFTY", "FIN NIFTY"];

  // Normalize and order the indices
  const cards = orderedNames.map((name) => {
    // Look for exact match first
    let found = indices?.find(
      (item) => item.name?.toUpperCase() === name
    );
    
    // Fallback search (e.g. NIFTY BANK / BANK NIFTY, NIFTY FIN SERVICE / FIN NIFTY)
    if (!found) {
      found = indices?.find((item) => {
        const itemUpper = item.name?.toUpperCase() || "";
        if (name === "BANK NIFTY" && (itemUpper === "NIFTY BANK" || itemUpper === "BANKNIFTY")) {
          return true;
        }
        if (name === "FIN NIFTY" && (itemUpper === "NIFTY FIN SERVICE" || itemUpper === "NIFTY FIN" || itemUpper === "FINNIFTY")) {
          return true;
        }
        return false;
      });
    }

    if (found) {
      return {
        name,
        value: found.value,
        change: found.change ?? 0,
      };
    }

    // Default values if not received yet
    const defaults = {
      "NIFTY 50": { value: "24,850.00", change: 1.25 },
      "SENSEX": { value: "81,240.00", change: 0.84 },
      "BANK NIFTY": { value: "52,100.00", change: -0.42 },
      "FIN NIFTY": { value: "23,150.00", change: 0.35 },
    };

    return {
      name,
      value: defaults[name]?.value ?? "—",
      change: defaults[name]?.change ?? 0,
    };
  });

  return (
    <div className="market-indices-grid">
      {cards.map((item, index) => {
        const change = typeof item.change === "number" ? item.change : parseFloat(item.change) || 0;
        const isPositive = change >= 0;

        // Clean value formatting
        let displayValue = item.value;
        if (typeof displayValue === "number") {
          displayValue = `₹${displayValue.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        } else if (typeof displayValue === "string") {
          // If it doesn't already start with ₹ and is a valid numeric string
          const cleanString = displayValue.replace(/[₹,]/g, "");
          const num = parseFloat(cleanString);
          if (!isNaN(num)) {
            displayValue = `₹${num.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          } else {
            // Keep original string but prefix with ₹ if not present
            if (displayValue !== "—" && !displayValue.startsWith("₹")) {
              displayValue = `₹${displayValue}`;
            }
          }
        }

        return (
          <div
            key={`${item.name}-${index}`}
            className={`market-index-card ${isPositive ? "pos-border" : "neg-border"}`}
          >
            <div className="index-header-row">
              <span className="index-title">{item.name}</span>
              <span className={`index-change-pill ${isPositive ? "positive" : "negative"}`}>
                {isPositive ? "+" : ""}{change.toFixed(2)}%
              </span>
            </div>
            <div className="index-price-val">{displayValue}</div>
          </div>
        );
      })}
    </div>
  );
};

export default MarketIndices;