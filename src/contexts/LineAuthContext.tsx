import { createContext, useContext, useState, type ReactNode } from 'react';
import { type LineUser, mockLineUser } from '../data/mockLineUser';

interface LineAuthContextType {
    lineUser: LineUser | null;
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

const LineAuthContext = createContext<LineAuthContextType | undefined>(undefined);

export const LineAuthProvider = ({ children }: { children: ReactNode }) => {
    const [lineUser, setLineUser] = useState<LineUser | null>(null);

    const login = () => {
        // In production, this would call LINE Login API
        // For now, use mock data
        setLineUser(mockLineUser);
    };

    const logout = () => {
        setLineUser(null);
    };

    return (
        <LineAuthContext.Provider
            value={{
                lineUser,
                isAuthenticated: lineUser !== null,
                login,
                logout,
            }}
        >
            {children}
        </LineAuthContext.Provider>
    );
};

export const useLineAuth = () => {
    const context = useContext(LineAuthContext);
    if (context === undefined) {
        throw new Error('useLineAuth must be used within a LineAuthProvider');
    }
    return context;
};
