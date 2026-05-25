const gainers = [

  {
    symbol: "ADANIPORTS",
    change: "+5.2%",
  },

  {
    symbol: "SBIN",
    change: "+4.8%",
  },

  {
    symbol: "BAJFINANCE",
    change: "+3.9%",
  },

];


const losers = [

  {
    symbol: "WIPRO",
    change: "-2.1%",
  },

  {
    symbol: "ASIANPAINT",
    change: "-1.8%",
  },

  {
    symbol: "TECHM",
    change: "-1.4%",
  },

];


const MarketMovers = () => {

  return (

    <div className="grid grid-cols-2 gap-5">

      {/* Gainers */}

      <div className="bg-white rounded-xl p-5 border border-gray-200">

        <h2 className="text-[18px] font-bold mb-4">

          Top Gainers

        </h2>

        <div className="space-y-3">

          {gainers.map((stock, index) => (

            <div
              key={index}
              className="flex items-center justify-between bg-[#F8FAFC] rounded-lg px-4 py-3"
            >

              <p className="font-semibold text-[14px]">

                {stock.symbol}

              </p>

              <p className="text-green-500 font-semibold text-[13px]">

                {stock.change}

              </p>

            </div>

          ))}

        </div>

      </div>


      {/* Losers */}

      <div className="bg-white rounded-xl p-5 border border-gray-200">

        <h2 className="text-[18px] font-bold mb-4">

          Top Losers

        </h2>

        <div className="space-y-3">

          {losers.map((stock, index) => (

            <div
              key={index}
              className="flex items-center justify-between bg-[#F8FAFC] rounded-lg px-4 py-3"
            >

              <p className="font-semibold text-[14px]">

                {stock.symbol}

              </p>

              <p className="text-red-500 font-semibold text-[13px]">

                {stock.change}

              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
};

export default MarketMovers;