import { createTheme, ThemeProvider } from "@mui/material";
import { blue, deepOrange, green, pink, teal } from "@mui/material/colors";
import React from "react";

const baseTheme = createTheme({
  typography: {
    // body1: {
    //   fontSize: 12,
    //   fontWeight: 600,
    // },
  },
  palette: {
    primary: pink,
    secondary: deepOrange,
  },
});

const customTheme = (theme) =>
  createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      primary: green,
    },
  });

const MyCustomProvider = ({ children }) => {
  return (
    <ThemeProvider theme={customTheme(baseTheme)}>{children}</ThemeProvider>
  );
};

export default MyCustomProvider;
