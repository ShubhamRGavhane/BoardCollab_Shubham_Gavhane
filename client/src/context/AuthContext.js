import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUser({ id: decoded.id, username: decoded.username });
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      username,
      password,
    });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    // No need to setUser here – effect will do it
    return res.data;
  };

  const register = async (username, password) => {
    const res = await axios.post("http://localhost:5000/api/auth/register", {
      username,
      password,
    });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
