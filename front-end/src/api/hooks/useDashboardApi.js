import { useQuery } from "@tanstack/react-query";
import api from "../axios";

// Format tiền VNĐ
export const formatCurrency = (num) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num || 0);

// Hook lấy dữ liệu tổng quan
export const useDashboardSummary = (startDate, endDate) =>
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

// Hook lấy dữ liệu doanh thu
export const useRevenue = (startDate, endDate) =>
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

// Hook lấy top khách hàng
export const useTopCustomers = (startDate, endDate) =>
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

// Hook lấy top dịch vụ
export const useTopServices = (startDate, endDate) =>
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