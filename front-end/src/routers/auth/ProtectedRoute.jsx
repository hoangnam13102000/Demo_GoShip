// /* eslint-disable react-refresh/only-export-components */
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContexts";
// import NotFound from "../../pages/404";

// // ===================== PROTECT ADMIN =====================
// export const ProtectAdmin = ({ children }) => {
//   const { user, isAuthenticated, loading } = useAuth();

//   if (loading) return <div />;

//   // Chưa đăng nhập → 404
//   if (!isAuthenticated || !user) return <NotFound />;

//   // USER TRUY CẬP ADMIN → 404 (CHẶN HẲN)
//   if (user.role?.toUpperCase() === "USER") {
//     return <NotFound />;
//   }

//   return children;
// };

// // ===================== PROTECT USER =====================
// export const ProtectUser = ({ children }) => {
//   const { user, isAuthenticated, loading } = useAuth();

//   if (loading) return <div />;

//   // Chưa đăng nhập → 404
//   if (!isAuthenticated || !user) return <NotFound />;

//   // ADMIN / AGENT mà cố truy cập user → vẫn cho phép, không chặn.
//   // (NẾU BẠN MUỐN CHẶN, bảo tôi chỉnh lại)

//   return children;
// };
