import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaBuilding,
  FaUserTie,
} from "react-icons/fa";
import { useCRUDApi } from "../../../../api/hooks/useCRUDApi";
import { menuItems } from "../../../../config/menuItem";

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
  } catch {
    return null;
  }
};

/* ================= SIDEBAR ================= */
const Sidebar = ({ collapsed, setCollapsed }) => {
  const currentUser = useMemo(() => getCurrentUser(), []);
  const role = currentUser?.role?.toUpperCase() || "AGENT";

  /* ===== Agent info ===== */
  const { useGetAll } = useCRUDApi("agents");

  const [agentInfo, setAgentInfo] = useState({
    branchName: "Đang tải...",
    agentName: "Nhân viên",
    role,
  });

  const { data: currentAgent } = useGetAll({
    enabled: !!currentUser?.id && role === "AGENT",
    select: (agents = []) =>
      agents.find((a) => a.account_id === currentUser?.id),
  });

  useEffect(() => {
    if (!currentUser) return;

    if (role === "ADMIN") {
      setAgentInfo({
        branchName: "Quản trị hệ thống",
        agentName: "Quản trị viên",
        role: "ADMIN",
      });
      return;
    }

    if (currentAgent) {
      setAgentInfo({
        branchName:
          currentAgent.branch?.name ||
          currentUser.branch_name ||
          "Chưa gán chi nhánh",
        agentName:
          currentAgent.full_name ||
          currentUser.full_name ||
          "Nhân viên",
        role,
      });
    }
  }, [currentAgent, currentUser, role]);

  const isAdmin = role === "ADMIN";

  /* ================= RESOLVE MENU ================= */
  const visibleMenus = useMemo(() => {
    return menuItems
      .filter(
        (item) =>
          !item.roles ||
          item.roles.map((r) => r.toUpperCase()).includes(role)
      )
      .map((item) => ({
        ...item,
        path: item.pathByRole?.[role],
      }))
      .filter((item) => Boolean(item.path));
  }, [role]);

  /* ================= RENDER ================= */
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
                {agentInfo.branchName}
              </div>
              <div className="text-xs text-blue-200 truncate">
                {agentInfo.agentName}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-2 rounded-lg hover:bg-blue-600 transition"
        >
          <FaBars />
        </button>
      </div>

      {/* MENU */}
      <nav className="mt-6 px-3 space-y-2">
        {visibleMenus.map((item, index) => {
          const Icon = item.icon;

          return (
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
              <Icon className="text-lg shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
