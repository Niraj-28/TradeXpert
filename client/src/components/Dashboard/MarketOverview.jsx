import {

  TrendingUp,
  TrendingDown,

} from "lucide-react";

const MarketOverview = () => {

  const indices = [

    {

      name: "NIFTY 50",

      value: "24,850.25",

      change: "+152.40",

      percent: "+0.61%",

      positive: true,

    },

    {

      name: "SENSEX",

      value: "81,320.45",

      change: "+410.15",

      percent: "+0.51%",

      positive: true,

    },

    {

      name: "BANKNIFTY",

      value: "52,610.20",

      change: "-120.55",

      percent: "-0.22%",

      positive: false,

    },

  ];

  return (

    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-5 mt-5">

      {indices.map((item, index) => (

        <div
          key={index}
          className="relative overflow-hidden bg-white border border-[#E2E8F0] rounded-[30px] p-6 shadow-sm"
        >

          {/* TOP GLOW */}

          <div
            className={`absolute top-0 left-0 w-full h-1 ${
              item.positive

                ? "bg-gradient-to-r from-green-400 to-emerald-500"

                : "bg-gradient-to-r from-red-400 to-rose-500"

            }`}
          ></div>

          {/* HEADER */}

          <div className="flex items-center justify-between mb-2">

            <div>

              <p className="text-xs text-[#64748B] font-medium">

                Market Index

              </p>

              <h2 className="text-sm font-bold text-[#0F172A] mt-1">

                {item.name}

              </h2>

            </div>

            <div
              className={`w-8 h-8 rounded-2xl flex items-center justify-center ${
                item.positive

                  ? "bg-green-100"

                  : "bg-red-100"

              }`}
            >

              {item.positive ? (

                <TrendingUp
                  className="text-green-600"
                  size={15}
                />

              ) : (

                <TrendingDown
                  className="text-red-600"
                  size={15}
                />

              )}

            </div>

          </div>

          {/* VALUE */}

          <h1 className="text-xl font-bold text-[#0F172A] mb-2">

            {item.value}

          </h1>

          {/* CHANGE */}

          <div
            className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-xl text-[10px] font-semibold ${
              item.positive

                ? "bg-green-100 text-green-700"

                : "bg-red-100 text-red-700"

            }`}
          >

            {item.change}

            <span>

              ({item.percent})

            </span>

          </div>

          MARKET STATUS

          {/* <div className="mt-6 flex items-center gap-2">

            <div
              className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                item.positive

                  ? "bg-green-500"

                  : "bg-red-500"

              }`}
            ></div>

            <p className="text-sm text-[#64748B]">

              Live Market

            </p>

          </div> */}

        </div>

      ))}

    </div>

  );

};

export default MarketOverview;