import { useMemo } from "react";
import { useCRUDApi } from "../../api/hooks/useCRUDApi";

/* ================= HOOK GỐC - GIỮ NGUYÊN 100% ================= */
/**
 * Hook gốc - KHÔNG THAY ĐỔI GÌ
 * File DeliveryManager.jsx và các file khác vẫn dùng hook này bình thường
 */
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

/* ================= HOOKS MỚI - THÊM VÀO ================= */

/**
 * Hook lấy thông tin agent hiện tại từ API
 * Hook MỚI - không ảnh hưởng code cũ
 */
export const useCurrentAgent = () => {
  const currentUser = useCurrentUser(); // Dùng hook gốc
  const { useGetAll } = useCRUDApi("agents");
  
  return useGetAll({
    staleTime: 30000,
    select: (data) => {
      if (!currentUser?.id) return null;
      return data.find(agent => agent.account_id === currentUser.id);
    },
    enabled: !!currentUser?.id
  });
};

/**
 * Hook tổng hợp - lấy đầy đủ thông tin user + agent + các trường tiện ích
 * Hook MỚI - không ảnh hưởng code cũ
 */
export const useCurrentUserWithAgent = () => {
  const currentUser = useCurrentUser(); // Dùng hook gốc
  const { data: agent, isLoading: loadingAgent, isError } = useCurrentAgent();
  
  return {
    // User info
    user: currentUser,
    userId: currentUser?.id,
    userEmail: currentUser?.email,
    
    // Agent info
    agent,
    agentId: agent?.id,
    
    // Role info
    role: currentUser?.role || "USER",
    isAdmin: currentUser?.role === "ADMIN",
    isAgent: currentUser?.role === "AGENT",
    isUser: currentUser?.role === "USER",
    
    // Branch info
    branchId: agent?.branch_id,
    branchName: agent?.branch?.name || "Chi nhánh",
    hasBranch: !!(agent?.branch_id || currentUser?.role === "ADMIN"),
    
    // Loading states
    isLoading: loadingAgent,
    isError,
  };
};