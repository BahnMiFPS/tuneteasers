import { createTheme, responsiveFontSizes } from "@mui/material"

let theme = createTheme({
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
  },
})
theme = responsiveFontSizes(theme, {
  breakpoints: ["xs", "sm", "md", "lg", "xl"], // breakpoints to consider
  disableAlign: false, // whether to align to Material Design's 4px line height grid
  factor: 2, // determines the strength of resizing
  variants: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "subtitle1",
    "subtitle2",
    "body2",
    "caption",
    "button",
    "body1",
  ], // typography variants to handle
})

export default theme
