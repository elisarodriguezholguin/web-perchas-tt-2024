import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from ".";
import { Children } from "../interfaces";

export const AppTheme = ({ children }: Children) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
