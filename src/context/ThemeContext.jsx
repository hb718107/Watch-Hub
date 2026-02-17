import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('watchhub_theme');
        return savedTheme || 'dark'; // Default to dark
    });

    useEffect(() => {
        const root = document.documentElement;
        // Remove previous theme class
        root.classList.remove('light', 'dark');
        // Add current theme class
        root.classList.add(theme);
        // Save to local storage
        localStorage.setItem('watchhub_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
