import React, { createContext, useState, useEffect } from "react";

export const RegionContext = createContext();

export const RegionProvider = ({ children }) => {
    const [selectedRegion, setSelectedRegion] = useState("Please select a region");

    // Clear selected region when page loads/refreshes
    useEffect(() => {
        localStorage.removeItem('selectedRegion');
    }, []);

    return (
        <RegionContext.Provider value={{ selectedRegion, setSelectedRegion }}>
            {children}
        </RegionContext.Provider>
    );
};
