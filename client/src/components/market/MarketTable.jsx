import { useMarket } from "../../context/MarketContext";

const MarketTable = () => {

  const { marketStocks } = useMarket();

  return (
    <div className="market-table-wrapper">

      <div className="table-header">

        <h2>Live Market</h2>

        <p>Realtime NSE/BSE stock data</p>

      </div>

      <table className="market-table">

        <thead>

          <tr>
            <th>Symbol</th>
            <th>Company</th>
            <th>Price</th>
            <th>Change</th>
            <th>Volume</th>
          </tr>

        </thead>

        <tbody>

          {marketStocks.map((stock, index) => (

            <tr key={index}>

              <td>{stock.symbol}</td>

              <td>{stock.company}</td>

              <td>₹{stock.price}</td>

              <td
                className={
                  stock.change.includes("-")
                    ? "negative"
                    : "positive"
                }
              >
                {stock.change}
              </td>

              <td>{stock.volume}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default MarketTable;