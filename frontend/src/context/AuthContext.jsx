import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        username: 'Kajal_Ops',
        role: 'Dispatcher' // Alternates between 'Dispatcher' and 'Admin'
    });

    const switchRole = (newRole) => {
        setUser(prev => ({ ...prev, role: newRole }));
    };

    return (
        <AuthContext.Provider value={{ user, switchRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);