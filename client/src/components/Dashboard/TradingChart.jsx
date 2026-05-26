import {

  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,

} from "recharts";

const data = [

  {
    day: "Mon",
    value: 12000,
  },

  {
    day: "Tue",
    value: 14500,
  },

  {
    day: "Wed",
    value: 13200,
  },

  {
    day: "Thu",
    value: 16800,
  },

  {
    day: "Fri",
    value: 19200,
  },

  {
    day: "Sat",
    value: 17500,
  },

  {
    day: "Sun",
    value: 22400,
  },

];

const TradingChart = () => {

  return (

    <div className="bg-white border border-[#E2E8F0] rounded-[30px] p-6 shadow-sm mt-5">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-5">

        <div>

          <h2 className="text-lg font-bold text-[#0F172A] mt-1">

            Portfolio Growth

          </h2>

        </div>

        {/* TIME FILTERS */}

        <div className="flex items-center gap-3 flex-wrap">

          <button className="px-2.5 py-1 rounded-xl bg-[#58E6B3] text-[#0F172A] text-xs font-semibold">

            1D

          </button>

          <button className="px-2.5 py-1 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] transition-all text-[#0F172A] text-xs font-semibold">

            1W

          </button>

          <button className="px-2.5 py-1 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] transition-all text-[#0F172A] text-xs font-semibold">

            1M

          </button>

          <button className="px-2.5 py-1 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] transition-all text-[#0F172A] text-xs font-semibold">

            1Y

          </button>

        </div>

      </div>

      {/* STATS */}

      <div className="flex flex-col md:flex-row md:items-center gap-8 mb-5">

        <div>

          <p className="text-sm text-[#64748B]">

            Total Portfolio Value

          </p>

          <h1 className="text-xl font-bold text-[#0F172A] mt-1">

            ₹22,400

          </h1>

        </div>

        <div>

          <p className="text-sm text-[#64748B]">

            Today's Profit

          </p>

          <h2 className="text-xl font-bold text-green-600 mt-1">

            +₹2,420 (+4.8%)

          </h2>

        </div>

      </div>

      {/* CHART */}

      <div className="w-full h-[250px] text-xs">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart data={data}>

            <defs>

              <linearGradient
                id="colorValue"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="5%"
                  stopColor="#58E6B3"
                  stopOpacity={0.4}
                />

                <stop
                  offset="95%"
                  stopColor="#58E6B3"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#58E6B3"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorValue)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

};

export default TradingChart;