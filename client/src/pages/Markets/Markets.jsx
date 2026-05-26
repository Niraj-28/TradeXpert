import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar/Navbar";

import socket from "../../socket/socket";

const Markets = () => {

  const [stocks, setStocks] = useState([]);

  useEffect(() => {

    socket.on(

      "market-update",

      (data) => {

        setStocks(data);

      }

    );

    return () => {

      socket.off("market-update");

    };

  }, []);

  return (

    <div className="min-h-screen bg-[#F8FAFC]">

      <Navbar />

      <div className="pt-28 px-6 lg:px-16">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-4xl font-bold text-[#0F172A]">

            Live Market

          </h1>

          <p className="text-[#64748B] mt-2">

            Real-time Indian stock market updates

          </p>

        </div>


        {/* STOCK GRID */}

        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">

          {stocks.map((stock, index) => (

            <div
              key={index}
              className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-lg transition-all"
            >

              {/* TOP */}

              <div className="flex items-start justify-between mb-6">

                <div>

                  <h2 className="text-2xl font-bold text-[#0F172A]">

                    {stock.name}

                  </h2>

                  <p className="text-[#64748B] text-sm mt-1">

                    NSE • EQ

                  </p>

                </div>

                <div
                  className={`px-3 py-1 rounded-xl text-sm font-semibold ${
                    stock.change >= 0
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >

                  {stock.change.toFixed(2)}%

                </div>

              </div>


              {/* PRICE */}

              <div className="mb-6">

                <h1 className="text-4xl font-bold text-[#0F172A]">

                  ₹{stock.price.toFixed(2)}

                </h1>

              </div>


              {/* MARKET DATA */}

              <div className="grid grid-cols-3 gap-4">

                <div>

                  <p className="text-xs text-[#94A3B8]">

                    OPEN

                  </p>

                  <h3 className="font-semibold mt-1">

                    ₹{stock.open}

                  </h3>

                </div>

                <div>

                  <p className="text-xs text-[#94A3B8]">

                    HIGH

                  </p>

                  <h3 className="font-semibold mt-1 text-green-600">

                    ₹{stock.high}

                  </h3>

                </div>

                <div>

                  <p className="text-xs text-[#94A3B8]">

                    LOW

                  </p>

                  <h3 className="font-semibold mt-1 text-red-500">

                    ₹{stock.low}

                  </h3>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

};

export default Markets;