import { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaEdit,
  FaSpinner,
  FaTimes,
  FaCheck,
  FaCalendarAlt,
  FaIdCard,
  FaGlobe,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useProfileApi } from "../../../api/hooks/useProfileApi";
import DynamicForm from "../../../components/common/DynamicForm";
import DynamicDialog from "../../../components/UI/DynamicDialog";

const ProfilePage = () => {
  const { profile, loading, error, updateProfile, changePassword } =
    useProfileApi();

  const [showForm, setShowForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formError, setFormError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  
  // Thêm state cho DynamicDialog
  const [dialog, setDialog] = useState({
    open: false,
    mode: "success",
    title: "",
    message: "",
    onConfirm: null,
    onClose: null,
  });

  // Init form data khi mở modal
  useEffect(() => {
    if (profile && showForm) {
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
    }
  }, [profile, showForm]);

  // Init password form
  useEffect(() => {
    if (showPasswordForm) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswords({
        current: false,
        new: false,
        confirm: false,
      });
      setPasswordError(null);
    }
  }, [showPasswordForm]);

  /* ================== LOADING & ERROR STATES ================== */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="relative">
          <FaSpinner className="animate-spin text-indigo-600 w-12 h-12" />
          <div className="absolute inset-0 animate-ping opacity-20">
            <FaSpinner className="text-indigo-600 w-12 h-12" />
          </div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">
          Đang tải thông tin hồ sơ...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <FaTimes className="text-red-500 w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Đã xảy ra lỗi
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  /* ================== ROLE BADGE CONFIG ================== */
  const roleBadge = {
    USER: {
      bg: "bg-gradient-to-r from-blue-50 to-blue-100",
      text: "text-blue-800",
      border: "border-blue-200",
      icon: "text-blue-500",
    },
    AGENT: {
      bg: "bg-gradient-to-r from-emerald-50 to-green-100",
      text: "text-emerald-800",
      border: "border-emerald-200",
      icon: "text-emerald-500",
    },
    ADMIN: {
      bg: "bg-gradient-to-r from-purple-50 to-violet-100",
      text: "text-purple-800",
      border: "border-purple-200",
      icon: "text-purple-500",
    },
  };

  /* ================== FORM CONFIGS ================== */
  const profileFields = [
    {
      name: "full_name",
      label: "Họ và tên",
      type: "text",
      required: true,
      icon: "user",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      icon: "envelope",
    },
    {
      name: "phone",
      label: "Số điện thoại",
      type: "text",
      required: false,
      icon: "phone",
    },
    {
      name: "address",
      label: "Địa chỉ",
      type: "textarea",
      rows: 3,
      required: false,
      icon: "map-marker",
    },
  ];

  const passwordFields = [
    {
      name: "currentPassword",
      label: "Mật khẩu hiện tại",
      type: "password",
      required: true,
      icon: "lock",
      showPassword: showPasswords.current,
      onTogglePassword: () =>
        setShowPasswords((prev) => ({ ...prev, current: !prev.current })),
    },
    {
      name: "newPassword",
      label: "Mật khẩu mới",
      type: "password",
      required: true,
      icon: "lock",
      showPassword: showPasswords.new,
      onTogglePassword: () =>
        setShowPasswords((prev) => ({ ...prev, new: !prev.new })),
      helpText: "Ít nhất 6 ký tự",
    },
    {
      name: "confirmPassword",
      label: "Xác nhận mật khẩu mới",
      type: "password",
      required: true,
      icon: "lock",
      showPassword: showPasswords.confirm,
      onTogglePassword: () =>
        setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm })),
    },
  ];

  /* ================== HANDLERS ================== */
  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error khi người dùng bắt đầu nhập
    if (passwordError) {
      setPasswordError(null);
    }
  };

  const handleProfileSubmit = async () => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      const success = await updateProfile(formData);

      if (success) {
        // Hiển thị dialog thành công
        setDialog({
          open: true,
          mode: "success",
          title: "Thành công",
          message: "Thông tin hồ sơ đã được cập nhật thành công",
          onClose: () => {
            setDialog(prev => ({ ...prev, open: false }));
            setShowForm(false);
          }
        });
      } else {
        setFormError("Không thể cập nhật hồ sơ");
      }
    } catch (err) {
      setFormError(err.message || "Không thể cập nhật hồ sơ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async () => {
    // ===== VALIDATION =====
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("Vui lòng điền đầy đủ các trường");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Mật khẩu mới không khớp");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    // Kiểm tra mật khẩu mới không giống mật khẩu cũ
    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError("Mật khẩu mới phải khác mật khẩu hiện tại");
      return;
    }

    setIsChangingPassword(true);
    setPasswordError(null);

    try {
      const data = {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        new_password_confirmation: passwordData.confirmPassword,
      };

      const result = await changePassword(data);
      
      if (result.success) {
        // Hiển thị dialog thành công
        setDialog({
          open: true,
          mode: result.requiresRelogin ? "alert" : "success",
          title: "Thành công",
          message: result.message,
          onClose: () => {
            setDialog(prev => ({ ...prev, open: false }));
            
            if (result.requiresRelogin) {
              // Đăng xuất và chuyển đến trang đăng nhập
              localStorage.removeItem("access_token");
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              sessionStorage.clear();
              window.location.href = "/dang-nhap";
            } else {
              setShowPasswordForm(false);
            }
          }
        });
        
        // Reset form
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      setPasswordError(
        err.message || "Không thể đổi mật khẩu. Vui lòng thử lại.",
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  /* ================== CUSTOM FIELD COMPONENTS ================== */
  const PasswordField = ({ field, value, onChange, error }) => {
    const { name, label, showPassword, onTogglePassword, helpText } = field;

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {helpText && (
            <span className="text-xs text-gray-500 ml-2">({helpText})</span>
          )}
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name={name}
            value={value || ""}
            onChange={onChange}
            className={`w-full px-4 py-3 border ${error ? "border-red-300" : "border-gray-300"} rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all pr-12`}
            placeholder={`Nhập ${label.toLowerCase()}`}
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
          >
            {showPassword ? (
              <FaEyeSlash className="w-5 h-5" />
            ) : (
              <FaEye className="w-5 h-5" />
            )}
          </button>
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  };

  /* ================== RENDER ================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 shadow-2xl mb-8">
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center shadow-2xl">
                    <FaUser className="text-white w-12 h-12 md:w-14 md:h-14" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center border-4 border-white shadow-lg">
                    <FaCheck className="text-white w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {profile.full_name}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${roleBadge[profile.role].bg} ${roleBadge[profile.role].text} border ${roleBadge[profile.role].border} shadow-sm`}
                    >
                      <FaShieldAlt className={roleBadge[profile.role].icon} />
                      {profile.role}
                    </span>
                    <span className="text-sm text-white/80">
                      ID: #{profile.id?.slice(0, 8) || "000000"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="group inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-green-600"
                >
                  <FaLock />
                  <span>Đổi mật khẩu</span>
                </button>
                {profile.role !== "ADMIN" && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="group inline-flex items-center gap-3 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-white/95 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <FaEdit className="text-indigo-600" />
                    <span>Chỉnh sửa hồ sơ</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - THÔNG TIN CÁ NHÂN */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <FaUser className="text-indigo-600" />
                  </div>
                  Thông tin cá nhân
                </h2>
                <div className="text-sm text-gray-500">
                  Tham gia từ{" "}
                  {profile.created_at
                    ? new Date(profile.created_at).toLocaleDateString("vi-VN")
                    : "--/--/----"}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <InfoCard
                  icon={<FaEnvelope />}
                  label="Email"
                  value={profile.email}
                  color="bg-gradient-to-r from-blue-50 to-blue-100"
                  iconColor="text-blue-600"
                  copyable
                />
                <InfoCard
                  icon={<FaPhone />}
                  label="Số điện thoại"
                  value={profile.phone}
                  color="bg-gradient-to-r from-emerald-50 to-emerald-100"
                  iconColor="text-emerald-600"
                  copyable
                />
                <InfoCard
                  icon={<FaMapMarkerAlt />}
                  label="Địa chỉ"
                  value={profile.address}
                  color="bg-gradient-to-r from-amber-50 to-amber-100"
                  iconColor="text-amber-600"
                  fullWidth
                />
                <InfoCard
                  icon={<FaGlobe />}
                  label="Ngôn ngữ"
                  value="Tiếng Việt"
                  color="bg-gradient-to-r from-violet-50 to-violet-100"
                  iconColor="text-violet-600"
                />
                <InfoCard
                  icon={<FaCalendarAlt />}
                  label="Trạng thái tài khoản"
                  value="Đang hoạt động"
                  color="bg-gradient-to-r from-green-50 to-green-100"
                  iconColor="text-green-600"
                />
                <InfoCard
                  icon={<FaIdCard />}
                  label="Loại tài khoản"
                  value={
                    profile.role === "USER"
                      ? "Cá nhân"
                      : profile.role === "AGENT"
                        ? "Đại lý"
                        : "Quản trị"
                  }
                  color="bg-gradient-to-r from-purple-50 to-purple-100"
                  iconColor="text-purple-600"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - THỐNG KÊ VÀ HÀNH ĐỘNG */}
          <div className="space-y-8">
            {/* THỐNG KÊ */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-100 to-blue-100 flex items-center justify-center">
                  <FaShieldAlt className="text-indigo-600" />
                </div>
                Thống kê tài khoản
              </h3>
              <div className="space-y-4">
                <StatItem label="Thời gian tham gia" value="6 tháng" />
                <StatItem label="Hoạt động gần nhất" value="2 giờ trước" />
                <StatItem label="Số lần đăng nhập" value="47" />
                <StatItem
                  label="Độ tin cậy"
                  value="Cao"
                  badgeColor="bg-green-100 text-green-800"
                />
              </div>
            </div>

            {/* HÀNH ĐỘNG NHANH */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl shadow-lg p-6 md:p-8">
              <h3 className="text-lg font-bold text-gray-800 mb-6">
                Hành động nhanh
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full text-left p-4 bg-white rounded-xl hover:shadow-md transition-shadow flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <FaEdit className="text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-700">
                      Cập nhật thông tin
                    </span>
                  </div>
                  <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </button>
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="w-full text-left p-4 bg-white rounded-xl hover:shadow-md transition-shadow flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                      <FaLock className="text-emerald-600" />
                    </div>
                    <span className="font-medium text-gray-700">
                      Đổi mật khẩu
                    </span>
                  </div>
                  <div className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================== DYNAMIC FORM CHO CHỈNH SỬA HỒ SƠ ================== */}
      <DynamicForm
        visible={showForm}
        title="Chỉnh sửa hồ sơ"
        form={formData}
        fields={profileFields}
        editing={true}
        successMessage={""} // Đã xóa, sử dụng Dialog thay thế
        isSubmitting={isSubmitting}
        error={formError}
        onChange={handleProfileChange}
        onSubmit={handleProfileSubmit}
        onCancel={() => setShowForm(false)}
      />

      {/* ================== CUSTOM DYNAMIC FORM CHO ĐỔI MẬT KHẨU ================== */}
      {showPasswordForm && (
        <DynamicForm
          visible={showPasswordForm}
          title="Đổi mật khẩu"
          titleIcon={<FaLock className="w-6 h-6" />}
          form={passwordData}
          fields={passwordFields.map((field) => ({
            ...field,
            customRender: (fieldProps) => (
              <PasswordField key={fieldProps.field.name} {...fieldProps} />
            ),
          }))}
          editing={true}
          successMessage={""} // Đã xóa, sử dụng Dialog thay thế
          isSubmitting={isChangingPassword}
          error={passwordError}
          onChange={handlePasswordChange}
          onSubmit={handlePasswordSubmit}
          onCancel={() => setShowPasswordForm(false)}
          submitButtonText={
            isChangingPassword ? "Đang xử lý..." : "Đổi mật khẩu"
          }
          submitButtonIcon={<FaLock />}
          submitButtonClass="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
          footerContent={
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Yêu cầu mật khẩu:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${passwordData.newPassword?.length >= 6 ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  Ít nhất 6 ký tự
                </li>
                <li className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${passwordData.newPassword === passwordData.confirmPassword && passwordData.newPassword ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  Mật khẩu mới phải khớp
                </li>
                <li className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${passwordData.currentPassword ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  Phải nhập mật khẩu hiện tại
                </li>
                <li className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${passwordData.currentPassword !== passwordData.newPassword || !passwordData.newPassword ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  Mật khẩu mới phải khác mật khẩu cũ
                </li>
              </ul>
            </div>
          }
        />
      )}

      {/* ================== DYNAMIC DIALOG CHO THÔNG BÁO ================== */}
      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onClose={dialog.onClose}
        onConfirm={dialog.onConfirm}
        closeText="Đóng"
        confirmText="Xác nhận"
        cancelText="Hủy"
      />
    </div>
  );
};

/* ================== SUB COMPONENTS ================== */
const InfoCard = ({
  icon,
  label,
  value,
  color,
  iconColor,
  fullWidth,
  copyable,
}) => {
  const [copied, setCopied] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);

  const handleCopy = () => {
    if (value && copyable) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setShowCopyDialog(true);
      
      // Tự động đóng dialog sau 2 giây
      setTimeout(() => {
        setShowCopyDialog(false);
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <div className={`${fullWidth ? "md:col-span-2" : ""}`}>
      <div
        className={`p-5 rounded-xl border border-gray-100 hover:border-gray-200 transition-all hover:shadow-sm ${color}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow-sm ${iconColor}`}
            >
              {icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
              <p
                className={`font-semibold ${value ? "text-gray-800" : "text-gray-400"}`}
              >
                {value || "Chưa cập nhật"}
              </p>
            </div>
          </div>
          {copyable && value && (
            <button
              onClick={handleCopy}
              className="text-sm px-3 py-1 rounded-lg bg-white/70 hover:bg-white border border-gray-200 transition-colors text-gray-700"
            >
              {copied ? "Đã sao chép" : "Sao chép"}
            </button>
          )}
        </div>
      </div>

      {/* Dialog thông báo sao chép thành công */}
      <DynamicDialog
        open={showCopyDialog}
        mode="success"
        title="Thành công"
        message="Đã sao chép vào clipboard"
        onClose={() => setShowCopyDialog(false)}
        closeText="Đóng"
      />
    </div>
  );
};

const StatItem = ({ label, value, badgeColor }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="text-gray-600">{label}</span>
    {badgeColor ? (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColor}`}
      >
        {value}
      </span>
    ) : (
      <span className="font-semibold text-gray-800">{value}</span>
    )}
  </div>
);

export default ProfilePage;