// Import React
import React from "react";
import ReactDOM from "react-dom/client";


// Import Tailwind CSS
import "./styles/index.css";

// Import Router
import RouterCustom from "./routers/RouterCustom";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <RouterCustom />
    </BrowserRouter>
  </React.StrictMode>
);
