import { Navigate } from "react-router-dom";
import { hasRole } from "../utils/auth/auth";

const RoleRoute = ({ allowRoles = [], children }) => {
  if (!hasRole(allowRoles)) {
    return <Navigate to="/404" replace />;
  }

  return children;
};

export default RoleRoute;
