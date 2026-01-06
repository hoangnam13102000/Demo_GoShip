// Import React
import React from "react";
import ReactDOM from "react-dom/client";

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import Tailwind CSS
import "./styles/index.css";

// Import Router
import RouterCustom from "./routers/RouterCustom";
import { BrowserRouter } from "react-router-dom";
// import { AuthProvider } from "./contexts/AuthContexts";

// Tạo QueryClient (BẮT BUỘC)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 30,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* <AuthProvider> */}
          <RouterCustom />
        {/* </AuthProvider> */}
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
