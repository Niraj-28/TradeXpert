const tickerData = [

  {
    symbol: "RELIANCE",
    price: "₹2,985",
    change: "+2.45%",
    positive: true,
  },

  {
    symbol: "TCS",
    price: "₹3,850",
    change: "-0.92%",
    positive: false,
  },

  {
    symbol: "INFY",
    price: "₹1,620",
    change: "+1.82%",
    positive: true,
  },

  {
    symbol: "HDFCBANK",
    price: "₹1,785",
    change: "+3.11%",
    positive: true,
  },

  {
    symbol: "SBIN",
    price: "₹812",
    change: "-1.25%",
    positive: false,
  },

  {
    symbol: "ICICIBANK",
    price: "₹1,120",
    change: "+0.88%",
    positive: true,
  },

];

const LiveTicker = () => {

  return (

    <>

      <style>{`
        @keyframes ticker-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .ticker-scroll-animation {
          animation: ticker-scroll 30s linear infinite;
        }
      `}</style>

      <div className="relative overflow-hidden bg-[#0F172A] rounded-[24px] py-4 px-2 ">

      {/* TICKER */}

      <div className="ticker-wrapper overflow-hidden">

        <div className="ticker-track ticker-scroll-animation flex items-center gap-12 pl-36">

          {[...tickerData, ...tickerData].map(

            (stock, index) => (

              <div
                key={index}
                className="flex items-center gap-3 whitespace-nowrap"
              >

                <span className="text-white font-bold text-xs">

                  {stock.symbol}

                </span>

                <span className="text-[#CBD5E1] text-xs">

                  {stock.price}

                </span>

                <span
                  className={`text-xs font-semibold ${
                    stock.positive

                      ? "text-green-400"

                      : "text-red-400"

                  }`}
                >

                  {stock.change}

                </span>

              </div>

            )

          )}

        </div>

      </div>

      </div>

    </>

  );

};

export default LiveTicker;