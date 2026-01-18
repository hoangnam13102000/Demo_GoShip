import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth/auth";

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/dang-nhap" replace />;
  }

  return children;
};

export default ProtectedRoute;
