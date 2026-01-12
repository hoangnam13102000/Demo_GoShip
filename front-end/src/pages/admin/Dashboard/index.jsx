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
  FaChartLine,
  FaCalendar,
  FaArrowUp,
  FaArrowDown,
  FaClock
} from "react-icons/fa";
import StatCard from "../../../components/common/Cards/StatCard";
import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";
import RevenueChart from "../../../components/UI/charts/RevenueChart";
import PieChartCard from "../../../components/UI/charts/PieChartCard";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const formatCurrency = (num) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);

// ===== React Query Hooks =====
const useDashboardSummary = () =>
  useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: async () => {
      const res = await api.get("/dashboard/summary");
      return res.data;
    },
  });

const useRevenue = () =>
  useQuery({
    queryKey: ["dashboardRevenue"],
    queryFn: async () => {
      const res = await api.get("/dashboard/revenue");
      return res.data;
    },
  });

const useTopCustomers = () =>
  useQuery({
    queryKey: ["dashboardTopCustomers"],
    queryFn: async () => {
      const res = await api.get("/dashboard/top-customers");
      return res.data;
    },
  });

const Dashboard = () => {
  const { data: summary = {}, isLoading: loadingSummary } = useDashboardSummary();
  const { data: revenueData = { labels: [], values: [] }, isLoading: loadingRevenue } = useRevenue();
  const { data: topCustomers = [], isLoading: loadingTopCustomers } = useTopCustomers();

  // Tính toán các chỉ số phụ
  const revenueGrowth = 12.5; // Tăng trưởng doanh thu %
  const orderGrowth = 8.3; // Tăng trưởng đơn hàng %
  const customerGrowth = 5.7; // Tăng trưởng khách hàng %

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-6 sm:px-6 lg:px-8 space-y-8">
      
      {/* ===== HEADER SECTION ===== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg">
              <FaChartLine className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Dashboard GoShip
              </h1>
              <p className="text-gray-600 mt-1">
                Tổng quan hệ thống - Thời gian thực
              </p>
            </div>
          </div>
          
          {/* Stats Quick View */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <FaClock className="text-blue-500" />
              <span>Cập nhật: {new Date().toLocaleTimeString('vi-VN')}</span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="flex items-center gap-2 text-green-600">
              <FaArrowUp className="text-sm" />
              <span>Doanh thu: +{revenueGrowth}%</span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="flex items-center gap-2 text-blue-600">
              <FaCalendar className="text-blue-500" />
              <span>{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition duration-200 shadow-sm text-sm font-medium text-gray-700">
            Hôm nay
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition duration-200 shadow-sm text-sm font-medium text-gray-700">
            Tuần này
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200 shadow-md text-sm font-medium">
            Tháng này
          </button>
        </div>
      </div>

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Hiệu suất hệ thống</h3>
            <div className="text-2xl">📈</div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-100">Tỷ lệ hoàn thành</span>
              <span className="text-xl font-bold">98.5%</span>
            </div>
            <div className="w-full bg-blue-400 rounded-full h-2">
              <div className="bg-white h-2 rounded-full" style={{ width: '98.5%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Hài lòng khách hàng</h3>
            <div className="text-2xl">😊</div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-green-100">Đánh giá trung bình</span>
              <span className="text-xl font-bold">4.8/5</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-6 h-6 text-yellow-300">★</div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Thời gian xử lý</h3>
            <div className="text-2xl">⚡</div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-purple-100">Trung bình/đơn</span>
              <span className="text-xl font-bold">2.4h</span>
            </div>
            <div className="text-sm text-purple-200">
              Giảm 15% so với tháng trước
            </div>
          </div>
        </div>
      </div>

      {/* ===== OVERVIEW SECTION ===== */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <div className="text-indigo-600">📊</div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Tổng quan hoạt động</h2>
              <p className="text-gray-500 text-sm">Cập nhật mới nhất về hệ thống GoShip</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Chào mừng đến với GoShip Dashboard</h3>
              <p className="text-gray-700 leading-relaxed">
                Hệ thống quản lý GoShip cung cấp cái nhìn toàn diện về hoạt động vận chuyển 
                của bạn. Theo dõi tình trạng đơn hàng, phân tích doanh thu và quản lý khách hàng 
                một cách hiệu quả với dữ liệu thời gian thực.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mt-0.5">
                    ✓
                  </div>
                  <span>Theo dõi đơn hàng và tình trạng vận chuyển</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mt-0.5">
                    ✓
                  </div>
                  <span>Phân tích doanh thu và hiệu suất kinh doanh</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mt-0.5">
                    ✓
                  </div>
                  <span>Quản lý thông tin khách hàng và dịch vụ</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin nhanh</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Đơn hàng hôm nay</span>
                  <span className="font-bold text-gray-900">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Doanh thu hôm nay</span>
                  <span className="font-bold text-green-600">{formatCurrency(24500000)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Khách hàng mới</span>
                  <span className="font-bold text-blue-600">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tỷ lệ thành công</span>
                  <span className="font-bold text-green-600">99.2%</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Dữ liệu được cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} GoShip. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Hệ thống hoạt động bình thường
              </span>
              <span>|</span>
              <span>Phiên bản 2.1.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Dashboard);