import { FaCheckCircle } from "react-icons/fa";

const SuccessScreen = ({ tracking, fee }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCheckCircle className="text-4xl text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tạo đơn thành công!
        </h2>
        <p className="text-gray-600 mb-6">
          Đơn hàng đã được tạo và sẵn sàng giao
        </p>
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <p className="text-xs text-gray-600 mb-1">Mã vận đơn</p>
          <p className="font-mono font-bold text-lg text-blue-600 break-all">
            {tracking}
          </p>
        </div>
        <div className="bg-amber-50 rounded-lg p-4 mb-6">
          <p className="text-xs text-gray-600 mb-1">Phí vận chuyển</p>
          <p className="font-bold text-xl text-amber-600">
            {fee.toLocaleString("vi-VN")}₫
          </p>
        </div>
        <button
          onClick={() => (window.location.href = "/")}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;