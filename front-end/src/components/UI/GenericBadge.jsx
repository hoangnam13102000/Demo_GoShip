import React from "react";

const GenericBadge = ({
  value,
  config = {},
  label,
  showDot = true,
  size = "md",
  className = "",
  customLabel,
}) => {
  // Tìm config cho giá trị, fallback về DEFAULT nếu không có
  const badgeConfig = config[value] || config.DEFAULT || {
    className: "bg-gray-100 text-gray-800",
    dotColor: "bg-gray-500",
  };

  // Xử lý kích thước
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  const displayLabel = customLabel || label || badgeConfig.label || value;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses[size]} ${badgeConfig.className} ${className}`}
    >
      {showDot && badgeConfig.dotColor && (
        <span
          className={`w-2 h-2 rounded-full ${badgeConfig.dotColor}`}
        />
      )}
      {displayLabel}
    </span>
  );
};

export default GenericBadge;