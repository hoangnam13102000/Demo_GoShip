import { memo, useState } from "react";
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
  FaClock,
  FaHourglassHalf,
  FaEye,
  FaCheckCircle
} from "react-icons/fa";
import Pagination from "../../../components/common/Pagination";
import StatCard from "../../../components/common/Cards/StatCard";
import RevenueChart from "../../../components/UI/charts/RevenueChart";
import PieChartCard from "../../../components/UI/charts/PieChartCard";
import TrackingSearch from "../../../components/common/bars/TrackingSearch";
import TrackingResult from "../../../pages/client/Tracking/TrackingResult";
import DynamicTable from "../../../components/common/DynamicTable";

import {
  formatCurrency,
  useDashboardSummary,
  useRevenue,
  useTopCustomers,
  usePendingShipments
} from "../../../api/hooks/useDashboardApi";

import QuickMetrics from "../../../components/UI/dashboard/QuickMetrics";
import OverviewSection from "../../../components/UI/dashboard/OverviewSection";
import axios from "../../../api/axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { data: summary = {}, isLoading: loadingSummary } = useDashboardSummary();
  const { data: revenueData = { labels: [], values: [] }, isLoading: loadingRevenue } = useRevenue();
  const { data: topCustomers = [], isLoading: loadingTopCustomers } = useTopCustomers();
  const { data: pendingShipments = [], isLoading: loadingPendingShipments } = usePendingShipments(5);

  const [trackingData, setTrackingData] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const revenueGrowth = 12.5;
  const orderGrowth = 8.3;
  const customerGrowth = 5.7;

  // Pagination logic
  const totalPages = Math.ceil(pendingShipments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentShipments = pendingShipments.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTrackingSearch = async (trackingNumber) => {
    setTrackingLoading(true);
    setTrackingError("");
    setTrackingData(null);

    try {
      const response = await axios.get(`/shipments/track/${trackingNumber}`);
      setTrackingData(response.data);
    } catch (error) {
      setTrackingData(null);
      setTrackingError(
        error.response?.data?.message || "Không tìm thấy vận đơn"
      );
    } finally {
      setTrackingLoading(false);
    }
  };

  const quickInfo = [
    { label: "Đơn hàng hôm nay", value: "24", color: "text-gray-900" },
    { label: "Doanh thu hôm nay", value: formatCurrency(24500000), color: "text-green-600" },
    { label: "Khách hàng mới", value: "5", color: "text-blue-600" },
    { label: "Tỷ lệ thành công", value: "99.2%", color: "text-green-600" },
  ];

  // Columns cho DynamicTable - Top Customers
  const customerColumns = [
    {
      key: 'name',
      title: 'Khách hàng',
      dataIndex: 'full_name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">
            {row.full_name?.charAt(0) || '?'}
          </div>
          <span className="font-medium text-gray-900">{row.full_name}</span>
        </div>
      )
    },
    {
      key: 'shipments',
      title: 'Số đơn hàng',
      dataIndex: 'total_shipments',
      align: 'right',
      render: (row) => (
        <span className="font-semibold text-gray-900">{row.total_shipments}</span>
      )
    },
    {
      key: 'percentage',
      title: 'Tỷ lệ',
      align: 'right',
      render: (row) => {
        const total = topCustomers.reduce((sum, c) => sum + c.total_shipments, 0);
        const percentage = ((row.total_shipments / total) * 100).toFixed(1);
        return (
          <span className="text-sm font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {percentage}%
          </span>
        );
      }
    }
  ];

  // Columns cho DynamicTable - Pending Shipments
  const pendingColumns = [
    {
      key: 'tracking_number',
      title: 'Mã vận đơn',
      dataIndex: 'tracking_number',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <span className="font-mono font-medium text-gray-900">{row.tracking_number}</span>
        </div>
      )
    },
    {
      key: 'customer',
      title: 'Khách hàng',
      dataIndex: 'customer_name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
            {row.customer_name?.charAt(0) || '?'}
          </div>
          <span className="text-gray-900 font-medium">{row.customer_name}</span>
        </div>
      )
    },
    {
      key: 'created_at',
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      render: (row) => (
        <div className="flex items-center gap-2 text-gray-600">
          <FaCalendar className="text-gray-400 text-xs" />
          <span>{new Date(row.created_at).toLocaleDateString("vi-VN")}</span>
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Thao tác',
      align: 'center',
      render: (row) => (
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium">
          <FaEye />
          <span>Xem chi tiết</span>
        </button>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 px-4 py-6 sm:px-6 lg:px-8 space-y-8">

      {/* ================= HEADER ================= */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 rounded-3xl shadow-2xl p-8 border border-blue-400/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">
                Dashboard GoShip
              </h1>
              <p className="text-blue-100 text-lg font-medium">
                Tổng quan hệ thống - Thời gian thực
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 lg:gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <FaClock className="text-blue-200" />
                <span className="text-white text-sm font-medium">
                  {new Date().toLocaleTimeString("vi-VN")}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/30 backdrop-blur-sm rounded-xl border border-green-400/30">
                <FaArrowUp className="text-green-200 text-xs" />
                <span className="text-white text-sm font-medium">
                  +{revenueGrowth}% doanh thu
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <FaCalendar className="text-blue-200" />
                <span className="text-white text-sm font-medium">
                  {new Date().toLocaleDateString("vi-VN", { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <TrackingSearch onSearch={handleTrackingSearch} />
          </div>

          <div className="mt-8">
            {trackingLoading && (
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                <p className="text-white mt-4 font-medium">Đang tìm kiếm vận đơn...</p>
              </div>
            )}
            {trackingError && (
              <div className="max-w-2xl mx-auto bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{trackingError}</p>
                  </div>
                </div>
              </div>
            )}
            {trackingData && <TrackingResult data={trackingData} />}
          </div>
        </div>
      </div>

      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative transform hover:scale-105 transition-transform duration-300">
          <StatCard 
            title="Tổng đơn hàng" 
            value={summary.totalOrders} 
            icon={FaBox} 
            color="blue" 
            loading={loadingSummary}
            trend="up"
            trendValue={`+${orderGrowth}%`}
            subtitle="So với tháng trước"
            className="h-full hover:shadow-2xl transition-shadow duration-300"
          />
        </div>
        <div className="relative transform hover:scale-105 transition-transform duration-300">
          <StatCard 
            title="Đang vận chuyển" 
            value={summary.inTransit} 
            icon={FaTruck} 
            color="yellow" 
            loading={loadingSummary}
            trend="neutral"
            subtitle="Đơn hàng đang giao"
            className="h-full hover:shadow-2xl transition-shadow duration-300"
          />
          {!loadingSummary && summary.inTransit > 0 && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-3 py-1.5 rounded-full shadow-lg animate-pulse">
              Active
            </div>
          )}
        </div>
        <div className="relative transform hover:scale-105 transition-transform duration-300">
          <StatCard
            title="Chờ xử lý"
            value={summary.pending}
            icon={FaHourglassHalf}
            color="purple"
            loading={loadingSummary}
            trend="neutral"
            subtitle="Cần xử lý ngay"
            className="h-full hover:shadow-2xl transition-shadow duration-300"
          />
          {!loadingSummary && summary.pending > 0 && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
              {summary.pending}
            </div>
          )}
        </div>
        <div className="relative transform hover:scale-105 transition-transform duration-300">
          <StatCard 
            title="Doanh thu" 
            value={formatCurrency(summary.totalRevenue)} 
            icon={FaMoneyBill} 
            color="red" 
            loading={loadingSummary}
            trend="up"
            trendValue={`+${revenueGrowth}%`}
            subtitle="Tổng doanh thu"
            className="h-full hover:shadow-2xl transition-shadow duration-300"
          />
          {!loadingSummary && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white text-xs px-4 py-1.5 rounded-full shadow-lg">
              🏆 Cao nhất
            </div>
          )}
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 transform hover:scale-[1.02] transition-transform duration-300">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 h-full hover:shadow-2xl transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                    <FaMoneyBill className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Doanh thu 12 tháng</h3>
                </div>
                <p className="text-gray-500 text-sm">Biểu đồ thể hiện doanh thu theo từng tháng</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                <FaArrowUp className="text-sm" />
                <span>Tăng {revenueGrowth}% so với năm trước</span>
              </div>
            </div>
            <RevenueChart
              labels={revenueData.labels}
              values={revenueData.values}
              isLoading={loadingRevenue}
              title="Doanh thu 12 tháng"
              height="300px"
            />
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">Trung bình/tháng:</span> {formatCurrency(revenueData.values?.reduce((a, b) => a + b, 0) / (revenueData.values?.length || 1) || 0)}
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Doanh thu</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="transform hover:scale-[1.02] transition-transform duration-300">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 h-full hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-200 rounded-lg">
                    <FaUsers className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Top 5 khách hàng</h3>
                </div>
                <p className="text-gray-500 text-sm">Khách hàng có nhiều đơn hàng nhất</p>
              </div>
            </div>
            <PieChartCard
              labels={topCustomers.map(customer => customer.full_name)}
              values={topCustomers.map(customer => customer.total_shipments)}
              isLoading={loadingTopCustomers}
              title="Top khách hàng"
              height="220px"
            />
            {!loadingTopCustomers && topCustomers.length > 0 && (
              <div className="mt-6 space-y-3">
                <div className="text-sm font-medium text-gray-700">Chi tiết khách hàng hàng đầu</div>
                <div className="space-y-2">
                  {topCustomers.slice(0, 3).map((customer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg hover:from-gray-100 hover:to-blue-100 transition-all duration-200 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-blue-600 font-bold shadow-sm">
                          {customer.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{customer.full_name}</div>
                          <div className="text-xs text-gray-500">{customer.total_shipments} đơn hàng</div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {((customer.total_shipments / topCustomers.reduce((sum, c) => sum + c.total_shipments, 0)) * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= TOP CUSTOMERS TABLE ================= */}
      <div className="transform hover:scale-[1.01] transition-transform duration-300">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-200 rounded-lg">
                <FaUsers className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Danh sách khách hàng</h3>
                <p className="text-sm text-gray-500">Tất cả khách hàng có đơn hàng</p>
              </div>
            </div>
            {!loadingTopCustomers && topCustomers.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                <FaCheckCircle className="text-sm" />
                <span>{topCustomers.length} khách hàng</span>
              </div>
            )}
          </div>

          <DynamicTable
            columns={customerColumns}
            data={topCustomers}
            isLoading={loadingTopCustomers}
            isError={false}
            rowKey="customer_id"
          />
        </div>
      </div>

      {/* ================= PENDING TABLE - SỬ DỤNG DYNAMIC TABLE ================= */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transform hover:scale-[1.01] transition-transform duration-300 hover:shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-200 rounded-lg">
              <FaHourglassHalf className="text-purple-600 text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Đơn hàng chờ xử lý</h3>
              <p className="text-sm text-gray-500">Danh sách các đơn hàng cần xử lý gấp</p>
            </div>
          </div>
          {!loadingPendingShipments && pendingShipments.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
              <FaCheckCircle className="text-sm" />
              <span>{pendingShipments.length} đơn hàng</span>
            </div>
          )}
        </div>

        <DynamicTable
          columns={pendingColumns}
          data={currentShipments}
          isLoading={loadingPendingShipments}
          isError={false}
          rowKey="id"
          emptyText="Không có đơn hàng chờ xử lý"
          emptySubtext="Tất cả đơn hàng đã được xử lý"
          rowClassName="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50"
        />

        {/* Pagination */}
        {!loadingPendingShipments && pendingShipments.length > 0 && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              maxVisible={5}
            />
          </div>
        )}
      </div>

      <div className="transform hover:scale-[1.01] transition-transform duration-300">
        <QuickMetrics />
      </div>
      
      <div className="transform hover:scale-[1.01] transition-transform duration-300">
        <OverviewSection quickInfo={quickInfo} />
      </div>
    </div>
  );
};

export default memo(Dashboard);