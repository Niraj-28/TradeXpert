const features = [

  {
    title: "Virtual Trading",
    description:
      "Practice stock trading with a realistic market simulation environment.",
  },

  {
    title: "Portfolio Analytics",
    description:
      "Track investments with advanced analytics and performance insights.",
  },

  {
    title: "Real-Time Market",
    description:
      "Monitor live market trends, stock movements, and trading updates.",
  },

  {
    title: "Watchlists",
    description:
      "Create and manage personalized watchlists for your favorite stocks.",
  },

  {
    title: "Risk Analysis",
    description:
      "Analyze risk levels and make smarter investment decisions.",
  },

  {
    title: "Trading Dashboard",
    description:
      "Access a modern fintech dashboard with charts and analytics.",
  },

];


const FeaturesSection = () => {

  return (

    <section className="px-16 py-10">

      <div className="text-center mb-12">

        <h2 className="text-[40px] font-bold mb-3">

          Powerful Features

        </h2>

        <p className="text-gray-500 text-[17px]">

          Everything you need to master stock market trading.

        </p>

      </div>


      <div className="grid grid-cols-3 gap-6">

        {features.map((feature, index) => (

          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all"
          >

            <h3 className="text-[22px] font-bold mb-4">

              {feature.title}

            </h3>

            <p className="text-gray-500 leading-relaxed text-[15px]">

              {feature.description}

            </p>

          </div>

        ))}

      </div>

    </section>

  );
};

export default FeaturesSection;