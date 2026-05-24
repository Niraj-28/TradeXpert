import logo from "../../assets/logo.png";

import { useNavigate } from "react-router-dom";

const Home = () => {

  const navigate = useNavigate();


  // Button Handlers

  const handleMarkets = () => {
    navigate("/markets");
  };

  const handlePortfolio = () => {
    navigate("/portfolio");
  };

  const handleTrading = () => {
    navigate("/trading");
  };

  const handleNews = () => {
    navigate("/news");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleExplore = () => {
    alert("Explore Market Clicked");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Account Created");
  };


  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Navbar */}

      <nav className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-12">

        <div className="flex items-center gap-3">

          <img
            src={logo}
            alt="TradeXpert"
            className="h-12"
          />

        </div>

        <div className="flex items-center gap-10 font-medium">

          <button onClick={handleMarkets}>
            Markets
          </button>

          <button onClick={handlePortfolio}>
            Portfolio
          </button>

          <button onClick={handleTrading}>
            Trading
          </button>

          <button onClick={handleNews}>
            News
          </button>

        </div>

        <div className="flex items-center gap-5">

          <button
            className="font-medium"
            onClick={handleLogin}
          >
            Sign In
          </button>

          <button
            className="bg-[#58E6B3] px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition-all"
            onClick={handleRegister}
          >
            Get Started
          </button>

        </div>

      </nav>

      {/* Hero Section */}

      <section className="grid grid-cols-2 min-h-[85vh] px-16 items-center gap-16">

        {/* LEFT */}

        <div>

          <h1 className="text-[40px] leading-[60px] font-bold text-black">

            Trade Smart.
            <br />

            Invest Better.
            <br />

            Master The
            <br />

            Market.

          </h1>

          <p className="text-gray-500 text-[18px] mt-5 max-w-xl leading-relaxed">

            Experience real-time Indian stock market simulation with live trading,
            analytics, portfolio tracking, and financial news.

          </p>

          <div className="flex gap-5 mt-5">

            <button
              className="bg-[#58E6B3] px-8 py-4 rounded-2xl font-semibold text-lg hover:opacity-90 transition-all shadow-sm"
              onClick={handleRegister}
            >

              Start Trading

            </button>

            <button
              className="border border-gray-300 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all"
              onClick={handleExplore}
            >

              Explore Market

            </button>

          </div>

        </div>

        {/* RIGHT */}

        <div className="flex justify-center">

          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-xl rounded-[32px] p-10 border border-gray-200 shadow-sm"
          >

            <h2 className="text-[30px] font-bold mb-2">
              Create Account
            </h2>

            <p className="text-gray-500 text-[15px] mb-5">
              Start your virtual trading journey.
            </p>

            <div className="space-y-5 text-[15px]">

              <input
                type="email"
                placeholder="Email Address"
                className="w-full h-16 border border-gray-300 rounded-2xl px-5 outline-none focus:border-[#58E6B3]"
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full h-16 border border-gray-300 rounded-2xl px-5 outline-none focus:border-[#58E6B3]"
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="w-full h-16 border border-gray-300 rounded-2xl px-5 outline-none focus:border-[#58E6B3]"
              />

              <div className="flex items-start gap-3">

                <input
                  type="checkbox"
                  className="mt-1"
                />

                <p className="text-gray-500 text-sm">

                  I agree to the Terms of Service and Privacy Policy.

                </p>

              </div>

              <button
                type="submit"
                className="w-full h-16 bg-[#58E6B3] rounded-2xl text-lg font-semibold hover:opacity-90 transition-all"
              >

                Create Account

              </button>

            </div>

          </form>

        </div>

      </section>

    </div>
  );
};

export default Home;