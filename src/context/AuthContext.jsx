
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (email, password) => {
        if (email === 'admin@crediapp.com' && password === 'admin123') {
            const userData = { email, role: 'admin' };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return userData;
        }
        if (email === 'cliente@crediapp.com' && password === 'cliente123') {
            const userData = { email, role: 'client' };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return userData;
        }
        return null;
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
  