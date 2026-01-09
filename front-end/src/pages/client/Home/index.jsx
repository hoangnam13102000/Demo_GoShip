import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
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
          {isError && <p className="text-center text-red-500">Lỗi tải dữ liệu</p>}

          {!isLoading && !isError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {mappedServices.map((service) => (
                <Link
                  key={service.id}
                  to={`/tao-don-hang?type=${service.serviceCode}`}
                  state={{
                    service_id: service.id,
                    service_code: service.serviceCode,
                    service_name: service.title,
                    base_price: service.price,
                  }}
                  className="block"
                >
                  <ServiceCard
                    {...service}
                    onSelect={() => {}}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-8">
          {[FaHome, FaCheckCircle, FaTruck, FaMapMarkerAlt].map(
            (Icon, index) => (
              <div key={index} className="text-center">
                <Icon className="text-blue-600 text-3xl mx-auto mb-2" />
                <p className="font-bold">Bước {index + 1}</p>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
