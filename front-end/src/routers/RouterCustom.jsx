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
import NotFound from "../pages/404";

// ===== ADMIN =====
import Dashboard from "../pages/admin/Dashboard";
import DashboardLayout from "../pages/admin/Layout";

// ================= USER ROUTER =================
const userRouter = [
  { path: ROUTERS.USER.HOME, element: <HomePage /> },
  { path: ROUTERS.USER.LOGIN, element: <LoginPage /> },
  { path: ROUTERS.USER.REGISTER, element: <RegisterPage /> },
  { path: ROUTERS.USER.FORGOTPASSWORD, element: <ForgotPasswordPage /> },
  { path: ROUTERS.USER.ABOUT, element: <AboutPage /> },
  { path: ROUTERS.USER.CONTACT, element: <ContactPage /> },
  { path: ROUTERS.USER.SERVICES, element: <ServicesPage /> },
  { path: ROUTERS.USER.BLOG, element: <BlogPage /> },
  { path: "*", element: <NotFound /> },
];

// ================= ADMIN ROUTER =================
const adminRouter = [
  { path: ROUTERS.ADMIN.DASHBOARD, element: <Dashboard /> },
];

// ================= RENDER USER =================
const RenderUserRouter = () => (
  <MasterLayout>
    <Routes>
      {userRouter.map((item, index) => (
        <Route key={index} path={item.path} element={item.element} />
      ))}
    </Routes>
  </MasterLayout>
);

// ================= RENDER ADMIN =================
const RenderAdminRouter = () => (
  <DashboardLayout>
    <Routes>
      {adminRouter.map((item, index) => (
        <Route key={index} path={item.path} element={item.element} />
      ))}
    </Routes>
  </DashboardLayout>
);

// ================= MAIN ROUTER =================
const RouterCustom = () => {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return isAdminRoute ? <RenderAdminRouter /> : <RenderUserRouter />;
};

export default RouterCustom;
