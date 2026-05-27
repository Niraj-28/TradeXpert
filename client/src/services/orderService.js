import axios from "axios";

const API =
  "http://localhost:5000/api/orders";

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