const SubmitButton = ({ loading, children, onClick }) => {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-70 flex items-center justify-center"
    >
      {loading ? "Đang xử lý..." : children}
    </button>
  );
};

export default SubmitButton;
