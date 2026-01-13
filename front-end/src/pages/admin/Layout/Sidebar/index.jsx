import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBox,
  FaUsers,
  FaTruck,
  FaMoneyBillWave,
  FaChartBar,
  FaCog,
  FaBars,
} from "react-icons/fa";

const menuItems = [
  { title: "Dashboard", icon: <FaTachometerAlt />, path: "/admin" },
  { title: "Quản lý tài khoản", icon: <FaBox />, path: "/admin/quan-ly-tai-khoan" },
  { title: "Quản lý chi nhánh", icon: <FaBox />, path: "/admin/quan-ly-chi-nhanh" },
  { title: "Quản lý nhân viên", icon: <FaUsers />, path: "/admin/quan-ly-agent" },
  { title: "Quản lý khách hàng", icon: <FaUsers />, path: "/admin/quan-ly-khach-hang" },
  { title: "Quản lý dịch vụ", icon: <FaUsers />, path: "/admin/quan-ly-dich-vu" },
  { title: "Quản lý vận chuyển", icon: <FaTruck />, path: "/admin/quan-ly-don-hang" },
  { title: "Quản lý hóa đơn", icon: <FaMoneyBillWave />, path: "/admin/quan-ly-hoa-don" },
  { title: "Báo cáo", icon: <FaChartBar />, path: "/admin/bao-cao" },
  { title: "Cài đặt", icon: <FaCog />, path: "/admin/settings" },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen
      bg-gradient-to-b from-blue-700 to-blue-800 text-white
      transition-all duration-300
      ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Logo + Toggle */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-blue-600">
        {!collapsed && (
          <span className="text-xl font-bold tracking-wide">
            CourierHub
          </span>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-blue-600 transition"
          title="Thu gọn / Mở rộng"
        >
          <FaBars />
        </button>
      </div>

      {/* Menu */}
      <nav 
        className={`mt-6 px-3 space-y-2 overflow-y-auto ${
          collapsed ? "h-[calc(100vh-80px)]" : "h-[calc(100vh-80px)]"
        }`}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#3b82f6 #1e3a8a",
        }}
      >
        <style>{`
          nav::-webkit-scrollbar {
            width: 6px;
          }
          
          nav::-webkit-scrollbar-track {
            background: #1e3a8a;
            border-radius: 3px;
          }
          
          nav::-webkit-scrollbar-thumb {
            background: #3b82f6;
            border-radius: 3px;
          }
          
          nav::-webkit-scrollbar-thumb:hover {
            background: #60a5fa;
          }
        `}</style>

        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition
              ${
                isActive
                  ? "bg-white text-blue-700 shadow"
                  : "text-blue-100 hover:bg-blue-600 hover:text-white"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>

            {!collapsed && (
              <span className="font-medium whitespace-nowrap">
                {item.title}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;