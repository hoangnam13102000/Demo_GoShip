import { useState } from "react";
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaClock, FaShieldAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../../../components/common/InputField";
import DynamicDialog from "../../../components/UI/DynamicDialog";
import { forgotPasswordAPI } from "../../../api/auth/request";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogMode, setDialogMode] = useState("success");

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    
    if (!email) {
      setError("Vui lòng nhập địa chỉ email");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Vui lòng nhập email hợp lệ");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await forgotPasswordAPI({ email });
      
      if (response.success) {
        setSuccess(true);
        setDialogMessage(response.message);
        setDialogMode("success");
        setDialogOpen(true);
      } else {
        setError(response.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error?.email?.[0] || 
        "Không thể gửi yêu cầu. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    if (success) {
      navigate("/dang-nhap");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

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
                  <p className="text-gray-600">Khôi phục mật khẩu</p>
                </div>
              </div>
              
              <h2 className="text-4xl font-bold text-gray-800 leading-tight">
                Quên mật khẩu?
                <span className="block text-blue-600">Chúng tôi sẽ giúp bạn</span>
              </h2>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                Nhập địa chỉ email đăng ký tài khoản GoShip của bạn. 
                Chúng tôi sẽ gửi link đặt lại mật khẩu đến email đó.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6 pt-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FaShieldAlt className="text-blue-600 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg mb-2">Bảo mật an toàn</h3>
                    <p className="text-gray-600">
                      Link đặt lại mật khẩu được mã hóa và chỉ có hiệu lực trong 24 giờ.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <FaClock className="text-emerald-600 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg mb-2">Xử lý nhanh chóng</h3>
                    <p className="text-gray-600">
                      Nhận email đặt lại mật khẩu ngay lập tức sau khi gửi yêu cầu.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <FaCheckCircle className="text-purple-600 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg mb-2">Dễ dàng sử dụng</h3>
                    <p className="text-gray-600">
                      Chỉ cần nhấp vào link trong email và làm theo hướng dẫn đơn giản.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="animate-fadeInRight">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-8 relative overflow-hidden">
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
                        <p className="text-white/80 text-sm">Khôi phục mật khẩu</p>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
                      <FaEnvelope className="text-white text-lg" />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {success ? "Đã gửi email!" : "Nhập email của bạn"}
                  </h2>
                  <p className="text-white/90">
                    {success 
                      ? "Vui lòng kiểm tra hộp thư email" 
                      : "Chúng tôi sẽ gửi link đặt lại mật khẩu"}
                  </p>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                {!success ? (
                  <div className="space-y-6">
                    <div>
                      <p className="text-gray-600 mb-6">
                        Vui lòng nhập địa chỉ email bạn đã đăng ký tài khoản GoShip. 
                        Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu đến email này.
                      </p>
                      
                      <InputField
                        label="Địa chỉ email"
                        type="email"
                        icon={FaEnvelope}
                        value={email}
                        onChange={(val) => {
                          setEmail(val);
                          if (error) setError("");
                        }}
                        placeholder="your.email@goship.com"
                        error={error}
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                            <span className="text-red-600 font-bold">!</span>
                          </div>
                          <p className="text-red-600 font-medium">{error}</p>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Đang xử lý...
                        </div>
                      ) : (
                        "Gửi link đặt lại mật khẩu"
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                      <FaCheckCircle className="text-emerald-600 w-10 h-10" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Đã gửi email thành công!
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Chúng tôi đã gửi link đặt lại mật khẩu đến:
                      </p>
                      <p className="text-lg font-medium text-blue-600 bg-blue-50 py-2 px-4 rounded-lg">
                        {email}
                      </p>
                    </div>

                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-yellow-600 font-bold">!</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-yellow-800 mb-1">Vui lòng kiểm tra:</h4>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• Hộp thư đến (Inbox) của email</li>
                            <li>• Thư mục Spam/Junk nếu không thấy trong Inbox</li>
                            <li>• Link sẽ hết hạn sau 24 giờ</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => navigate("/dang-nhap")}
                        className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                      >
                        Quay lại đăng nhập
                      </button>
                      <button
                        onClick={() => {
                          setSuccess(false);
                          setEmail("");
                        }}
                        className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                      >
                        Gửi lại email
                      </button>
                    </div>
                  </div>
                )}
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

      {/* Dialog */}
      <DynamicDialog
        open={dialogOpen}
        mode={dialogMode}
        title={dialogMode === "success" ? " Thành công" : " Lỗi"}
        message={dialogMessage}
        closeText="Đóng"
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default ForgotPasswordPage;