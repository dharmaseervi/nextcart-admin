'use client'
import React, { createContext, useState } from 'react';


export const GlobalContext = createContext({});

export default function GlobalProvider({ children }) {
    const [orderCounts, setOrderCounts] = useState([]);
    const [orderPlaced, setOrderPlaced] = useState([]);
    return (
        <GlobalContext.Provider value={{
            orderCounts, setOrderCounts,orderPlaced, setOrderPlaced
        }}>
            {children}
        </GlobalContext.Provider>
    );
}


