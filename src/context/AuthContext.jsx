import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Mock Users
const USERS = [
  { id: 1, username: 'admin', password: '1111', role: 'admin', name: 'Администратор системы', service: null, location: 'Вся фабрика' },
  { id: 2, username: 'chefe', password: '2222', role: 'manager', name: 'Руководитель', service: null, location: 'Вся фабрика' },
  { id: 3, username: 'dispacho', password: '3333', role: 'dispatcher', name: 'Диспетчер', service: null, location: 'Цех измельчения' },
  { id: 4, username: 'user', password: '4444', role: 'user', name: 'Иван Механик', service: 'Механики', location: 'Участок 1' },
  { id: 5, username: 'supply', password: '5555', role: 'supply', name: 'Отдел Снабжения', service: 'Снабжение', location: 'Склад' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('catoca_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = USERS.find(u => u.username === username && u.password === password);
        if (foundUser) {
          const userWithoutPass = { ...foundUser };
          delete userWithoutPass.password;
          setUser(userWithoutPass);
          localStorage.setItem('catoca_user', JSON.stringify(userWithoutPass));
          resolve(userWithoutPass);
        } else {
          reject(new Error('Неверный логин или пароль'));
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('catoca_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
