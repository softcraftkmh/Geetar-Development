import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";

import App from "./pages/App";
import "./styles.css";
import "react-table/react-table.css";

ReactDOM.render(
  <div>
    <CssBaseline />
    <App />
  </div>,
  document.getElementById("root")
);
