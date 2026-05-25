import {
  useEffect,
  useState,
} from "react";

import {
  getMarketQuote,
} from "../../services/upstoxService";


const LiveMarket = () => {

  const [marketData, setMarketData] =
    useState(null);


  useEffect(() => {

    fetchData();

  }, []);


  const fetchData = async () => {

    try {

      const data =
        await getMarketQuote(
          "NSE_EQ|INE002A01018"
        );

      setMarketData(data);

    } catch (error) {

      console.log(error);

    }

  };


  return (

    <div className="bg-white rounded-xl p-5 border border-gray-200">

      <div className="mb-5">

        <h2 className="text-[20px] font-bold">

          Live Market

        </h2>

        <p className="text-gray-500 text-[13px] mt-1">

          Real-time NSE market data

        </p>

      </div>


      {marketData ? (

        <div>

          <h1 className="text-[30px] font-bold mb-2">

            Reliance

          </h1>

          <p className="text-[24px] font-bold">

            ₹{
              marketData.data[
                "NSE_EQ|INE002A01018"
              ]?.last_price
            }

          </p>

        </div>

      ) : (

        <p>Loading...</p>

      )}

    </div>

  );
};

export default LiveMarket;