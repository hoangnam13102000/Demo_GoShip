import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaSignOutAlt,
  FaShoppingCart,
  FaAngleDown,
  FaStar,
  FaBox,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import DynamicDialog from "../../../../components/UI/DynamicDialog";
import { ROUTERS } from "../../../../routers/Router";

export default function ClientHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const navigate = useNavigate();

  const navItems = [
    { label: "Trang chủ", to: ROUTERS.USER.HOME },
    { label: "Dịch vụ", to: ROUTERS.USER.SERVICES },
    { label: "Giá cả" },
    { label: "Theo dõi", to: ROUTERS.USER.ABOUT },
    { label: "Liên hệ", to: ROUTERS.USER.CONTACT },
  ];

  const defaultUser = {
    name: "Người dùng",
    email: "user@example.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  };

  const currentUser = user || defaultUser;

  const checkLoginStatus = () => {
    try {
      const token = localStorage.getItem("access_token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkLoginStatus();

    const sync = () => checkLoginStatus();

    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    window.addEventListener("auth-change", sync);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") sync();
    });

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
      window.removeEventListener("auth-change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          await fetch("http://localhost:8000/api/logout", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch {}
      }

      localStorage.removeItem("access_token");
      localStorage.removeItem("user");

      setIsLoggedIn(false);
      setUser(null);
      setIsProfileOpen(false);
      setIsMenuOpen(false);
      setShowLogoutDialog(true);
    } catch {
      alert("Không thể đăng xuất. Vui lòng thử lại.");
    }
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between text-sm">
          <div className="flex gap-4">
            <a href="tel:+84123456789" className="flex items-center gap-2">
              <FaPhone /> +84 (123) 456 789
            </a>
            <a
              href="mailto:support@courierhub.com"
              className="hidden md:flex items-center gap-2"
            >
              <FaEnvelope /> support@courierhub.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            <FaStar className="text-yellow-300" /> 4.9/5
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to={ROUTERS.USER.HOME} className="flex items-center gap-3">
              <img
                src="/Logo.png"
                alt="GoShip"
                className="w-14 h-14 rounded-xl"
              />
              <div>
                <div className="text-2xl font-bold text-blue-600">GoShip</div>
                <div className="text-xs text-gray-500">
                  Dịch vụ giao hàng toàn quốc
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <FaShoppingCart className="text-xl text-gray-700" />

              {isLoggedIn ? (
                <div className="relative hidden lg:block">
                  <button
                    onClick={() => setIsProfileOpen((p) => !p)}
                    className="flex items-center gap-2"
                  >
                    <img
                      src={currentUser.avatar}
                      className="w-10 h-10 rounded-full"
                      alt=""
                    />
                    {currentUser.name}
                    <FaAngleDown
                      className={`transition ${
                        isProfileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-xl">
                      <Link
                        to={ROUTERS.USER.MYORDERS}
                        className="flex gap-2 px-4 py-3 hover:bg-blue-50"
                      >
                        <FaBox /> Đơn hàng của tôi
                      </Link>
                      <Link
                        to="/profile"
                        className="flex gap-2 px-4 py-3 hover:bg-blue-50"
                      >
                        <FaUser /> Hồ sơ cá nhân
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex gap-2 px-4 py-3 hover:bg-red-50 text-red-600"
                      >
                        <FaSignOutAlt /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden lg:flex gap-2">
                  <Link
                    to={ROUTERS.USER.LOGIN}
                    className="px-4 py-2 text-blue-600"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to={ROUTERS.USER.REGISTER}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}

              <button
                onClick={() => setIsMenuOpen((p) => !p)}
                className="lg:hidden"
              >
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 hover:bg-blue-50 rounded-lg"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <DynamicDialog
        open={showLogoutDialog}
        mode="success"
        title="Đăng xuất thành công"
        message="Bạn đã đăng xuất khỏi hệ thống."
        closeText="Về trang chủ"
        onClose={() => {
          setShowLogoutDialog(false);
          navigate(ROUTERS.USER.HOME, { replace: true });
        }}
      />
    </>
  );
}
