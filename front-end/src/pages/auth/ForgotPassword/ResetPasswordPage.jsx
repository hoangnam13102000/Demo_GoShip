import { useState, useEffect } from "react";
import { FaLock, FaCheckCircle, FaArrowLeft, FaExclamationCircle, FaEnvelope } from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import InputField from "../../../components/common/InputField";
import { resetPasswordAPI, validateResetTokenAPI } from "../../../api/auth/request";
import DynamicDialog from "../../../components/UI/DynamicDialog";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Lấy tham số từ URL
  const tokenFromURL = searchParams.get("token") ? decodeURIComponent(searchParams.get("token")) : "";
  const emailFromURL = searchParams.get("email") ? decodeURIComponent(searchParams.get("email")) : "";
  
  const [formData, setFormData] = useState({
    email: "",
    token: "",
    password: "",
    password_confirmation: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogMode, setDialogMode] = useState("info");
  const [dialogTitle, setDialogTitle] = useState("");

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      console.log("=== DEBUG INFO ===");
      console.log("Token from URL (decoded):", tokenFromURL);
      console.log("Email from URL (decoded):", emailFromURL);
      console.log("Full URL:", window.location.href);
      console.log("===================");

      // Kiểm tra xem có parameters không
      if (!tokenFromURL || !emailFromURL) {
        setTokenValid(false);
        setDialogTitle("Thiếu thông tin");
        setDialogMessage("Thiếu thông tin email hoặc token. Vui lòng sử dụng link từ email.");
        setDialogMode("error");
        setDialogOpen(true);
        setValidating(false);
        return;
      }

      // Cập nhật formData với giá trị từ URL
      setFormData(prev => ({
        ...prev,
        email: emailFromURL,
        token: tokenFromURL
      }));

      try {
        console.log("Calling validateResetTokenAPI with:", { 
          email: emailFromURL, 
          token: tokenFromURL 
        });
        
        const response = await validateResetTokenAPI({
          email: emailFromURL,
          token: tokenFromURL
        });
        
        console.log("Token validation API response:", response);
        
        if (response.valid) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setDialogTitle("Token không hợp lệ");
          setDialogMessage(response.message || "Token không hợp lệ hoặc đã hết hạn");
          setDialogMode("error");
          setDialogOpen(true);
        }
      } catch (err) {
        console.error("Token validation error details:", err);
        console.error("Error response data:", err.response?.data);
        setTokenValid(false);
        setDialogTitle("Lỗi xác thực");
        setDialogMessage(
          err.response?.data?.message || 
          err.response?.data?.error || 
          "Không thể xác thực token. Vui lòng thử lại."
        );
        setDialogMode("error");
        setDialogOpen(true);
      } finally {
        setValidating(false);
      }
    };

    // Thêm delay nhỏ để đảm bảo state đã được cập nhật
    const timer = setTimeout(() => {
      validateToken();
    }, 100);

    return () => clearTimeout(timer);
  }, [tokenFromURL, emailFromURL]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    
    // Validate form - sử dụng Dialog để hiển thị lỗi
    if (!formData.password) {
      setDialogTitle("Thiếu thông tin");
      setDialogMessage("Vui lòng nhập mật khẩu mới");
      setDialogMode("error");
      setDialogOpen(true);
      return;
    }
    
    if (formData.password.length < 6) {
      setDialogTitle("Mật khẩu không hợp lệ");
      setDialogMessage("Mật khẩu phải có ít nhất 6 ký tự");
      setDialogMode("error");
      setDialogOpen(true);
      return;
    }
    
    if (!formData.password_confirmation) {
      setDialogTitle("Thiếu thông tin");
      setDialogMessage("Vui lòng xác nhận mật khẩu mới");
      setDialogMode("error");
      setDialogOpen(true);
      return;
    }
    
    if (formData.password !== formData.password_confirmation) {
      setDialogTitle("Mật khẩu không khớp");
      setDialogMessage("Mật khẩu xác nhận không khớp");
      setDialogMode("error");
      setDialogOpen(true);
      return;
    }

    setLoading(true);

    try {
      console.log("Calling resetPasswordAPI with:", {
        email: formData.email,
        token: formData.token,
        password: "[HIDDEN]",
        password_confirmation: "[HIDDEN]"
      });
      
      const response = await resetPasswordAPI({
        email: formData.email,
        token: formData.token,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      });
      
      console.log("Reset password API response:", response);
      
      if (response.success) {
        setDialogTitle("Thành công");
        setDialogMessage(response.message);
        setDialogMode("success");
      } else {
        setDialogTitle("Lỗi");
        setDialogMessage(response.message || "Có lỗi xảy ra khi đặt lại mật khẩu");
        setDialogMode("error");
      }
      setDialogOpen(true);
    } catch (err) {
      console.error("Reset password error details:", err);
      console.error("Error response data:", err.response?.data);
      setDialogTitle("Lỗi");
      setDialogMessage(
        err.response?.data?.message || 
        err.response?.data?.error || 
        "Không thể đặt lại mật khẩu. Vui lòng thử lại sau."
      );
      setDialogMode("error");
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    if (dialogMode === "success") {
      navigate("/dang-nhap");
    }
  };

  // Hàm xử lý nút "Yêu cầu link mới"
  const handleRequestNewLink = () => {
    navigate("/quen-mat-khau");
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Đang xác thực link đặt lại mật khẩu...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        
        {/* Navigation */}
        <div className="relative z-20 container mx-auto px-4 py-8">
          <button
            onClick={() => navigate("/dang-nhap")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft className="w-5 h-5" />
            <span className="font-medium">Quay lại đăng nhập</span>
          </button>
        </div>

        {/* Error Content */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
          <div className="w-full max-w-md">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-8 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaExclamationCircle className="text-red-600 w-10 h-10" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Link không hợp lệ hoặc đã hết hạn
              </h2>
              
              <p className="text-gray-600 mb-6">
                Link đặt lại mật khẩu không hợp lệ, đã được sử dụng hoặc đã hết hạn (24 giờ).
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleRequestNewLink}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                >
                  Yêu cầu link mới
                </button>
                
                <button
                  onClick={() => navigate("/dang-nhap")}
                  className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                >
                  Quay lại đăng nhập
                </button>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Cần hỗ trợ?{" "}
                <a href="mailto:support@goship.com" className="text-emerald-600 hover:text-emerald-700">
                  support@goship.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      {/* Navigation */}
      <div className="relative z-20">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate("/dang-nhap")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft className="w-5 h-5" />
            <span className="font-medium">Quay lại đăng nhập</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Column - Information */}
          <div className="hidden lg:block space-y-8 animate-fadeInLeft">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <img 
                    src="/Logo.png" 
                    alt="GoShip Logo" 
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    GoShip Pro
                  </h1>
                  <p className="text-gray-600">Đặt lại mật khẩu</p>
                </div>
              </div>
              
              <h2 className="text-4xl font-bold text-gray-800 leading-tight">
                Đặt lại mật khẩu mới
                <span className="block text-emerald-600">Bảo mật tài khoản của bạn</span>
              </h2>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                Tạo mật khẩu mới cho tài khoản GoShip của bạn. 
                Đảm bảo mật khẩu đủ mạnh và khó đoán.
              </p>
            </div>

            {/* Password Requirements */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 text-lg mb-4">Yêu cầu mật khẩu</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full ${formData.password.length >= 6 ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center`}>
                    {formData.password.length >= 6 ? <FaCheckCircle /> : "✓"}
                  </div>
                  <span className={`${formData.password.length >= 6 ? 'text-emerald-700' : 'text-gray-600'}`}>
                    Ít nhất 6 ký tự
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center`}>
                    {/[A-Z]/.test(formData.password) ? <FaCheckCircle /> : "✓"}
                  </div>
                  <span className={`${/[A-Z]/.test(formData.password) ? 'text-emerald-700' : 'text-gray-600'}`}>
                    Có chữ hoa
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full ${/\d/.test(formData.password) ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center`}>
                    {/\d/.test(formData.password) ? <FaCheckCircle /> : "✓"}
                  </div>
                  <span className={`${/\d/.test(formData.password) ? 'text-emerald-700' : 'text-gray-600'}`}>
                    Có chữ số
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full ${/[!@#$%^&*]/.test(formData.password) ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center`}>
                    {/[!@#$%^&*]/.test(formData.password) ? <FaCheckCircle /> : "✓"}
                  </div>
                  <span className={`${/[!@#$%^&*]/.test(formData.password) ? 'text-emerald-700' : 'text-gray-600'}`}>
                    Có ký tự đặc biệt
                  </span>
                </li>
              </ul>
            </div>

            {/* Security Tips */}
            <div className="bg-blue-50/80 backdrop-blur-sm rounded-xl p-5 border border-blue-100 shadow-sm">
              <h3 className="font-bold text-blue-800 text-lg mb-2">Mẹo bảo mật</h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• Không sử dụng mật khẩu cũ</li>
                <li>• Không chia sẻ mật khẩu với ai</li>
                <li>• Sử dụng trình quản lý mật khẩu nếu cần</li>
                <li>• Đăng xuất khỏi thiết bị công cộng</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="animate-fadeInRight">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-emerald-600 via-blue-500 to-indigo-600 p-8 relative overflow-hidden">
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
                        <h1 className="text-xl font-bold text-white">GoShip</h1>
                        <p className="text-white/80 text-sm">Đặt lại mật khẩu</p>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
                      <FaLock className="text-white text-lg" />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Tạo mật khẩu mới
                  </h2>
                  <p className="text-white/90">
                    Nhập mật khẩu mới cho tài khoản của bạn
                  </p>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <p className="text-gray-600 mb-6">
                      Tạo mật khẩu mới cho tài khoản:{" "}
                      <span className="font-medium text-blue-600">{formData.email}</span>
                    </p>
                    
                    <div className="space-y-4">
                      <InputField
                        label="Mật khẩu mới"
                        type="password"
                        icon={FaLock}
                        value={formData.password}
                        onChange={(val) => handleChange("password", val)}
                        placeholder="Nhập mật khẩu mới"
                      />
                      
                      <InputField
                        label="Xác nhận mật khẩu"
                        type="password"
                        icon={FaLock}
                        value={formData.password_confirmation}
                        onChange={(val) => handleChange("password_confirmation", val)}
                        placeholder="Nhập lại mật khẩu mới"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Đang xử lý...
                      </div>
                    ) : (
                      "Đặt lại mật khẩu"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Footer Links */}
            <div className="mt-8 text-center space-y-4">
              <p className="text-sm text-gray-600">
                Bạn nhớ mật khẩu?{" "}
                <Link to="/dang-nhap" className="text-blue-600 font-semibold hover:text-blue-700">
                  Đăng nhập ngay
                </Link>
              </p>
              <p className="text-xs text-gray-500">
                Cần hỗ trợ?{" "}
                <a href="mailto:support@goship.com" className="text-emerald-600 hover:text-emerald-700">
                  support@goship.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Dialog - dùng cho tất cả thông báo */}
      <DynamicDialog
        open={dialogOpen}
        mode={dialogMode}
        title={dialogTitle}
        message={dialogMessage}
        closeText="Đóng"
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default ResetPasswordPage;