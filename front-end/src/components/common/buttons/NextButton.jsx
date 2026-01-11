import { FaArrowLeft, FaCheck } from 'react-icons/fa';

const NextButton = ({ 
  onClick, 
  disabled = false, 
  loading = false,
  label = 'Tiếp tục',
  loadingText = 'Đang xử lý...',
  icon: CustomIcon,
  showRightIcon = true,
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  className = '' 
}) => {
  const displayLabel = label;
  const displayLoadingText = loadingText;

  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };

  // Size styles
  const sizeStyles = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3 px-4 text-base',
    lg: 'py-4 px-6 text-lg',
  };

  // Width styles
  const widthClass = fullWidth ? 'flex-1' : 'px-4';

  const baseStyles = `${widthClass} ${sizeStyles[size]} ${variantStyles[variant]} font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`;

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${className}`}
    >
      {loading ? (
        <>
          <span>⏳</span>
          <span>{displayLoadingText}</span>
        </>
      ) : (
        <>
          {CustomIcon ? (
            <CustomIcon />
          ) : null}
          <span>{displayLabel}</span>
          {showRightIcon && (
            <FaArrowLeft style={{ transform: 'rotate(180deg)' }} />
          )}
        </>
      )}
    </button>
  );
};

export default NextButton;