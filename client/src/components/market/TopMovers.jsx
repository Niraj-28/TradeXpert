import { useMarket } from "../../context/MarketContext";

const TopMovers = () => {

  const {
    topGainers,
    topLosers,
  } = useMarket();

  return (
    <div className="movers-grid">

      {/* GAINERS */}
      <div className="mover-card">

        <h2>Top Gainers</h2>

        {topGainers.map((stock, index) => (

          <div
            key={index}
            className="mover-item"
          >

            <div>
              <h4>{stock.symbol}</h4>

              <p>₹{stock.price}</p>
            </div>

            <span className="positive">
              {stock.percent}
            </span>

          </div>

        ))}

      </div>

      {/* LOSERS */}
      <div className="mover-card">

        <h2>Top Losers</h2>

        {topLosers.map((stock, index) => (

          <div
            key={index}
            className="mover-item"
          >

            <div>
              <h4>{stock.symbol}</h4>

              <p>₹{stock.price}</p>
            </div>

            <span className="negative">
              {stock.percent}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
};

export default TopMovers;