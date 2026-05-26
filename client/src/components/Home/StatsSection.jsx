const stats = [

  {
    number: "50K+",
    title: "Active Traders",
  },

  {
    number: "₹120Cr+",
    title: "Virtual Trades",
  },

  {
    number: "99.9%",
    title: "Platform Uptime",
  },

  {
    number: "24/7",
    title: "Market Insights",
  },

];


const StatsSection = () => {

  return (

    <section className="px-16 py-14">

      <div className="grid grid-cols-4 gap-6">

        {stats.map((item, index) => (

          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm"
          >

            <h2 className="text-[34px] font-bold text-[#58E6B3] mb-2">

              {item.number}

            </h2>

            <p className="text-gray-500 text-[15px]">

              {item.title}

            </p>

          </div>

        ))}

      </div>

    </section>

  );
};

export default StatsSection;