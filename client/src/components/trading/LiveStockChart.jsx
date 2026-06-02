import {

  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,

} from "recharts";

const chartData = [

  {
    time: "09:15",
    price: 2910,
  },

  {
    time: "10:00",
    price: 2930,
  },

  {
    time: "11:00",
    price: 2920,
  },

  {
    time: "12:00",
    price: 2950,
  },

  {
    time: "01:00",
    price: 2970,
  },

  {
    time: "02:00",
    price: 2945,
  },

];

const LiveStockChart = () => {

  return (

    <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6">

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-2xl font-bold text-[#0F172A]">

            RELIANCE

          </h2>

          <p className="text-[#64748B] text-sm">

            Live Stock Chart

          </p>

        </div>

        <div>

          <h1 className="text-3xl font-bold text-[#0F172A]">

            ₹2945

          </h1>

        </div>

      </div>

      <div className="h-[320px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart data={chartData}>

            <defs>

              <linearGradient
                id="colorPrice"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="5%"
                  stopColor="#34D399"
                  stopOpacity={0.4}
                />

                <stop
                  offset="95%"
                  stopColor="#34D399"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <XAxis dataKey="time" />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="price"
              stroke="#34D399"
              fillOpacity={1}
              fill="url(#colorPrice)"
              strokeWidth={3}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

};

export default LiveStockChart;