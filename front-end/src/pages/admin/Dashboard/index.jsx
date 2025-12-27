import { FaBox, FaUsers, FaTruck, FaMoneyBill } from "react-icons/fa";
import StatCard from "../../../components/common/Cards/StatCard";

const Dashboard = () => {
  return (
    <div
      className="
        min-h-screen bg-gray-100
        px-4 py-4
        sm:px-6 sm:py-6
        lg:px-8 lg:py-8
      "
    >
      {/* ===== TITLE ===== */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Tổng quan hệ thống CourierHub
        </p>
      </div>

      {/* ===== STATS ===== */}
      <div
        className="
          grid grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-4 sm:gap-6
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
          mt-8 sm:mt-10
          bg-white
          p-4 sm:p-6 lg:p-8
          rounded-xl shadow border
        "
      >
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
          Tổng quan hoạt động
        </h2>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Chào mừng bạn đến với hệ thống quản lý CourierHub.
          Tại đây bạn có thể theo dõi tình trạng đơn hàng,
          khách hàng và doanh thu theo thời gian thực.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
