import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Chatbot from "../../../components/chats/ChatWidget";

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main content */}
      <div
        className={`
          flex flex-col
          flex-1 min-h-screen bg-gray-100
          transition-all duration-300
          ${collapsed ? "ml-20" : "ml-64"}
        `}
      >
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>

        {/* Footer */}
        <Footer />

        
        <div style={{ position: "fixed", bottom: "1rem", right: "1rem", zIndex: 999, display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-end" }}>
          <Chatbot isStacked={true} />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;