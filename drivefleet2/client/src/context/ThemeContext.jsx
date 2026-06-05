import { createContext, useContext, useState, useEffect } from "react";
const ThemeContext = createContext(null);
export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => localStorage.getItem("df_theme") === "dark");
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("df_theme", dark ? "dark" : "light");
  }, [dark]);
  return <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>{children}</ThemeContext.Provider>;
};
export const useTheme = () => useContext(ThemeContext);
