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

    const [lockedThemes, setLockedThemes] = useState(() => {
        // Lazy init locked themes
        const saved = localStorage.getItem('sts_locked_themes');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Ensure theme-1 is always locked
                return new Set([...parsed, 'theme-1']);
            } catch {
                return new Set(['theme-1']);
            }
        }
        return new Set(['theme-1']);
    });

    // Persist default state if empty on mount (side effect only)
    useEffect(() => {
        if (!localStorage.getItem('sts_locked_themes')) {
            localStorage.setItem('sts_locked_themes', JSON.stringify(['theme-1']));
        }
    }, []);

    // Update logic when theme changes or locks change
    useEffect(() => {
        const theme = THEMES.find(t => t.id === activeThemeId) || THEMES[0];

        // Apple CSS variables
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

    const toggleLock = (themeId) => {
        setLockedThemes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(themeId)) {
                // user requested to unlock
                // prevent unlocking theme-1 if strictly required, but for now we allow unlocking manually if user wants, 
                // BUT the initial requirement was "Make sure current theme becomes a locked theme 1", which we did in init.
                // If we want to ENFORCE theme 1 is ALWAYS locked, we would check logic here.
                // "Make sure current theme becomes a locked theme 1" -> usually means initial state.

                newSet.delete(themeId);
            } else {
                newSet.add(themeId);
            }

            // Save to local storage
            localStorage.setItem('sts_locked_themes', JSON.stringify([...newSet]));
            return newSet;
        });
    };

    return (
        <ThemeContext.Provider value={{
            activeThemeId,
            setTheme: setActiveThemeId,
            lockedThemes,
            toggleLock,
            themes: THEMES
        }}>
            {children}
        </ThemeContext.Provider>
    );
};
