import React, { createContext, useContext, useState } from 'react';

const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
    const [refresh, setRefresh] = useState(false);

    const toggleRefresh = () => {
        setRefresh(prev => !prev);
    };

    return (
        <RefreshContext.Provider value={{ refresh, toggleRefresh }}>
            {children}
        </RefreshContext.Provider>
    );
};

export const useRefresh = () => useContext(RefreshContext);