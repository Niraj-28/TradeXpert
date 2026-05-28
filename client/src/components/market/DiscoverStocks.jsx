import { Search } from "lucide-react";

import { useMarket } from "../../context/MarketContext";

const DiscoverStocks = () => {

  const { trendingStocks } = useMarket();

  return (
    <div className="discover-section">

      {/* HEADER */}
      <div className="section-header">

        <div>
          <h1>Discover Stocks</h1>

          <p>
            Explore trending NSE/BSE stocks
          </p>
        </div>

      </div>

      {/* SEARCH */}
      <div className="discover-search">

        <Search size={18} />

        <input
          type="text"
          placeholder="Search stocks..."
        />

      </div>

      {/* TRENDING */}
      <div className="trending-grid">

        {trendingStocks.map((stock, index) => (

          <div
            key={index}
            className="trending-card"
          >

            <div>
              <h3>{stock.symbol}</h3>

              <p>Trending Stock</p>
            </div>

            <div className="trend-right">

              <h4>
                ₹{stock.price}
              </h4>

              <span
                className={
                  stock.change.includes("-")
                    ? "negative"
                    : "positive"
                }
              >
                {stock.change}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default DiscoverStocks;