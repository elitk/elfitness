"use client";
import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "theme-pref";

/** Toggle helper */
export const oppositeTheme = (t: Theme): Theme =>
  t === "light" ? "dark" : "light";

interface SettingsContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem(STORAGE_KEY) as Theme) || "dark";
  });

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(STORAGE_KEY, newTheme);
    setThemeState(newTheme);
  };

  return (
    <SettingsContext.Provider value={{ theme, setTheme }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx)
    throw new Error("useSettings must be used within a SettingsProvider");
  return ctx;
};
