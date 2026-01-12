import { useState, memo } from "react";
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
import { FaBox, FaUsers, FaTruck, FaMoneyBill, FaLayerGroup, FaFileExcel, FaFilePdf, FaCalendarAlt, FaFilter, FaDownload, FaChartLine } from "react-icons/fa";
import StatCard from "../../../components/common/Cards/StatCard";
import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";
import { format } from "date-fns";
import RevenueChart from "../../../components/UI/charts/RevenueChart";
import PieChartCard from "../../../components/UI/charts/PieChartCard";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// ===== Format tiền VNĐ =====
const formatCurrency = (num) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);

// ===== React Query Hooks =====
const useDashboardSummary = (startDate, endDate) =>
  useQuery({
    queryKey: ["dashboardSummary", startDate, endDate],
    queryFn: async () => {
      const res = await api.get("/dashboard/summary", {
        params: { start_date: startDate, end_date: endDate },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

const useRevenue = (startDate, endDate) =>
  useQuery({
    queryKey: ["dashboardRevenue", startDate, endDate],
    queryFn: async () => {
      const res = await api.get("/dashboard/revenue", {
        params: { start_date: startDate, end_date: endDate },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

const useTopCustomers = (startDate, endDate) =>
  useQuery({
    queryKey: ["dashboardTopCustomers", startDate, endDate],
    queryFn: async () => {
      const res = await api.get("/dashboard/top-customers", {
        params: { start_date: startDate, end_date: endDate },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

const useTopServices = (startDate, endDate) =>
  useQuery({
    queryKey: ["dashboardTopServices", startDate, endDate],
    queryFn: async () => {
      const res = await api.get("/dashboard/top-services", {
        params: { start_date: startDate, end_date: endDate },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

const DashboardReport = () => {
  // ===== State lọc ngày =====
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-01"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));

  // ===== Fetch dữ liệu =====
  const { data: summary = {}, isLoading: loadingSummary } = useDashboardSummary(startDate, endDate);
  const { data: revenueData = { labels: [], values: [] }, isLoading: loadingRevenue } = useRevenue(startDate, endDate);
  const { data: topCustomers = [], isLoading: loadingTopCustomers } = useTopCustomers(startDate, endDate);
  const { data: topServices = [], isLoading: loadingTopServices } = useTopServices(startDate, endDate);

  // ===== Hàm xuất file Excel =====
  const exportExcel = () => {
    // Sử dụng URL backend Laravel đầy đủ
    window.open(
      `http://127.0.0.1:8000/api/dashboard/export?start_date=${startDate}&end_date=${endDate}`,
      "_blank"
    );
  };

  // ===== Hàm xuất file PDF =====
  const exportPDF = () => {
    // Sử dụng URL backend Laravel đầy đủ
    window.open(
      `http://127.0.0.1:8000/api/dashboard/export-pdf?start_date=${startDate}&end_date=${endDate}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-6 sm:px-6 lg:px-8 space-y-8">
      
      {/* ===== HEADER SECTION ===== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg">
              <FaChartLine className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Báo cáo hệ thống GoShip
              </h1>
              <p className="text-gray-600 mt-1">
                Tổng quan và thống kê theo khoảng thời gian
              </p>
            </div>
          </div>
          
          {/* Date Display */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaCalendarAlt />
            <span>
              {new Date(startDate).toLocaleDateString('vi-VN')} - {new Date(endDate).toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>
        
        {/* Export Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={exportExcel}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <FaFileExcel className="text-lg" />
            <span>Xuất Excel</span>
          </button>
          <button
            onClick={exportPDF}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <FaFilePdf className="text-lg" />
            <span>Xuất PDF</span>
          </button>
        </div>
      </div>

      {/* ===== FILTER SECTION ===== */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaFilter className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Lọc báo cáo</h2>
              <p className="text-sm text-gray-500">Chọn khoảng thời gian để xem dữ liệu</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Từ ngày
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10 w-full rounded-xl border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 shadow-sm transition duration-200"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Đến ngày
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10 w-full rounded-xl border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 shadow-sm transition duration-200"
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  const today = new Date();
                  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                  setStartDate(format(firstDay, "yyyy-MM-dd"));
                  setEndDate(format(today, "yyyy-MM-dd"));
                }}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition duration-200 font-medium"
              >
                Tháng này
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== STATS GRID ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng đơn hàng" 
          value={loadingSummary ? "..." : summary.totalOrders} 
          icon={FaBox} 
          color="blue"
          loading={loadingSummary}
          trend="up"
          subtitle="So với tháng trước"
        />
        <StatCard 
          title="Khách hàng" 
          value={loadingSummary ? "..." : summary.totalCustomers} 
          icon={FaUsers} 
          color="green"
          loading={loadingSummary}
          trend="up"
          subtitle="Tổng số khách hàng"
        />
        <StatCard 
          title="Đang vận chuyển" 
          value={loadingSummary ? "..." : summary.inTransit} 
          icon={FaTruck} 
          color="yellow"
          loading={loadingSummary}
          trend="neutral"
          subtitle="Đơn hàng đang giao"
        />
        <StatCard 
          title="Doanh thu" 
          value={loadingSummary ? "..." : formatCurrency(summary.totalRevenue)} 
          icon={FaMoneyBill} 
          color="red"
          loading={loadingSummary}
          trend="up"
          subtitle="Tổng doanh thu"
        />
      </div>

      {/* ===== CHARTS SECTION ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Doanh thu theo thời gian</h3>
                <p className="text-gray-500 text-sm">Thống kê doanh thu từng ngày</p>
              </div>
              <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                {new Date(startDate).toLocaleDateString('vi-VN')} - {new Date(endDate).toLocaleDateString('vi-VN')}
              </div>
            </div>
            <RevenueChart
              labels={revenueData.labels}
              values={revenueData.values}
              isLoading={loadingRevenue}
              title="Doanh thu"
              height="300px"
            />
          </div>
        </div>
        
        {/* Pie Charts */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaUsers className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Top 5 khách hàng</h3>
                <p className="text-gray-500 text-sm">Khách hàng có nhiều đơn nhất</p>
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
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaLayerGroup className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Top 5 dịch vụ</h3>
                <p className="text-gray-500 text-sm">Dịch vụ được sử dụng nhiều nhất</p>
              </div>
            </div>
            <PieChartCard
              labels={topServices.map((s) => s.service_name)}
              values={topServices.map((s) => s.total_shipments)}
              isLoading={loadingTopServices}
              title="Top 5 dịch vụ"
              icon={FaLayerGroup}
              iconColor="text-purple-600"
              height="220px"
            />
          </div>
        </div>
      </div>

      {/* ===== QUICK INSIGHTS ===== */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Thông tin nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Doanh thu trung bình/ngày</div>
            <div className="text-2xl font-bold text-blue-600">
              {loadingSummary ? "..." : formatCurrency(summary.totalRevenue / (revenueData.values?.length || 1))}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Tỷ lệ đơn đang giao</div>
            <div className="text-2xl font-bold text-yellow-600">
              {loadingSummary ? "..." : `${((summary.inTransit / summary.totalOrders) * 100 || 0).toFixed(1)}%`}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Khách hàng mới</div>
            <div className="text-2xl font-bold text-green-600">
              {loadingSummary ? "..." : "0"}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Đơn hàng/khách hàng</div>
            <div className="text-2xl font-bold text-purple-600">
              {loadingSummary ? "..." : (summary.totalOrders / summary.totalCustomers || 0).toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* ===== OVERVIEW / NOTES ===== */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900">📋 Tổng quan báo cáo</h2>
        </div>
        <div className="p-6">
          <div className="prose prose-blue max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Báo cáo này cung cấp cái nhìn tổng quan về hoạt động của GoShip trong khoảng thời gian đã chọn. 
              Dữ liệu được cập nhật theo thời gian thực và có thể được lọc theo nhu cầu của bạn.
            </p>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span>Chọn khoảng thời gian để xem thống kê tổng quan về đơn hàng, khách hàng, doanh thu và dịch vụ.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span>Xuất báo cáo ra file Excel hoặc PDF để lưu trữ hoặc chia sẻ với đội ngũ quản lý.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <span>Sử dụng biểu đồ để phân tích xu hướng và đưa ra quyết định kinh doanh hiệu quả.</span>
              </li>
            </ul>
          </div>
          
          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              Dữ liệu được cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportExcel}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition"
              >
                <FaFileExcel />
                Excel
              </button>
              <button
                onClick={exportPDF}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition"
              >
                <FaFilePdf />
                PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition">
                <FaDownload />
                Chia sẻ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(DashboardReport);