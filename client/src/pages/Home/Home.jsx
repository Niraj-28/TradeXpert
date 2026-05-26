import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

import {
  FaChartLine,
  FaChartPie,
  FaSignal,
  FaStar,
  FaShieldAlt,
  FaWallet,
  FaArrowUp,
} from "react-icons/fa";

const Home = () => {

  const navigate = useNavigate();

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


  const features = [

    {
      icon: <FaChartLine />,
      title: "Virtual Trading",
      description:
        "Practice stock trading with realistic market simulation and live execution.",
    },

    {
      icon: <FaChartPie />,
      title: "Portfolio Analytics",
      description:
        "Track investments using advanced analytics and modern financial insights.",
    },

    {
      icon: <FaSignal />,
      title: "Live Market Tracking",
      description:
        "Monitor real-time stock prices, market trends, and trading movements.",
    },

    {
      icon: <FaStar />,
      title: "Smart Watchlists",
      description:
        "Create personalized watchlists and monitor your favorite stocks easily.",
    },

    {
      icon: <FaShieldAlt />,
      title: "Risk Analysis",
      description:
        "Understand investment risk and make smarter financial decisions.",
    },

    {
      icon: <FaWallet />,
      title: "Advanced Dashboard",
      description:
        "Experience a premium fintech dashboard with charts and analytics.",
    },

  ];


  const marketData = [

    {
      name: "NIFTY 50",
      value: "24,850",
      change: "+1.24%",
      positive: true,
    },

    {
      name: "SENSEX",
      value: "81,320",
      change: "+0.98%",
      positive: true,
    },

    {
      name: "BANK NIFTY",
      value: "52,110",
      change: "-0.42%",
      positive: false,
    },

    {
      name: "MIDCAP",
      value: "18,220",
      change: "+2.15%",
      positive: true,
    },

  ];


  return (

    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#ECFDF5] overflow-hidden">

      {/* NAVBAR */}

      <nav className="fixed top-0 left-0 w-full h-20 bg-[#FFFFFF]/80 backdrop-blur-xl border-b border-[#E2E8F0] flex items-center justify-between px-6 lg:px-16 z-50">

        {/* LOGO */}

        <div className="flex items-center">

          <img
            src={logo}
            alt="TradeXpert"
            className="h-10 lg:h-11"
          />

        </div>


        {/* MENU */}

        <div className="hidden md:flex items-center gap-10 text-[15px] font-medium text-[#0F172A]">

          <button className="hover:text-[#34D399] transition-all duration-300">

            Markets

          </button>

          <button className="hover:text-[#34D399] transition-all duration-300">

            Portfolio

          </button>

          <button className="hover:text-[#34D399] transition-all duration-300">

            Trading

          </button>

          <button className="hover:text-[#34D399] transition-all duration-300">

            News

          </button>

        </div>


        {/* BUTTONS */}

        <div className="flex items-center gap-3 lg:gap-4">

          <button
            onClick={() => navigate("/login")}
            className="font-medium text-[14px] lg:text-[15px] hover:text-[#34D399] transition-all"
          >

            Sign In

          </button>

          <button
            onClick={() => navigate("/register")}
            className="bg-gradient-to-r from-[#58E6B3] to-[#34D399] px-4 lg:px-5 py-2.5 rounded-2xl font-semibold text-[14px] lg:text-[15px] shadow-md hover:opacity-90 transition-all"
          >

            Get Started

          </button>

        </div>

      </nav>


      {/* HERO SECTION */}

      <section className="grid lg:grid-cols-2 grid-cols-1 min-h-[88vh] px-6 lg:px-16 pt-28 items-center gap-14 relative">

        {/* BACKGROUND GLOW */}

        <div className="absolute top-[-120px] right-[-120px] w-[350px] h-[350px] bg-[#58E6B3]/10 rounded-full blur-[120px]"></div>

        <div className="absolute bottom-[-150px] left-[-120px] w-[350px] h-[350px] bg-[#58E6B3]/10 rounded-full blur-[120px]"></div>


        {/* LEFT SIDE */}

        <div className="relative z-10">


          {/* HEADING */}

          <h1 className="text-[42px] lg:text-[56px] leading-[52px] lg:leading-[68px] font-bold text-[#0F172A] tracking-[-2px]">

            Trade Smart.
            <br />

            Invest Better.
            <br />

            <span className="text-[#34D399]">

              Master The

            </span>

            <br />

            Market.

          </h1>


          {/* DESCRIPTION */}

          <p className="text-[#64748B] text-[16px] lg:text-[17px] mt-6 max-w-xl leading-relaxed">

            Experience real-time Indian stock market simulation
            with portfolio analytics, market insights,
            live trends, and advanced trading tools —
            all in one premium fintech platform.

          </p>


          {/* BUTTONS */}

          <div className="flex flex-wrap gap-4 mt-8">

            <button
              onClick={() => navigate("/register")}
              className="bg-gradient-to-r from-[#58E6B3] to-[#34D399] px-7 py-3 rounded-2xl font-semibold text-[15px] lg:text-[16px] shadow-lg hover:opacity-90 transition-all"
            >

              Start Trading

            </button>

            <button className="border border-[#E2E8F0] bg-white px-7 py-3 rounded-2xl font-semibold text-[15px] lg:text-[16px] hover:bg-[#F8FAFC] transition-all">

              Explore Market

            </button>

          </div>


          {/* STATS */}

          <div className="flex flex-wrap items-center gap-10 mt-14">

            {stats.map((item, index) => (

              <div key={index}>

                <h3 className="text-[24px] font-bold text-[#0F172A]">

                  {item.number}

                </h3>

                <p className="text-[#64748B] text-sm mt-1">

                  {item.title}

                </p>

              </div>

            ))}

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="relative flex justify-center">

          {/* MAIN CARD */}

          <div className="bg-white w-full max-w-xl rounded-[34px] p-5 lg:p-6 border border-[#E2E8F0] shadow-[0_20px_60px_rgba(52,211,153,0.08)]">

            {/* HEADER */}

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-[20px] lg:text-[22px] font-bold text-[#0F172A]">

                  Market Overview

                </h2>

                <p className="text-[#64748B] text-sm mt-1">

                  Real-time analytics dashboard

                </p>

              </div>

              <div className="bg-[#ECFDF5] text-[#34D399] px-4 py-2 rounded-xl text-sm font-semibold">

                Live Market

              </div>

            </div>


            {/* PORTFOLIO CARD */}

            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-[28px] p-6 text-white mb-5 relative overflow-hidden">

              <div className="absolute right-[-30px] top-[-30px] w-[140px] h-[140px] bg-white/10 rounded-full"></div>

              <div className="relative z-10">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-white/70 text-sm">

                      Portfolio Value

                    </p>

                    <h2 className="text-[28px] lg:text-[34px] font-bold mt-2">

                      ₹4,25,320

                    </h2>

                  </div>

                  <div className="bg-white/10 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold">

                    <FaArrowUp />

                    12.4%

                  </div>

                </div>


                {/* GRAPH */}

                <div className="flex items-end gap-2 h-20 mt-8">

                  <div className="w-3 h-10 bg-white/30 rounded-full"></div>
                  <div className="w-3 h-12 bg-white/40 rounded-full"></div>
                  <div className="w-3 h-14 bg-white/50 rounded-full"></div>
                  <div className="w-3 h-11 bg-white/40 rounded-full"></div>
                  <div className="w-3 h-16 bg-[#58E6B3] rounded-full"></div>
                  <div className="w-3 h-12 bg-white/50 rounded-full"></div>
                  <div className="w-3 h-20 bg-[#34D399] rounded-full"></div>
                  <div className="w-3 h-16 bg-white/70 rounded-full"></div>

                </div>

              </div>

            </div>


            {/* MARKET CARDS */}

            <div className="grid sm:grid-cols-2 grid-cols-1 gap-3">

              {marketData.map((item, index) => (

                <div
                  key={index}
                  className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#E2E8F0] transition-all hover:shadow-md"
                >

                  <div className="flex items-center justify-between mb-2">

                    <h3 className="font-semibold text-[13px] text-[#0F172A]">

                      {item.name}

                    </h3>

                    <span
                      className={`text-sm font-semibold ${
                        item.positive
                          ? "text-[#34D399]"
                          : "text-red-500"
                      }`}
                    >

                      {item.change}

                    </span>

                  </div>

                  <h2 className="text-[22px] lg:text-[24px] font-bold text-[#0F172A]">

                    {item.value}

                  </h2>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>


      {/* FEATURES */}

      <section className="px-6 lg:px-16 py-20">

        <div className="text-center mb-14">

          <h2 className="text-[34px] lg:text-[40px] font-bold text-[#0F172A] mb-4">

            Powerful Trading Features

          </h2>

          <p className="text-[#64748B] text-[16px] lg:text-[17px]">

            Everything you need to learn, practice, and master trading.

          </p>

        </div>


        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">

          {features.map((feature, index) => (

            <div
              key={index}
              className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 hover:border-[#34D399] hover:shadow-[0_15px_40px_rgba(52,211,153,0.08)] transition-all"
            >

              <div className="w-14 h-14 bg-[#ECFDF5] rounded-2xl flex items-center justify-center text-[#34D399] text-xl mb-5">

                {feature.icon}

              </div>

              <h3 className="text-[20px] font-bold text-[#0F172A] mb-3">

                {feature.title}

              </h3>

              <p className="text-[#64748B] leading-relaxed text-[15px]">

                {feature.description}

              </p>

            </div>

          ))}

        </div>

      </section>


      {/* CTA SECTION */}

      <section className="px-16 pb-20">

        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#B8F0D6] via-[#F4FFFB] to-[#A8ECC8]  border border-[#D7F5E7] p-16 text-center shadow-[0_20px_60px_rgba(52,211,153,0.08)]">

          {/* SOFT GLOW */}

          <div className="absolute top-[-120px] left-[-120px] w-[260px] h-[260px] bg-[#58E6B3]/20 rounded-full blur-[100px]"></div>

          <div className="absolute bottom-[-120px] right-[-120px] w-[260px] h-[260px] bg-[#34D399]/20 rounded-full blur-[100px]"></div>

          <div className="relative z-10">

            {/* HEADING */}

            <h2 className="text-[48px] leading-[62px] font-bold text-[#0F172A] mb-6">

              Start Your Trading
              <br />

              Journey Today

            </h2>


            {/* DESCRIPTION */}

            <p className="text-[18px] text-[#64748B] max-w-3xl mx-auto leading-relaxed">

              Join thousands of traders using TradeXpert to practice,
              analyze, and master stock market trading with modern fintech tools.

            </p>


            {/* BUTTONS */}

            <div className="flex items-center justify-center gap-5 mt-10">

              <button
                onClick={() => navigate("/register")}
                className="bg-gradient-to-r from-[#58E6B3] to-[#34D399] text-black px-10 py-4 rounded-2xl text-[16px] font-semibold hover:opacity-90 transition-all shadow-[0_12px_30px_rgba(52,211,153,0.20)]"
              >

                Get Started Now

              </button>


            </div>

          </div>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="bg-white border-t border-[#E2E8F0] px-6 lg:px-16 py-12">

        <div className="flex lg:flex-row flex-col gap-12 items-start justify-between">

          <div>

            <img
              src={logo}
              alt="TradeXpert"
              className="h-11 mb-5"
            />

            <p className="text-[#64748B] max-w-md leading-relaxed">

              TradeXpert is a modern virtual trading platform helping
              traders learn stock market investing using advanced analytics,
              real-time insights, and fintech tools.

            </p>

          </div>


          <div className="flex gap-16">

            <div>

              <h3 className="font-semibold text-[#0F172A] mb-5">

                Platform

              </h3>

              <div className="space-y-3 text-[#64748B]">

                <p>Markets</p>
                <p>Portfolio</p>
                <p>Trading</p>
                <p>News</p>

              </div>

            </div>

            <div>

              <h3 className="font-semibold text-[#0F172A] mb-5">

                Resources

              </h3>

              <div className="space-y-3 text-[#64748B]">

                <p>Documentation</p>
                <p>Support</p>
                <p>Privacy Policy</p>
                <p>Terms & Conditions</p>

              </div>

            </div>

          </div>

        </div>

        <div className="border-t border-[#E2E8F0] mt-10 pt-6 text-center text-[#64748B] text-sm">

          © 2026 TradeXpert. All rights reserved.

        </div>

      </footer>

    </div>

  );
};

export default Home;