import { memo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { 
  FaBox, 
  FaUsers, 
  FaTruck, 
  FaMoneyBill, 
  FaCalendar,
  FaArrowUp,
  FaClock
} from "react-icons/fa";
import StatCard from "../../../components/common/Cards/StatCard";
import RevenueChart from "../../../components/UI/charts/RevenueChart";
import PieChartCard from "../../../components/UI/charts/PieChartCard";

// Import shared components và hooks
import {
  formatCurrency,
  useDashboardSummary,
  useRevenue,
  useTopCustomers
} from "../../../api/hooks/useDashboardApi";
import {DashboardHeader} from "../../../components/UI/dashboard/DashboardHeader";
import QuickMetrics from "../../../components/UI/dashboard/QuickMetrics";
import OverviewSection from "../../../components/UI/dashboard/OverviewSection";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { data: summary = {}, isLoading: loadingSummary } = useDashboardSummary();
  const { data: revenueData = { labels: [], values: [] }, isLoading: loadingRevenue } = useRevenue();
  const { data: topCustomers = [], isLoading: loadingTopCustomers } = useTopCustomers();

  const revenueGrowth = 12.5;
  const orderGrowth = 8.3;
  const customerGrowth = 5.7;

  // Quick actions cho DashboardHeader
  const dashboardActions = [
    {
      label: "Hôm nay",
      className: "px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition duration-200 shadow-sm text-sm font-medium text-gray-700"
    },
    {
      label: "Tuần này",
      className: "px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition duration-200 shadow-sm text-sm font-medium text-gray-700"
    },
    {
      label: "Tháng này",
      className: "px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200 shadow-md text-sm font-medium"
    }
  ];

  // Quick stats cho DashboardHeader
  const quickStats = [
    {
      icon: <FaClock className="text-blue-500" />,
      label: `Cập nhật: ${new Date().toLocaleTimeString('vi-VN')}`,
      color: 'text-gray-600'
    },
    {
      icon: <FaArrowUp className="text-sm" />,
      label: `Doanh thu: +${revenueGrowth}%`,
      color: 'text-green-600'
    },
    {
      icon: <FaCalendar className="text-blue-500" />,
      label: new Date().toLocaleDateString('vi-VN', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      color: 'text-blue-600'
    }
  ];

  // Quick info cho OverviewSection
  const quickInfo = [
    { label: "Đơn hàng hôm nay", value: "24", color: "text-gray-900" },
    { label: "Doanh thu hôm nay", value: formatCurrency(24500000), color: "text-green-600" },
    { label: "Khách hàng mới", value: "5", color: "text-blue-600" },
    { label: "Tỷ lệ thành công", value: "99.2%", color: "text-green-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-6 sm:px-6 lg:px-8 space-y-8">
      
      {/* ===== HEADER SECTION ===== */}
      <DashboardHeader 
        title="Dashboard GoShip"
        subtitle="Tổng quan hệ thống - Thời gian thực"
        actions={dashboardActions}
        quickStats={quickStats}
      />

      {/* ===== STATS GRID ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative">
          <StatCard
            title="Tổng đơn hàng"
            value={loadingSummary ? "..." : summary.totalOrders}
            icon={FaBox}
            color="blue"
            loading={loadingSummary}
            trend="up"
            trendValue={`+${orderGrowth}%`}
            subtitle="So với tháng trước"
            className="h-full"
          />
        </div>
        <div className="relative">
          <StatCard
            title="Khách hàng"
            value={loadingSummary ? "..." : summary.totalCustomers}
            icon={FaUsers}
            color="green"
            loading={loadingSummary}
            trend="up"
            trendValue={`+${customerGrowth}%`}
            subtitle="Tổng số khách hàng"
            className="h-full"
          />
        </div>
        <div className="relative">
          <StatCard
            title="Đang vận chuyển"
            value={loadingSummary ? "..." : summary.inTransit}
            icon={FaTruck}
            color="yellow"
            loading={loadingSummary}
            trend="neutral"
            subtitle="Đơn hàng đang giao"
            className="h-full"
          />
          {!loadingSummary && (
            <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
              Active
            </div>
          )}
        </div>
        <div className="relative">
          <StatCard
            title="Doanh thu"
            value={loadingSummary ? "..." : formatCurrency(summary.totalRevenue)}
            icon={FaMoneyBill}
            color="red"
            loading={loadingSummary}
            trend="up"
            trendValue={`+${revenueGrowth}%`}
            subtitle="Tổng doanh thu"
            className="h-full"
          />
          {!loadingSummary && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full shadow">
              Cao nhất
            </div>
          )}
        </div>
      </div>

      {/* ===== CHARTS SECTION ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FaMoneyBill className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Doanh thu 12 tháng</h3>
                </div>
                <p className="text-gray-500 text-sm">Biểu đồ thể hiện doanh thu theo từng tháng</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                <FaArrowUp className="text-sm" />
                <span>Tăng {revenueGrowth}% so với năm trước</span>
              </div>
            </div>
            <RevenueChart
              labels={revenueData.labels}
              values={revenueData.values}
              isLoading={loadingRevenue}
              title="Doanh thu"
              height="300px"
            />
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">Trung bình/tháng:</span> {formatCurrency(revenueData.values?.reduce((a, b) => a + b, 0) / (revenueData.values?.length || 1) || 0)}
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Doanh thu</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Top Customers Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaUsers className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Top 5 khách hàng</h3>
              </div>
              <p className="text-gray-500 text-sm">Khách hàng có nhiều đơn hàng nhất</p>
            </div>
          </div>
          
          <PieChartCard
            labels={topCustomers.map((c) => c.full_name)}
            values={topCustomers.map((c) => c.total_shipments)}
            isLoading={loadingTopCustomers}
            title="Top 5 khách hàng"
            icon={FaUsers}
            iconColor="text-green-600"
            height="220px"
          />
          
          {/* Customer Details */}
          {!loadingTopCustomers && topCustomers.length > 0 && (
            <div className="mt-6 space-y-3">
              <div className="text-sm font-medium text-gray-700">Chi tiết khách hàng hàng đầu</div>
              <div className="space-y-2">
                {topCustomers.slice(0, 3).map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-150">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-medium">
                        {customer.full_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{customer.full_name}</div>
                        <div className="text-xs text-gray-500">{customer.total_shipments} đơn hàng</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-blue-600">
                      {((customer.total_shipments / topCustomers.reduce((sum, c) => sum + c.total_shipments, 0)) * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== QUICK METRICS ===== */}
      <QuickMetrics />

      {/* ===== OVERVIEW SECTION ===== */}
      <OverviewSection 
        quickInfo={quickInfo}
      />
    </div>
  );
};

export default memo(Dashboard);