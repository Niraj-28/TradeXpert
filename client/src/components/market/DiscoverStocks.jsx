import { useState } from "react";
import { searchStocks } from "../../services/marketApi";
import { addToWatchlist } from "../../services/watchlistService";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Search, Plus, Check, RefreshCw, X, TrendingUp } from "lucide-react";
import StockLogo from "../ui/StockLogo";

const DiscoverStocks = ({ onTrade }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addedSymbols, setAddedSymbols] = useState(new Set());
  const { user } = useAuth();

  const handleSearch = async (val) => {
    setQuery(val);

    if (!val.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const data = await searchStocks(val);
      setResults(data || []);
    } catch (error) {
      console.error("Search instruments error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWatchlist = async (symbol) => {
    if (!user) {
      toast.error("Please sign in to add stocks to your watchlist");
      return;
    }
    try {
      await addToWatchlist(symbol.toUpperCase());
      toast.success(`${symbol} added to watchlist`);
      setAddedSymbols((prev) => new Set([...prev, symbol.toUpperCase()]));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to watchlist");
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <div className="discover-search-container">
      <div className="discover-search-wrapper">
        <Search size={18} className="discover-search-icon" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search 100,000+ NSE/BSE stocks by symbol or company name..."
          className="discover-search-input"
        />
        {query && (
          <button onClick={clearSearch} className="discover-clear-btn">
            <X size={16} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {query && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="discover-search-dropdown"
          >
            {loading ? (
              <div className="discover-dropdown-loading">
                <RefreshCw className="animate-spin text-[#37c98b]" size={18} />
                <span>Searching markets...</span>
              </div>
            ) : results.length > 0 ? (
              results.map((stock) => {
                const isAdded = addedSymbols.has(stock.trading_symbol.toUpperCase());
                
                // Estimate a price based on name hashing for search results
                let hash = 0;
                for (let i = 0; i < stock.trading_symbol.length; i++) {
                  hash = stock.trading_symbol.charCodeAt(i) + ((hash << 5) - hash);
                }
                const estimatedPrice = parseFloat((Math.abs(hash % 2900) + 100).toFixed(2));

                return (
                  <div key={stock.instrument_key} className="discover-result-item">
                     <div 
                      className="discover-result-left"
                      onClick={() => onTrade({
                        symbol: stock.trading_symbol,
                        name: stock.name || stock.trading_symbol,
                        price: estimatedPrice,
                      })}
                      style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
                    >
                      <StockLogo symbol={stock.trading_symbol} size={28} />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span className="discover-result-symbol">{stock.trading_symbol}</span>
                          <span className="discover-result-exchange" style={{ fontSize: "10px", padding: "1px 4px", background: "#f1f5f9", borderRadius: "4px", color: "#64748b", fontWeight: "600" }}>{stock.exchange}</span>
                        </div>
                        <span className="discover-result-name" style={{ fontSize: "11px", color: "#64748b", marginTop: "1px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "180px" }}>
                          {stock.name || "Equity Stock"}
                        </span>
                      </div>
                    </div>

                    <div className="discover-result-actions">
                      {/* Trade Quick Button */}
                      <button
                        onClick={() => onTrade({
                          symbol: stock.trading_symbol,
                          name: stock.name || stock.trading_symbol,
                          price: estimatedPrice,
                        })}
                        className="discover-btn-trade"
                        title="Trade Stock"
                      >
                        <TrendingUp size={12} className="inline mr-1" />
                        Trade
                      </button>

                      {/* Add to Watchlist Button */}
                      <button
                        onClick={() => handleAddWatchlist(stock.trading_symbol)}
                        disabled={isAdded}
                        className={`discover-btn-add ${isAdded ? "added" : ""}`}
                        title="Add to Watchlist"
                      >
                        {isAdded ? <Check size={12} /> : <Plus size={12} />}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="discover-dropdown-empty">
                <span>No stocks found for "{query}"</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiscoverStocks;