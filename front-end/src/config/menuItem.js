import {
  FaTachometerAlt,
  FaBox,
  FaUsers,
  FaTruck,
  FaMoneyBillWave,
  FaChartBar,
  FaCog,
} from "react-icons/fa";
import { ROUTERS } from "../routers/Router";

export const menuItems = [
  {
    title: "Dashboard",
    icon: FaTachometerAlt,
    roles: ["ADMIN", "AGENT"],
    pathByRole: {
      ADMIN: ROUTERS.ADMIN.DASHBOARD,
      AGENT: ROUTERS.AGENTS.DASHBOARD,
    },
  },

  // ADMIN ONLY
  {
    title: "Quản lý tài khoản",
    icon: FaUsers,
    roles: ["ADMIN"],
    pathByRole: {
      ADMIN: ROUTERS.ADMIN.ACCOUNTS,
    },
  },

  {
    title: "Quản lý chi nhánh",
    icon: FaBox,
    roles: ["ADMIN", "AGENT"],
    pathByRole: {
      ADMIN: ROUTERS.ADMIN.BRANCHES,
      AGENT: ROUTERS.AGENTS.BRANCHES,
    },
  },

  {
    title: "Quản lý nhân viên",
    icon: FaUsers,
    roles: ["ADMIN", "AGENT"],
    pathByRole: {
      ADMIN: ROUTERS.ADMIN.AGENTS,
      AGENT: ROUTERS.AGENTS.AGENTS,
    },
  },

  // ADMIN ONLY
  {
    title: "Quản lý khách hàng",
    icon: FaUsers,
    roles: ["ADMIN"],
    pathByRole: {
      ADMIN: ROUTERS.ADMIN.CUSTOMERS,
    },
  },

  // ADMIN ONLY
  {
    title: "Quản lý dịch vụ",
    icon: FaBox,
    roles: ["ADMIN"],
    pathByRole: {
      ADMIN: ROUTERS.ADMIN.SERVICES,
    },
  },

  {
    title: "Quản lý đơn hàng",
    icon: FaTruck,
    roles: ["ADMIN", "AGENT"],
    pathByRole: {
      ADMIN: ROUTERS.ADMIN.DELIVERIES,
      AGENT: ROUTERS.AGENTS.SHIPMENTS,
    },
  },

  // ADMIN ONLY
  {
    title: "Quản lý hóa đơn",
    icon: FaMoneyBillWave,
    roles: ["ADMIN"],
    pathByRole: {
      ADMIN: ROUTERS.ADMIN.BILL,
    },
  },

  {
    title: "Báo cáo",
    icon: FaChartBar,
    roles: ["ADMIN", "AGENT"],
    pathByRole: {
      ADMIN: ROUTERS.ADMIN.REPORT,
      AGENT: ROUTERS.AGENTS.REPORT,
    },
  },

  {
    title: "Cài đặt",
    icon: FaCog,
    roles: ["ADMIN"],
    pathByRole: {
      ADMIN: "/admin/settings",
    },
  },
];
