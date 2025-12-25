import React, { useState } from 'react';
import { FaBox, FaBars, FaTimes, FaPhone, FaEnvelope, FaUser, FaSignOutAlt, FaShoppingCart, FaAngleDown, FaTruck } from 'react-icons/fa';

export default function ClientHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const user = {
    name: 'Nguyễn Văn A',
    email: 'customer@courier.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
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
      <div className="hidden sm:block bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 py-2 sm:py-3">
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <a href="tel:+84123456789" className="text-gray-700 hover:text-blue-600 flex items-center gap-2 transition-colors">
                <FaPhone className="text-blue-600 text-xs" />
                <span className="hidden md:inline">+84 (123) 456 789</span>
                <span className="md:hidden">Hotline</span>
              </a>
              <span className="hidden sm:block w-px h-4 bg-gray-300"></span>
              <a href="mailto:support@courierhub.com" className="text-gray-700 hover:text-blue-600 flex items-center gap-2 transition-colors">
                <FaEnvelope className="text-blue-600 text-xs" />
                <span className="hidden md:inline">support@courierhub.com</span>
                <span className="md:hidden">Email</span>
              </a>
            </div>
            <div className="flex items-center gap-4 text-xs sm:text-sm">
              <span className="text-gray-600">⭐ 4.9/5 (2,500+ đánh giá)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
              
              {/* Logo & Brand */}
              <a href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 group hover:opacity-80 transition-opacity">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-1.5 sm:p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <FaBox className="text-white text-base sm:text-lg lg:text-xl" />
                </div>
                <div className="hidden xs:block">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    CourierHub
                  </h1>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500 hidden md:block font-medium">
                    Dịch vụ giao hàng toàn quốc
                  </p>
                </div>
              </a>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-gray-700 hover:text-blue-600 font-medium text-sm xl:text-base transition-colors relative group"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-blue-600 transition-all duration-300"></span>
                  </a>
                ))}
              </nav>

              {/* Right Side */}
              <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                
                {/* Quick Features - Desktop Only */}
                <div className="hidden 2xl:flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs xl:text-sm text-gray-600 px-3 py-1.5 bg-blue-50 rounded-full">
                    <FaShoppingCart className="text-blue-600" />
                    <span className="font-medium">Giao hàng nhanh</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs xl:text-sm text-gray-600 px-3 py-1.5 bg-blue-50 rounded-full">
                    <FaTruck className="text-blue-600" />
                    <span className="font-medium">Theo dõi real-time</span>
                  </div>
                </div>

                {/* Auth Section */}
              <>
                {/* Cart Icon */}
                <button className="relative p-2 sm:p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors group hidden sm:block">
                  <FaShoppingCart className="text-base sm:text-lg group-hover:text-blue-600" />
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    0
                  </span>
                </button>

                {/* Profile Dropdown - Logged In */}
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 sm:gap-2.5 p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-full border-2 border-gray-200 group-hover:border-blue-400 transition-colors"
                    />
                    <div className="hidden lg:flex flex-col items-start">
                      <p className="text-xs xl:text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="text-[10px] text-gray-500">Khách hàng</p>
                    </div>
                    <FaAngleDown className="hidden lg:block text-xs text-gray-500 group-hover:text-blue-600 transition-colors" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500 mt-1 truncate">{user.email}</p>
                        <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                          Khách hàng
                        </span>
                      </div>
                      <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                        <FaShoppingCart className="text-sm" />
                        <span className="text-sm">Đơn hàng của tôi</span>
                      </a>
                      <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                        <FaUser className="text-sm" />
                        <span className="text-sm">Hồ sơ cá nhân</span>
                      </a>
                      <button className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 mt-2">
                        <FaSignOutAlt className="text-sm" />
                        <span className="text-sm font-medium">Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
              

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2 sm:p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {isMenuOpen ? (
                    <FaTimes className="text-lg sm:text-xl text-gray-600" />
                  ) : (
                    <FaBars className="text-lg sm:text-xl text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <nav className="lg:hidden border-t border-gray-200 py-4 space-y-2 animate-in fade-in slide-in-from-top-2">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium text-sm"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            )}
          </div>
        </div>
      </header>
    </>
  );
}