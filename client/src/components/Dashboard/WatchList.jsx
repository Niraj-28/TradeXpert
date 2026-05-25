const stocks = [

  {
    symbol: "RELIANCE",
    price: "₹2,950",
    change: "+1.2%",
    positive: true,
  },

  {
    symbol: "TCS",
    price: "₹3,820",
    change: "+0.8%",
    positive: true,
  },

  {
    symbol: "HDFCBANK",
    price: "₹1,640",
    change: "-0.4%",
    positive: false,
  },

  {
    symbol: "INFY",
    price: "₹1,520",
    change: "+2.3%",
    positive: true,
  },

];


const WatchList = () => {

  return (

    <div className="bg-white rounded-xl p-5 border border-gray-200 h-full">

      {/* Header */}

      <div className="flex items-center justify-between mb-5">

        <h2 className="text-[20px] font-bold">

          Watchlist

        </h2>

        <button className="text-[#58E6B3] text-[13px] font-semibold">

          View All

        </button>

      </div>


      {/* Stocks */}

      <div className="space-y-2">

        {stocks.map((stock, index) => (

          <div
            key={index}
            className="flex items-center justify-between bg-[#F8FAFC] rounded-lg px-4 py-3"
          >

            <div>

              <h3 className="font-semibold text-[12px]">

                {stock.symbol}

              </h3>

              <p className="text-gray-500 text-[12px]">

                NSE

              </p>

            </div>


            <div className="text-right">

              <h3 className="font-semibold text-[14px]">

                {stock.price}

              </h3>

              <p
                className={`text-[12px] font-semibold ${
                  stock.positive
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >

                {stock.change}

              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
};

export default WatchList;