import React, { createContext, useState, useContext, ReactNode } from 'react';

// Create the context
const UtilityContext = createContext<{
    animStatus: boolean;
    setAnimStatus: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

// Provider component
export const UtilityProvider = ({ children }: { children: ReactNode }) => {
    const [animStatus, setAnimStatus] = useState<boolean>(true);

    return (
        <UtilityContext.Provider value={{ animStatus, setAnimStatus }}>
            {children}
        </UtilityContext.Provider>
    );
};

// Custom hook to use the Utility context
export const useUtility = () => {
    const context = useContext(UtilityContext);
    if (!context) {
        throw new Error('useUtility must be used within a UtilityProvider');
    }
    return context;
};
