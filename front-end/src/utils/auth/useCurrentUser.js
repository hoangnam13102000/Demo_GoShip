import { useMemo } from "react";

const useCurrentUser = () => {
  return useMemo(() => {
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
  }, []);
};

export default useCurrentUser;