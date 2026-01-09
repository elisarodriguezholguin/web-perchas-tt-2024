import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    primary: {
      main: "hsl(35, 79%, 64%)",
    },
    secondary: {
      main: "#3b2525",
    },
    error: {
      main: red.A400,
    },
  },
});
