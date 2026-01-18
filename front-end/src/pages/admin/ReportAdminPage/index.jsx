import React, { useState, memo } from "react";
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
  FaLayerGroup, 
  FaClock, 
  FaFileExcel,
} from "react-icons/fa";
import StatCard from "../../../components/common/Cards/StatCard";
import { format } from "date-fns";
import RevenueChart from "../../../components/UI/charts/RevenueChart";
import PieChartCard from "../../../components/UI/charts/PieChartCard";
import DashboardHeader from "../../../components/UI/dashboard/DashboardHeader";
import { 
  useDashboardSummary, 
  useRevenue, 
  useTopCustomers, 
  useTopServices,
  formatCurrency 
} from "../../../api/hooks/useDashboardApi";

// Import component ReportPrintButton
import ReportPrintButton from "../../../components/common/buttons/ReportPrintButton";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const DashboardReport = () => {
  // ===== State lọc ngày =====
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-01"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [isPrinting, setIsPrinting] = useState(false);

  // ===== Fetch dữ liệu từ useDashboardApi.js =====
  const { data: summary = {}, isLoading: loadingSummary } = useDashboardSummary(startDate, endDate);
  const { data: revenueData = { labels: [], values: [] }, isLoading: loadingRevenue } = useRevenue(startDate, endDate);
  const { data: topCustomers = [], isLoading: loadingTopCustomers } = useTopCustomers(startDate, endDate);
  const { data: topServices = [], isLoading: loadingTopServices } = useTopServices(startDate, endDate);

  // ===== Hàm xuất file Excel =====
  const exportExcel = () => {
    window.open(
      `http://127.0.0.1:8000/api/dashboard/export?start_date=${startDate}&end_date=${endDate}`,
      "_blank"
    );
  };

  // ===== Quick Stats cho DashboardHeader =====
  const quickStats = [
    {
      label: `Đơn hàng: ${loadingSummary ? "..." : summary.totalOrders || 0}`,
      color: "text-blue-600",
    },
    {
      label: `Doanh thu: ${loadingSummary ? "..." : formatCurrency(summary.totalRevenue || 0)}`,
      color: "text-green-600",
    },
    {
      label: `Đang giao: ${loadingSummary ? "..." : summary.inTransit || 0}`,
      color: "text-yellow-600",
    },
  ];

  // ===== Actions cho DashboardHeader =====
  const headerActions = [
    {
      label: "Hôm nay",
      onClick: () => {
        const today = format(new Date(), "yyyy-MM-dd");
        setStartDate(today);
        setEndDate(today);
      },
      className: "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700",
    },
    {
      label: "Tuần này",
      onClick: () => {
        const today = new Date();
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        setStartDate(format(firstDayOfWeek, "yyyy-MM-dd"));
        setEndDate(format(lastDayOfWeek, "yyyy-MM-dd"));
      },
      className: "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700",
    },
    {
      label: "Tháng này",
      onClick: () => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        setStartDate(format(firstDay, "yyyy-MM-dd"));
        setEndDate(format(today, "yyyy-MM-dd"));
      },
      className: "bg-blue-600 text-white hover:bg-blue-700",
    },
  ];

  // ===== Xử lý thay đổi ngày =====
  const handleDateChange = (type, value) => {
    if (type === "start") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  // ===== Tính toán thống kê nhanh =====
  const averageDailyRevenue = revenueData.values?.length > 0 
    ? (summary.totalRevenue || 0) / revenueData.values.length 
    : 0;
  
  const transitRate = summary.totalOrders > 0 
    ? ((summary.inTransit || 0) / summary.totalOrders) * 100 
    : 0;
  
  const ordersPerCustomer = summary.totalCustomers > 0 
    ? (summary.totalOrders || 0) / summary.totalCustomers 
    : 0;

  // ===== Custom Export Buttons với nút in =====
  const CustomExportButtons = () => (
    <div className="flex gap-2">
      <button
        onClick={exportExcel}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
      >
        <FaFileExcel className="w-4 h-4" />
        <span>Xuất Excel</span>
      </button>
      
      {/* Sử dụng component ReportPrintButton đã import */}
      <ReportPrintButton
        summary={summary}
        revenueData={revenueData}
        topCustomers={topCustomers}
        topServices={topServices}
        startDate={startDate}
        endDate={endDate}
        isLoading={loadingSummary || loadingRevenue || loadingTopCustomers || loadingTopServices}
        onPrintStart={() => setIsPrinting(true)}
        onPrintEnd={() => setIsPrinting(false)}
        variant="primary"
        size="md"
        fullWidth={false}
        disabled={loadingSummary || loadingRevenue || loadingTopCustomers || loadingTopServices}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-6 sm:px-6 lg:px-8 space-y-8">
      
      {/* ===== HEADER SECTION với DashboardHeader ===== */}
      <DashboardHeader
        title="Báo cáo hệ thống GoShip"
        subtitle="Tổng quan và thống kê theo khoảng thời gian"
        showDateFilter={true}
        startDate={startDate}
        endDate={endDate}
        onDateChange={handleDateChange}
        actions={headerActions}
        quickStats={quickStats}
      />

      {/* ===== EXPORT BUTTONS ===== */}
      <div className="flex justify-end">
        <CustomExportButtons />
      </div>

      {/* ===== STATS GRID ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng đơn hàng" 
          value={loadingSummary ? "..." : summary.totalOrders || 0} 
          icon={FaBox} 
          color="blue"
          loading={loadingSummary}
          trend="up"
          subtitle="So với tháng trước"
        />
        <StatCard 
          title="Khách hàng" 
          value={loadingSummary ? "..." : summary.totalCustomers || 0} 
          icon={FaUsers} 
          color="green"
          loading={loadingSummary}
          trend="up"
          subtitle="Tổng số khách hàng"
        />
        <StatCard 
          title="Đang vận chuyển" 
          value={loadingSummary ? "..." : summary.inTransit || 0} 
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
              labels={revenueData.labels || []}
              values={revenueData.values || []}
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
              {loadingSummary ? "..." : formatCurrency(averageDailyRevenue)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Tỷ lệ đơn đang giao</div>
            <div className="text-2xl font-bold text-yellow-600">
              {loadingSummary ? "..." : `${transitRate.toFixed(1)}%`}
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
              {loadingSummary ? "..." : ordersPerCustomer.toFixed(1)}
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
                <span>Xuất báo cáo ra file Excel để lưu trữ hoặc chia sẻ với đội ngũ quản lý.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <span>Sử dụng tính năng "In báo cáo" để in trực tiếp báo cáo ra giấy với đầy đủ thông tin thống kê.</span>
              </li>
            </ul>
          </div>
          
          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FaClock className="text-blue-500" />
                <span>Dữ liệu được cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}</span>
              </div>
            </div>
            <CustomExportButtons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(DashboardReport);