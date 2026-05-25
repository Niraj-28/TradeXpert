const PortfolioCard = () => {

  return (

    <div className="bg-white rounded-xl p-5 border border-gray-200 h-full">

      {/* Top */}

      <div className="flex items-start justify-between mb-5">

        <div>

          <p className="text-gray-500 text-[12px]">

            Portfolio Value

          </p>

          <h1 className="text-[25px] font-bold mt-1 leading-none">

            ₹4,25,320

          </h1>

        </div>

        <div className="bg-green-100 text-green-600 px-3 py-2 rounded-lg text-[13px] font-semibold">

          +12.4%

        </div>

      </div>


      {/* Stats */}

      <div className="grid grid-cols-3 gap-3">

        <div className="bg-[#F8FAFC] rounded-lg p-3">

          <p className="text-gray-500 text-[12px] mb-1">

            Invested

          </p>

          <h3 className="text-[15px] font-bold">

            ₹3,80,000

          </h3>

        </div>


        <div className="bg-[#F8FAFC] rounded-lg p-3">

          <p className="text-gray-500 text-[12px] mb-1">

            Profit

          </p>

          <h3 className="text-[15px] font-bold text-green-500">

            ₹45,320

          </h3>

        </div>


        <div className="bg-[#F8FAFC] rounded-lg p-3">

          <p className="text-gray-500 text-[12px] mb-1">

            Holdings

          </p>

          <h3 className="text-[15px] font-bold">

            12 Stocks

          </h3>

        </div>

      </div>

    </div>

  );
};

export default PortfolioCard;