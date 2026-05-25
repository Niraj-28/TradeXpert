const stocks = [

  {
    symbol: "RELIANCE",
    company: "Reliance Industries",
    price: "₹2,950",
    change: "+1.2%",
    positive: true,
  },

  {
    symbol: "TCS",
    company: "Tata Consultancy",
    price: "₹3,820",
    change: "+0.8%",
    positive: true,
  },

  {
    symbol: "INFY",
    company: "Infosys Ltd",
    price: "₹1,520",
    change: "+2.3%",
    positive: true,
  },

  {
    symbol: "HDFCBANK",
    company: "HDFC Bank",
    price: "₹1,640",
    change: "-0.4%",
    positive: false,
  },

  {
    symbol: "ICICIBANK",
    company: "ICICI Bank",
    price: "₹1,210",
    change: "+1.8%",
    positive: true,
  },

];


const TrendingStocks = () => {

  return (

    <div className="bg-white rounded-xl p-5 border border-gray-200">

      {/* Header */}

      <div className="flex items-center justify-between mb-5">

        <div>

          <h2 className="text-[20px] font-bold">

            Trending Stocks

          </h2>

          <p className="text-gray-500 text-[13px] mt-1">

            Most active stocks today

          </p>

        </div>


        {/* Search */}

        <input
          type="text"
          placeholder="Search stock..."
          className="bg-[#F8FAFC] border border-gray-200 rounded-lg px-4 py-2 text-[14px] outline-none w-[220px]"
        />

      </div>


      {/* Table */}

      <div className="space-y-2">

        {stocks.map((stock, index) => (

          <div
            key={index}
            className="grid grid-cols-4 items-center bg-[#F8FAFC] rounded-lg px-4 py-3"
          >

            {/* Company */}

            <div>

              <h3 className="font-semibold text-[14px]">

                {stock.symbol}

              </h3>

              <p className="text-gray-500 text-[12px]">

                {stock.company}

              </p>

            </div>


            {/* Price */}

            <div className="text-center">

              <p className="font-semibold text-[14px]">

                {stock.price}

              </p>

            </div>


            {/* Change */}

            <div className="text-center">

              <p
                className={`font-semibold text-[13px] ${
                  stock.positive
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >

                {stock.change}

              </p>

            </div>


            {/* Action */}

            <div className="flex justify-end">

              <button className="bg-[#58E6B3] px-4 py-2 rounded-lg text-[13px] font-semibold hover:opacity-90 transition-all">

                Buy

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
};

export default TrendingStocks;