import {

  TrendingUp,
  TrendingDown,

} from "lucide-react";

const Holdings = () => {

  const holdings = [

    {

      symbol: "RELIANCE",

      quantity: 10,

      avgPrice: 2500,

      currentPrice: 2985,

    },

    {

      symbol: "INFY",

      quantity: 15,

      avgPrice: 1420,

      currentPrice: 1620,

    },

    {

      symbol: "TCS",

      quantity: 8,

      avgPrice: 3950,

      currentPrice: 3850,

    },

  ];

  return (

    <div className="bg-white border border-[#E2E8F0] rounded-[22px] p-5 shadow-sm mt-5">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-2">

        <div>

          <h2 className="text-xl font-bold text-[#0F172A] mt-2">

            Holdings

          </h2>

        </div>

      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">

        <table className="w-full min-w-[700px]">

          <thead>

            <tr className="border-b border-[#E2E8F0]">

              <th className="text-left py-3 text-xs text-[#64748B]">

                Stock

              </th>

              <th className="text-left py-3 text-xs text-[#64748B]">

                Qty

              </th>

              <th className="text-left py-3 text-xs text-[#64748B]">

                Avg

              </th>

              <th className="text-left py-3 text-xs text-[#64748B]">

                LTP

              </th>

              <th className="text-left py-3 text-xs text-[#64748B]">

                P&L

              </th>

            </tr>

          </thead>

          <tbody>

            {holdings.map((holding, index) => {

              const pnl =

                (holding.currentPrice -

                  holding.avgPrice) *

                holding.quantity;

              const positive = pnl >= 0;

              return (

                <tr
                  key={index}
                  className="border-b border-[#F1F5F9]"
                >

                  <td className="py-4 text-sm">

                    <div>

                      <h3 className="font-bold text-[#0F172A]">

                        {holding.symbol}

                      </h3>

                      <p className="text-xs text-[#64748B]">

                        NSE

                      </p>

                    </div>

                  </td>

                  <td className="py-4 font-semibold text-sm">

                    {holding.quantity}

                  </td>

                  <td className="py-4 font-semibold text-sm">

                    ₹{holding.avgPrice}

                  </td>

                  <td className="py-4 font-bold text-sm">

                    ₹{holding.currentPrice}

                  </td>

                  <td className="py-4 text-sm">

                    <div
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${
                        positive

                          ? "bg-green-100 text-green-700"

                          : "bg-red-100 text-red-700"
                      }`}
                    >

                      {positive ? (

                        <TrendingUp size={15} />

                      ) : (

                        <TrendingDown size={15} />

                      )}

                      ₹{pnl.toLocaleString()}

                    </div>

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default Holdings;