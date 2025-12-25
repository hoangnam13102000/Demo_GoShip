import { Routes, Route } from "react-router-dom";
import { ROUTERS } from "./router";
import MasterLayout from "../pages/client/Layout";
import HomePage from "../pages/client/Home/index";

//================= USER ROUTER =================//
const userRouter = [
  {
    path: ROUTERS.USER.HOME,
    element: <HomePage />,
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
