import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";


// Create Context

const AuthContext = createContext();


// Provider Component

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);


  // Load user from localStorage

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {

      setUser(JSON.parse(storedUser));

    }

  }, []);


  // Login Function

  const login = (userData) => {

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);

  };


  // Logout Function

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


// Custom Hook

export const useAuth = () => {

  return useContext(AuthContext);

};