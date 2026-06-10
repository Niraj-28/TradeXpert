import {

  createContext,
  useContext,
  useState,

} from "react";

const AuthContext = createContext();

export const AuthProvider = ({

  children,

}) => {

  const [user, setUser] =

    useState(

      JSON.parse(

        localStorage.getItem("user")

      ) || null

    );

  const login = (data) => {
    const token = data.token || localStorage.getItem("token");
    const updatedUser = { ...data, token };
    setUser(updatedUser);
    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );
    if (token) {
      localStorage.setItem("token", token);
    }
  };

  const logout = () => {

    setUser(null);

    localStorage.removeItem("user");

    localStorage.removeItem("token");

  };

  return (

    <AuthContext.Provider
      value={{

        user,
        login,
        logout,

      }}
    >

      {children}

    </AuthContext.Provider>

  );

};

export const useAuth = () =>

  useContext(AuthContext);