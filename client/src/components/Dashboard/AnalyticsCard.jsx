const AnalyticsCard = () => {

  return (

    <div className="bg-white rounded-xl p-5 border border-gray-200 h-full">

      <h2 className="text-[20px] font-bold mb-5">

        Analytics

      </h2>


      <div className="space-y-4">

        {/* ROI */}

        <div className="bg-[#F8FAFC] rounded-lg p-4">

          <div className="flex items-center justify-between mb-2">

            <p className="text-gray-500 text-[13px]">

              ROI

            </p>

            <p className="text-green-500 text-[13px] font-semibold">

              +18.4%

            </p>

          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">

            <div className="bg-[#58E6B3] h-2 rounded-full w-[75%]"></div>

          </div>

        </div>


        {/* Risk */}

        <div className="bg-[#F8FAFC] rounded-lg p-4">

          <div className="flex items-center justify-between mb-2">

            <p className="text-gray-500 text-[13px]">

              Risk Level

            </p>

            <p className="text-yellow-500 text-[13px] font-semibold">

              Medium

            </p>

          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">

            <div className="bg-yellow-400 h-2 rounded-full w-[55%]"></div>

          </div>

        </div>


        {/* Diversification */}

        <div className="bg-[#F8FAFC] rounded-lg p-4">

          <div className="flex items-center justify-between mb-2">

            <p className="text-gray-500 text-[13px]">

              Diversification

            </p>

            <p className="text-blue-500 text-[13px] font-semibold">

              Good

            </p>

          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">

            <div className="bg-blue-400 h-2 rounded-full w-[82%]"></div>

          </div>

        </div>

      </div>

    </div>

  );
};

export default AnalyticsCard;