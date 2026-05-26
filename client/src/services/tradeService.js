import axios from "axios";

const API = "http://localhost:5000/api/trade";

const token =

  JSON.parse(

    localStorage.getItem("user")

  )?.token;

export const buyStock = async (data) => {

  const response = await axios.post(

    `${API}/buy`,

    data,

    {

      headers: {

        Authorization: `Bearer ${token}`,

      },

    }

  );

  return response.data;

};

export const sellStock = async (data) => {

  const response = await axios.post(

    `${API}/sell`,

    data,

    {

      headers: {

        Authorization: `Bearer ${token}`,

      },

    }

  );

  return response.data;

};

export const getPortfolio = async () => {

  const response = await axios.get(

    `${API}/portfolio`,

    {

      headers: {

        Authorization: `Bearer ${token}`,

      },

    }

  );

  return response.data;

};

export const getTransactions = async () => {

  const response = await axios.get(

    `${API}/transactions`,

    {

      headers: {

        Authorization: `Bearer ${token}`,

      },

    }

  );

  return response.data;

};