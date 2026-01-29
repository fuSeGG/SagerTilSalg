import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEMES } from '../styles/themes';

const ThemeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [activeThemeId, setActiveThemeId] = useState(() => {
        // Lazy init active theme
        const saved = localStorage.getItem('sts_active_theme');
        return (saved && THEMES.find(t => t.id === saved)) ? saved : 'theme-1';
    });

    // Update logic when theme changes
    useEffect(() => {
        const theme = THEMES.find(t => t.id === activeThemeId) || THEMES[0];

        // Apply CSS variables
        const root = document.documentElement;
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
        Object.entries(theme.styles).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });

        // Apply data attribute for radical layout changes
        document.body.setAttribute('data-theme', theme.id);

        // Persist active theme
        localStorage.setItem('sts_active_theme', activeThemeId);
    }, [activeThemeId]);

    return (
        <ThemeContext.Provider value={{
            activeThemeId,
            setTheme: setActiveThemeId,
            themes: THEMES
        }}>
            {children}
        </ThemeContext.Provider>
    );
};
