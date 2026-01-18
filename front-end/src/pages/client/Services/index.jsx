import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCRUDApi } from "../../../api/hooks/useCRUDApi";
import ServiceCard from "../../../components/common/Cards/ServiceCard";
import { 
  FaTruck, 
  FaFileAlt, 
  FaBox, 
  FaRocket, 
  FaCheckCircle, 
  FaShieldAlt,
  FaClock,
  FaMapMarkerAlt,
  FaHeadset,
  FaTag,
  FaStar,
  FaChevronDown,
  FaChevronUp,
  FaQuestionCircle
} from "react-icons/fa";

/* ================= ICON MAP ================= */
const SERVICE_ICON_MAP = {
  DOCUMENT: FaFileAlt,
  PACKAGE: FaBox,
  EXPRESS: FaRocket,
};

const ServicesPage = () => {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  /* ================= API ================= */
  const { useGetAll } = useCRUDApi("shipment-services");
  const { data: services = [], isLoading, isError } = useGetAll({
    staleTime: 1000 * 60 * 5,
  });

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
          ? "from-cyan-500 to-cyan-600"
          : service.code === "PACKAGE"
          ? "from-blue-500 to-blue-600"
          : "from-purple-500 to-purple-600",
      serviceCode: service.code,
      deliveryTime: service.delivery_time || "1-3 ngày",
      maxWeight: service.max_weight || "30kg",
      isRecommended: service.is_recommended || false,
    }));
  }, [services]);

  /* ================= FILTERED SERVICES ================= */
  const filteredServices = useMemo(() => {
    if (activeTab === "all") return mappedServices;
    return mappedServices.filter(service => service.serviceCode === activeTab);
  }, [activeTab, mappedServices]);

  /* ================= HANDLERS ================= */
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

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  /* ================= FEATURED BENEFITS ================= */
  const benefits = [
    {
      icon: FaShieldAlt,
      title: "Bảo hiểm đầy đủ",
      desc: "Được bảo hiểm 100% giá trị hàng hóa",
      delay: "delay-0"
    },
    {
      icon: FaClock,
      title: "Giao hàng nhanh",
      desc: "Cam kết giao đúng giờ hoặc hoàn tiền",
      delay: "delay-100"
    },
    {
      icon: FaMapMarkerAlt,
      title: "Theo dõi real-time",
      desc: "Cập nhật vị trí liên tục trên bản đồ",
      delay: "delay-200"
    },
    {
      icon: FaHeadset,
      title: "Hỗ trợ 24/7",
      desc: "Đội ngũ CSKH luôn sẵn sàng hỗ trợ",
      delay: "delay-300"
    }
  ];

  /* ================= COMPARISON TABLE ================= */
  const comparisonFeatures = [
    "Giao hàng trong ngày",
    "Bảo hiểm hàng hóa",
    "Hỗ trợ đóng gói",
    "Thu hộ (COD)",
    "Giao lại nhiều lần",
    "Theo dõi real-time",
    "Hỗ trợ hoàn trả",
    "Báo cáo định kỳ"
  ];

  /* ================= FAQ DATA ================= */
  const faqs = [
    {
      q: "Làm thế nào để theo dõi đơn hàng?",
      a: "Bạn có thể theo dõi đơn hàng bằng mã vận đơn trên website hoặc ứng dụng di động của chúng tôi. Hệ thống sẽ cập nhật trạng thái theo thời gian thực."
    },
    {
      q: "Thời gian giao hàng trung bình là bao lâu?",
      a: "Tùy vào dịch vụ bạn chọn: Express (4-8 giờ), Tài liệu (1-2 ngày), Kiện hàng (1-3 ngày). Đối với khu vực xa, thời gian có thể lâu hơn 1-2 ngày."
    },
    {
      q: "Có hỗ trợ thu hộ COD không?",
      a: "Có, tất cả dịch vụ đều hỗ trợ thu hộ với phí dịch vụ chỉ 1% giá trị đơn hàng. Số tiền sẽ được chuyển khoản cho bạn trong vòng 24 giờ sau khi giao hàng thành công."
    },
    {
      q: "Tôi có thể hủy đơn hàng sau khi tạo không?",
      a: "Có, bạn có thể hủy đơn hàng trong vòng 2 giờ sau khi tạo mà không mất phí. Sau thời gian đó, có thể áp dụng phí hủy tùy theo trạng thái đơn hàng."
    }
  ];

  /* ================= SERVICE TABS ================= */
  const serviceTabs = [
    { id: "all", label: "Tất cả dịch vụ", icon: FaTruck },
    { id: "DOCUMENT", label: "Tài liệu", icon: FaFileAlt },
    { id: "PACKAGE", label: "Kiện hàng", icon: FaBox },
    { id: "EXPRESS", label: "Express", icon: FaRocket },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 pt-24 pb-20 px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold mb-8 animate-bounce-slow">
              <FaStar /> 10 NĂM KINH NGHIỆM - UY TÍN HÀNG ĐẦU
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight animate-slideDown">
              Dịch vụ <span className="text-yellow-300">Chuyên nghiệp</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10 animate-slideUp">
              Lựa chọn giải pháp vận chuyển hoàn hảo cho nhu cầu của bạn với 10 năm kinh nghiệm trong ngành logistics
            </p>
          </div>
        </div>
      </section>

      {/* ================= BENEFITS SECTION ================= */}
      <section className="py-16 px-4 bg-white -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tại sao chọn GoShip?</h2>
            <p className="text-gray-600">Những lợi ích đặc biệt chỉ có tại chúng tôi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 animate-fadeInUp ${benefit.delay} hover:-translate-y-2`}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl mb-4">
                  <benefit.icon />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <FaStar /> DỊCH VỤ CỦA CHÚNG TÔI
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Giải pháp <span className="text-blue-600">toàn diện</span> cho mọi nhu cầu
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Chọn dịch vụ phù hợp nhất với yêu cầu vận chuyển của bạn
            </p>
          </div>

          {/* Service Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fadeIn">
            {serviceTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow"
                }`}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </div>

          {isLoading && (
            <div className="text-center py-20 animate-pulse">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-gray-600 mt-4 text-lg">Đang tải dịch vụ...</p>
            </div>
          )}

          {isError && (
            <div className="text-center py-20 animate-shake">
              <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <FaQuestionCircle className="text-red-500 text-3xl" />
              </div>
              <p className="text-red-500 font-medium text-lg">Lỗi tải dữ liệu dịch vụ</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
              >
                Thử lại
              </button>
            </div>
          )}

          {!isLoading && !isError && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className={`relative animate-fadeInUp hover:scale-[1.02] transition-all duration-300 ${
                    service.isRecommended ? 'animate-bounce-slow' : ''
                  }`}
                >
                  {service.isRecommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
                        <FaTag className="text-xs" /> ĐỀ XUẤT
                      </div>
                    </div>
                  )}
                  <ServiceCard
                    {...service}
                    onSelect={() => handleSelectService(service)}
                    className="h-full hover:shadow-2xl transition-shadow duration-300"
                  />
                </div>
              ))}
            </div>
          )}

          {filteredServices.length === 0 && !isLoading && !isError && (
            <div className="text-center py-12 animate-fadeIn">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FaBox className="text-gray-400 text-3xl" />
              </div>
              <p className="text-gray-600 text-lg">Không tìm thấy dịch vụ nào</p>
            </div>
          )}
        </div>
      </section>

      {/* ================= COMPARISON TABLE ================= */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">So sánh dịch vụ</h2>
            <p className="text-gray-600">Xem chi tiết tính năng của từng dịch vụ</p>
          </div>

          <div className="overflow-x-auto rounded-2xl shadow-xl border border-gray-200 animate-slideUp">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tính năng</th>
                  {mappedServices.map((service) => (
                    <th key={service.id} className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <service.icon className={`text-2xl mb-2 ${
                          service.serviceCode === "DOCUMENT" ? "text-cyan-500" :
                          service.serviceCode === "PACKAGE" ? "text-blue-500" : "text-purple-500"
                        }`} />
                        <span className="font-bold text-gray-900">{service.title}</span>
                        <span className="text-sm text-gray-600">{service.price}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {comparisonFeatures.map((feature, index) => (
                  <tr 
                    key={index} 
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50 transition-colors duration-200`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{feature}</td>
                    {mappedServices.map((service) => (
                      <td key={service.id} className="px-6 py-4 text-center">
                        <FaCheckCircle className={`inline text-xl ${
                          service.features.includes(feature) ? "text-green-500 animate-scaleIn" : "text-gray-300"
                        }`} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Câu hỏi thường gặp</h2>
            <p className="text-gray-600">Tìm câu trả lời cho những thắc mắc phổ biến</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                >
                  <h3 className="text-lg font-bold text-gray-900">{faq.q}</h3>
                  {expandedFaq === index ? (
                    <FaChevronUp className="text-blue-500 transition-transform duration-300" />
                  ) : (
                    <FaChevronDown className="text-gray-400 transition-transform duration-300" />
                  )}
                </button>
                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ${
                    expandedFaq === index ? "max-h-96 pb-4" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fadeIn">
            <h2 className="text-4xl font-bold text-white mb-6">
              Sẵn sàng trải nghiệm dịch vụ <span className="text-yellow-300">tốt nhất</span>?
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              Đăng ký ngay hôm nay và nhận ưu đãi 20% cho khách hàng mới
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-bounce-slow">
              <button 
                onClick={() => navigate('/dang-ky')}
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Đăng ký miễn phí
              </button>
              <button 
                onClick={() => navigate('/lien-he')}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                Liên hệ tư vấn
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Add custom CSS animations */}
      <style >{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

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

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-slideDown {
          animation: slideDown 0.7s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.7s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .delay-0 {
          animation-delay: 0s;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};

export default ServicesPage;