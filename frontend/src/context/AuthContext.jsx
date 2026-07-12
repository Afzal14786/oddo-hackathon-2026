// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setLogoutHandler } from '../api/client';
import { getMe, login as loginApi, register as registerApi, logout as logoutApi } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        setUser(res.data.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Register logout handler with Axios interceptor
  useEffect(() => {
    setLogoutHandler(() => {
      setUser(null);
      navigate('/login');
    });
    return () => setLogoutHandler(null);
  }, [navigate]);

  // Login
  const login = async (credentials) => {
    const res = await loginApi(credentials);
    setUser(res.data.data.user);
    navigate('/');
    return res;
  };

  // Register
  const register = async (userData) => {
    const res = await registerApi(userData);
    return res;
  };

  // Logout
  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      // ignore errors
    } finally {
      setUser(null);
      navigate('/login');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};