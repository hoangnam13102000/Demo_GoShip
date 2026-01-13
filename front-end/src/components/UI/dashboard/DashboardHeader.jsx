import React from "react";
import { FaChartLine, FaCalendar, FaClock, FaArrowUp } from "react-icons/fa";

export const DashboardHeader = ({ 
  title = "Dashboard GoShip", 
  subtitle = "Tổng quan hệ thống - Thời gian thực",
  showDateFilter = false,
  startDate,
  endDate,
  onDateChange,
  actions = [],
  quickStats = []
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg">
            <FaChartLine className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {title}
            </h1>
            <p className="text-gray-600 mt-1">
              {subtitle}
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
          {quickStats.map((stat, index) => (
            <React.Fragment key={index}>
              <div className={`flex items-center gap-2 ${stat.color || 'text-green-600'}`}>
                {stat.icon || <FaArrowUp className="text-sm" />}
                <span>{stat.label}</span>
              </div>
              {index < quickStats.length - 1 && (
                <div className="h-4 w-px bg-gray-300"></div>
              )}
            </React.Fragment>
          ))}
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="flex items-center gap-2 text-blue-600">
            <FaCalendar className="text-blue-500" />
            <span>{new Date().toLocaleDateString('vi-VN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>

        {/* Date Filter Section */}
        {showDateFilter && (
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Từ ngày
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendar className="text-gray-400" />
                </div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => onDateChange?.('start', e.target.value)}
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
                  <FaCalendar className="text-gray-400" />
                </div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => onDateChange?.('end', e.target.value)}
                  className="pl-10 w-full rounded-xl border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 shadow-sm transition duration-200"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex gap-3">
        {actions.length > 0 ? actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`px-4 py-2 rounded-xl transition duration-200 shadow-sm text-sm font-medium ${action.className || 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'}`}
          >
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </button>
        )) : (
          <>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition duration-200 shadow-sm text-sm font-medium text-gray-700">
              Hôm nay
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition duration-200 shadow-sm text-sm font-medium text-gray-700">
              Tuần này
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200 shadow-md text-sm font-medium">
              Tháng này
            </button>
          </>
        )}
      </div>
    </div>
  );
};
export default DashboardHeader;