import {

  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,

} from "recharts";

const allocationData = [

  {
    name: "Banking",
    value: 35,
  },

  {
    name: "IT",
    value: 25,
  },

  {
    name: "Energy",
    value: 20,
  },

  {
    name: "Pharma",
    value: 12,
  },

  {
    name: "Others",
    value: 8,
  },

];

const COLORS = [

  "#58E6B3",
  "#0F172A",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",

];

const PortfolioAnalytics = () => {

  return (

    <div className="bg-white border border-[#E2E8F0] rounded-[30px] p-6 shadow-sm mt-5">

      {/* HEADER */}

      <div className="mb-5">

        <h2 className="text-lg font-bold text-[#0F172A] mt-1">

          Portfolio Allocation

        </h2>

      </div>

      {/* CHART + LEGEND */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">

        {/* CHART */}

        <div className="w-full h-[260px]">

          <ResponsiveContainer width="100%" height="100%">

            <PieChart>

              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >

                {allocationData.map((entry, index) => (

                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />

                ))}

              </Pie>

              <Tooltip formatter={(value) => `${value}%`} />

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* LEGEND */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {allocationData.map((item, index) => (

            <div key={index} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-all">

              <div 

                className="w-3 h-3 rounded-full flex-shrink-0"

                style={{ backgroundColor: COLORS[index] }}

              ></div>

              <div className="flex-1 min-w-0">

                <p className="text-[11px] text-[#64748B]">{item.name}</p>

                <p className="text-[13px] font-semibold text-[#0F172A]">{item.value}%</p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

};

export default PortfolioAnalytics;