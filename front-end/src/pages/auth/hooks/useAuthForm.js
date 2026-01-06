import { useEffect, useState } from "react";
import { loginAPI, registerAPI } from "../../../api/auth/request";
import { validateAuth } from "../../../utils/hooks/validateAuth";

export const useAuthForm = (mode = "login") => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [emailSuggestions, setEmailSuggestions] = useState([]);

  // ================= LOAD EMAIL HISTORY =================
  useEffect(() => {
    const emails = JSON.parse(localStorage.getItem("email_history")) || [];
    setEmailSuggestions(emails);
  }, []);

  // ================= SAVE EMAIL HISTORY =================
  const saveEmailHistory = (email) => {
    const key = "email_history";
    const list = JSON.parse(localStorage.getItem(key)) || [];

    if (!list.includes(email)) {
      const newList = [email, ...list].slice(0, 5);
      localStorage.setItem(key, JSON.stringify(newList));
      setEmailSuggestions(newList);
    }
  };

  // ================= SET FIELD =================
  const setField = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // ================= HANDLE LOGIN =================
  const handleLogin = async (email, password) => {
    const res = await loginAPI({ email, password });

    if (res?.data?.access_token) {
      localStorage.setItem("access_token", res.data.access_token);
    }

    if (res?.data?.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    saveEmailHistory(email);
    return res;
  };

  // ================= SUBMIT =================
  const submit = async (onSuccess) => {
    const validationErrors = validateAuth(values, mode);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      // ===== REGISTER =====
      if (mode === "register") {
        const res = await registerAPI({
          email: values.email,
          password: values.password,
          password_confirmation: values.confirmPassword,
        });

        //  auto login sau khi đăng ký
        await handleLogin(values.email, values.password);

        onSuccess?.(res);
      }

      // ===== LOGIN =====
      if (mode === "login") {
        await handleLogin(values.email, values.password);
        onSuccess?.();
      }
    } catch (err) {
      if (err.response?.data?.errors) {
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
    emailSuggestions,
  };
};
