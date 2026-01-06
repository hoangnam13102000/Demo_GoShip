import { loginAPI } from "../../../../api/auth/request";

export const handleLoginService = async (email, password) => {
  try {
    const res = await loginAPI({
      email: email,
      password: password,
    });

    const user = res.user;

    if (!user) {
      return {
        success: false,
        message: "Không lấy được thông tin người dùng",
      };
    }

    if (user.status !== "ACTIVE") {
      return {
        success: false,
        message: "Tài khoản của bạn đang bị khóa hoặc chưa kích hoạt.",
      };
    }

    return {
      success: true,
      message: `Xin chào ${user.email}`,
      user: user,
    };
  } catch (err) {
    console.log("LOGIN ERROR:", err.response?.data);

    return {
      success: false,
      message:
        err.response?.data?.message ||
        "Email hoặc mật khẩu không đúng",
    };
  }
};
