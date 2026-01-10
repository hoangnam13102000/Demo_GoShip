import { useEffect, useState } from "react";
import { loginAPI, registerAPI } from "../../../api/auth/request";
import { validateAuth } from "../../../utils/hooks/validateAuth";

export const useAuthForm = (mode = "login") => {
  const [values, setValues] = useState({ email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [emailSuggestions, setEmailSuggestions] = useState([]);

  useEffect(() => {
    const emails = JSON.parse(localStorage.getItem("email_history")) || [];
    setEmailSuggestions(emails);
  }, []);

  const saveEmailHistory = (email) => {
    const list = JSON.parse(localStorage.getItem("email_history")) || [];
    if (!list.includes(email)) {
      const newList = [email, ...list].slice(0, 5);
      localStorage.setItem("email_history", JSON.stringify(newList));
      setEmailSuggestions(newList);
    }
  };

  const setField = (field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleLogin = async (email, password) => {
    console.log("=== Sending login request ===");
    console.log("Email:", email);
    console.log("Password:", password);

    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    try {
      const res = await loginAPI({ email, password });
      console.log("=== Response from loginAPI ===");
      console.log(res);

      // ✅ Truy cập trực tiếp access_token và user
      if (res?.access_token) {
        localStorage.setItem("access_token", res.access_token);
        console.log("Access token saved:", res.access_token);
      } else {
        console.warn("No access_token in response");
      }

      if (res?.user) {
        localStorage.setItem("user", JSON.stringify(res.user));
        console.log("User info saved:", res.user);
      } else {
        console.warn("No user info in response");
      }

      saveEmailHistory(email);
      return res;
    } catch (err) {
      console.error("Login API error:", err);
      throw err;
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
          password_confirmation: values.confirmPassword,
        });
        console.log("=== Register response ===", res);
        await handleLogin(values.email, values.password);
        onSuccess?.(res);
      }

      if (mode === "login") {
        const loginRes = await handleLogin(values.email, values.password);
        console.log("=== Login successful ===", loginRes);
        onSuccess?.(loginRes);
      }
    } catch (err) {
      console.error("Submit error:", err);
      if (err.response?.data?.errors) {
        const apiErrors = {};
        Object.keys(err.response.data.errors).forEach(key => apiErrors[key] = err.response.data.errors[key][0]);
        setErrors(apiErrors);
      } else if (err.response?.data?.message) {
        setErrors({ email: err.response.data.message });
      } else alert("Không thể kết nối server");
    } finally { 
      setLoading(false); 
    }
  };

  return { values, errors, loading, setField, submit, emailSuggestions };
};
