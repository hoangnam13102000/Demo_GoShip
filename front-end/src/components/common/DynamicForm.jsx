import {
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaCheck,
  FaStar,
  FaToggleOn,
  FaToggleOff,
  FaInfoCircle,
  FaEye,
  FaEyeSlash,
  FaCalendarAlt,
  FaDollarSign,
  FaWeight,
  FaRuler,
  FaEnvelope,
  FaPhone,
  FaLink,
  FaEdit,
  FaPlus,
  FaKey,
  FaSync,
  FaMagic,
  FaPencilAlt,
  FaHashtag,
  FaFont,
} from "react-icons/fa";
import { useState, useEffect } from "react";

const DynamicForm = ({
  visible,
  title,
  form,
  fields,
  editing,
  successMessage,
  isSubmitting,
  onChange,
  onSubmit,
  onCancel,
  error,
}) => {
  // State cho password visibility
  const [showPassword, setShowPassword] = useState({});
  
  // State cho character counter
  const [charCount, setCharCount] = useState({});

  // Khởi tạo character counter
  useEffect(() => {
    const initialCounts = {};
    fields.forEach(field => {
      if (field.type === 'textarea') {
        initialCounts[field.name] = (form[field.name] || '').length;
      }
    });
    setCharCount(initialCounts);
  }, [form, fields]);

  // Checkbox config cho shipment service - Nâng cấp với gradient phức tạp
  const checkboxConfig = {
    is_featured: {
      label: "Dịch vụ nổi bật",
      description: "Hiển thị dịch vụ ở vị trí ưu tiên trên trang chủ",
      icon: FaStar,
      color: "from-amber-400 via-yellow-400 to-amber-500",
      bgColor: "from-amber-50/80 via-yellow-50/80 to-amber-100/80",
      borderColor: "border-amber-300",
      shadowColor: "shadow-amber-200/50",
    },
    is_active: {
      label: "Kích hoạt dịch vụ",
      description: "Cho phép khách hàng sử dụng dịch vụ này",
      icon: FaCheck,
      color: "from-emerald-400 via-green-400 to-emerald-500",
      bgColor: "from-emerald-50/80 via-green-50/80 to-emerald-100/80",
      borderColor: "border-emerald-300",
      shadowColor: "shadow-emerald-200/50",
    },
  };

  // Field type specific icons sử dụng react-icons
  const fieldTypeIcons = {
    email: FaEnvelope,
    phone: FaPhone,
    text: FaFont,
    number: FaHashtag,
    date: FaCalendarAlt,
    password: FaKey,
    url: FaLink,
    weight: FaWeight,
    price: FaDollarSign,
    dimension: FaRuler,
  };

  // Xử lý character counter cho textarea
  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    setCharCount(prev => ({ ...prev, [name]: value.length }));
    onChange(e);
  };

  // Toggle password visibility
  const togglePasswordVisibility = (fieldName) => {
    setShowPassword(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  // Get field icon
  const getFieldIcon = (field) => {
    if (field.icon) return field.icon;
    if (fieldTypeIcons[field.type]) {
      const IconComponent = fieldTypeIcons[field.type];
      return <IconComponent className="inline" />;
    }
    if (field.name.includes('email')) return <FaEnvelope className="inline" />;
    if (field.name.includes('phone')) return <FaPhone className="inline" />;
    if (field.name.includes('price') || field.name.includes('cost')) return <FaDollarSign className="inline" />;
    return <FaFont className="inline" />;
  };

  // Early return phải đặt sau tất cả hooks
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-purple-900/30 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 z-50 animate-fadeIn">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 scale-100 hover:scale-[1.005] border border-white/20">
        {/* HEADER với gradient phức tạp */}
        <div className="relative bg-gradient-to-r from-slate-900 via-blue-800/90 to-purple-900/90 px-4 sm:px-8 py-6 sm:py-8 text-white border-b border-white/10">
          {/* Header pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 2px, transparent 2px)`,
              backgroundSize: '30px 30px'
            }}></div>
          </div>
          
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                  {editing ? (
                    <FaEdit className="text-white text-lg" />
                  ) : (
                    <FaPlus className="text-white text-lg" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold truncate bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    {title}
                  </h2>
                  {editing && (
                    <p className="text-xs sm:text-sm text-blue-200/80 mt-1 flex items-center gap-1">
                      <FaInfoCircle className="w-3 h-3" />
                      Cập nhật thông tin chi tiết
                    </p>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onCancel}
              disabled={isSubmitting}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2.5 rounded-xl transition-all duration-200 flex-shrink-0 disabled:opacity-50 hover:scale-110 active:scale-95 group relative"
              aria-label="Đóng"
            >
              <FaTimes size={22} />
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-4 h-0.5 bg-white/50 rounded-full transition-all duration-200"></div>
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8">
          {/* SUCCESS MESSAGE với animation */}
          {successMessage && (
            <div className="mb-6 animate-slideDown">
              <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-emerald-50/90 to-green-50/90 border-l-4 border-emerald-500 rounded-2xl shadow-lg backdrop-blur-sm">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center animate-bounce-slow">
                    <FaCheckCircle className="text-emerald-600 w-5 h-5" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-emerald-900 mb-1">Thành công!</p>
                  <p className="text-xs text-emerald-700">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-6 animate-shake">
              <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-red-50/90 to-rose-50/90 border-l-4 border-red-500 rounded-2xl shadow-lg backdrop-blur-sm">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <FaExclamationCircle className="text-red-600 w-5 h-5" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-900 mb-1">Có lỗi xảy ra</p>
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* FIELDS */}
          <div className="space-y-6 sm:space-y-7">
            {fields.map((field, idx) => {
              if (field.hideWhenEdit && editing) return null;
              if (field.hideWhenCreate && !editing) return null;

              const fieldValue = form[field.name];
              const isRequired = field.required ?? true;
              const fieldIcon = getFieldIcon(field);

              // ============= CUSTOM CHECKBOX =============
              if (field.type === "checkbox") {
                const isChecked = fieldValue === true || fieldValue === 1 || fieldValue === "1";
                const config = checkboxConfig[field.name];
                const IconComponent = config?.icon;

                return (
                  <div key={field.name} className="group animate-fadeInUp" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className="relative">
                      {/* Modern Checkbox Card với glassmorphism */}
                      <div
                        onClick={() => {
                          if (!isSubmitting) {
                            onChange({
                              target: {
                                name: field.name,
                                type: "checkbox",
                                checked: !isChecked,
                              },
                            });
                          }
                        }}
                        className={`relative flex items-center gap-4 p-5 sm:p-6 cursor-pointer rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm ${
                          isChecked
                            ? `bg-gradient-to-r ${config?.bgColor} ${config?.borderColor} shadow-lg ${config?.shadowColor} scale-[1.02]`
                            : "bg-white/80 border-slate-200/80 hover:border-blue-300/80 hover:bg-blue-50/30 hover:shadow-md shadow-slate-200/50"
                        } ${isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:shadow-xl active:scale-95"}`}
                      >
                        {/* Animated Checkbox Circle */}
                        <div className="relative">
                          <div
                            className={`relative w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 rounded-full border-3 transition-all duration-300 flex items-center justify-center ${
                              isChecked
                                ? `bg-gradient-to-br ${config?.color} border-transparent shadow-lg animate-pulse-slow`
                                : "border-slate-300 group-hover:border-blue-400 bg-white"
                            }`}
                          >
                            {isChecked && IconComponent && (
                              <IconComponent className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white animate-scaleIn" />
                            )}
                          </div>
                          {/* Checkmark animation */}
                          {isChecked && (
                            <div className="absolute -inset-2 border-2 border-emerald-400/30 rounded-full animate-ping-slow"></div>
                          )}
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`text-sm sm:text-base font-bold transition-colors duration-300 ${
                              isChecked ? "text-slate-900" : "text-slate-800"
                            }`}>
                              {config?.label || field.label || field.name}
                            </p>
                            {isChecked && (
                              <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full animate-bounce-in">
                                ĐÃ BẬT
                              </span>
                            )}
                          </div>
                          {config?.description && (
                            <p className={`text-xs sm:text-sm transition-colors duration-300 ${
                              isChecked ? "text-blue-700 font-medium" : "text-slate-600"
                            }`}>
                              {config.description}
                            </p>
                          )}
                        </div>

                        {/* Toggle Icon với animation */}
                        <div className="flex-shrink-0 ml-2 transform transition-transform duration-300 group-hover:scale-110">
                          {isChecked ? (
                            <FaToggleOn className="w-8 h-8 sm:w-9 sm:h-9 text-emerald-500" />
                          ) : (
                            <FaToggleOff className="w-8 h-8 sm:w-9 sm:h-9 text-slate-400" />
                          )}
                        </div>

                        {/* Hidden Input */}
                        <input
                          type="checkbox"
                          name={field.name}
                          checked={isChecked}
                          onChange={() => {}}
                          disabled={isSubmitting}
                          className="absolute opacity-0 w-0 h-0"
                          required={field.required ?? false}
                        />
                      </div>

                      {/* Hint với icon */}
                      {field.hint && (
                        <div className="flex items-start gap-2 mt-3 p-3 bg-slate-50/80 rounded-xl">
                          <FaInfoCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-slate-600">{field.hint}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // ============= SELECT =============
              if (field.type === "select") {
                return (
                  <div key={field.name} className="group animate-fadeInUp" style={{ animationDelay: `${idx * 50}ms` }}>
                    <label className="block text-sm sm:text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <span className="text-blue-500 text-lg">
                        {fieldIcon}
                      </span>
                      <span>{field.label || field.name}</span>
                      {isRequired && (
                        <span className="text-rose-500 ml-1.5 text-xl">*</span>
                      )}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                      <select
                        name={field.name}
                        value={fieldValue || ""}
                        onChange={onChange}
                        disabled={isSubmitting}
                        className="relative w-full px-5 py-4 text-sm sm:text-base text-slate-900 bg-white/90 backdrop-blur-sm border-2 border-slate-200/80 rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 disabled:opacity-60 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md"
                        required={isRequired}
                      >
                        <option value="" className="text-slate-400">
                          {field.placeholder || `Chọn ${field.label || field.name}`}
                        </option>
                        {field.options.map((option) => (
                          <option key={option.value} value={option.value} className="py-2">
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors">
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    {field.hint && (
                      <p className="text-xs text-slate-500 mt-2.5 pl-1">{field.hint}</p>
                    )}
                  </div>
                );
              }

              // ============= TEXTAREA =============
              if (field.type === "textarea") {
                const currentCount = charCount[field.name] || 0;
                const maxLength = field.maxLength || 1000;
                const isNearLimit = currentCount > maxLength * 0.8;

                return (
                  <div key={field.name} className="group animate-fadeInUp" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
                        <span className="text-blue-500 text-lg">
                          {fieldIcon}
                        </span>
                        <span>{field.label || field.name}</span>
                        {isRequired && (
                          <span className="text-rose-500 ml-1.5 text-xl">*</span>
                        )}
                      </label>
                      <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                        isNearLimit 
                          ? currentCount > maxLength 
                            ? "bg-rose-100 text-rose-700" 
                            : "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {currentCount}/{maxLength}
                      </div>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                      <textarea
                        name={field.name}
                        value={fieldValue || ""}
                        onChange={handleTextareaChange}
                        placeholder={field.placeholder}
                        rows={field.rows || 4}
                        maxLength={maxLength}
                        disabled={isSubmitting}
                        className="relative w-full px-5 py-4 text-sm sm:text-base text-slate-900 bg-white/90 backdrop-blur-sm border-2 border-slate-200/80 rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all resize-none hover:border-blue-400 hover:bg-blue-50/30 disabled:opacity-60 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md"
                        required={isRequired}
                      />
                    </div>
                    {field.hint && (
                      <p className="text-xs text-slate-500 mt-2.5 pl-1">{field.hint}</p>
                    )}
                  </div>
                );
              }

              // ============= PASSWORD =============
              if (field.type === "password") {
                return (
                  <div key={field.name} className="group animate-fadeInUp" style={{ animationDelay: `${idx * 50}ms` }}>
                    <label className="block text-sm sm:text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <span className="text-blue-500 text-lg">
                        <FaKey />
                      </span>
                      <span>{field.label || field.name}</span>
                      {isRequired && (
                        <span className="text-rose-500 ml-1.5 text-xl">*</span>
                      )}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                      <input
                        type={showPassword[field.name] ? "text" : "password"}
                        name={field.name}
                        value={fieldValue || ""}
                        onChange={onChange}
                        placeholder={field.placeholder}
                        disabled={isSubmitting}
                        className="relative w-full px-5 py-4 text-sm sm:text-base text-slate-900 bg-white/90 backdrop-blur-sm border-2 border-slate-200/80 rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all hover:border-blue-400 hover:bg-blue-50/30 disabled:opacity-60 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md pr-12"
                        required={isRequired}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(field.name)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors p-2"
                        aria-label={showPassword[field.name] ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      >
                        {showPassword[field.name] ? (
                          <FaEyeSlash className="w-5 h-5" />
                        ) : (
                          <FaEye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {field.hint && (
                      <p className="text-xs text-slate-500 mt-2.5 pl-1">{field.hint}</p>
                    )}
                  </div>
                );
              }

              // ============= TEXT INPUT & OTHER =============
              return (
                <div key={field.name} className="group animate-fadeInUp" style={{ animationDelay: `${idx * 50}ms` }}>
                  <label className="block text-sm sm:text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="text-blue-500 text-lg">
                      {fieldIcon}
                    </span>
                    <span>{field.label || field.name}</span>
                    {isRequired && (
                      <span className="text-rose-500 ml-1.5 text-xl">*</span>
                    )}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={fieldValue || ""}
                      onChange={onChange}
                      placeholder={field.placeholder}
                      disabled={isSubmitting}
                      className="relative w-full px-5 py-4 text-sm sm:text-base text-slate-900 bg-white/90 backdrop-blur-sm border-2 border-slate-200/80 rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all hover:border-blue-400 hover:bg-blue-50/30 disabled:opacity-60 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md"
                      required={isRequired}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                    />
                    {field.type === "date" && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <FaCalendarAlt className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  {field.hint && (
                    <div className="flex items-start gap-2 mt-2.5 p-3 bg-slate-50/80 rounded-xl">
                      <FaInfoCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600">{field.hint}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER với gradient */}
        <div className="border-t border-slate-200/50 bg-gradient-to-r from-slate-50/90 to-blue-50/90 backdrop-blur-sm px-4 sm:px-8 py-5 sm:py-6">
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:flex-1 px-5 py-3.5 text-sm sm:text-base font-semibold border-2 border-slate-300 text-slate-700 rounded-2xl hover:bg-white hover:border-slate-400 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 group"
            >
              <span className="relative">
                Hủy
                <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-slate-400 transition-all duration-200"></span>
              </span>
            </button>

            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="w-full sm:flex-1 px-5 py-3.5 text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:via-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-95 group relative overflow-hidden"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                {isSubmitting && (
                  <FaSpinner className="animate-spin w-5 h-5" />
                )}
                <span className="flex items-center gap-2">
                  {isSubmitting
                    ? editing
                      ? "Đang lưu..."
                      : "Đang tạo..."
                    : editing
                    ? (
                      <>
                        <FaSync className="w-4 h-4" />
                        Cập nhật
                      </>
                    ) : (
                      <>
                        <FaMagic className="w-4 h-4" />
                        Tạo mới
                      </>
                    )}
                </span>
              </div>
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000">
                <div className="w-20 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.2;
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-in 0.6s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DynamicForm;