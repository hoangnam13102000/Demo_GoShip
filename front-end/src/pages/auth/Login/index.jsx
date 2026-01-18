import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaTruck,
  FaShieldAlt,
  FaBolt,
  FaCheckCircle,
  FaUserPlus,
  FaArrowLeft,
  FaHome,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "../../../components/common/InputField";
import SubmitButton from "../../../components/common/buttons/SubmitButton";
import DynamicDialog from "../../../components/UI/DynamicDialog";
import { useAuthForm } from "../hooks/useAuthForm";

const LoginPage = () => {
  // Login form
  const loginForm = useAuthForm("login");
  // Register form
  const registerForm = useAuthForm("register");

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogMode, setDialogMode] = useState("success");
  const [loginRes, setLoginRes] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const emailInputRef = useRef(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Hiệu ứng particle background
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement("div");
      particle.className =
        "absolute w-1 h-1 bg-blue-400/20 rounded-full animate-float";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      return particle;
    };

    const container = document.querySelector(".particles-container");
    if (container) {
      for (let i = 0; i < 30; i++) {
        container.appendChild(createParticle());
      }
    }

    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (
        emailInputRef.current &&
        !emailInputRef.current.contains(event.target)
      ) {
        setShowEmailSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      if (container) {
        container.innerHTML = "";
      }
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEmailFocus = () => {
    if (loginForm.emailSuggestions && loginForm.emailSuggestions.length > 0) {
      setShowEmailSuggestions(true);
    }
  };

  const handleSelectSuggestion = (email) => {
    loginForm.setField("email", email);
    setShowEmailSuggestions(false);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await loginForm.submit((res) => {
        setLoginRes(res);
        console.log("=== Login Successful ===");
        console.log("User info:", res.user);
        console.log("Role:", res.user?.role);
        console.log("Email:", res.user?.email);
        console.log("Access token:", res.access_token);

        setDialogMessage("Đăng nhập thành công! Đang chuyển hướng...");
        setDialogMode("success");
        setDialogOpen(true);
      });
    } catch (err) {
      console.log("=== Login Failed ===", err);
      setDialogMessage(
        err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
      );
      setDialogMode("error");
      setDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      await registerForm.submit(() => {
        setDialogMessage("Đăng ký thành công! Tài khoản của bạn đã được tạo.");
        setDialogMode("success");
        setDialogOpen(true);
        setRegisterSuccess(true);

        // Reset form after successful registration
        registerForm.setField("email", "");
        registerForm.setField("password", "");
        registerForm.setField("confirmPassword", "");
      });
    } catch (err) {
      console.log("=== Registration Failed ===", err);
      setDialogMessage(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
      setDialogMode("error");
      setDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);

    if (registerSuccess) {
      // Sau khi đăng ký thành công, chuyển về tab login
      setActiveTab("login");
      setRegisterSuccess(false);
      return;
    }

    const user =
      loginRes?.user || JSON.parse(localStorage.getItem("user")) || null;
    console.log("Redirecting user with role:", user?.role);

    if (!user?.role) {
      navigate("/", { replace: true });
      return;
    }

    switch (user.role) {
      case "USER":
        navigate("/", { replace: true });
        break;
      case "ADMIN":
        navigate("/admin", { replace: true });
        break;
      case "AGENT":
        navigate("/agent", { replace: true });
        break;
      default:
        navigate("/", { replace: true });
    }
  };

  const handleSwitchToRegister = () => {
    setActiveTab("register");
    // Reset register form khi chuyển sang tab đăng ký
    registerForm.setField("email", "");
    registerForm.setField("password", "");
    registerForm.setField("confirmPassword", "");
  };

  const handleSwitchToLogin = () => {
    setActiveTab("login");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
        {/* Background Particles */}
        <div className="particles-container absolute inset-0 overflow-hidden"></div>

        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        {/* Navigation Bar */}
        <div className="relative z-20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaHome className="w-5 h-5" />
                <span className="font-medium">Trang chủ</span>
              </button>

              <div className="flex items-center gap-4">
                {activeTab === "login" ? (
                  <span className="text-sm text-gray-600">
                    Chưa có tài khoản?
                  </span>
                ) : (
                  <span className="text-sm text-gray-600">
                    Đã có tài khoản?
                  </span>
                )}
                {activeTab === "login" ? (
                  <button
                    onClick={handleSwitchToRegister}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium rounded-lg hover:shadow-md transition-all duration-300"
                  >
                    Đăng ký
                  </button>
                ) : (
                  <button
                    onClick={handleSwitchToLogin}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-md transition-all duration-300"
                  >
                    Đăng nhập
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Column - Hero Section */}
            <div className="hidden lg:block space-y-8 animate-fadeInLeft">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <img
                      src="/Logo.png"
                      alt="GoShip Logo"
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      GoShip Pro
                    </h1>
                    <p className="text-gray-600">
                      Hệ thống vận chuyển thông minh
                    </p>
                  </div>
                </div>

                <h2 className="text-5xl font-bold text-gray-800 leading-tight">
                  {activeTab === "login"
                    ? "Chào mừng trở lại"
                    : "Bắt đầu hành trình"}
                  <span className="block text-blue-600">
                    {activeTab === "login"
                      ? "Đăng nhập để tiếp tục"
                      : "Đăng ký tài khoản mới"}
                  </span>
                </h2>

                <p className="text-gray-600 text-lg leading-relaxed">
                  {activeTab === "login"
                    ? "Hệ thống quản lý vận chuyển thông minh cho doanh nghiệp. Theo dõi đơn hàng, quản lý đại lý và tối ưu hóa logistics."
                    : "Tham gia cộng đồng GoShip với hàng nghìn đối tác vận chuyển. Quản lý đơn hàng, theo dõi lịch sử và phát triển kinh doanh."}
                </p>
              </div>

              {/* Features Grid - Hiển thị phù hợp với từng tab */}
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FaBolt className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Tốc độ cao
                      </h3>
                      <p className="text-sm text-gray-600">Xử lý trong 3s</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <FaShieldAlt className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Bảo mật</h3>
                      <p className="text-sm text-gray-600">SSL 256-bit</p>
                    </div>
                  </div>
                </div>

                {activeTab === "register" && (
                  <>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                          <FaUserPlus className="text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            Dễ dàng đăng ký
                          </h3>
                          <p className="text-sm text-gray-600">Chỉ 30 giây</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                          <FaCheckCircle className="text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            Miễn phí
                          </h3>
                          <p className="text-sm text-gray-600">
                            Không phí đăng ký
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="pt-8">
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">10K+</div>
                    <div className="text-sm text-gray-600">Đơn hàng/ngày</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600">
                      200+
                    </div>
                    <div className="text-sm text-gray-600">Đại lý</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      99.9%
                    </div>
                    <div className="text-sm text-gray-600">Hài lòng</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Auth Form */}
            <div className="animate-fadeInRight">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                {/* Form Header */}
                <div
                  className={`p-8 relative overflow-hidden ${
                    activeTab === "login"
                      ? "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600"
                      : "bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-xl shadow-md">
                          <img
                            src="/Logo.png"
                            alt="GoShip Logo"
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                        <div>
                          <h1 className="text-xl font-bold text-white">
                            GoShip
                          </h1>
                          <p className="text-white/80 text-sm">
                            {activeTab === "login"
                              ? "Đăng nhập"
                              : "Đăng ký tài khoản"}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`w-10 h-10 rounded-full backdrop-blur-sm border-2 border-white/30 flex items-center justify-center ${
                          activeTab === "login" ? "bg-white/20" : "bg-white/20"
                        }`}
                      >
                        {activeTab === "login" ? (
                          <FaUser className="text-white text-lg" />
                        ) : (
                          <FaUserPlus className="text-white text-lg" />
                        )}
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">
                      {activeTab === "login"
                        ? "Chào mừng trở lại"
                        : "Tạo tài khoản mới"}
                    </h2>
                    <p className="text-white/90">
                      {activeTab === "login"
                        ? "Đăng nhập để tiếp tục công việc"
                        : "Tham gia cộng đồng GoShip trong 30 giây"}
                    </p>
                  </div>
                </div>

                {/* Tab Selection */}
                <div className="flex border-b border-gray-100">
                  <button
                    className={`flex-1 py-4 text-center font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                      activeTab === "login"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={handleSwitchToLogin}
                  >
                    <FaUser className="w-4 h-4" />
                    Đăng nhập
                  </button>
                  <button
                    className={`flex-1 py-4 text-center font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                      activeTab === "register"
                        ? "text-emerald-600 border-b-2 border-emerald-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={handleSwitchToRegister}
                  >
                    <FaUserPlus className="w-4 h-4" />
                    Đăng ký
                  </button>
                </div>

                {/* Login Form */}
                <div
                  className={`p-8 space-y-6 transition-all duration-300 ${activeTab === "login" ? "block" : "hidden"}`}
                >
                  {/* Email Field với Suggestions */}
                  <div ref={emailInputRef} className="relative">
                    <InputField
                      label="Email"
                      type="email"
                      icon={FaEnvelope}
                      value={loginForm.values.email}
                      onChange={(val) => loginForm.setField("email", val)}
                      placeholder="example@goship.com"
                      error={loginForm.errors.email}
                      remember={true}
                      suggestions={loginForm.emailSuggestions || []}
                      onSelectSuggestion={handleSelectSuggestion}
                      onFocus={handleEmailFocus}
                    />

                    {/* Custom Suggestions Dropdown chỉ hiện khi click vào field */}
                    {showEmailSuggestions &&
                      loginForm.emailSuggestions &&
                      loginForm.emailSuggestions.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-fadeIn">
                          {loginForm.emailSuggestions.map((email, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectSuggestion(email)}
                              className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 text-gray-700 hover:text-blue-600"
                            >
                              {email}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>

                  {/* Password Field */}
                  <InputField
                    label="Mật khẩu"
                    type={showPassword ? "text" : "password"}
                    icon={FaLock}
                    value={loginForm.values.password}
                    onChange={(val) => loginForm.setField("password", val)}
                    placeholder="••••••••"
                    error={loginForm.errors.password}
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    }
                  />

                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">
                        Ghi nhớ đăng nhập
                      </span>
                    </label>
                    <Link
                      to="/quen-mat-khau"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>

                  <SubmitButton
                    loading={loginForm.loading || isLoading}
                    onClick={handleLogin}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {loginForm.loading || isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Đang xử lý...
                      </div>
                    ) : (
                      "Đăng nhập"
                    )}
                  </SubmitButton>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Chưa có tài khoản?{" "}
                      <button
                        onClick={handleSwitchToRegister}
                        className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                      >
                        Đăng ký ngay
                      </button>
                    </p>
                  </div>
                </div>

                {/* Register Form */}
                <div
                  className={`p-8 space-y-6 transition-all duration-300 ${activeTab === "register" ? "block" : "hidden"}`}
                >
                  {/* Email Field */}
                  <InputField
                    label="Email"
                    type="email"
                    icon={FaEnvelope}
                    value={registerForm.values.email}
                    onChange={(val) => registerForm.setField("email", val)}
                    placeholder="example@goship.com"
                    error={registerForm.errors.email}
                  />

                  {/* Password Field */}
                  <InputField
                    label="Mật khẩu"
                    type={showRegisterPassword ? "text" : "password"}
                    icon={FaLock}
                    value={registerForm.values.password}
                    onChange={(val) => registerForm.setField("password", val)}
                    placeholder="Tối thiểu 6 ký tự"
                    error={registerForm.errors.password}
                    rightElement={
                      <button
                        type="button"
                        onClick={() =>
                          setShowRegisterPassword(!showRegisterPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    }
                  />

                  {/* Confirm Password Field */}
                  <InputField
                    label="Nhập lại mật khẩu"
                    type={showConfirmPassword ? "text" : "password"}
                    icon={FaLock}
                    value={registerForm.values.confirmPassword}
                    onChange={(val) =>
                      registerForm.setField("confirmPassword", val)
                    }
                    placeholder="Nhập lại mật khẩu"
                    error={registerForm.errors.confirmPassword}
                    rightElement={
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    }
                  />

                  {/* Terms Checkbox */}
                  <div className="space-y-4">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <span className="text-sm text-gray-600 font-medium block mb-1">
                          Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo
                          mật
                        </span>
                        <div className="flex gap-3">
                          <a
                            href="#terms"
                            className="text-xs text-emerald-600 hover:text-emerald-700"
                          >
                            Điều khoản dịch vụ
                          </a>
                          <a
                            href="#privacy"
                            className="text-xs text-emerald-600 hover:text-emerald-700"
                          >
                            Chính sách bảo mật
                          </a>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-600">
                        Đăng ký nhận bản tin khuyến mãi và cập nhật từ GoShip
                      </span>
                    </label>
                  </div>

                  <SubmitButton
                    loading={registerForm.loading || isLoading}
                    onClick={handleRegister}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {registerForm.loading || isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Đang xử lý...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <FaUserPlus className="w-4 h-4" />
                        Đăng ký tài khoản
                      </div>
                    )}
                  </SubmitButton>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Đã có tài khoản?{" "}
                      <button
                        onClick={handleSwitchToLogin}
                        className="text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center gap-1 mx-auto"
                      >
                        <FaArrowLeft className="w-3 h-3" />
                        Quay lại đăng nhập
                      </button>
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile App Download */}
              <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <img
                        src="/Logo.png"
                        alt="GoShip"
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">
                        Tải ứng dụng GoShip
                      </h3>
                      <p className="text-sm text-gray-600">
                        Theo dõi đơn hàng mọi lúc mọi nơi
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:shadow-md transition-shadow">
                    Tải ngay
                  </button>
                </div>
              </div>

              {/* Footer Links */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-xs text-gray-500">
                    © 2024 GoShip. All rights reserved.
                  </div>
                  <div className="flex gap-4">
                    <a
                      href="#privacy"
                      className="text-xs text-gray-600 hover:text-emerald-600 transition-colors"
                    >
                      Chính sách bảo mật
                    </a>
                    <a
                      href="#terms"
                      className="text-xs text-gray-600 hover:text-emerald-600 transition-colors"
                    >
                      Điều khoản dịch vụ
                    </a>
                    <a
                      href="#help"
                      className="text-xs text-gray-600 hover:text-emerald-600 transition-colors"
                    >
                      Trợ giúp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DynamicDialog
        open={dialogOpen}
        mode={dialogMode}
        title={
          dialogMode === "success"
            ? registerSuccess
              ? "Đăng ký thành công!"
              : "Thành công"
            : " Lỗi"
        }
        message={
          <div className="text-center space-y-4">
            {registerSuccess ? (
              <>
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <FaCheckCircle className="text-emerald-600 w-8 h-8" />
                </div>
                <p className="text-gray-700 font-medium">
                  Tài khoản của bạn đã được tạo thành công!
                </p>
                <p className="text-sm text-gray-600">
                  Chúng tôi đã gửi email xác nhận đến{" "}
                  <strong className="text-emerald-600">
                    {registerForm.values.email}
                  </strong>
                </p>
              </>
            ) : (
              <p className="text-gray-700">{dialogMessage}</p>
            )}
          </div>
        }
        closeText="Tiếp tục"
        onClose={handleCloseDialog}
        customButtons={
          registerSuccess
            ? [
                {
                  text: "Đăng nhập ngay",
                  onClick: () => {
                    setDialogOpen(false);
                    handleSwitchToLogin();
                  },
                  className:
                    "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white",
                },
              ]
            : undefined
        }
      />
    </>
  );
};

export default LoginPage;
