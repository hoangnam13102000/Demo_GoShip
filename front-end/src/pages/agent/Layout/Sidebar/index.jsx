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

  { title: "Quản lý vận chuyển", icon: <FaTruck />, path: "/admin/quan-ly-don-hang" },
  { title: "Doanh thu", icon: <FaMoneyBillWave />, path: "/admin/revenue" },
  { title: "Quản lý hóa đơn", icon: <FaMoneyBillWave />, path: "/admin/quan-ly-hoa-don" },
  { title: "Báo cáo", icon: <FaChartBar />, path: "/admin/reports" },
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
      <nav className="mt-6 px-3 space-y-2">
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
