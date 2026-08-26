import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#1f1f1f",
      paper: "#2a2a2a",
    },
    primary: {
      main: "#8ab4f8",
    },
    text: {
      primary: "#f5f5f5",
      secondary: "#b3b3b3",
    },
  },
  typography: {
    fontFamily: ['"Inter"', "system-ui", "-apple-system", "sans-serif"].join(","),
    h1: {
      fontWeight: 700,
    },
    subtitle1: {
      fontWeight: 400,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  shape: {
    borderRadius: 12,
  },
});
