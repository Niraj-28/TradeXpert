import axios from "axios";

const API = "http://localhost:5000/api/trade";

export const placeTrade = async (

  tradeData,

  token

) => {

  const response = await axios.post(

    `${API}/place`,

    tradeData,

    {

      headers: {

        Authorization: `Bearer ${token}`,

      },

    }

  );

  return response.data;

};

export const getTradeHistory = async (

  token

) => {

  const response = await axios.get(

    `${API}/history`,

    {

      headers: {

        Authorization: `Bearer ${token}`,

      },

    }

  );

  return response.data;

};