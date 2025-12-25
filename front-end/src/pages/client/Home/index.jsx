import React, { useState } from 'react';
import { FaTruck, FaFileAlt, FaBox, FaRocket, FaSearch, FaMapMarkerAlt, FaCheckCircle, FaHome } from 'react-icons/fa';

const HomePage = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  const handleTrackingSearch = (e) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      setSearchSubmitted(true);
      console.log('Tracking:', trackingNumber);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 pt-16 sm:pt-20 lg:pt-32 pb-20 sm:pb-24 lg:pb-40 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <FaTruck className="text-white text-8xl sm:text-9xl lg:text-[200px] absolute -top-10 -left-10 sm:-top-20 sm:-left-20" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Courier Services
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 font-semibold">
              Gửi hàng nhanh – Theo dõi đơn dễ dàng
            </p>
          </div>

          {/* Tracking Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleTrackingSearch} className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <FaSearch className="text-blue-600" />
                Tra cứu vận đơn
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Nhập mã vận đơn (VD: VDL123456789)"
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-sm sm:text-base"
                />
                <button
                  type="submit"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap"
                >
                  <FaSearch className="text-sm" />
                  Tìm kiếm
                </button>
              </div>

              {searchSubmitted && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm sm:text-base">
                    ✓ Đang tìm kiếm vận đơn: <span className="font-semibold">{trackingNumber}</span>
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Dịch vụ của chúng tôi
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Chúng tôi cung cấp ba loại dịch vụ giao hàng để đáp ứng mọi nhu cầu của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: FaFileAlt,
                title: 'Tài liệu',
                desc: 'Gửi tài liệu quan trọng một cách an toàn',
                features: ['Trọng lượng: < 1kg', 'Giao nhanh 24h', 'Bảo hiểm đầy đủ'],
                price: '15,000đ',
                color: 'from-cyan-600 to-cyan-700'
              },
              {
                icon: FaBox,
                title: 'Kiện hàng',
                desc: 'Gửi các kiện hàng nhỏ đến trung bình',
                features: ['Trọng lượng: < 20kg', 'Giao trong 2-3 ngày', 'Hỗ trợ 24/7'],
                price: '25,000đ',
                color: 'from-blue-600 to-blue-700',
                featured: true
              },
              {
                icon: FaRocket,
                title: 'Express',
                desc: 'Gửi hàng cấp tốc cho khách hàng VIP',
                features: ['Trọng lượng: < 30kg', 'Giao trong 12h', 'Theo dõi GPS'],
                price: '50,000đ',
                color: 'from-blue-500 to-purple-600'
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className={`relative p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  service.featured
                    ? 'bg-gradient-to-br ' + service.color + ' text-white border-2 border-transparent scale-105 sm:scale-100 lg:scale-105'
                    : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                }`}
              >
                {service.featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-yellow-400 text-blue-900 text-xs sm:text-sm font-bold rounded-full">
                    ⭐ PHỔ BIẾN NHẤT
                  </div>
                )}

                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-4 sm:mb-6 ${
                  service.featured ? 'bg-white/20' : 'bg-gradient-to-br ' + service.color
                }`}>
                  <service.icon className={`text-2xl sm:text-3xl ${
                    service.featured ? 'text-white' : 'text-white'
                  }`} />
                </div>

                <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${
                  service.featured ? 'text-white' : 'text-gray-900'
                }`}>
                  {service.title}
                </h3>
                
                <p className={`text-sm sm:text-base mb-6 ${
                  service.featured ? 'text-blue-50' : 'text-gray-600'
                }`}>
                  {service.desc}
                </p>

                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className={`flex items-center gap-2 text-sm sm:text-base ${
                      service.featured ? 'text-blue-50' : 'text-gray-600'
                    }`}>
                      <FaCheckCircle className={service.featured ? 'text-blue-200' : 'text-blue-600'} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 ${
                  service.featured ? 'text-white' : 'text-blue-600'
                }`}>
                  {service.price}
                </div>

                <button className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 font-bold rounded-lg transition-all duration-300 text-sm sm:text-base ${
                  service.featured
                    ? 'bg-white text-blue-600 hover:shadow-lg hover:scale-105'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                  Chọn dịch vụ
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Process */}
      <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Quy trình giao hàng
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Bốn bước đơn giản để gửi và nhận hàng an toàn
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-transparent"></div>

            {[
              { step: 1, icon: FaHome, title: 'Tạo đơn hàng', desc: 'Nhập thông tin gửi và nhận' },
              { step: 2, icon: FaCheckCircle, title: 'Xác nhận', desc: 'Chúng tôi xác nhận thông tin' },
              { step: 3, icon: FaTruck, title: 'Vận chuyển', desc: 'Hàng được giao an toàn' },
              { step: 4, icon: FaMapMarkerAlt, title: 'Giao hàng', desc: 'Khách hàng nhận hàng' },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mb-4 sm:mb-6 text-white font-bold text-xl sm:text-2xl shadow-lg hover:shadow-xl transition-shadow">
                    {item.step}
                  </div>
                  <item.icon className="text-blue-600 text-2xl sm:text-3xl mb-3 sm:mb-4 hidden sm:block" />
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{item.desc}</p>
                </div>

                {idx < 3 && (
                  <div className="hidden lg:flex absolute -right-4 top-8 sm:top-10 text-blue-600 text-2xl sm:text-3xl">
                    →
                  </div>
                )}

                {idx < 3 && (
                  <div className="lg:hidden flex justify-center mt-4 sm:mt-6 text-blue-600 text-xl sm:text-2xl">
                    ↓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { number: '50K+', label: 'Đơn hàng thành công' },
              { number: '99%', label: 'Tỉ lệ giao đúng hẹn' },
              { number: '24/7', label: 'Hỗ trợ khách hàng' },
              { number: '63', label: 'Tỉnh thành phủ sóng' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600 mb-2">{stat.number}</p>
                <p className="text-gray-600 text-sm sm:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Sẵn sàng gửi hàng ngay hôm nay?
          </h2>
          <p className="text-blue-100 text-base sm:text-lg lg:text-xl mb-8 sm:mb-10">
            Tạo tài khoản miễn phí và nhận ưu đãi 20% cho 10 đơn hàng đầu tiên
          </p>
          <button className="px-8 sm:px-10 py-4 bg-white text-blue-600 font-bold rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-base sm:text-lg">
            Đăng ký ngay
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;