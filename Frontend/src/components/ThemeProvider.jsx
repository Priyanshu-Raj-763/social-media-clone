import { useEffect } from "react";
import { useSelector } from "react-redux";
import { applyTheme } from "../lib/themeUtils.js";

export default function ThemeProvider({ children }) {
  const mode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    applyTheme(mode);
  }, [mode]);

  return children;
}
