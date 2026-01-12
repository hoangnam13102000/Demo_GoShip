export const ROUTERS = {
  USER: {
    HOME: "/",
    LOGIN: "/dang-nhap",
    REGISTER: "/dang-ky",
    FORGOTPASSWORD: "/quen-mat-khau",

    ABOUT: "/gioi-thieu",
    CONTACT: "/lien-he",
    SERVICES: "/dich-vu",
    BLOG: "/blog",
    CREATESHIPMENTPAGE: "/tao-don-hang",
    TRACKINGPAGE: "/tra-cuu-don-hang",
    MYORDERS: "/don-hang-cua-toi",

    NOTFOUND: "/404",
  },

  ADMIN: {
    DASHBOARD: "/admin",
    ACCOUNTS: "admin/quan-ly-tai-khoan",
    AGENTS: "admin/quan-ly-agent",
    CUSTOMERS: "/admin/quan-ly-khach-hang",
    SERVICES: "/admin/quan-ly-dich-vu",
    SHIPMENTS: "/admin/quan-ly-don-hang",
    BRANCHES: "/admin/quan-ly-chi-nhanh",
    BILL: "/admin/quan-ly-hoa-don",
    REPORT: "/admin/bao-cao",
  },
  AGENTS: {
    DASHBOARD: "/agent",
    SHIPMENTS: "/agent/quan-ly-don-hang",
    BILL: "/agent/quan-ly-hoa-don"
  },
};

export const ADMIN_PATH = "/admin";
export const AGENT_PATH = "/agent";
