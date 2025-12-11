
import React, { createContext, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useAppContext } from '../state/AppContext.tsx';
import * as actions from '../state/actions.ts';
// FIX: Import useAuth to get authentication state
import { useAuth } from '../state/AuthContext.tsx';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { dispatch } = useAppContext();
    // FIX: Get auth state from useAuth hook
    const { authState } = useAuth();
    const { currentUser } = authState;
    
    // The theme is now derived directly from the logged-in user's state.
    const theme = currentUser?.theme || 'light';

    // This effect applies the theme to the document and is the single source of truth for the CSS.
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        if (!currentUser) return; // Cannot change theme if not logged in

        const newTheme = theme === 'light' ? 'dark' : 'light';
        dispatch({
            type: actions.UPDATE_USER_THEME,
            payload: { userId: currentUser.id, theme: newTheme }
        });
    }, [theme, currentUser, dispatch]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
