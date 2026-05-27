import {

  Newspaper,
  TrendingUp,
  Globe2,
  Clock3,

} from "lucide-react";

const News = () => {

  const featuredNews = [

    {

      title:
        "Reliance Industries Hits New 52-Week High Amid Strong Q2 Earnings",

      source:
        "Economic Times",

      time:
        "2 hours ago",

      category:
        "Stocks",

    },

    {

      title:
        "NIFTY Crosses 24,800 Mark As Banking Stocks Rally",

      source:
        "Moneycontrol",

      time:
        "1 hour ago",

      category:
        "Markets",

    },

  ];

  const latestNews = [

    {

      title:
        "TCS Expands AI Partnership With Global Enterprises",

      source:
        "Bloomberg",

      time:
        "15 mins ago",

    },

    {

      title:
        "Infosys Announces Strategic Cloud Transformation Deal",

      source:
        "CNBC",

      time:
        "25 mins ago",

    },

    {

      title:
        "BankNifty Sees Volatility Ahead Of RBI Policy Meeting",

      source:
        "Reuters",

      time:
        "40 mins ago",

    },

    {

      title:
        "Indian Markets Open Higher Tracking Global Cues",

      source:
        "Financial Express",

      time:
        "55 mins ago",

    },

  ];

  return (

    <div className="min-h-screen bg-[#F4F7FB] px-5 lg:px-8 py-6">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>

          <p className="text-[14px] text-[#64748B] font-medium">

            Financial Intelligence Hub

          </p>

          <h1 className="mt-2 text-[42px] font-bold tracking-tight text-[#0F172A]">

            Market News

          </h1>

        </div>

        {/* LIVE NEWS */}

        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-red-100 text-red-700 w-fit">

          <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />

          <span className="text-[14px] font-bold">

            Breaking News Live

          </span>

        </div>

      </div>

      {/* FEATURED NEWS */}

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">

        {featuredNews.map(
          (news, index) => (

            <div
              key={index}
              className="relative overflow-hidden bg-white rounded-[32px] border border-[#E8ECF2] p-7 shadow-[0_6px_24px_rgba(15,23,42,0.06)]"
            >

              {/* TOP */}

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="h-12 w-12 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center">

                    <TrendingUp
                      size={24}
                    />

                  </div>

                  <div>

                    <p className="text-[13px] text-[#64748B]">

                      Featured Story

                    </p>

                    <h3 className="mt-1 text-[18px] font-bold text-[#0F172A]">

                      {
                        news.category
                      }

                    </h3>

                  </div>

                </div>

                <div className="px-4 py-2 rounded-2xl bg-[#F4F7FB] text-[13px] font-bold text-[#0F172A]">

                  LIVE

                </div>

              </div>

              {/* TITLE */}

              <h2 className="mt-8 text-[30px] leading-[42px] font-bold tracking-tight text-[#0F172A]">

                {news.title}

              </h2>

              {/* FOOTER */}

              <div className="mt-10 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <Globe2
                    size={18}
                    className="text-[#64748B]"
                  />

                  <span className="text-[14px] font-semibold text-[#0F172A]">

                    {news.source}

                  </span>

                </div>

                <div className="flex items-center gap-2 text-[#64748B]">

                  <Clock3
                    size={16}
                  />

                  <span className="text-[13px]">

                    {news.time}

                  </span>

                </div>

              </div>

            </div>

          )
        )}

      </section>

      {/* MAIN GRID */}

      <section className="grid grid-cols-1 2xl:grid-cols-12 gap-6">

        {/* LEFT */}

        <div className="2xl:col-span-8">

          <div className="bg-white rounded-[30px] border border-[#E8ECF2] p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">

            {/* HEADER */}

            <div className="flex items-center gap-3 mb-8">

              <Newspaper
                className="text-[#0F172A]"
              />

              <h2 className="text-[30px] font-bold tracking-tight text-[#0F172A]">

                Latest Market Updates

              </h2>

            </div>

            {/* NEWS LIST */}

            <div className="space-y-5">

              {latestNews.map(
                (
                  item,
                  index
                ) => (

                  <div
                    key={index}
                    className="rounded-[24px] border border-[#EEF2F7] p-6 hover:bg-[#FAFBFC] transition-all"
                  >

                    <div className="flex items-start justify-between gap-5">

                      {/* LEFT */}

                      <div>

                        <h3 className="text-[24px] leading-[34px] font-bold tracking-tight text-[#0F172A]">

                          {item.title}

                        </h3>

                        <div className="mt-5 flex items-center gap-6">

                          <div className="flex items-center gap-2">

                            <Globe2
                              size={16}
                              className="text-[#64748B]"
                            />

                            <span className="text-[14px] font-semibold text-[#0F172A]">

                              {
                                item.source
                              }

                            </span>

                          </div>

                          <div className="flex items-center gap-2 text-[#64748B]">

                            <Clock3
                              size={15}
                            />

                            <span className="text-[13px]">

                              {
                                item.time
                              }

                            </span>

                          </div>

                        </div>

                      </div>

                      {/* TAG */}

                      <div className="px-4 py-2 rounded-2xl bg-[#F4F7FB] text-[13px] font-bold text-[#0F172A] whitespace-nowrap">

                        Market News

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="2xl:col-span-4 space-y-6">

          {/* MARKET SENTIMENT */}

          <div className="bg-[#0F172A] rounded-[30px] p-6 text-white">

            <p className="text-[13px] text-gray-400">

              Market Mood

            </p>

            <h2 className="mt-2 text-[30px] font-bold tracking-tight">

              Bullish Sentiment

            </h2>

            <div className="mt-8">

              <div className="flex items-center justify-between mb-3">

                <span className="text-[14px]">

                  Investor Confidence

                </span>

                <span className="text-[14px] font-bold">

                  82%

                </span>

              </div>

              <div className="h-3 bg-white/10 rounded-full overflow-hidden">

                <div className="h-full w-[82%] bg-green-500 rounded-full" />

              </div>

            </div>

            <div className="mt-8 space-y-5">

              <div>

                <p className="text-[13px] text-gray-400">

                  Trending Sector

                </p>

                <h3 className="mt-2 text-[22px] font-bold">

                  Banking & AI Tech

                </h3>

              </div>

              <div>

                <p className="text-[13px] text-gray-400">

                  Market Trend

                </p>

                <h3 className="mt-2 text-[22px] font-bold text-green-400">

                  Strong Uptrend

                </h3>

              </div>

            </div>

          </div>

          {/* QUICK INSIGHTS */}

          <div className="bg-white rounded-[30px] border border-[#E8ECF2] p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">

            <h2 className="text-[28px] font-bold tracking-tight text-[#0F172A]">

              Quick Insights

            </h2>

            <div className="mt-8 space-y-5">

              <div className="p-5 rounded-[22px] bg-[#F4F7FB]">

                <p className="text-[13px] text-[#64748B]">

                  Most Active Stock

                </p>

                <h3 className="mt-2 text-[22px] font-bold text-[#0F172A]">

                  RELIANCE

                </h3>

              </div>

              <div className="p-5 rounded-[22px] bg-[#F4F7FB]">

                <p className="text-[13px] text-[#64748B]">

                  Highest Volume

                </p>

                <h3 className="mt-2 text-[22px] font-bold text-[#0F172A]">

                  HDFCBANK

                </h3>

              </div>

              <div className="p-5 rounded-[22px] bg-[#F4F7FB]">

                <p className="text-[13px] text-[#64748B]">

                  Market Volatility

                </p>

                <h3 className="mt-2 text-[22px] font-bold text-red-500">

                  Moderate

                </h3>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>

  );

};

export default News;