import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
    if (token) {
      setUser({ token });
      setIsAdmin(storedIsAdmin);
    }
  }, []);

  const login = (token, admin) => {
    localStorage.setItem('token', token);
    localStorage.setItem('isAdmin', admin);
    setUser({ token });
    setIsAdmin(admin);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

