import { FaBox, FaUsers, FaTruck, FaMoneyBill } from "react-icons/fa";
import StatCard from "../../../components/common/Cards/StatCard";

const Dashboard = () => {
  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br from-gray-50 to-gray-100
        px-4 py-5
        sm:px-6 sm:py-6
        lg:px-10 lg:py-8
      "
    >
      {/* ===== TITLE ===== */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tổng quan hệ thống CourierHub
          </p>
        </div>

        <span className="text-xs text-gray-400">
          Cập nhật theo thời gian thực
        </span>
      </div>

      {/* ===== STATS ===== */}
      <div
        className="
          grid grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-5 sm:gap-6
        "
      >
        <StatCard
          title="Tổng đơn hàng"
          value="1,250"
          icon={FaBox}
          color="blue"
        />
        <StatCard
          title="Khách hàng"
          value="540"
          icon={FaUsers}
          color="green"
        />
        <StatCard
          title="Đang vận chuyển"
          value="128"
          icon={FaTruck}
          color="yellow"
        />
        <StatCard
          title="Doanh thu"
          value="320,000,00 VNĐ"
          icon={FaMoneyBill}
          color="red"
        />
      </div>

      {/* ===== OVERVIEW ===== */}
      <div
        className="
          mt-10
          bg-white
          p-5 sm:p-6 lg:p-8
          rounded-2xl
          shadow-sm
          border border-gray-100
        "
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800">
          Tổng quan hoạt động
        </h2>

        <div className="h-1 w-12 bg-blue-600 rounded-full mb-4"></div>

        <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-3xl">
          Chào mừng bạn đến với hệ thống quản lý CourierHub.
          Tại đây bạn có thể theo dõi tình trạng đơn hàng,
          khách hàng và doanh thu theo thời gian thực.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
