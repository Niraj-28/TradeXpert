const stocks = [

  {
    symbol: "RELIANCE",
    price: "₹2,985",
    change: "+2.45%",
    positive: true,
  },

  {
    symbol: "TCS",
    price: "₹3,850",
    change: "-0.92%",
    positive: false,
  },

  {
    symbol: "INFY",
    price: "₹1,620",
    change: "+1.82%",
    positive: true,
  },

  {
    symbol: "HDFCBANK",
    price: "₹1,785",
    change: "+3.11%",
    positive: true,
  },

  {
    symbol: "SBIN",
    price: "₹812",
    change: "-1.25%",
    positive: false,
  },

];

const LiveMarket = () => {

  return (

    <div className="bg-[#081028] rounded-[18px] py-3 px-5 overflow-hidden">

      <div className="flex items-center gap-10 whitespace-nowrap overflow-x-auto scrollbar-hide">

        {/* LIVE */}

        <div className="flex items-center gap-3 bg-[#0F1A3A] px-5 py-2 rounded-2xl flex-shrink-0">

          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>

          <span className="text-white font-semibold text-sm">

            LIVE

          </span>

        </div>

        {/* STOCKS */}

        {stocks.map((stock, index) => (

          <div
            key={index}
            className="flex items-center gap-4 flex-shrink-0"
          >

            <h3 className="text-white font-bold text-lg">

              {stock.symbol}

            </h3>

            <p className="text-white text-lg">

              {stock.price}

            </p>

            <span
              className={`font-bold text-lg ${
                stock.positive

                  ? "text-[#00E676]"

                  : "text-[#FF5252]"
              }`}
            >

              {stock.change}

            </span>

          </div>

        ))}

      </div>

    </div>

  );

};

export default LiveMarket;