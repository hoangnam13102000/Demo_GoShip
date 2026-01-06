// /* eslint-disable react-refresh/only-export-components */
// import { createContext, useContext, useEffect, useState } from "react";
// import { loginAPI, logoutAPI, getCurrentUser } from "../api/auth/request";

// const AuthContext = createContext(null);

// const getInitialUser = () => {
//   const token = localStorage.getItem("token");
//   const account_id = localStorage.getItem("account_id");
//   const username = localStorage.getItem("username");
//   const role = localStorage.getItem("role");
//   const status = localStorage.getItem("status");

//   if (!token || !account_id) return null;

//   return {
//     account_id: Number(account_id),
//     username,
//     role,
//     status,
//     token,
//   };
// };

// export const AuthProvider = ({ children }) => {
//   // Lấy user ngay từ localStorage → KHÔNG văng 404 khi refresh
//   const [user, setUser] = useState(getInitialUser());
//   const [loading, setLoading] = useState(true);
//   const isAuthenticated = !!user?.token;

//   // Xác thực token bằng API nhưng không xóa user lúc đầu
//   useEffect(() => {
//     const verifyToken = async () => {
//       const storedUser = getInitialUser();
//       if (!storedUser?.token) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await getCurrentUser(storedUser.token);

//         if (res.status?.toUpperCase() !== "ACTIVE") throw new Error("Account inactive");

//         setUser({
//           account_id: res.id,
//           username: res.email,
//           role: res.role,
//           status: res.status,
//           token: storedUser.token,
//         });
//       } catch (err) {
//         console.warn("Token verify failed:", err);
//         clearStorage();
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyToken();
//   }, []);

//   // Login
//   const login = async (credentials) => {
//     const res = await loginAPI(credentials);

//     if (!res?.user || !res?.token)
//       throw new Error("Dữ liệu đăng nhập không hợp lệ");

//     const { id, email, role, status } = res.user;

//     if (status?.toUpperCase() !== "ACTIVE")
//       throw new Error("Tài khoản bị khóa");

//     const userData = {
//       account_id: id,
//       username: email,
//       role,
//       status,
//       token: res.token,
//     };

//     localStorage.setItem("token", res.token);
//     localStorage.setItem("account_id", id);
//     localStorage.setItem("username", email);
//     localStorage.setItem("role", role);
//     localStorage.setItem("status", status);

//     setUser(userData);
//     window.dispatchEvent(new Event("storage"));
//     return userData;
//   };

//   // Logout
//   const logout = async () => {
//     try {
//       if (user?.token) await logoutAPI(user.token);
//     } catch (err) {
//       console.warn("Logout API error:", err);
//     } finally {
//       clearStorage();
//       setUser(null);
//       window.dispatchEvent(new Event("storage"));
//     }
//   };

//   const clearStorage = () => {
//     ["account_id", "username", "role", "status", "token"]
//       .forEach(k => localStorage.removeItem(k));
//   };

//   // Đồng bộ nhiều tab
//   useEffect(() => {
//     const syncAuth = () => setUser(getInitialUser());
//     window.addEventListener("storage", syncAuth);
//     return () => window.removeEventListener("storage", syncAuth);
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
//   return ctx;
// };
