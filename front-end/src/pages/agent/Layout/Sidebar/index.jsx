import { useState, useEffect, useMemo } from "react";
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
  FaBuilding,
  FaUserTie,
} from "react-icons/fa";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";

/* ================= HELPER ================= */

const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem("user");
    const authData = localStorage.getItem("auth");

    if (userData) return JSON.parse(userData);
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.user || parsed;
    }
    return null;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
};

/* ================= SIDEBAR ================= */

const Sidebar = ({ collapsed, setCollapsed }) => {
  const currentUser = useMemo(() => getCurrentUser(), []);

  const { useGetAll } = useCRUDApi("agents");

  const [agentInfo, setAgentInfo] = useState({
    branchName: "Đang tải...",
    agentName: "Nhân viên",
    role: "AGENT",
  });

  /* ===== Fetch agent ===== */
  const { data: currentAgent } = useGetAll({
    enabled: !!currentUser?.id,
    select: (agents = []) =>
      agents.find((agent) => agent.account_id === currentUser?.id),
  });

  /* ===== Resolve info – SAFE ===== */
  useEffect(() => {
    if (!currentUser) return;

    // ADMIN
    if (currentUser.role === "ADMIN") {
      setAgentInfo((prev) =>
        prev.role === "ADMIN"
          ? prev
          : {
              branchName: "Quản trị hệ thống",
              agentName: "Quản trị viên",
              role: "ADMIN",
            }
      );
      return;
    }

    // AGENT
    if (currentAgent) {
      setAgentInfo((prev) => {
        const next = {
          branchName:
            currentAgent.branch?.name ||
            currentUser.branch_name ||
            "Chưa gán chi nhánh",
          agentName:
            currentAgent.full_name ||
            currentUser.full_name ||
            "Nhân viên",
          role: currentUser.role || "AGENT",
        };

        if (
          prev.branchName === next.branchName &&
          prev.agentName === next.agentName &&
          prev.role === next.role
        ) {
          return prev;
        }

        return next;
      });
    }
  }, [currentAgent, currentUser?.id, currentUser?.role]);

  const { branchName, agentName, role } = agentInfo;
  const isAdmin = role === "ADMIN";

  const menuItems = [
    { title: "Dashboard", icon: <FaTachometerAlt />, path: "/agent" },
    { title: "Quản lý vận chuyển", icon: <FaTruck />, path: "/agent/quan-ly-don-hang" },
    { title: "Quản lý khách hàng", icon: <FaUsers />, path: "/agent/quan-ly-khach-hang" },
    { title: "Quản lý nhân viên", icon: <FaBox />, path: "/agent/quan-ly-nhan-vien" },
    
    { title: "Báo cáo", icon: <FaChartBar />, path: "/agent/reports" },
    { title: "Cài đặt", icon: <FaCog />, path: "/agent/settings" },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen
      bg-gradient-to-b from-blue-700 to-blue-800 text-white
      transition-all duration-300
      ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* HEADER */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-blue-600">
        {!collapsed && (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              {isAdmin ? (
                <FaUserTie className="text-purple-700" />
              ) : (
                <FaBuilding className="text-blue-700" />
              )}
            </div>

            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">
                {branchName}
              </div>
              <div className="text-xs text-blue-200 truncate">
                {agentName}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-blue-600 transition"
        >
          <FaBars />
        </button>
      </div>

      {/* MENU */}
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
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
