import { useMarket } from "../../context/MarketContext";

const SectorPerformance = () => {

  const { sectors } = useMarket();

  return (
    <div className="sector-section">

      <div className="table-header">

        <h2>Sector Performance</h2>

        <p>
          Market sectors overview
        </p>

      </div>

      <div className="sector-grid">

        {sectors.map((item, index) => (

          <div
            key={index}
            className="sector-card"
          >

            <h3>{item.sector}</h3>

            <span
              className={
                item.percent.includes("-")
                  ? "negative"
                  : "positive"
              }
            >
              {item.percent}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
};

export default SectorPerformance;