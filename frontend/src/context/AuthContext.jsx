import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const rawAPI = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = rawAPI.endsWith("/") ? rawAPI.slice(0, -1) : rawAPI;
console.log("Using API URL:", API);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      checkAuth(token);
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async (token) => {
    try {
      const { data } = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
    } catch (err) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  };

  const signup = async (email, password, fullName) => {
    const { data } = await axios.post(`${API}/auth/signup`, { email, password, fullName });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  };

  const updateProfile = async (fullName) => {
    const token = localStorage.getItem("token");
    const { data } = await axios.put(`${API}/auth/profile`, { fullName }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(data);
    return data;
  };

  const logout = (redirectPath = "/login") => {
    localStorage.clear();
    setUser(null);
    window.location.href = redirectPath;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
