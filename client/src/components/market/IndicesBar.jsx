import { useMarket } from "../../context/MarketContext";

const IndicesBar = () => {
  const { indices } = useMarket();

  return (
    <div className="indices-grid">

      {indices.map((item, index) => (

        <div
          key={index}
          className="index-card"
        >

          <h3>{item.name}</h3>

          <h2>
            {item.value.toFixed(2)}
          </h2>

          <p className="positive">
            {item.change}
            {" "}
            ({item.percent})
          </p>

        </div>

      ))}

    </div>
  );
};

export default IndicesBar;