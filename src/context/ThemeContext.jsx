import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("dark"); // Always dark mode

    useEffect(() => {
        const root = window.document.documentElement;
        root.setAttribute("data-theme", "dark"); // Always set dark theme
        // Remove any stored theme preference
        localStorage.removeItem("theme");
    }, []);

    const toggleTheme = () => {
        // No toggle functionality - always dark
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
