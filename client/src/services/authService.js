import API from "./api";


// Register

export const registerUser = async (userData) => {

  const response = await API.post(
    "/auth/register",
    userData
  );

  return response.data;
};


// Login

export const loginUser = async (userData) => {

  const response = await API.post(
    "/auth/login",
    userData
  );

  return response.data;
};