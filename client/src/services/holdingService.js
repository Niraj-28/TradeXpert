import axios from "axios";

const API =
  "http://localhost:5000/api/holdings";

const getToken = () =>

  localStorage.getItem(
    "token"
  );

export const getHoldings =
  async () => {

    const response =
      await axios.get(API, {

        headers: {

          Authorization:
            `Bearer ${getToken()}`,

        },

      });

    return response.data;

  };