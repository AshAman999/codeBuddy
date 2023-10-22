import { createTheme, ThemeProvider } from "@mui/material";
import { blue, deepOrange, green, pink, teal } from "@mui/material/colors";
import React from "react";

const baseTheme = createTheme({
  typography: {
    fontFamily: "'Arial', sans-serif",
  },
  palette: {
    primary: blue,
    secondary: teal,
  },
});

const customTheme = (theme) =>
  createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      primary: pink,
      secondary: deepOrange,
      success: green,
    },
  });

const MyCustomProvider = ({ children }) => {
  return (
    <ThemeProvider theme={customTheme(baseTheme)}>{children}</ThemeProvider>
  );
};

export default MyCustomProvider;
