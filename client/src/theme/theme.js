import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#361E70", // Color 1
    },
    secondary: {
      main: "#1F1147", // Color 2
    },
    error: {
      main: "#FF5252", // Color 3
    },
    warning: {
      main: "#6949FD", // Color 4
    },
    info: {
      main: "#38E9BB", // Color 5
    },
    text: {
      primary: "#ffffff", // Set default text color to white
    },

    background: {
      paper: "#1F1147",
    },
  },
  typography: {
    fontFamily: "Urbanist, sans-serif", // Use "Urbanist" font
    fontSize: 16,
  },
});

export default theme;
