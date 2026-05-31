import React, { createContext, useContext, useMemo } from "react";
import { theme, type Theme } from "../tokens";

const ThemeContext = createContext<Theme>(theme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(() => theme, []);
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
