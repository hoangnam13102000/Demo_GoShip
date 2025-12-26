import { useState } from "react";
import { forgotPasswordAPI } from "../../../api/auth/request"; // bạn cần tạo API

export const useForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (onSuccess) => {
    if (!email) {
      setError("Email không được để trống");
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPasswordAPI({ email });
      onSuccess?.(res);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, error, loading, submit };
};
