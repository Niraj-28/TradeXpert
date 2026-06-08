const prices = {};

module.exports = {
  setPrice: (symbol, price) => {
    if (symbol && price !== undefined) {
      prices[symbol.toUpperCase()] = Number(price);
    }
  },
  getPrice: (symbol) => {
    if (!symbol) return null;
    return prices[symbol.toUpperCase()] || null;
  },
  getAllPrices: () => prices
};
