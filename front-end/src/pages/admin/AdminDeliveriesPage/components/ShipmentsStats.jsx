import { FaBox, FaCheckCircle, FaClock, FaTruck } from "react-icons/fa";
import StatCard from "../../../../components/common/Cards/StatCard";

const ShipmentsStats = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Tổng đơn hàng"
          value={stats.total}
          icon={FaBox}
          color="blue"
        />
        <StatCard
          title="Chờ xử lý"
          value={stats.pending}
          icon={FaClock}
          color="yellow"
        />
        <StatCard
          title="Đang giao"
          value={stats.inTransit}
          icon={FaTruck}
          color="blue"
        />
        <StatCard
          title="Đã giao"
          value={stats.delivered}
          icon={FaCheckCircle}
          color="green"
        />
      </div>
    </div>
  );
};

export default ShipmentsStats;