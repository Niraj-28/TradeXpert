import MainLayout from "../../layouts/MainLayout";

import MarketCards from "../../components/Dashboard/MarketCards";

import PortfolioCard from "../../components/Dashboard/PortfolioCard";

import WatchList from "../../components/Dashboard/WatchList";

import TrendingStocks from "../../components/Dashboard/TrendingStocks";

import MarketMovers from "../../components/Dashboard/MarketMovers";

import PortfolioChart from "../../components/Dashboard/PortfolioChart";

import AnalyticsCard from "../../components/Dashboard/AnalyticsCard";

import LiveMarket from "../../components/Dashboard/LiveMarket";


const Dashboard = () => {

  return (

    <MainLayout>

      <div className="space-y-5">

        {/* Header */}

        <div>

          <h1 className="text-3xl font-bold mb-1">

            Welcome Back 👋

          </h1>

          <p className="text-gray-500 text-[15px]">

            Track markets and manage your investments.

          </p>

        </div>


        {/* Market Cards */}

        <MarketCards />

        <LiveMarket />


        {/* Portfolio + Watchlist */}

        <div className="grid grid-cols-2 gap-5">

          <PortfolioCard />

          <WatchList />

        </div>


        {/* Chart + Analytics */}

        <div className="grid grid-cols-3 gap-5">

          <div className="col-span-2">

            <PortfolioChart />

          </div>

          <div>

            <AnalyticsCard />

          </div>

        </div>


        {/* Trending Stocks */}

        <TrendingStocks />


        {/* Market Movers */}

        <MarketMovers />

      </div>

    </MainLayout>

  );
};

export default Dashboard;