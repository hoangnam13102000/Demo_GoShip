import { 
  FaChartLine, 
  FaBox, 
  FaMoneyBill, 
  FaUsers, 
  FaPercentage, 
  FaClock,
  FaCheck,
  FaShieldAlt 
} from "react-icons/fa";

export const OverviewSection = ({ 
  title = "Tổng quan hoạt động",
  subtitle = "Cập nhật mới nhất về hệ thống",
  welcomeText,
  quickInfo = [],
  footer = true 
}) => {
  const defaultQuickInfo = [
    { label: "Đơn hàng hôm nay", value: "24", color: "text-gray-900", icon: <FaBox /> },
    { label: "Doanh thu hôm nay", value: "24.500.000 ₫", color: "text-green-600", icon: <FaMoneyBill /> },
    { label: "Khách hàng mới", value: "5", color: "text-blue-600", icon: <FaUsers /> },
    { label: "Tỷ lệ thành công", value: "99.2%", color: "text-green-600", icon: <FaPercentage /> },
  ];

  const defaultWelcomeText = `Hệ thống quản lý GoShip cung cấp cái nhìn toàn diện về hoạt động vận chuyển của bạn. Theo dõi tình trạng đơn hàng, phân tích doanh thu và quản lý khách hàng một cách hiệu quả với dữ liệu thời gian thực.`;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <FaChartLine className="text-indigo-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-500 text-sm">{subtitle}</p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Welcome & Features */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Chào mừng đến với GoShip Dashboard</h3>
              <p className="text-gray-700 leading-relaxed">
                {welcomeText || defaultWelcomeText}
              </p>
            </div>
            
            <ul className="space-y-3">
              {[
                { icon: <FaBox />, text: "Theo dõi đơn hàng và tình trạng vận chuyển", color: "text-blue-600", bg: "bg-blue-100" },
                { icon: <FaChartLine />, text: "Phân tích doanh thu và hiệu suất kinh doanh", color: "text-green-600", bg: "bg-green-100" },
                { icon: <FaUsers />, text: "Quản lý thông tin khách hàng và dịch vụ", color: "text-purple-600", bg: "bg-purple-100" },
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${item.bg} ${item.color}`}>
                    <FaCheck className="text-xs" />
                  </div>
                  <span className="text-gray-700">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Right Column - Quick Info */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin nhanh</h3>
            <div className="space-y-4">
              {(quickInfo.length > 0 ? quickInfo : defaultQuickInfo).map((info, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{info.icon}</span>
                    <span className="text-gray-600">{info.label}</span>
                  </div>
                  <span className={`font-bold ${info.color}`}>{info.value}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaClock className="text-gray-400" />
                <span>Cập nhật: {new Date().toLocaleString('vi-VN')}</span>
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
                <FaShieldAlt className="text-gray-400" />
                <span>Hệ thống ổn định</span>
              </span>
              <span className="hidden sm:inline">|</span>
              <span>v2.1.0</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewSection;