import { Routes, Route, useLocation } from "react-router-dom";
import { ROUTERS } from "./Router";

// ===== USER =====
import MasterLayout from "../pages/client/Layout";
import HomePage from "../pages/client/Home";
import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/auth/Resgister";
import ForgotPasswordPage from "../pages/auth/ForgotPassword";
import AboutPage from "../pages/client/About";
import ContactPage from "../pages/client/Contact";
import ServicesPage from "../pages/client/Services";
import BlogPage from "../pages/client/Blog";
import CreateShipmentPage from "../pages/client/CreateShipmentPage";
import TrackingPage from "../pages/client/TrackingPage";
import NotFound from "../pages/404";

// ===== ADMIN =====
import Dashboard from "../pages/admin/Dashboard";
import DashboardLayout from "../pages/admin/Layout";
import AdminAccountsPage from "../pages/admin/AccountManagement";
import AdminAgentsPage from "../pages/admin/AdminAgentsPage";
import AdminCustomersPage from "../pages/admin/AdminCustomersPage.jsx";
import AdminShipmentServicesPage from "../pages/admin/AdminShipmentServicesPage";
import AdminShipmentsPage from "../pages/admin/AdminShipmentsPage/index.jsx";
import AdminBranchesPage from "../pages/admin/AdminBranchesPage/index.jsx";
import AdminBillsPage from "../pages/admin/AdminBillsPage/index.jsx";

// ===== AGENT =====
import AgentDashboard from "../pages/agent/Layout";
// ================= USER ROUTER =================
const userRouter = [
  { path: ROUTERS.USER.HOME, element: <HomePage /> },
  { path: ROUTERS.USER.LOGIN, element: <LoginPage /> },
  { path: ROUTERS.USER.REGISTER, element: <RegisterPage /> },
  { path: ROUTERS.USER.FORGOTPASSWORD, element: <ForgotPasswordPage /> },
  { path: ROUTERS.USER.ABOUT, element: <AboutPage /> },
  { path: ROUTERS.USER.CONTACT, element: <ContactPage /> },
  { path: ROUTERS.USER.SERVICES, element: <ServicesPage /> },
  { path: ROUTERS.USER.CREATESHIPMENTPAGE, element: <CreateShipmentPage /> },
  { path: ROUTERS.USER.TRACKINGPAGE, element: <TrackingPage /> },
  { path: ROUTERS.USER.BLOG, element: <BlogPage /> },
];

// ================= ADMIN ROUTER =================
const adminRouter = [
  { path: ROUTERS.ADMIN.DASHBOARD, element: <Dashboard /> },
  { path: ROUTERS.ADMIN.ACCOUNTS, element: <AdminAccountsPage /> },
  { path: ROUTERS.ADMIN.AGENTS, element: <AdminAgentsPage /> },
  { path: ROUTERS.ADMIN.CUSTOMERS, element: <AdminCustomersPage /> },
  { path: ROUTERS.ADMIN.SERVICES, element: <AdminShipmentServicesPage /> },
  { path: ROUTERS.ADMIN.SHIPMENTS, element: <AdminShipmentsPage /> },
  { path: ROUTERS.ADMIN.BRANCHES, element: <AdminBranchesPage /> },
  { path: ROUTERS.ADMIN.BILL, element: <AdminBillsPage /> },

];

// ================= ADMIN ROUTER =================
const agentRouter = [
  { path: ROUTERS.AGENTS.DASHBOARD, element: <Dashboard /> },
];
// ================= RENDER USER =================
const RenderUserRouter = () => (
  <MasterLayout>
    <Routes>
      {userRouter.map((item, index) => (
        <Route key={index} path={item.path} element={item.element} />
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </MasterLayout>
);

// ================= RENDER ADMIN =================
const RenderAdminRouter = () => (
  <DashboardLayout>
    <Routes>
      {adminRouter.map((item, index) => (
        <Route
          key={index}
          path={item.path}   // path now = "dashboard"
          element={item.element}/>
      ))}

      <Route path="*" element={<NotFound />} />
    </Routes>
  </DashboardLayout>
);

// ================= MAIN ROUTER =================
const RouterCustom = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAgentRoute = location.pathname.startsWith("/agent");
  return isAdminRoute ? (
    <RenderAdminRouter />
  ) : isAgentRoute ? (
    <AgentDashboard />
  ) : (
    <RenderUserRouter />
  );
};

export default RouterCustom;
