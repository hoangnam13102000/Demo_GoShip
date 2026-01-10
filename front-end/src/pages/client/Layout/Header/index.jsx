import React, { useState } from 'react';
import { FaBars, FaTimes, FaPhone, FaEnvelope, FaUser, FaSignOutAlt, FaShoppingCart, FaAngleDown, FaTruck, FaStar, FaBox } from 'react-icons/fa';

export default function ClientHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const user = {
    name: 'Nguyễn Văn A',
    email: 'customer@courier.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  };

  const navItems = [
    { label: 'Trang chủ', href: '#home' },
    { label: 'Dịch vụ', href: '#services' },
    { label: 'Giá cả', href: '#pricing' },
    { label: 'Theo dõi', href: '#tracking' },
    { label: 'Liên hệ', href: '#contact' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between py-2 sm:py-2.5 text-xs sm:text-sm gap-2">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
              <a href="tel:+84123456789" className="flex items-center gap-1.5 sm:gap-2 hover:text-blue-200 transition-colors duration-200">
                <FaPhone className="text-xs flex-shrink-0" />
                <span className="font-medium truncate">+84 (123) 456 789</span>
              </a>
              <a href="mailto:support@courierhub.com" className="hidden sm:flex items-center gap-1.5 sm:gap-2 hover:text-blue-200 transition-colors duration-200">
                <FaEnvelope className="text-xs flex-shrink-0" />
                <span className="font-medium hidden md:inline">support@courierhub.com</span>
              </a>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
              <FaStar className="text-yellow-300 text-xs sm:text-sm flex-shrink-0" />
              <span className="font-semibold text-xs sm:text-sm">4.9/5</span>
              <span className="text-blue-100 hidden lg:inline text-xs">(2,500+ đánh giá)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-2 sm:gap-3 group cursor-pointer flex-shrink-0">
              <img 
                src="/Logo.png" 
                alt="GoShip Logo" 
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 object-cover"
              />
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  GoShip
                </span>
                <span className="text-[10px] sm:text-xs text-gray-500 font-medium -mt-0.5 sm:-mt-1 hidden xs:block">
                  Dịch vụ giao hàng toàn quốc
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  className="relative px-3 xl:px-4 py-2 text-sm xl:text-base text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-3/4 transition-all duration-300"></span>
                </a>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              {/* Cart */}
              <button className="relative p-2 sm:p-3 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-all duration-200 group">
                <FaShoppingCart className="text-gray-700 text-base sm:text-xl group-hover:text-blue-600 transition-colors duration-200" />
                <span className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] sm:text-xs font-bold w-4 h-4 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-lg">
                  0
                </span>
              </button>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 md:gap-3 p-1.5 sm:p-2 pr-2 sm:pr-3 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-all duration-200 group"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-blue-200 group-hover:border-blue-400 transition-all duration-200"
                  />
                  <span className="hidden md:block text-sm lg:text-base text-gray-700 font-medium group-hover:text-blue-600 transition-colors duration-200 max-w-[120px] xl:max-w-none truncate">
                    {user.name}
                  </span>
                  <FaAngleDown className={`hidden md:block text-gray-500 text-sm transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 sm:mt-3 w-64 sm:w-72 bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-5 text-white">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-white shadow-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-base sm:text-lg truncate">{user.name}</p>
                          <p className="text-blue-100 text-xs sm:text-sm truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <a
                        href="#orders"
                        className="flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 hover:bg-blue-50 transition-colors duration-200 group"
                      >
                        <FaBox className="text-blue-600 text-base sm:text-lg group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-700 font-medium group-hover:text-blue-600">
                          Đơn hàng của tôi
                        </span>
                      </a>
                      <a
                        href="#profile"
                        className="flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 hover:bg-blue-50 transition-colors duration-200 group"
                      >
                        <FaUser className="text-blue-600 text-base sm:text-lg group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-700 font-medium group-hover:text-blue-600">
                          Hồ sơ cá nhân
                        </span>
                      </a>
                      <hr className="my-2 border-gray-200" />
                      <button className="w-full flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 hover:bg-red-50 transition-colors duration-200 group">
                        <FaSignOutAlt className="text-red-600 text-base sm:text-lg group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-700 font-medium group-hover:text-red-600">
                          Đăng xuất
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 sm:p-3 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-all duration-200"
              >
                {isMenuOpen ? (
                  <FaTimes className="text-gray-700 text-lg sm:text-xl" />
                ) : (
                  <FaBars className="text-gray-700 text-lg sm:text-xl" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white shadow-lg">
            <nav className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-1">
              {navItems.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-lg sm:rounded-xl transition-all duration-200"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="mailto:support@courierhub.com"
                className="sm:hidden flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-lg sm:rounded-xl transition-all duration-200"
              >
                <FaEnvelope className="flex-shrink-0" />
                <span className="truncate">support@courierhub.com</span>
              </a>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}