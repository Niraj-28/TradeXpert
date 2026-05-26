import {

  TrendingUp,

} from "lucide-react";

const marketData = [

  {

    name: "NIFTY 50",

    value: "24,850.25",

    change: "+152.40",

    percent: "+0.61%",

  },

  {

    name: "SENSEX",

    value: "81,320.45",

    change: "+410.15",

    percent: "+0.51%",

  },

  {

    name: "BANK NIFTY",

    value: "52,145.80",

    change: "-210.40",

    percent: "-0.40%",

  },

];

const MarketCards = () => {

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

      {marketData.map((market, index) => {

        const positive =

          market.change.includes("+");

        return (

          <div
            key={index}
            className="bg-white border border-[#E2E8F0] rounded-[22px] p-5 shadow-sm"
          >

            {/* TOP */}

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm text-[#64748B]">

                  Market Index

                </p>

                <h2 className="text-2xl font-bold text-[#0F172A] mt-1">

                  {market.name}

                </h2>

              </div>

              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  positive

                    ? "bg-[#DCFCE7]"

                    : "bg-[#FEE2E2]"
                }`}
              >

                <TrendingUp
                  size={26}
                  className={
                    positive

                      ? "text-green-600"

                      : "text-red-600"
                  }
                />

              </div>

            </div>

            {/* VALUE */}

            <h1 className="text-3xl font-bold text-[#0F172A] mt-8">

              {market.value}

            </h1>

            {/* CHANGE */}

            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl mt-5 text-sm font-semibold ${
                positive

                  ? "bg-green-100 text-green-700"

                  : "bg-red-100 text-red-700"
              }`}
            >

              {market.change}

              ({market.percent})

            </div>

            {/* FOOTER */}

            <div className="flex items-center gap-2 mt-6">

              <div className="w-3 h-3 rounded-full bg-green-500"></div>

              <span className="text-[#64748B] text-sm">

                Live Market

              </span>

            </div>

          </div>

        );

      })}

    </div>

  );

};

export default MarketCards;