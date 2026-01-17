import React from "react";
import {
  FaTruck,
  FaUsers,
  FaCheckCircle,
  FaGlobeAsia,
  FaShieldAlt,
  FaAward,
  FaArrowRight,
  FaChartLine,
  FaLightbulb,
  FaRocket,
  FaHeart,
  FaTwitter,
  FaFacebookF,
  FaClock,
  FaLinkedinIn,
  FaCogs,
  FaUserTie,
  FaBalanceScale,
  FaStar,
  FaQuoteLeft,
  FaLeaf,
} from "react-icons/fa";

const AboutPage = () => {
  const stats = [
    { icon: FaTruck, value: "500K+", label: "Đơn hàng mỗi tháng", desc: "Giao thành công trên toàn quốc" },
    { icon: FaUsers, value: "200K+", label: "Đối tác & Khách hàng", desc: "Doanh nghiệp và cá nhân tin dùng" },
    { icon: FaCheckCircle, value: "99.8%", label: "Tỷ lệ chính xác", desc: "Đúng giờ, đúng địa điểm" },
    { icon: FaGlobeAsia, value: "100%", label: "Tỉnh thành phủ sóng", desc: "63 tỉnh thành trên cả nước" },
    { icon: FaClock, value: "24/7", label: "Hỗ trợ khách hàng", desc: "Đội ngũ hỗ trợ không ngừng nghỉ" },
    { icon: FaChartLine, value: "300%", label: "Tăng trưởng hàng năm", desc: "Tốc độ phát triển vượt trội" },
  ];

  const coreValues = [
    {
      icon: FaShieldAlt,
      title: "Minh Bạch Tuyệt Đối",
      desc: "Mọi thông tin đều được công khai rõ ràng, từ giá cả đến tiến trình giao hàng.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: FaRocket,
      title: "Tốc Độ Vượt Trội",
      desc: "Tối ưu hóa tuyến đường và công nghệ AI để rút ngắn thời gian giao hàng tối đa.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: FaHeart,
      title: "Trải Nghiệm Khách Hàng",
      desc: "Đặt khách hàng làm trung tâm, liên tục cải tiến dịch vụ dựa trên phản hồi.",
      color: "from-red-500 to-orange-500",
    },
    {
      icon: FaLightbulb,
      title: "Đổi Mới Sáng Tạo",
      desc: "Không ngừng nghiên cứu và áp dụng công nghệ mới để nâng cao chất lượng.",
      color: "from-yellow-500 to-amber-500",
    },
  ];

  const milestones = [
    { year: "2014", title: "Thành lập GoShip", desc: "Khởi đầu với đội ngũ 10 người" },
    { year: "2016", title: "Mở rộng 10 tỉnh thành", desc: "Phủ sóng miền Bắc và miền Trung" },
    { year: "2018", title: "Ra mắt App Mobile", desc: "Ứng dụng theo dõi đơn hàng thời gian thực" },
    { year: "2020", title: "Triển khai AI Logistics", desc: "Ứng dụng AI trong tối ưu tuyến đường" },
    { year: "2022", title: "Đạt 100K đối tác", desc: "Mở rộng hợp tác với doanh nghiệp lớn" },
    { year: "2024", title: "Leader ngành Logistics", desc: "Dẫn đầu về công nghệ và dịch vụ" },
  ];

  const teamMembers = [
    { name: "Nguyễn Văn An", position: "CEO & Founder", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Trần Thị Bình", position: "CTO", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Lê Minh Cường", position: "Head of Operations", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Phạm Thu Hà", position: "Customer Success Director", img: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
  ];

  const certifications = [
    { icon: FaAward, title: "ISO 9001:2015", desc: "Chứng nhận chất lượng quốc tế" },
    { icon: FaShieldAlt, title: "GDPR Compliant", desc: "Bảo mật dữ liệu châu Âu" },
    { icon: FaLeaf, title: "Green Logistics", desc: "Giảm 30% khí thải carbon" },
    { icon: FaBalanceScale, title: "Legal Compliance", desc: "Tuân thủ pháp luật Việt Nam" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Thêm CSS animation inline */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .floating-card {
            animation: float 3s ease-in-out infinite;
          }
          
          /* Responsive adjustments */
          @media (max-width: 640px) {
            .timeline-line {
              left: 1.5rem !important;
            }
            .timeline-dot {
              left: 1.5rem !important;
            }
            .timeline-content {
              margin-left: 3rem !important;
              width: calc(100% - 3rem) !important;
            }
            .floating-card-responsive {
              position: relative !important;
              right: auto !important;
              bottom: auto !important;
              margin-top: 2rem;
              max-width: 100% !important;
            }
          }
          
          @media (max-width: 768px) {
            .stats-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            .team-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          
          @media (max-width: 480px) {
            .stats-grid {
              grid-template-columns: 1fr !important;
            }
            .team-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      {/* Hero Section - Responsive */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-cyan-800/80"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-6 sm:mb-8 text-sm sm:text-base">
              <FaStar className="text-yellow-300 text-lg sm:text-xl" />
              <span className="font-medium">10 Năm Dẫn Đầu Ngành Logistics</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              Định Hình Tương Lai 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-cyan-300 mt-2">
                Logistics Việt Nam
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
              Với hơn một thập kỷ kinh nghiệm, GoShip tự hào là đối tác tin cậy của hơn 200,000 doanh nghiệp 
              trong hành trình chuyển đổi số và tối ưu hóa chuỗi cung ứng.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-900 font-bold rounded-xl text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                Khám phá câu chuyện của chúng tôi
              </button>
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold rounded-xl text-base sm:text-lg transition-all duration-300">
                Xem video giới thiệu
              </button>
            </div>
          </div>
        </div>
        
        {/* Animated waves */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 sm:h-16 md:h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="#ffffff" opacity=".25"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="#ffffff" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#ffffff"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section - Responsive */}
      <section className="py-12 sm:py-16 bg-white -mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid stats-grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group p-3 sm:p-0">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="text-xl sm:text-2xl md:text-3xl text-blue-600" />
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="font-semibold text-gray-800 text-sm sm:text-base mb-1">{stat.label}</div>
                <div className="text-xs sm:text-sm text-gray-500">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision - Responsive */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-2 sm:-inset-3 md:-inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl sm:rounded-3xl opacity-20 blur-lg sm:blur-xl"></div>
              <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="GoShip Team"
                  className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6">
                  <div className="text-white">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      <FaUserTie className="text-yellow-300 text-sm sm:text-base" />
                      <span className="font-semibold text-sm sm:text-base">Đội ngũ 500+ chuyên gia</span>
                    </div>
                    <p className="text-xs sm:text-sm opacity-90">10 năm kinh nghiệm trong ngành Logistics & Technology</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Card - Responsive */}
              <div className="floating-card floating-card-responsive absolute lg:-right-4 lg:-bottom-4 xl:-right-8 xl:-bottom-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl max-w-full lg:max-w-xs mt-4 lg:mt-0">
                <FaQuoteLeft className="text-2xl sm:text-3xl mb-2 sm:mb-4 opacity-50" />
                <p className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">"Không chỉ là giao hàng, chúng tôi đang kiến tạo tương lai logistics Việt Nam"</p>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full"></div>
                  <div>
                    <div className="font-bold text-sm sm:text-base">Nguyễn Văn An</div>
                    <div className="text-xs sm:text-sm opacity-80">CEO & Founder</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 text-sm sm:text-base">
                  <FaLightbulb className="text-yellow-500 text-sm sm:text-base" />
                  <span className="font-semibold">Sứ Mệnh & Tầm Nhìn</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
                  Kiến Tạo Hệ Sinh Thái 
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mt-1">
                    Logistics Thông Minh
                  </span>
                </h2>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <FaRocket className="text-blue-600 text-lg sm:text-xl" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">Sứ Mệnh</h3>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      Tối ưu hóa toàn bộ chuỗi cung ứng Việt Nam thông qua công nghệ tiên tiến, 
                      mang lại trải nghiệm vượt trội cho cả người gửi và người nhận.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <FaGlobeAsia className="text-purple-600 text-lg sm:text-xl" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">Tầm Nhìn 2030</h3>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      Trở thành nền tảng logistics thông minh hàng đầu Đông Nam Á, 
                      kết nối 10 triệu doanh nghiệp vào hệ sinh thái số của GoShip.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <FaCogs className="text-2xl sm:text-3xl text-blue-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 sm:mb-2 text-base sm:text-lg">Công Nghệ Đột Phá</h4>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      Sử dụng AI, Big Data và IoT để tối ưu tuyến đường, dự báo nhu cầu 
                      và nâng cao hiệu quả hoạt động lên 300%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values - Responsive */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              Giá Trị Cốt Lõi
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mt-1">
                Tạo Nên Khác Biệt
              </span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg">
              4 nguyên tắc không đổi trong suốt 10 năm hoạt động và phát triển
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {coreValues.map((value, index) => (
              <div key={index} className="group">
                <div className={`relative h-full bg-gradient-to-br ${value.color} p-0.5 sm:p-1 rounded-xl sm:rounded-2xl`}>
                  <div className="relative bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 h-full transform group-hover:-translate-y-1 sm:group-hover:-translate-y-2 transition-all duration-300">
                    <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${value.color} rounded-xl sm:rounded-2xl mb-4 sm:mb-6`}>
                      <value.icon className="text-xl sm:text-2xl text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{value.title}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{value.desc}</p>
                    
                    <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className={`w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br ${value.color} rounded-full flex items-center justify-center`}>
                        <FaArrowRight className="text-white text-xs sm:text-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline - Responsive */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              Hành Trình 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mt-1">
                10 Năm Phát Triển
              </span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg">
              Từ startup nhỏ trở thành leader ngành logistics công nghệ
            </p>
          </div>

          <div className="relative">
            {/* Timeline line - Responsive */}
            <div className="timeline-line absolute left-6 sm:left-1/2 transform sm:-translate-x-1/2 w-0.5 sm:w-1 h-full bg-gradient-to-b from-blue-500 to-cyan-500"></div>
            
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex flex-col sm:flex-row sm:items-center mb-8 sm:mb-12 md:mb-16 ${index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                <div className="hidden sm:block sm:w-1/2"></div>
                
                {/* Content - Responsive */}
                <div className={`timeline-content sm:w-1/2 ${index % 2 === 0 ? 'sm:pl-8 md:pl-12' : 'sm:pr-8 md:pr-12'} ml-8 sm:ml-0`}>
                  <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100">
                    <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-bold mb-3 sm:mb-4 text-sm sm:text-base">
                      {milestone.year}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1.5 sm:mb-2">{milestone.title}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{milestone.desc}</p>
                  </div>
                </div>
                
                {/* Dot - Responsive */}
                <div className="timeline-dot absolute left-6 sm:left-1/2 transform sm:-translate-x-1/2 w-4 h-4 sm:w-6 sm:h-6 bg-white border-2 sm:border-4 border-blue-600 rounded-full mt-6 sm:mt-0"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Responsive */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              Đội Ngũ Lãnh Đạo
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mt-1">
                Tài Năng & Tâm Huyết
              </span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg">
              Những người đang kiến tạo tương lai của ngành logistics Việt Nam
            </p>
          </div>

          <div className="grid team-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="group">
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-lg sm:shadow-xl">
                  <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-3 sm:mb-4 text-sm sm:text-base">{member.position}</p>
                    <div className="flex space-x-2 sm:space-x-3">
                      {[FaLinkedinIn, FaTwitter, FaFacebookF].map((Icon, i) => (
                        <a key={i} href="#" className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors">
                          <Icon className="text-xs sm:text-sm" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications - Responsive */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              Chứng Nhận & Tiêu Chuẩn
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg">
              Cam kết chất lượng và bảo mật ở tiêu chuẩn quốc tế
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 hover:border-blue-300 transition-colors group">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <cert.icon className="text-xl sm:text-2xl text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1.5 sm:mb-2">{cert.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Responsive */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-gray-900 text-white py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-gray-900/90"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Sẵn Sàng Cùng Chúng Tôi
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-cyan-300 mt-1">
              Kiến Tạo Tương Lai?
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto px-2 sm:px-0">
            Tham gia hệ sinh thái GoShip và trải nghiệm dịch vụ logistics thông minh hàng đầu Việt Nam.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-900 font-bold rounded-xl text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              Trở thành đối tác ngay
            </button>
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold rounded-xl text-base sm:text-lg transition-all duration-300">
              Liên hệ tư vấn
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;