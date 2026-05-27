import {

  useState,

} from "react";

import {

  Search,
  Plus,

} from "lucide-react";

import {

  addToWatchlist,

} from "../../services/watchlistService";

const stocks = [

  "RELIANCE",
  "TCS",
  "INFY",
  "HDFCBANK",
  "ICICIBANK",
  "SBIN",
  "AXISBANK",
  "WIPRO",
  "LT",
  "ITC",

];

const AddWatchlist = ({

  onAdded,

}) => {

  const [query, setQuery] =
    useState("");

  const filteredStocks =
    stocks.filter((stock) =>

      stock
        .toLowerCase()
        .includes(
          query.toLowerCase()
        )

    );

  const handleAdd =
    async (symbol) => {

      try {

        await addToWatchlist(
          symbol
        );

        setQuery("");

        if (onAdded) {

          onAdded();

        }

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <div className="bg-white border border-[#E8ECF2] rounded-[20px] p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">

      {/* HEADER */}

      <div className="mb-4">

        <h2 className="text-[16px] font-bold text-[#0F172A]">

          Add Watchlist

        </h2>

        <p className="text-[11px] text-[#64748B] mt-1">

          Search and track stocks

        </p>

      </div>

      {/* SEARCH */}

      <div className="relative">

        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]"
        />

        <input
          type="text"
          placeholder="Search stock..."
          value={query}
          onChange={(e) =>
            setQuery(
              e.target.value
            )
          }
          className="w-full h-11 pl-10 pr-4 rounded-2xl border border-[#E8ECF2] outline-none focus:border-[#10B981] text-[14px]"
        />

      </div>

      {/* RESULTS */}

      {query && (

        <div className="mt-4 space-y-2">

          {filteredStocks.map(
            (stock) => (

              <div
                key={stock}
                className="flex items-center justify-between border border-[#EEF2F7] rounded-2xl px-3 py-3"
              >

                <div>

                  <h3 className="text-[14px] font-semibold text-[#0F172A]">

                    {stock}

                  </h3>

                  <p className="text-[11px] text-[#64748B] mt-1">

                    NSE Market

                  </p>

                </div>

                <button
                  onClick={() =>
                    handleAdd(
                      stock
                    )
                  }
                  className="w-9 h-9 rounded-xl bg-[#10B981] flex items-center justify-center hover:opacity-90 transition-all"
                >

                  <Plus
                    size={16}
                    className="text-white"
                  />

                </button>

              </div>

            )
          )}

        </div>

      )}

    </div>

  );

};

export default AddWatchlist;