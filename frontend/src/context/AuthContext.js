import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize CSRF token and check auth
    const initializeApp = async () => {
      try {
        // Get debug info first
        const debugInfo = await authAPI.getDebugInfo();
        console.log('Backend debug info:', debugInfo.data);
        
        // Initialize CSRF token
        await authAPI.initializeCSRF();
        console.log('CSRF initialized on app start');
      } catch (error) {
        console.error('Failed to initialize CSRF:', error);
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response headers:', error.response.headers);
        }
      }
      
      // Then check authentication
      await checkAuth();
    };
    
    initializeApp();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username) => {
    try {
      const response = await authAPI.login(username);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
