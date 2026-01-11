export const validateAuth = (values, mode = "login") => {
  const errors = {};
  const { email, password, confirmPassword } = values;

  // Email (login + register)
  if (!email) {
    errors.email = "Email không được để trống";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Email không hợp lệ";
  }

  // Password (login + register)
  if (!password) {
    errors.password = "Mật khẩu không được để trống";
  } else if (mode === "register" && password.length < 6) {
    errors.password = "Mật khẩu phải ít nhất 6 ký tự";
  }

  // Register only
  if (mode === "register") {
    if (!confirmPassword) {
      errors.confirmPassword = "Vui lòng nhập lại mật khẩu";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Mật khẩu nhập lại không khớp";
    }
  }

  //
  return errors;
};
