import React from 'react';
import { FaBox, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaArrowUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Trang chủ", to: "/" },
    { label: "Về chúng tôi", to: "/gioi-thieu" },
    { label: "Dịch vụ", to: "/dich-vu" },
    { label: "Blog", to: "/blog" },
    { label: "Liên hệ", to: "/lien-he" },
  ];

  const serviceLinks = [
    { label: "Quản lý đơn hàng", to: "/quan-ly-don-hang" },
    { label: "Theo dõi giao hàng", to: "/theo-doi" },
    { label: "Quản lý kho", to: "/quan-ly-kho" },
    { label: "Báo cáo và phân tích", to: "/bao-cao" },
    { label: "Hỗ trợ khách hàng", to: "/ho-tro" },
  ];

  const legalLinks = [
    { label: "Chính sách bảo mật", to: "/chinh-sach-bao-mat" },
    { label: "Điều khoản sử dụng", to: "/dieu-khoan" },
    { label: "Cài đặt cookies", to: "/cai-dat-cookies" },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8">
            
            {/* About Section */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg hover:scale-110 transition-transform duration-300">
                  <FaBox className="text-white text-lg sm:text-xl" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">GoShip</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-6">
                Hệ thống quản lý dịch vụ chuyên phát hiện đại, giúp tối ưu hóa quy trình giao hàng và nâng cao chất lượng dịch vụ.
              </p>
              <div className="flex gap-3 sm:gap-4">
                <a href="#" className="bg-gray-800 hover:bg-blue-600 text-white p-2 sm:p-2.5 rounded-full transition-all duration-300 hover:scale-110">
                  <FaFacebook className="text-base sm:text-lg" />
                </a>
                <a href="#" className="bg-gray-800 hover:bg-blue-400 text-white p-2 sm:p-2.5 rounded-full transition-all duration-300 hover:scale-110">
                  <FaTwitter className="text-base sm:text-lg" />
                </a>
                <a href="#" className="bg-gray-800 hover:bg-blue-700 text-white p-2 sm:p-2.5 rounded-full transition-all duration-300 hover:scale-110">
                  <FaLinkedin className="text-base sm:text-lg" />
                </a>
                <a href="#" className="bg-gray-800 hover:bg-pink-600 text-white p-2 sm:p-2.5 rounded-full transition-all duration-300 hover:scale-110">
                  <FaInstagram className="text-base sm:text-lg" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-span-1">
              <h4 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">Liên kết nhanh</h4>
              <ul className="space-y-2 sm:space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-xs sm:text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="col-span-1">
              <h4 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">Dịch vụ</h4>
              <ul className="space-y-2 sm:space-y-3">
                {serviceLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-xs sm:text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <h4 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">Liên hệ</h4>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-blue-400 mt-0.5 sm:mt-1 flex-shrink-0 text-sm sm:text-base" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Tầng 5, Toà nhà ABC</p>
                    <p className="text-xs sm:text-sm text-gray-400">123 Đường Nguyễn Huệ, Q.1</p>
                    <p className="text-xs sm:text-sm text-gray-400">TP.HCM, Việt Nam</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-blue-400 flex-shrink-0 text-sm sm:text-base" />
                  <a href="tel:+84123456789" className="text-xs sm:text-sm text-gray-400 hover:text-blue-400 transition-colors">
                    +84 (123) 456 789
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-blue-400 flex-shrink-0 text-sm sm:text-base" />
                  <a href="mailto:support@GoShip.com" className="text-xs sm:text-sm text-gray-400 hover:text-blue-400 transition-colors truncate">
                    support@GoShip.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-8 sm:my-10 lg:my-12"></div>

          {/* Bottom Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 lg:gap-8">
            
            {/* Copyright */}
            <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left order-2 sm:order-1">
              <p>&copy; {currentYear} <span className="text-blue-400 font-semibold">GoShip</span>. Tất cả các quyền được bảo lưu.</p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm order-1 sm:order-2">
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.label}>
                  <Link to={link.to} className="text-gray-400 hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                  {index < legalLinks.length - 1 && (
                    <span className="text-gray-700 hidden sm:inline">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
              <button
                onClick={scrollToTop}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 sm:p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 order-3 sm:order-3"
                title="Lên đầu trang"
              >
                <FaArrowUp className="text-sm sm:text-base" />
              </button>
            )}
          </div>

          {/* Version Info */}
          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-700 text-center text-xs text-gray-500">
            <p>GoShip v1.0.0 | Built with React + Laravel | {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}