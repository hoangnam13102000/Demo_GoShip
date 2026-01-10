import { useState } from "react";
import {
  FaUserCircle,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaQuestionCircle,
} from "react-icons/fa";

const DashboardHeader = ({ title = "Dashboard", user, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-40 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          {/* Left */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition">
              <img
                src="/Logo.png"
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              <p className="text-xs text-gray-500">Trang chủ</p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button className="relative p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg group">
              <FaBell className="text-lg" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button className="relative p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg group">
              <FaCog className="text-lg" />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-2"></div>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-gray-900">
                    {user?.email?.split("@")[0] || "User"}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    {user?.role || "guest"}
                  </span>
                </div>
                <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white shadow-md">
                  <FaUserCircle className="text-lg" />
                </div>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-5 py-4 border-b">
                    <p className="font-semibold text-gray-900 text-sm">
                      {user?.email}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 capitalize">
                      {user?.role === "admin" ? "Quản trị viên" : "Người dùng"}
                    </p>
                  </div>

                  <div className="py-2">
                    <button className="w-full px-5 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3">
                      <FaUser className="text-gray-400" />
                      Hồ sơ
                    </button>
                    <button className="w-full px-5 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3">
                      <FaCog className="text-gray-400" />
                      Cài đặt
                    </button>
                    <button className="w-full px-5 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3">
                      <FaQuestionCircle className="text-gray-400" />
                      Trợ giúp
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onLogout();
                    }}
                    className="w-full px-5 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 border-t flex items-center gap-3"
                  >
                    <FaSignOutAlt />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {showMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowMenu(false)}
        />
      )}
    </>
  );
};

export default DashboardHeader;
