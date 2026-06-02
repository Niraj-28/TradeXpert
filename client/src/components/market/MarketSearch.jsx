import { useState } from "react";

import {
  searchStocks,
} from "../../services/marketApi";

const MarketSearch = () => {
  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState([]);

  const handleSearch = async (
    value
  ) => {
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    try {
      const data =
        await searchStocks(value);

      setResults(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) =>
          handleSearch(e.target.value)
        }
        placeholder="Search NSE/BSE Stocks..."
        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-zinc-600"
      />

      {results.length > 0 && (
        <div className="absolute top-16 left-0 w-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden z-50 shadow-2xl">
          {results.map((stock) => (
            <div
              key={
                stock.instrument_key
              }
              className="px-5 py-4 hover:bg-zinc-800 transition-all border-b border-zinc-800 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">
                    {
                      stock.trading_symbol
                    }
                  </div>

                  <div className="text-sm text-zinc-400 mt-1">
                    {stock.name}
                  </div>
                </div>

                <div className="text-xs text-zinc-500">
                  {
                    stock.exchange
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketSearch;