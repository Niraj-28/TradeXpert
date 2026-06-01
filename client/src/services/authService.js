import API from "./api";


// Register User

export const registerUser = async (userData) => {

  const response = await API.post(
    "/auth/register",
    userData
  );

  return response.data;
};


// Login User

export const loginUser = async (userData) => {

  const response = await API.post(
    "/auth/login",
    userData
  );

  return response.data;
};

// Update User Profile
export const updateUserProfile = async (profileData) => {
  const token = localStorage.getItem("token");
  const response = await API.put(
    "/auth/profile",
    profileData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Change Password
export const changeUserPassword = async (passwordData) => {
  const token = localStorage.getItem("token");
  const response = await API.put(
    "/auth/change-password",
    passwordData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Get User Profile
export const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await API.get(
    "/auth/profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Reset Forgotten Password
export const resetForgottenPassword = async (resetData) => {
  const response = await API.post(
    "/auth/reset-forgotten-password",
    resetData
  );
  return response.data;
};

// Send OTP
export const sendOtp = async (emailOrPhone) => {
  const response = await API.post(
    "/auth/send-otp",
    { emailOrPhone }
  );
  return response.data;
};

// Verify OTP
export const verifyOtp = async (emailOrPhone, otp) => {
  const response = await API.post(
    "/auth/verify-otp",
    { emailOrPhone, otp }
  );
  return response.data;
};