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
} from "react-icons/fa";

import { useCRUDApi } from "../../../api/hooks/useCRUDApi";
import ServiceCard from "../../../components/common/Cards/ServiceCard";
import TrackingSearch from "../../../components/common/bars/TrackingSearch";
import TrackingResult from "../../../pages/client/Tracking/TrackingResult";
import ChatBubble from "../../../components/chats/MessengerChat";
import Chatbot from "../../../components/chats/ChatWidget"; // Thêm import Chatbot

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
    setTrackingData(null); // Reset data trước khi search
    
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
          ? "from-cyan-600 to-cyan-700"
          : service.code === "PACKAGE"
          ? "from-blue-600 to-blue-700"
          : "from-blue-500 to-purple-600",
      serviceCode: service.code,
    }));
  }, [services]);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-white">
      {/* ================= HERO ================= */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-4">Courier Services</h1>
            <p className="text-xl text-blue-100 font-semibold">
              Gửi hàng nhanh – Theo dõi đơn dễ dàng
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <TrackingSearch onSearch={handleTrackingSearch} />
          </div>

          {/* ================= Tracking Result ================= */}
          <div className="mt-8">
            {trackingLoading && (
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                <p className="text-white mt-4 font-medium">Đang tìm kiếm vận đơn...</p>
              </div>
            )}
            
            {trackingError && (
              <div className="max-w-2xl mx-auto bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{trackingError}</p>
                  </div>
                </div>
              </div>
            )}
            
            {trackingData && <TrackingResult data={trackingData} />}
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Dịch vụ của chúng tôi</h2>
          </div>

          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-gray-600 mt-4">Đang tải dịch vụ...</p>
            </div>
          )}
          
          {isError && (
            <div className="text-center py-12">
              <p className="text-red-500 font-medium">Lỗi tải dữ liệu dịch vụ</p>
            </div>
          )}

          {!isLoading && !isError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {mappedServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  {...service}
                  onSelect={() => handleSelectService(service)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="py-16 sm:py-20 lg:py-28 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Quy trình giao hàng</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Bốn bước đơn giản để gửi và nhận hàng an toàn
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: 1, icon: FaHome, title: "Tạo đơn hàng", desc: "Nhập thông tin gửi và nhận" },
              { step: 2, icon: FaCheckCircle, title: "Xác nhận", desc: "Chúng tôi xác nhận thông tin" },
              { step: 3, icon: FaTruck, title: "Vận chuyển", desc: "Hàng được giao an toàn" },
              { step: 4, icon: FaMapMarkerAlt, title: "Giao hàng", desc: "Khách hàng nhận hàng" },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                  {item.step}
                </div>
                <item.icon className="text-blue-600 text-3xl mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Sẵn sàng gửi hàng ngay hôm nay?</h2>
          <p className="text-blue-100 text-lg mb-10">
            Tạo tài khoản miễn phí và nhận ưu đãi 20% cho 10 đơn hàng đầu tiên
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="px-10 py-4 bg-white text-blue-600 font-bold rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Đăng ký ngay
          </button>
        </div>
      </section>

      {/* Chat Bubbles Wrapper - Xếp dọc */}
      <div style={{ position: "fixed", bottom: "1rem", right: "1rem", zIndex: 999, display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-end" }}>
        {/* Messenger Chat - Khai báo trước, nằm trên */}
        <ChatBubble isStacked={true} />

        {/* Chat Widget - Khai báo sau, nằm dưới */}
        <Chatbot isStacked={true} />
      </div>
    </div>
  );
};

export default HomePage;