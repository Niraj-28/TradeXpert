import axios from "axios";

const API =
  "http://localhost:5000/api/market";

export const searchStocks = async (
  query
) => {
  const response =
    await axios.get(
      `${API}/search?q=${query}`
    );

  return response.data;
};

export const getLiveNews = async () => {
  const response = await axios.get(`${API}/news`);
  return response.data;
};

export const getStockNews = async (symbol) => {
  const response = await axios.get(`${API}/news/${symbol}`);
  return response.data;
};

export const getStockEvents = async (symbol) => {
  const response = await axios.get(`${API}/events/${symbol}`);
  return response.data;
};