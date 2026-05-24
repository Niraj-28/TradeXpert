import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";


const AuthContext = createContext();


export const AuthProvider = ({
  children,
}) => {

  const [user, setUser] = useState(null);


  // Load User

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {

      setUser(
        JSON.parse(storedUser)
      );

    }

  }, []);


  // Login

  const login = (userData) => {

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);

  };


  // Logout

  const logout = () => {

    localStorage.removeItem("user");

    setUser(null);

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


export const useAuth = () => {

  return useContext(AuthContext);

};