import React from "react";

export const OverviewSection = ({ 
  title = "Tổng quan hoạt động",
  subtitle = "Cập nhật mới nhất về hệ thống",
  welcomeText,
  quickInfo = [],
  footer = true 
}) => {
  const defaultQuickInfo = [
    { label: "Đơn hàng hôm nay", value: "24", color: "text-gray-900" },
    { label: "Doanh thu hôm nay", value: "24.500.000 ₫", color: "text-green-600" },
    { label: "Khách hàng mới", value: "5", color: "text-blue-600" },
    { label: "Tỷ lệ thành công", value: "99.2%", color: "text-green-600" },
  ];

  const defaultWelcomeText = `Hệ thống quản lý GoShip cung cấp cái nhìn toàn diện về hoạt động vận chuyển 
    của bạn. Theo dõi tình trạng đơn hàng, phân tích doanh thu và quản lý khách hàng 
    một cách hiệu quả với dữ liệu thời gian thực.`;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <div className="text-indigo-600">📊</div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-500 text-sm">{subtitle}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Chào mừng đến với GoShip Dashboard</h3>
            <p className="text-gray-700 leading-relaxed">
              {welcomeText || defaultWelcomeText}
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
              {(quickInfo.length > 0 ? quickInfo : defaultQuickInfo).map((info, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-600">{info.label}</span>
                  <span className={`font-bold ${info.color}`}>{info.value}</span>
                </div>
              ))}
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
      {footer && (
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
      )}
    </div>
  );
};
export default OverviewSection;