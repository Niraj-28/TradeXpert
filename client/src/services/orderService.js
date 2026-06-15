import axios from "axios";
import { BASE_API_URL } from "./api";

const API = `${BASE_API_URL}/orders`;

const getToken = () =>

  localStorage.getItem(
    "token"
  );

export const placeOrder =
  async (orderData) => {

    const response =
      await axios.post(

        API,

        orderData,

        {

          headers: {

            Authorization:
              `Bearer ${getToken()}`,

          },

        }

      );

    return response.data;

  };

export const getOrders =
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