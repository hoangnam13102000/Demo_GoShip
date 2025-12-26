const SubmitButton = ({ loading, children, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:shadow-lg transition disabled:opacity-70"
    >
      {loading ? "Đang xử lý..." : children}
    </button>
  );
};

export default SubmitButton;
