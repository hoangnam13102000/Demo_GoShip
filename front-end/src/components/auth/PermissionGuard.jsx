import { useMemo } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const PermissionGuard = ({
  children,
  allowedRoles = [],
  deniedRoles = [],
  user,
  customMessage = "Không có quyền truy cập",
  customComponent = null,
}) => {
  // Lấy thông tin người dùng hiện tại
  const currentUser = useMemo(() => {
    if (user) return user;
    
    try {
      const userData = localStorage.getItem("user");
      const authData = localStorage.getItem("auth");

      if (userData) {
        return JSON.parse(userData);
      }

      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.user || parsed;
      }

      return null;
    } catch (error) {
      return null;
    }
  }, [user]);

  const currentUserRole = currentUser?.role || "USER";

  // Kiểm tra quyền truy cập
  const hasPermission = useMemo(() => {
    // Nếu có deniedRoles và người dùng thuộc deniedRoles -> từ chối
    if (deniedRoles.length > 0 && deniedRoles.includes(currentUserRole)) {
      return false;
    }

    // Nếu có allowedRoles và người dùng không thuộc allowedRoles -> từ chối
    if (allowedRoles.length > 0 && !allowedRoles.includes(currentUserRole)) {
      return false;
    }

    // Nếu cả hai đều rỗng -> cho phép tất cả
    if (allowedRoles.length === 0 && deniedRoles.length === 0) {
      return true;
    }

    return true;
  }, [currentUserRole, allowedRoles, deniedRoles]);

  // Render component tùy chỉnh hoặc mặc định
  if (!hasPermission) {
    if (customComponent) {
      return customComponent;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <FaExclamationTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không có quyền truy cập
          </h2>
          <p className="text-gray-600">{customMessage}</p>
        </div>
      </div>
    );
  }

  return children;
};

export default PermissionGuard;