import { FaArrowLeft } from 'react-icons/fa';

const PrevButton = ({ onClick, disabled = false, label = 'Quay lại', className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
    >
      <FaArrowLeft /> {label}
    </button>
  );
};

export default PrevButton;