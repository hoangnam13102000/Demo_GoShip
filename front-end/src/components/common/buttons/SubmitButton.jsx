const SubmitButton = ({ loading, children, onClick }) => {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className="
        relative w-full
        px-6 py-3.5
        rounded-2xl
        font-semibold text-white text-base
        bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800
        shadow-md shadow-blue-500/30
        transition-all duration-300 ease-out
        hover:shadow-lg hover:shadow-blue-600/40
        hover:scale-[1.01]
        active:scale-[0.98]
        disabled:opacity-70
        disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        overflow-hidden
      "
    >
      {/* Hiệu ứng ánh sáng nhẹ khi hover */}
      <span
        className="
          absolute inset-0
          bg-white/10
          opacity-0
          hover:opacity-100
          transition-opacity duration-300
        "
      />

      {/* Nội dung */}
      {loading ? (
        <span className="flex items-center gap-2 relative z-10">
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span>Đang xử lý...</span>
        </span>
      ) : (
        <span className="relative z-10 tracking-wide">
          {children}
        </span>
      )}
    </button>
  );
};

export default SubmitButton;
