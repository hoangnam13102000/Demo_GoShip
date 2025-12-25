// Import React
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Import Tailwind CSS
import "./styles/index.css";

// Router
import RouterCustom from "./routers/RouterCustom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <RouterCustom />
    </BrowserRouter>
  </React.StrictMode>
);
