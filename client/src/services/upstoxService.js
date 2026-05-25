import API from "./api";


// Get Market Quote

export const getMarketQuote = async (
  symbol
) => {

  const response = await API.get(
    `/upstox/market/${symbol}`
  );

  return response.data;
};