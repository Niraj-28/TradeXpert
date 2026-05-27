import {

  TrendingUp,
  TrendingDown,

} from "lucide-react";

const MarketIndices = ({

  marketData = [],

}) => {

  const indices = [

    {

      name: "NIFTY 50",

      value: "24,850.25",

      change: "+152.40",

      percent: "+0.61",

      positive: true,

    },

    {

      name: "SENSEX",

      value: "81,320.45",

      change: "+410.15",

      percent: "+0.51",

      positive: true,

    },

    {

      name: "BANKNIFTY",

      value: "52,610.20",

      change: "-120.55",

      percent: "-0.22",

      positive: false,

    },

    {

      name: "FINNIFTY",

      value: "24,145.80",

      change: "+85.30",

      percent: "+0.35",

      positive: true,

    },

  ];

  return (

    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

      {indices.map(

        (index) => (

          <div
            key={index.name}
            className="relative overflow-hidden bg-white rounded-[28px] border border-[#E8ECF2] p-5 shadow-[0_4px_18px_rgba(15,23,42,0.05)]"
          >

            {/* TOP BORDER */}

            <div
              className={`absolute top-0 left-0 w-full h-1 ${
                index.positive

                  ? "bg-green-500"

                  : "bg-red-500"
              }`}
            />

            {/* HEADER */}

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[12px] font-medium text-[#64748B]">

                  Market Index

                </p>

                <h2 className="mt-2 text-[28px] font-bold tracking-tight text-[#0F172A]">

                  {index.name}

                </h2>

              </div>

              <div
                className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
                  index.positive

                    ? "bg-green-100 text-green-600"

                    : "bg-red-100 text-red-600"
                }`}
              >

                {index.positive ? (

                  <TrendingUp
                    size={24}
                  />

                ) : (

                  <TrendingDown
                    size={24}
                  />

                )}

              </div>

            </div>

            {/* VALUE */}

            <div className="mt-8">

              <h1 className="text-[42px] font-bold tracking-tight text-[#0F172A]">

                {index.value}

              </h1>

            </div>

            {/* CHANGE */}

            <div className="mt-5 flex items-center gap-3">

              <div
                className={`px-4 py-2 rounded-2xl text-[14px] font-bold ${
                  index.positive

                    ? "bg-green-100 text-green-700"

                    : "bg-red-100 text-red-700"
                }`}
              >

                {index.change}

              </div>

              <div
                className={`text-[16px] font-bold ${
                  index.positive

                    ? "text-green-600"

                    : "text-red-600"
                }`}
              >

                ({index.percent}%)

              </div>

            </div>

            {/* STATUS */}

            <div className="mt-6 flex items-center gap-2">

              <div
                className={`h-2 w-2 rounded-full ${
                  index.positive

                    ? "bg-green-500"

                    : "bg-red-500"
                }`}
              />

              <p className="text-[12px] font-medium text-[#64748B]">

                Market Open

              </p>

            </div>

          </div>

        )

      )}

    </section>

  );

};

export default MarketIndices;