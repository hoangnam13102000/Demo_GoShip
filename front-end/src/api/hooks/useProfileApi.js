import { useState, useEffect } from "react";
import api from "../axios";

export const useProfileApi = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/profile/${user.id}`);
      setProfile(res.data);
    } catch (err) {
      setError("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data) => {
    try {
      setLoading(true);
      await api.put(`/profile/${user.id}`, data);
      await fetchProfile();
      return true;
    } catch (err) {
      setError("Failed to update profile");
      return false;
    } finally {
      setLoading(false);
    }
  };

   const changePassword = async (data) => {
    try {
      // Gửi request đổi mật khẩu đến endpoint mới
      const response = await api.post(`/profile/${user.id}/change-password`, {
        current_password: data.current_password,
        new_password: data.new_password,
        new_password_confirmation: data.new_password_confirmation,
      });

      // Kiểm tra phản hồi từ server
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.",
          requiresRelogin: response.data.requires_relogin || true
        };
      } else {
        // Nếu server trả về success: false
        throw new Error(response.data.message || "Không thể đổi mật khẩu");
      }
      
    } catch (err) {
      console.error("Change password error:", err);

      // Xử lý lỗi 422 (validation)
      if (err.response?.status === 422) {
        const errorMsg =
          err.response.data.message || "Mật khẩu hiện tại không đúng";
        throw new Error(errorMsg);
      }

      // Xử lý lỗi 404
      if (err.response?.status === 404) {
        throw new Error("Tài khoản không tồn tại");
      }

      // Xử lý các lỗi khác
      throw new Error(
        err.response?.data?.message ||
          "Không thể đổi mật khẩu. Vui lòng thử lại."
      );
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    changePassword,
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile: fetchProfile,
  };
};