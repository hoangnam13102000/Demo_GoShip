import { useState } from "react";
import { FaUserCircle, FaBell, FaCog, FaSignOutAlt, FaUser, FaQuestionCircle } from "react-icons/fa";

const DashboardHeader = ({ title = "Dashboard", user, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-40 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left side */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition">
              <span className="text-2xl font-bold text-white">D</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              <p className="text-xs text-gray-500">Trang chủ</p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Notification */}
            <button className="relative p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition duration-200 group">
              <FaBell className="text-lg" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full shadow-sm"></span>
              <div className="absolute -bottom-10 right-0 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                Thông báo
              </div>
            </button>

            {/* Settings */}
            <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition duration-200 group">
              <FaCog className="text-lg" />
              <div className="absolute -bottom-10 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                Cài đặt
              </div>
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-200 mx-2"></div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition duration-200"
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

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-in fade-in duration-200">
                  {/* User Info Card */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-5 py-4 border-b border-blue-200">
                    <p className="font-semibold text-gray-900 text-sm">{user?.email}</p>
                    <p className="text-xs text-gray-600 mt-1 capitalize">
                      {user?.role === "admin" ? "Quản trị viên" : "Người dùng"}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button className="w-full px-5 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-3 group">
                      <FaUser className="text-gray-400 group-hover:text-blue-500 transition" />
                      <span className="group-hover:text-gray-900">Hồ sơ</span>
                    </button>
                    <button className="w-full px-5 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-3 group">
                      <FaCog className="text-gray-400 group-hover:text-blue-500 transition" />
                      <span className="group-hover:text-gray-900">Cài đặt</span>
                    </button>
                    <button className="w-full px-5 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-3 group">
                      <FaQuestionCircle className="text-gray-400 group-hover:text-blue-500 transition" />
                      <span className="group-hover:text-gray-900">Trợ giúp</span>
                    </button>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onLogout();
                    }}
                    className="w-full px-5 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition border-t border-gray-200 flex items-center gap-3 group"
                  >
                    <FaSignOutAlt className="group-hover:text-red-700 transition" />
                    <span className="group-hover:text-red-700">Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Click outside to close menu */}
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