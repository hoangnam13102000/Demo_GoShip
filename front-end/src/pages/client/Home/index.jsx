import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTruck,
  FaFileAlt,
  FaBox,
  FaRocket,
  FaSearch,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaHome,
} from "react-icons/fa";

import { useCRUDApi } from "../../../api/hooks/useCRUDApi";
import ServiceCard from "../../../components/common/Cards/ServiceCard";

/* ================= ICON MAP ================= */
const SERVICE_ICON_MAP = {
  DOCUMENT: FaFileAlt,
  PACKAGE: FaBox,
  EXPRESS: FaRocket,
};

const HomePage = () => {
  const navigate = useNavigate();

  /* ================= API ================= */
  const { useGetAll } = useCRUDApi("shipment-services");

  const {
    data: services = [],
    isLoading,
    isError,
  } = useGetAll({
    staleTime: 1000 * 60,
  });

  /* ================= STATE ================= */
  const [trackingNumber, setTrackingNumber] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  /* ================= HANDLERS ================= */
  const handleTrackingSearch = (e) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      setSearchSubmitted(true);
      console.log("Tracking:", trackingNumber);
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
      price:
        Number(service.base_price).toLocaleString("vi-VN") + "đ",
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
            <h1 className="text-5xl font-bold text-white mb-4">
              Courier Services
            </h1>
            <p className="text-xl text-blue-100 font-semibold">
              Gửi hàng nhanh – Theo dõi đơn dễ dàng
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <form
              onSubmit={handleTrackingSearch}
              className="bg-white rounded-xl shadow-2xl p-6"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FaSearch className="text-blue-600" />
                Tra cứu vận đơn
              </h2>

              <div className="flex gap-4">
                <input
                  value={trackingNumber}
                  onChange={(e) =>
                    setTrackingNumber(e.target.value)
                  }
                  placeholder="Nhập mã vận đơn"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg"
                />
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold">
                  Tìm kiếm
                </button>
              </div>

              {searchSubmitted && (
                <div className="mt-4 p-3 bg-green-50 border rounded">
                  Đang tìm vận đơn: <b>{trackingNumber}</b>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Dịch vụ của chúng tôi
            </h2>
          </div>

          {isLoading && <p className="text-center">Đang tải...</p>}
          {isError && (
            <p className="text-center text-red-500">
              Lỗi tải dữ liệu
            </p>
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
            <div className="hidden lg:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-transparent"></div>

            {[
              { step: 1, icon: FaHome, title: "Tạo đơn hàng", desc: "Nhập thông tin gửi và nhận" },
              { step: 2, icon: FaCheckCircle, title: "Xác nhận", desc: "Chúng tôi xác nhận thông tin" },
              { step: 3, icon: FaTruck, title: "Vận chuyển", desc: "Hàng được giao an toàn" },
              { step: 4, icon: FaMapMarkerAlt, title: "Giao hàng", desc: "Khách hàng nhận hàng" },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl shadow-lg">
                    {item.step}
                  </div>
                  <item.icon className="text-blue-600 text-3xl mb-4" />
                  <h3 className="text-xl font-bold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { number: "50K+", label: "Đơn hàng thành công" },
            { number: "99%", label: "Tỉ lệ giao đúng hẹn" },
            { number: "24/7", label: "Hỗ trợ khách hàng" },
            { number: "63", label: "Tỉnh thành phủ sóng" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="text-4xl font-bold text-blue-600 mb-2">
                {stat.number}
              </p>
              <p className="text-gray-600">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Sẵn sàng gửi hàng ngay hôm nay?
          </h2>
          <p className="text-blue-100 text-lg mb-10">
            Tạo tài khoản miễn phí và nhận ưu đãi 20% cho 10 đơn hàng đầu tiên
          </p>
          <button className="px-10 py-4 bg-white text-blue-600 font-bold rounded-lg hover:shadow-xl hover:scale-105 transition">
            Đăng ký ngay
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
