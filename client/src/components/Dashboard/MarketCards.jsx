const marketData = [

  {
    title: "NIFTY 50",
    value: "24,850",
    change: "+1.24%",
    positive: true,
  },

  {
    title: "SENSEX",
    value: "81,320",
    change: "+0.98%",
    positive: true,
  },

  {
    title: "BANK NIFTY",
    value: "52,110",
    change: "-0.42%",
    positive: false,
  },

  {
    title: "MIDCAP",
    value: "18,220",
    change: "+2.15%",
    positive: true,
  },

];


const MarketCards = () => {

  return (

    <div className="grid grid-cols-4 gap-4">

      {marketData.map((item, index) => (

        <div
          key={index}
          className="bg-white rounded-xl p-4 border border-gray-200"
        >

          <p className="text-gray-500 text-[10px] mb-2">

            {item.title}

          </p>

          <h2 className="text-[20px] font-bold leading-none mb-2">

            {item.value}

          </h2>

          <span
            className={`text-[12px] font-semibold ${
              item.positive
                ? "text-green-500"
                : "text-red-500"
            }`}
          >

            {item.change}

          </span>

        </div>

      ))}

    </div>

  );
};

export default MarketCards;