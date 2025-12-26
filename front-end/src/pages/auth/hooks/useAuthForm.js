import { useState } from "react";
import { loginAPI, registerAPI } from "../../../api/auth/request";
import { validateAuth } from "../../../utils/hooks/validateAuth";

/**
 * Hook dùng cho Login & Register
 * @param {"login" | "register"} mode
 */
export const useAuthForm = (mode = "login") => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // cập nhật field
  const setField = (field, value) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const submit = async (onSuccess) => {
    const validationErrors = validateAuth(values, mode);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      if (mode === "register") {
        const res = await registerAPI({
          email: values.email,
          password: values.password,
          password_confirmation: values.confirmPassword, // gửi đúng Laravel confirm
        });

        // lưu user demo
        localStorage.setItem("user", JSON.stringify(res.user));

        onSuccess?.(res);
      }

      if (mode === "login") {
        const res = await loginAPI({
          email: values.email,
          password: values.password,
        });

        localStorage.setItem("user", JSON.stringify(res.user));
        onSuccess?.(res);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        // Laravel trả validation errors object
        const apiErrors = {};
        Object.keys(err.response.data.errors).forEach((key) => {
          apiErrors[key] = err.response.data.errors[key][0];
        });
        setErrors(apiErrors);
      } else if (err.response?.data?.message) {
        setErrors({ email: err.response.data.message });
      } else {
        alert("Không thể kết nối server");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    values,
    errors,
    loading,
    setField,
    submit,
  };
};
