import { useState } from "react";
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaCheck, 
  FaShieldAlt, 
  FaTruck, 
  FaRocket, 
  FaUserFriends,
  FaArrowRight,
  FaStar,
  FaHome,
  FaChevronLeft
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../../../components/common/InputField";
import SubmitButton from "../../../components/common/buttons/SubmitButton";
import DynamicDialog from "../../../components/UI/DynamicDialog";
import { useAuthForm } from "../hooks/useAuthForm";

const RegisterPage = () => {
  const form = useAuthForm("register");
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedMarketing, setAcceptedMarketing] = useState(false);

  const handleSuccess = () => {
    setDialogOpen(true);
  };

  const steps = [
    { number: 1, title: "Thông tin cơ bản", icon: <FaEnvelope className="w-4 h-4" /> },
    { number: 2, title: "Bảo mật tài khoản", icon: <FaLock className="w-4 h-4" /> },
    { number: 3, title: "Hoàn tất đăng ký", icon: <FaCheck className="w-4 h-4" /> },
  ];

  const benefits = [
    {
      icon: <FaTruck className="text-blue-600 w-5 h-5" />,
      title: "Theo dõi đơn hàng thời gian thực",
      description: "Biết vị trí đơn hàng của bạn mọi lúc mọi nơi"
    },
    {
      icon: <FaShieldAlt className="text-green-600 w-5 h-5" />,
      title: "Bảo mật tuyệt đối",
      description: "Mã hóa SSL 256-bit bảo vệ thông tin của bạn"
    },
    {
      icon: <FaRocket className="text-purple-600 w-5 h-5" />,
      title: "Xử lý siêu tốc",
      description: "Tạo đơn hàng chỉ trong 30 giây"
    },
    {
      icon: <FaUserFriends className="text-amber-600 w-5 h-5" />,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ chăm sóc khách hàng luôn sẵn sàng"
    }
  ];

  const passwordRequirements = [
    { text: "Ít nhất 6 ký tự", met: form.values.password?.length >= 6 },
    { text: "Có chữ cái viết hoa", met: /[A-Z]/.test(form.values.password) },
    { text: "Có chữ số", met: /\d/.test(form.values.password) },
    { text: "Có ký tự đặc biệt", met: /[!@#$%^&*]/.test(form.values.password) },
  ];

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!acceptedTerms) {
      form.setError("terms", "Vui lòng chấp nhận điều khoản dịch vụ");
      return;
    }
    form.submit(handleSuccess);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background Elements */}
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
              <span className="text-sm text-gray-600">Đã có tài khoản?</span>
              <Link
                to="/dang-nhap"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-md transition-all duration-300"
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Registration Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Form Header with Progress */}
            <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
              <div className="relative z-10">
                {/* Logo và Title */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-white p-3 rounded-xl shadow-lg">
                    <img 
                      src="/Logo.png" 
                      alt="GoShip Logo" 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">GoShip Pro</h1>
                    <p className="text-emerald-100">Bắt đầu hành trình vận chuyển cùng chúng tôi</p>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="mb-6">
                  <div className="flex justify-between items-center px-2">
                    {steps.map((step, index) => (
                      <div key={step.number} className="flex flex-col items-center relative flex-1">
                        {/* Connector line */}
                        {index < steps.length - 1 && (
                          <div className="absolute top-3 left-1/2 w-full h-0.5 bg-white/30 -z-10"></div>
                        )}
                        
                        {/* Step circle */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                          currentStep >= step.number 
                            ? 'bg-white text-emerald-600 shadow-lg transform scale-110' 
                            : 'bg-white/30 text-white'
                        }`}>
                          {currentStep > step.number ? (
                            <FaCheck className="w-5 h-5" />
                          ) : (
                            <div className="text-sm font-bold">{step.number}</div>
                          )}
                        </div>
                        
                        {/* Step label */}
                        <span className={`text-sm font-medium text-center px-2 ${
                          currentStep >= step.number ? 'text-white' : 'text-emerald-100/70'
                        }`}>
                          {step.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              {/* Step 1: Email */}
              <div className={`transition-all duration-300 ${currentStep === 1 ? 'block' : 'hidden'}`}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <FaEnvelope className="text-emerald-600" />
                      Bước 1: Thông tin đăng nhập
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Nhập email của bạn để bắt đầu. Chúng tôi sẽ gửi xác nhận đăng ký đến email này.
                    </p>
                    
                    <InputField
                      label="Địa chỉ email"
                      type="email"
                      icon={FaEnvelope}
                      value={form.values.email}
                      onChange={(val) => form.setField("email", val)}
                      placeholder="your.email@goship.com"
                      error={form.errors.email}
                    />
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <FaStar className="text-white w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-800 mb-2 text-lg">Mẹo từ chuyên gia</h4>
                        <p className="text-blue-700">
                          Sử dụng email công việc để nhận thông báo quan trọng về đơn hàng, ưu đãi đặc biệt và cập nhật hệ thống.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleNextStep}
                    disabled={!form.values.email || form.errors.email}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <span>Tiếp tục đến bước 2</span>
                    <FaArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Step 2: Password */}
              <div className={`transition-all duration-300 ${currentStep === 2 ? 'block' : 'hidden'}`}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <FaLock className="text-emerald-600" />
                      Bước 2: Thiết lập bảo mật
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Tạo mật khẩu mạnh để bảo vệ tài khoản của bạn khỏi truy cập trái phép.
                    </p>
                    
                    <div className="space-y-5">
                      <InputField
                        label="Mật khẩu"
                        type={showPassword ? "text" : "password"}
                        icon={FaLock}
                        value={form.values.password}
                        onChange={(val) => form.setField("password", val)}
                        placeholder="Tạo mật khẩu mạnh"
                        error={form.errors.password}
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

                      <InputField
                        label="Xác nhận mật khẩu"
                        type={showConfirmPassword ? "text" : "password"}
                        icon={FaLock}
                        value={form.values.confirmPassword}
                        onChange={(val) => form.setField("confirmPassword", val)}
                        placeholder="Nhập lại mật khẩu"
                        error={form.errors.confirmPassword}
                        rightElement={
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        }
                      />
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-4 text-lg">Yêu cầu mật khẩu an toàn:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            req.met ? 'bg-green-500 shadow-sm' : 'bg-gray-300'
                          }`}>
                            {req.met && <FaCheck className="text-white w-3 h-3" />}
                          </div>
                          <span className={`font-medium ${req.met ? 'text-green-600' : 'text-gray-500'}`}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handlePrevStep}
                      className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 border border-gray-300"
                    >
                      <FaChevronLeft className="w-4 h-4" />
                      Quay lại
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={!form.values.password || form.errors.password || !form.values.confirmPassword || form.errors.confirmPassword}
                      className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <span>Tiếp tục đến bước 3</span>
                      <FaArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 3: Terms & Submit */}
              <div className={`transition-all duration-300 ${currentStep === 3 ? 'block' : 'hidden'}`}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <FaCheck className="text-emerald-600" />
                      Bước 3: Điều khoản & Hoàn tất
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Vui lòng đọc và xác nhận điều khoản để hoàn tất đăng ký tài khoản GoShip.
                    </p>
                  </div>

                  {/* Terms Checkboxes */}
                  <div className="space-y-5">
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-emerald-300 transition-all duration-300 hover:shadow-sm">
                      <label className="flex items-start gap-4 cursor-pointer">
                        <div className="mt-1">
                          <input 
                            type="checkbox" 
                            checked={acceptedTerms}
                            onChange={(e) => {
                              setAcceptedTerms(e.target.checked);
                              if (e.target.checked && form.errors.terms) {
                                form.setError("terms", null);
                              }
                            }}
                            className="w-5 h-5 rounded-lg text-emerald-600 focus:ring-emerald-500 border-2 border-gray-300" 
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FaShieldAlt className="text-emerald-600 w-5 h-5" />
                            <span className="font-bold text-gray-800 text-lg">
                              Điều khoản dịch vụ và Chính sách bảo mật
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">
                            Tôi đã đọc, hiểu và đồng ý với tất cả các điều khoản và điều kiện của GoShip, bao gồm chính sách xử lý dữ liệu cá nhân.
                          </p>
                          <div className="flex gap-4">
                            <a 
                              href="#terms" 
                              className="text-emerald-600 hover:text-emerald-700 font-medium text-sm border-b border-emerald-300 pb-1"
                            >
                              Xem điều khoản dịch vụ
                            </a>
                            <a 
                              href="#privacy" 
                              className="text-emerald-600 hover:text-emerald-700 font-medium text-sm border-b border-emerald-300 pb-1"
                            >
                              Xem chính sách bảo mật
                            </a>
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-emerald-300 transition-all duration-300 hover:shadow-sm">
                      <label className="flex items-start gap-4 cursor-pointer">
                        <div className="mt-1">
                          <input 
                            type="checkbox" 
                            checked={acceptedMarketing}
                            onChange={(e) => setAcceptedMarketing(e.target.checked)}
                            className="w-5 h-5 rounded-lg text-emerald-600 focus:ring-emerald-500 border-2 border-gray-300" 
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FaEnvelope className="text-emerald-600 w-5 h-5" />
                            <span className="font-bold text-gray-800 text-lg">
                              Nhận thông tin khuyến mãi
                            </span>
                          </div>
                          <p className="text-gray-600">
                            Tôi muốn nhận email về cập nhật tính năng mới, ưu đãi đặc biệt, tin tức và mẹo sử dụng từ GoShip.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {form.errors.terms && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                          <FaCheck className="text-red-600 w-3 h-3" />
                        </div>
                        <p className="text-red-600 font-medium">{form.errors.terms}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={handlePrevStep}
                      className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 border border-gray-300"
                    >
                      <FaChevronLeft className="w-4 h-4" />
                      Quay lại
                    </button>
                    <SubmitButton
                      loading={form.loading}
                      onClick={handleSubmit}
                      className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                      {form.loading ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Đang xử lý...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <FaCheck className="w-5 h-5" />
                          <span className="text-lg">Hoàn tất đăng ký</span>
                        </div>
                      )}
                    </SubmitButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Benefits & Guide */}
          <div className="lg:block hidden">
            <div className="sticky top-8 space-y-8">
              {/* Welcome Card */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 border border-emerald-100 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center shadow-md">
                    <img 
                      src="/Logo.png" 
                      alt="GoShip" 
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Chào mừng đến với GoShip Pro</h2>
                    <p className="text-emerald-700">Hệ thống vận chuyển thông minh hàng đầu</p>
                  </div>
                </div>

                {/* Guide Steps */}
                <div className="space-y-6 mb-8">
                  <h3 className="text-lg font-bold text-gray-800 border-b border-emerald-200 pb-2">
                    Hướng dẫn đăng ký 3 bước đơn giản
                  </h3>
                  
                  {steps.map((step, index) => (
                    <div key={step.number} className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        currentStep >= step.number 
                          ? 'bg-emerald-500 text-white shadow-md' 
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {step.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 mb-1">{step.title}</h4>
                        <p className="text-sm text-gray-600">
                          {step.number === 1 && "Nhập email để bắt đầu tạo tài khoản"}
                          {step.number === 2 && "Thiết lập mật khẩu an toàn cho tài khoản"}
                          {step.number === 3 && "Xác nhận điều khoản và hoàn tất đăng ký"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Security Badge */}
                <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <FaShieldAlt className="text-emerald-600 w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Bảo mật cấp độ doanh nghiệp</p>
                      <p className="text-sm text-gray-600">Mã hóa SSL 256-bit bảo vệ mọi thông tin</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 text-center">
                  Lợi ích khi sử dụng GoShip
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div 
                      key={index} 
                      className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mb-3">
                          {benefit.icon}
                        </div>
                        <h4 className="font-bold text-gray-800 text-sm mb-2">
                          {benefit.title}
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Stats */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                  Cộng đồng GoShip hùng mạnh
                </h3>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-1">10K+</div>
                    <div className="text-sm text-gray-600 font-medium">Doanh nghiệp</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-indigo-600 mb-1">200+</div>
                    <div className="text-sm text-gray-600 font-medium">Đối tác</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600 mb-1">99.9%</div>
                    <div className="text-sm text-gray-600 font-medium">Hài lòng</div>
                  </div>
                </div>
                <p className="text-center text-gray-600 text-sm mt-6">
                  Tham gia cộng đồng vận chuyển lớn nhất Việt Nam
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-gray-200 mt-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="/Logo.png" 
                alt="GoShip" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-gray-600 text-sm">© 2024 GoShip. All rights reserved.</span>
            </div>
            <div className="flex gap-6">
              <a href="#privacy" className="text-gray-600 hover:text-emerald-600 text-sm transition-colors">
                Chính sách bảo mật
              </a>
              <a href="#terms" className="text-gray-600 hover:text-emerald-600 text-sm transition-colors">
                Điều khoản dịch vụ
              </a>
              <a href="#contact" className="text-gray-600 hover:text-emerald-600 text-sm transition-colors">
                Liên hệ hỗ trợ
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* DynamicDialog xác nhận thành công */}
      <DynamicDialog
        open={dialogOpen}
        mode="success"
        title="🎉 Đăng ký thành công!"
        message={
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto">
              <FaCheck className="text-emerald-600 w-10 h-10" />
            </div>
            <div>
              <p className="text-gray-700 font-medium text-lg mb-2">Chúc mừng bạn đã trở thành thành viên GoShip!</p>
              <p className="text-gray-600 text-sm">
                Chúng tôi đã gửi email xác nhận đến <strong className="text-emerald-600">{form.values.email}</strong>
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Vui lòng kiểm tra hộp thư và làm theo hướng dẫn để kích hoạt tài khoản.
              </p>
            </div>
          </div>
        }
        onClose={() => {
          setDialogOpen(false);
          navigate("/dang-nhap");
        }}
        onConfirm={() => navigate("/dang-nhap")}
        confirmText="Đăng nhập ngay"
        closeText="Đóng"
        customButtons={[
          {
            text: "Về trang chủ",
            onClick: () => navigate("/"),
            className: "bg-gray-100 hover:bg-gray-200 text-gray-800"
          },
          {
            text: "Đăng nhập",
            onClick: () => navigate("/dang-nhap"),
            className: "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
          }
        ]}
      />
    </div>
  );
};

export default RegisterPage;