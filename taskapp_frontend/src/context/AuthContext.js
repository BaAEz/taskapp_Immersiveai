import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Configure axios defaults
axios.defaults.withCredentials = false; // Change to false since we're using '*' origin

const AuthContext = createContext();
const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5001'; // Add fallback

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  // Define verifyToken outside useEffect to avoid the dependency issue
  const verifyToken = async () => {
    try {
      await axios.get(`${SERVER_URL}/verify-token`);
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token is still valid
      verifyToken();
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token, verifyToken]); // Added verifyToken to dependency array

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${SERVER_URL}/login`, { email, password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  const signup = async (email, password) => {
    try {
      const { data } = await axios.post(`${SERVER_URL}/signup`, { email, password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);