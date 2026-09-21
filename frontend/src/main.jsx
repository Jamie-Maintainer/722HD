import React from "react";
import ReactDOM from "react-dom/client";
import {
  CssBaseline,
  ThemeProvider,
} from "@mui/material";

import App from "./App";
import theme from "./theme";
import ErrorBoundary from "./components/ErrorBoundary";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
