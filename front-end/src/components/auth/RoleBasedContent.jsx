import { useMemo } from "react";

const RoleBasedContent = ({
  children,
  user,
  renderByRole = {},
  defaultContent = null,
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

  // Lấy nội dung dựa trên role
  const content = useMemo(() => {
    if (renderByRole[currentUserRole]) {
      return renderByRole[currentUserRole];
    }
    return defaultContent || children;
  }, [currentUserRole, renderByRole, defaultContent, children]);

  return content;
};

export default RoleBasedContent;