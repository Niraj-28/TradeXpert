import {

  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,

} from "recharts";

const data = [

  {
    name: "Stocks",
    value: 65,
  },

  {
    name: "Mutual Funds",
    value: 20,
  },

  {
    name: "Gold",
    value: 15,
  },

];

const COLORS = [

  "#34D399",
  "#0F172A",
  "#94A3B8",

];

const PortfolioAnalytics = () => {

  return (

    <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6">

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-[#0F172A]">

          Portfolio Allocation

        </h2>

      </div>

      <div className="h-[320px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={110}
              dataKey="value"
            >

              {data.map((entry, index) => (

                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index]}
                />

              ))}

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

};

export default PortfolioAnalytics;