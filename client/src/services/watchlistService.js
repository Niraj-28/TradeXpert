import axios from "axios";
import { BASE_API_URL } from "./api";

const API = `${BASE_API_URL}/watchlist`;

const getToken = () =>

  localStorage.getItem("token");

export const getWatchlist =
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

export const addToWatchlist =
  async (symbol) => {

    const response =
      await axios.post(

        API,

        { symbol },

        {

          headers: {

            Authorization:
              `Bearer ${getToken()}`,

          },

        }

      );

    return response.data;

  };

export const removeFromWatchlist =
  async (id) => {

    const response =
      await axios.delete(

        `${API}/${id}`,

        {

          headers: {

            Authorization:
              `Bearer ${getToken()}`,

          },

        }

      );

    return response.data;

  };