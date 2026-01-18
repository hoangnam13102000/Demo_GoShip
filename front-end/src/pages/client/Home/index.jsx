import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios"; // import axios đã config baseURL
import {
  FaTruck,
  FaFileAlt,
  FaBox,
  FaRocket,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaHome,
  FaShieldAlt,
  FaClock,
  FaHeadset,
  FaUsers,
  FaChartLine,
  FaStar,
  FaArrowRight,
  FaAward,
  FaGlobeAsia,
} from "react-icons/fa";

import { useCRUDApi } from "../../../api/hooks/useCRUDApi";
import StatCard from "../../../components/common/Cards/StatCard";
import ServiceCard from "../../../components/common/Cards/ServiceCard";
import TrackingSearch from "../../../components/common/bars/TrackingSearch";
import TrackingResult from "../../../pages/client/Tracking/TrackingResult";

/* ================= ICON MAP ================= */
const SERVICE_ICON_MAP = {
  DOCUMENT: FaFileAlt,
  PACKAGE: FaBox,
  EXPRESS: FaRocket,
};

const HomePage = () => {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [trackingData, setTrackingData] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState("");

  /* ================= API ================= */
  const { useGetAll } = useCRUDApi("shipment-services");
  const { data: services = [], isLoading, isError } = useGetAll({
    staleTime: 1000 * 60,
  });

  /* ================= HANDLERS ================= */
  const handleTrackingSearch = async (trackingNumber) => {
    setTrackingLoading(true);
    setTrackingError("");
    setTrackingData(null);
    
    try {
      const res = await axios.get(`/shipments/track/${trackingNumber}`);
      setTrackingData(res.data);
    } catch (err) {
      console.error(err);
      setTrackingData(null);
      setTrackingError(err.response?.data?.message || "Không tìm thấy vận đơn");
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleSelectService = (service) => {
    navigate(`/tao-don-hang?type=${service.serviceCode}`, {
      state: {
        service_id: service.id,
        service_code: service.serviceCode,
        service_name: service.title,
        base_price: service.base_price,
        features: service.features,
      },
    });
  };

  /* ================= MAPPING SERVICE ================= */
  const mappedServices = useMemo(() => {
    return services.map((service) => ({
      id: service.id,
      icon: SERVICE_ICON_MAP[service.code] || FaTruck,
      title: service.name,
      desc: service.description,
      features: service.features || [],
      price: Number(service.base_price).toLocaleString("vi-VN") + "đ",
      base_price: Number(service.base_price),
      featured: service.is_featured,
      color:
        service.code === "DOCUMENT"
          ? "from-cyan-500 via-cyan-600 to-cyan-700"
          : service.code === "PACKAGE"
          ? "from-blue-500 via-blue-600 to-blue-700"
          : "from-purple-500 via-purple-600 to-purple-700",
      serviceCode: service.code,
    }));
  }, [services]);

  /* ================= STATISTICS ================= */
  const stats = [
    { icon: FaUsers, value: "50,000+", label: "Khách hàng tin dùng", color: "text-blue-500" },
    { icon: FaTruck, value: "1,000,000+", label: "Đơn hàng đã giao", color: "text-green-500" },
    { icon: FaGlobeAsia, value: "63/63", label: "Tỉnh thành phủ sóng", color: "text-purple-500" },
    { icon: FaAward, value: "10 năm", label: "Kinh nghiệm vận chuyển", color: "text-yellow-500" },
  ];

  /* ================= FEATURES ================= */
  const features = [
    {
      icon: FaShieldAlt,
      title: "Bảo hiểm toàn diện",
      desc: "Bảo hiểm 100% giá trị hàng hóa, an tâm tuyệt đối",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: FaClock,
      title: "Giao hàng siêu tốc",
      desc: "Cam kết giao hàng đúng hẹn, hoàn tiền nếu trễ",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: FaHeadset,
      title: "Hỗ trợ 24/7",
      desc: "Đội ngũ CSKH chuyên nghiệp luôn sẵn sàng",
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: FaChartLine,
      title: "Theo dõi real-time",
      desc: "Cập nhật liên tục vị trí đơn hàng trên bản đồ",
      color: "bg-cyan-50 text-cyan-600"
    },
  ];

  /* ================= TESTIMONIALS ================= */
  const testimonials = [
    {
      name: "Nguyễn Văn A",
      role: "Chủ shop thời trang",
      content: "Sử dụng dịch vụ 3 năm nay, GoShip luôn là lựa chọn số 1 cho shop của tôi. Tỷ lệ giao thành công 99%!",
      rating: 5,
    },
    {
      name: "Trần Thị B",
      role: "Doanh nghiệp xuất nhập khẩu",
      content: "Dịch vụ chuyên nghiệp, xử lý hàng hóa kỹ lưỡng. Đặc biệt rất hài lòng với tính năng theo dõi real-time.",
      rating: 5,
    },
    {
      name: "Lê Văn C",
      role: "Startup E-commerce",
      content: "Giá cả cạnh tranh, hỗ trợ nhanh chóng. Đã giúp chúng tôi mở rộng kinh doanh ra toàn quốc.",
      rating: 4,
    },
  ];

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-white">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 pt-24 pb-32 px-4">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold mb-6 animate-bounce-slow">
              <FaStar /> 10 NĂM KINH NGHIỆM - UY TÍN HÀNG ĐẦU
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Giao Hàng <span className="text-yellow-300">Thông Minh</span>
              <br />
              Vận Chuyển <span className="text-yellow-300">Chuyên Nghiệp</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 font-medium max-w-3xl mx-auto mb-10">
              Giải pháp logistics toàn diện cho doanh nghiệp và cá nhân với 10 năm kinh nghiệm
            </p>
          </div>

          {/* Tracking Section */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1 shadow-2xl">
              <TrackingSearch onSearch={handleTrackingSearch} />
            </div>
            
            {/* Tracking Result */}
            <div className="mt-8">
              {trackingLoading && (
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mb-4"></div>
                  <p className="text-white text-lg font-medium">Đang tìm kiếm vận đơn...</p>
                </div>
              )}
              
              {trackingError && (
                <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm border-l-4 border-red-400 rounded-xl p-6 shadow-lg animate-shake">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-white font-medium text-lg">{trackingError}</p>
                      <p className="text-blue-100 text-sm mt-1">Vui lòng kiểm tra lại mã vận đơn hoặc liên hệ hỗ trợ</p>
                    </div>
                  </div>
                </div>
              )}
              
              {trackingData && <TrackingResult data={trackingData} />}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <stat.icon className={`text-3xl ${stat.color} mx-auto mb-3`} />
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-blue-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-20" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 45C840 60 960 90 1080 105C1200 120 1320 120 1380 120H1440V0H0V120Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Dịch vụ <span className="text-blue-600">Đa dạng</span> cho mọi nhu cầu
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Chúng tôi cung cấp đầy đủ các giải pháp vận chuyển từ cơ bản đến cao cấp
            </p>
          </div>

          {isLoading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-gray-600 mt-4 text-lg">Đang tải dịch vụ...</p>
            </div>
          )}
          
          {isError && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="h-10 w-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-red-500 font-medium text-lg mb-4">Lỗi tải dữ liệu dịch vụ</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Thử lại
              </button>
            </div>
          )}

          {!isLoading && !isError && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {mappedServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    {...service}
                    onSelect={() => handleSelectService(service)}
                    className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                  />
                ))}
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => navigate('/dich-vu')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
                >
                  Xem tất cả dịch vụ
                  <FaArrowRight />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Điểm nổi bật chỉ có tại GoShip</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">Những giá trị khác biệt mang đến trải nghiệm tuyệt vời cho khách hàng</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROCESS SECTION ================= */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Quy trình giao hàng 4 bước</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Đơn giản, minh bạch và hiệu quả - Đảm bảo trải nghiệm tốt nhất cho khách hàng
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: 1, icon: FaHome, title: "Tạo đơn hàng", desc: "Nhập thông tin gửi và nhận trong 30s" },
                { step: 2, icon: FaCheckCircle, title: "Xác nhận", desc: "Chúng tôi xác nhận và thu gom hàng" },
                { step: 3, icon: FaTruck, title: "Vận chuyển", desc: "Hàng được vận chuyển an toàn" },
                { step: 4, icon: FaMapMarkerAlt, title: "Giao hàng", desc: "Khách hàng nhận hàng & xác nhận" },
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center"
                >
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                      {item.step}
                    </div>
                  </div>
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-3xl mb-6">
                    <item.icon />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS SECTION ================= */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Khách hàng nói gì về chúng tôi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Hàng nghìn khách hàng đã tin tưởng và đồng hành cùng chúng tôi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={`text-sm ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-24 px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="max-w-5xl mx-auto text-center relative">
          {/* Background Elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Sẵn sàng trải nghiệm dịch vụ <span className="text-yellow-300">tốt nhất</span>?
            </h2>
            <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-3xl mx-auto">
              Đăng ký ngay hôm nay và nhận ưu đãi 20% cho 10 đơn hàng đầu tiên. 
              Tối ưu chi phí vận chuyển cho doanh nghiệp của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/register')}
                className="px-10 py-4 bg-white text-blue-600 font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 shadow-lg text-lg"
              >
                Đăng ký miễn phí
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="px-10 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-200 text-lg"
              >
                Liên hệ tư vấn
              </button>
            </div>
            <p className="text-blue-100 mt-6 text-sm">
              Đã có tài khoản? 
              <button 
                onClick={() => navigate('/login')}
                className="ml-2 text-yellow-300 font-semibold hover:text-yellow-200"
              >
                Đăng nhập ngay
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Add custom animations */}
      <style >{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default HomePage;