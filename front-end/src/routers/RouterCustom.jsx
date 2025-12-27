import { Routes, Route } from "react-router-dom";
import { ROUTERS } from "./Router";

import MasterLayout from "../pages/client/Layout";
import HomePage from "../pages/client/Home/index";
import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/auth/Resgister";
import ForgotPasswordPage from "../pages/auth/ForgotPassword";
import AboutPage from "../pages/client/About";
import ContactPage from "../pages/client/Contact";
import ServicesPage from "../pages/client/Services";
import BlogPage from "../pages/client/Blog";
import NotFound from "../pages/404";

//================= USER ROUTER =================//
const userRouter = [
  {
    path: ROUTERS.USER.HOME,
    element: <HomePage />,
  },
  {
    path: ROUTERS.USER.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTERS.USER.REGISTER,
    element: <RegisterPage />,
  },
   {
    path: ROUTERS.USER.FORGOTPASSWORD,
    element: <ForgotPasswordPage />,
  },
  { path: ROUTERS.USER.ABOUT, element: <AboutPage /> },
  { path: ROUTERS.USER.CONTACT, element: <ContactPage /> },
  { path: ROUTERS.USER.SERVICES, element: <ServicesPage /> },
  { path: ROUTERS.USER.BLOG, element: <BlogPage /> },
   {
    path: ROUTERS.USER.NOTFOUND,
    element: <NotFound />,
  },
  
];

//================= RENDER USER =================//
const RenderUserRouter = () => (
  <MasterLayout>
    <Routes>
      {userRouter.map((item, key) => (
        <Route key={key} path={item.path} element={item.element} />
      ))}
    </Routes>
  </MasterLayout>
);

//================= MAIN ROUTER =================//
const RouterCustom = () => {
  return <RenderUserRouter />;
};

export default RouterCustom;
