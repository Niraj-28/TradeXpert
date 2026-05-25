import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  Tooltip,
} from "recharts";


const data = [

  {
    day: "Mon",
    value: 380000,
  },

  {
    day: "Tue",
    value: 392000,
  },

  {
    day: "Wed",
    value: 401000,
  },

  {
    day: "Thu",
    value: 398000,
  },

  {
    day: "Fri",
    value: 425320,
  },

];


const PortfolioChart = () => {

  return (

    <div className="bg-white rounded-xl p-5 border border-gray-200">

      {/* Header */}

      <div className="mb-5">

        <h2 className="text-[20px] font-bold">

          Portfolio Analytics

        </h2>

        <p className="text-gray-500 text-[13px] mt-1">

          Weekly portfolio performance

        </p>

      </div>


      {/* Chart */}

      <div className="h-[280px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart data={data}>

            <XAxis
              dataKey="day"
              tick={{
                fontSize: 12,
              }}
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#58E6B3"
              fill="#58E6B3"
              fillOpacity={0.15}
              strokeWidth={3}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>

  );
};

export default PortfolioChart;