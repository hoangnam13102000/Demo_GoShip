import React, { useState } from 'react';
import {
  FaBars,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaSignOutAlt,
  FaShoppingCart,
  FaAngleDown,
  FaTruck
} from 'react-icons/fa';

export default function ClientHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const user = {
    name: 'Nguyễn Văn A',
    email: 'customer@courier.com',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
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
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center gap-6 text-gray-700">
              <a href="tel:+84123456789" className="flex items-center gap-2 hover:text-blue-600">
                <FaPhone className="text-blue-600 text-xs" />
                +84 (123) 456 789
              </a>
              <span className="w-px h-4 bg-gray-300"></span>
              <a href="mailto:support@courierhub.com" className="flex items-center gap-2 hover:text-blue-600">
                <FaEnvelope className="text-blue-600 text-xs" />
                support@courierhub.com
              </a>
            </div>
            <span className="text-gray-600">⭐ 4.9/5 (2,500+ đánh giá)</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <img
                src="/public/Logo.png"
                alt="GoShip"
                className="
                  h-8
                  sm:h-9
                  md:h-10
                  lg:h-12
                  w-auto
                  object-contain
                "
              />
              <div className="hidden sm:block leading-tight">
                <h1 className="text-lg sm:text-xl font-bold text-blue-600">
                  GoShip
                </h1>
                <p className="text-xs text-gray-500 hidden md:block">
                  Dịch vụ giao hàng toàn quốc
                </p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 font-medium relative"
                >
                  {item.label}
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all hover:w-full"></span>
                </a>
              ))}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-4">

              {/* Cart */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg hidden sm:block">
                <FaShoppingCart className="text-lg text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  0
                </span>
              </button>

              {/* Profile */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border"
                  />
                  <span className="hidden lg:block text-sm font-semibold">
                    {user.name}
                  </span>
                  <FaAngleDown className="hidden lg:block text-xs text-gray-500" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow border">
                    <div className="px-4 py-3 border-b">
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <a className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
                      <FaShoppingCart /> Đơn hàng của tôi
                    </a>
                    <a className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
                      <FaUser /> Hồ sơ cá nhân
                    </a>
                    <button className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 border-t w-full">
                      <FaSignOutAlt /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="lg:hidden border-t py-4 space-y-2">
              {navItems.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}
        </div>
      </header>
    </>
  );
}
