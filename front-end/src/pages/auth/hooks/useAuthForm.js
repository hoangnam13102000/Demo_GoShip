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

  const handleLogin = async (email, password) => {
    console.log("=== Sending login request ===");
    console.log("Email:", email);
    console.log("Password:", password);

    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    try {
      const response = await loginAPI({ email, password });

      console.log("=== Response from loginAPI ===");
      console.log(response);

      if (response && response.access_token) {
        localStorage.setItem("access_token", response.access_token);
        console.log("Access token saved:", response.access_token);
      } else {
        console.warn("No access_token in response");
      }

      if (response && response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
        console.log("User info saved:", response.user);
      } else {
        console.warn("No user info in response");
      }

      saveEmailHistory(email);

      window.dispatchEvent(new Event("auth-change"));

      return response;
    } catch (error) {
      console.error("Login API error:", error);
      throw error;
    }
  };

  const submit = async (onSuccess) => {
    const validationErrors = validateAuth(values, mode);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      if (mode === "register") {
        const registerResponse = await registerAPI({
          email: values.email,
          password: values.password,
          password_confirmation: values.confirmPassword,
        });

        //(await handleLogin(values.email, values.password));

        if (onSuccess) {
          onSuccess(registerResponse);
        }
      }

      if (mode === "login") {
        const loginResponse = await handleLogin(values.email, values.password);

        console.log("=== Login successful ===", loginResponse);

        if (onSuccess) {
          onSuccess(loginResponse);
        }
      }
    } catch (error) {
      console.error("Submit error:", error);

      if (error.response && error.response.data && error.response.data.errors) {
        const apiErrors = {};

        Object.keys(error.response.data.errors).forEach((key) => {
          apiErrors[key] = error.response.data.errors[key][0];
        });

        setErrors(apiErrors);
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrors({ email: error.response.data.message });
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
