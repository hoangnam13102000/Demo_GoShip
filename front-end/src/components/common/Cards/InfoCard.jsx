import React from "react";

/**
 * InfoCard - Component hiển thị thông tin dạng card với icon và label
 * @param {Object} props
 * @param {string} props.title - Tiêu đề của card
 * @param {React.ReactNode} props.children - Nội dung bên trong card
 * @param {React.ComponentType} props.icon - Icon component (từ react-icons)
 * @param {string} props.iconColor - Màu của icon (mặc định: text-blue-600)
 * @param {string} props.className - Class CSS tùy chỉnh thêm
 */
const InfoCard = ({ 
  title, 
  children, 
  icon: Icon, 
  iconColor = "text-blue-600",
  className = "" 
}) => {
  return (
    <div className={`bg-white p-4 rounded-lg ${className}`}>
      <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
        {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
        {title}
      </h3>
      <div className="space-y-3 text-sm">
        {children}
      </div>
    </div>
  );
};

/**
 * InfoItem - Component hiển thị một mục thông tin với label và value
 * @param {Object} props
 * @param {string} props.label - Nhãn của thông tin
 * @param {React.ReactNode} props.children - Giá trị hiển thị
 * @param {string} props.className - Class CSS tùy chỉnh thêm
 */
export const InfoItem = ({ label, children, className = "" }) => {
  return (
    <div className={className}>
      <p className="text-slate-600">{label}</p>
      <p className="font-medium text-slate-900">{children}</p>
    </div>
  );
};

/**
 * InfoItemWithIcon - Component hiển thị thông tin với icon
 * @param {Object} props
 * @param {React.ComponentType} props.icon - Icon component
 * @param {React.ReactNode} props.children - Nội dung hiển thị
 * @param {string} props.iconColor - Màu của icon (mặc định: text-slate-400)
 * @param {string} props.className - Class CSS tùy chỉnh thêm
 */
export const InfoItemWithIcon = ({ 
  icon: Icon, 
  children, 
  iconColor = "text-slate-400",
  className = "" 
}) => {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      {Icon && <Icon className={`w-4 h-4 ${iconColor} mt-0.5 flex-shrink-0`} />}
      <span className="text-slate-700">{children}</span>
    </div>
  );
};

export default InfoCard;