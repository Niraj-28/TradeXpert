import axios from "axios";
import { BASE_API_URL } from "./api";

const API = `${BASE_API_URL}/holdings`;

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