import { Routes, Route, useLocation } from "react-router-dom";
import { ROUTERS } from "./Router";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import RoleRoute from "./RoleRouter.jsx";
import GuestRoute from "./GuestRole.jsx";

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
import MomoResult from "../pages/client/CreateShipmentPage/components/MomoReturn.jsx";
import NotFound from "../pages/404";
import ProfilePage from "../pages/client/Profile/index.jsx";

// ===== ADMIN =====
import Dashboard from "../pages/admin/Dashboard";
import DashboardLayout from "../pages/admin/Layout";
import AdminAccountsPage from "../pages/admin/AccountManagement";
import AdminAgentsPage from "../pages/admin/AdminAgentsPage";
import AdminCustomersPage from "../pages/admin/AdminCustomersPage.jsx";
import AdminShipmentServicesPage from "../pages/admin/AdminShipmentServicesPage";
import AdminBranchesPage from "../pages/admin/AdminBranchesPage/index.jsx";
import AdminBillsPage from "../pages/admin/AdminBillsPage/index.jsx";
import DashboardReport from "../pages/admin/ReportAdminPage";
import AdminDeliveriesPage from "../pages/admin/AdminDeliveriesPage/index.jsx";
import ReportAdminPage from "../pages/admin/ReportAdminPage";

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
  { path: ROUTERS.USER.BLOG, element: <BlogPage /> },
  { path: ROUTERS.USER.PROFILE, element: <ProfilePage /> },
  { path: ROUTERS.USER.DELIVERIES, element: <AdminDeliveriesPage /> },
  { path: ROUTERS.USER.MOMORESULT, element: <MomoResult /> },
];

// ================= ADMIN ROUTER =================
const adminRouter = [
  { path: ROUTERS.ADMIN.DASHBOARD, element: <Dashboard /> },
  { path: ROUTERS.ADMIN.ACCOUNTS, element: <AdminAccountsPage /> },
  { path: ROUTERS.ADMIN.AGENTS, element: <AdminAgentsPage /> },
  { path: ROUTERS.ADMIN.CUSTOMERS, element: <AdminCustomersPage /> },
  { path: ROUTERS.ADMIN.SERVICES, element: <AdminShipmentServicesPage /> },
  { path: ROUTERS.ADMIN.BRANCHES, element: <AdminBranchesPage /> },
  { path: ROUTERS.ADMIN.BILL, element: <AdminBillsPage /> },
  { path: ROUTERS.ADMIN.REPORT, element: <DashboardReport /> },
  { path: ROUTERS.ADMIN.DELIVERIES, element: <AdminDeliveriesPage /> },
];

// ================= AGENT ROUTER =================
const agentRouter = [
  { path: ROUTERS.AGENTS.DASHBOARD, element: <Dashboard /> },
  { path: ROUTERS.AGENTS.CUSTOMERS, element: <AdminCustomersPage /> },
  { path: ROUTERS.AGENTS.DELIVERIES, element: <AdminDeliveriesPage /> },
  { path: ROUTERS.AGENTS.BILL, element: <AdminBillsPage /> },
  { path: ROUTERS.AGENTS.AGENTS, element: <AdminAgentsPage/> },
  { path: ROUTERS.AGENTS.REPORT, element: <ReportAdminPage /> },
  { path: ROUTERS.AGENTS.PROFILE, element: <ProfilePage /> },
];

// ================= RENDER USER =================
const RenderUserRouter = () => (
  <MasterLayout>
    <Routes>
      {userRouter.map((item, index) => {
        // LOGIN / REGISTER / FORGOT → chỉ cho guest
        if (
          item.path === ROUTERS.USER.LOGIN ||
          item.path === ROUTERS.USER.REGISTER ||
          item.path === ROUTERS.USER.FORGOTPASSWORD
        ) {
          return (
            <Route
              key={index}
              path={item.path}
              element={<GuestRoute>{item.element}</GuestRoute>}
            />
          );
        }

        // CREATE SHIPMENT / TRACKING → cần login
        if (
          item.path === ROUTERS.USER.CREATESHIPMENTPAGE ||
          item.path === ROUTERS.USER.TRACKINGPAGE
        ) {
          return (
            <Route
              key={index}
              path={item.path}
              element={<ProtectedRoute>{item.element}</ProtectedRoute>}
            />
          );
        }

        // public
        return <Route key={index} path={item.path} element={item.element} />;
      })}

      <Route path="*" element={<NotFound />} />
    </Routes>
  </MasterLayout>
);

// ================= RENDER AGENT =================
const RenderAgentRouter = () => (
  <DashboardLayout>
    <Routes>
      {agentRouter.map((item, index) => (
        <Route
          key={index}
          path={item.path}
          element={
            <ProtectedRoute>
              <RoleRoute allowRoles={["AGENT"]}>{item.element}</RoleRoute>
            </ProtectedRoute>
          }
        />
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </DashboardLayout>
);

// ================= RENDER ADMIN =================
const RenderAdminRouter = () => (
  <DashboardLayout>
    <Routes>
      {adminRouter.map((item, index) => (
        <Route
          key={index}
          path={item.path}
          element={
            <ProtectedRoute>
              <RoleRoute allowRoles={["ADMIN"]}>{item.element}</RoleRoute>
            </ProtectedRoute>
          }
        />
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
    <RenderAgentRouter />
  ) : (
    <RenderUserRouter />
  );
};

export default RouterCustom;
