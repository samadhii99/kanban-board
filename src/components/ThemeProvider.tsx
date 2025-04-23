// ThemeProvider.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define context types
type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
};

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

// Custom hook to use theme
export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get initial theme from localStorage if available, otherwise default to 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Apply theme class to both body and #root when theme changes
  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-theme" : "";

    // Also apply to root element for more specific styling
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.className = theme === "dark" ? "dark-theme" : "";
    }

    // Apply to html element for fullscreen coverage
    document.documentElement.className = theme === "dark" ? "dark-theme" : "";
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
