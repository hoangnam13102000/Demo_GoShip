// hooks/usePermission.js
import { useMemo } from "react";

const usePermission = (user = null) => {
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
  const currentUserId = currentUser?.id;
  const currentUserBranchId = currentUser?.branch_id;

  // Kiểm tra quyền
  const hasRole = (roles) => {
    if (Array.isArray(roles)) {
      return roles.includes(currentUserRole);
    }
    return roles === currentUserRole;
  };

  const isAdmin = currentUserRole === "ADMIN";
  const isAgent = currentUserRole === "AGENT";
  const isUser = currentUserRole === "USER";

  // Kiểm tra quyền sở hữu
  const canEdit = (resourceUserId, resourceBranchId = null) => {
    if (isAdmin) return true;
    if (isAgent && resourceBranchId === currentUserBranchId) return true;
    if (isUser && resourceUserId === currentUserId) return true;
    return false;
  };

  // Kiểm tra quyền xóa
  const canDelete = (resourceUserId, resourceBranchId = null) => {
    if (isAdmin) return true;
    if (isAgent && resourceBranchId === currentUserBranchId) return true;
    if (isUser && resourceUserId === currentUserId) return true;
    return false;
  };

  return {
    user: currentUser,
    role: currentUserRole,
    userId: currentUserId,
    branchId: currentUserBranchId,
    hasRole,
    isAdmin,
    isAgent,
    isUser,
    canEdit,
    canDelete,
  };
};

export default usePermission;