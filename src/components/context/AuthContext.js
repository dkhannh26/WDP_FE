import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { PATH } from "../../config/api.config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [user, setUser] = useState({});

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    // console.log(token);

    if (token) {
      try {
        const response = await axios.post(
          PATH.checkAuth,
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
          setUsername(response.data.user.username);
          setUser(response.data.user);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error: ", error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        username,
        setIsAuthenticated,
        setUsername,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the Auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
