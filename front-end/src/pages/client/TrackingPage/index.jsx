import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaSearch,
  FaTruck,
  FaMapMarkerAlt,
  FaClock,
  FaBoxOpen,
} from "react-icons/fa";
import GenericBadge from "../../../components/UI/GenericBadge";

const STATUS_BADGE_CONFIG = {
  CREATED: { className: "bg-gray-100 text-gray-700" },
  IN_TRANSIT: { className: "bg-blue-100 text-blue-700" },
  DELIVERED: { className: "bg-green-100 text-green-700" },
  FAILED: { className: "bg-red-100 text-red-700" },
  DEFAULT: { className: "bg-gray-100 text-gray-700" },
};

const TrackingPage = () => {
  const { trackingNumber } = useParams();
  const navigate = useNavigate();

  const [input, setInput] = useState(trackingNumber || "");
  const [shipment, setShipment] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTracking = async (code) => {
    try {
      setLoading(true);
      setError("");

      // MOCK – thay bằng API thật
      const shipmentRes = await fetch(`/api/shipments/track/${code}`);
      if (!shipmentRes.ok) throw new Error("Không tìm thấy vận đơn");

      const shipmentData = await shipmentRes.json();
      setShipment(shipmentData);

      const timelineRes = await fetch(
        `/api/shipments/${shipmentData.id}/tracking`
      );
      const timelineData = await timelineRes.json();
      setTimeline(timelineData);
    } catch (err) {
      setError(err.message);
      setShipment(null);
      setTimeline([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trackingNumber) fetchTracking(trackingNumber);
  }, [trackingNumber]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    navigate(`/tracking/${input.trim()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* SEARCH */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl shadow p-6 flex gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập mã vận đơn"
            className="flex-1 border rounded-lg px-4 py-2"
          />
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
            <FaSearch /> Tra cứu
          </button>
        </form>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* SHIPMENT INFO */}
        {shipment && (
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaBoxOpen /> Thông tin đơn hàng
              </h2>
              <GenericBadge
                value={shipment.current_status}
                config={STATUS_BADGE_CONFIG}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold">Người gửi</p>
                <p>{shipment.sender_name}</p>
                <p>{shipment.sender_city}</p>
              </div>
              <div>
                <p className="font-semibold">Người nhận</p>
                <p>{shipment.receiver_name}</p>
                <p>{shipment.receiver_city}</p>
              </div>
            </div>
          </div>
        )}

        {/* TIMELINE */}
        {timeline.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaTruck /> Lịch sử vận chuyển
            </h2>

            <ol className="relative border-l border-gray-200">
              {timeline.map((item, idx) => (
                <li key={idx} className="mb-6 ml-6">
                  <span className="absolute -left-3 w-6 h-6 bg-blue-600 rounded-full"></span>
                  <p className="font-semibold">{item.status_name}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <FaMapMarkerAlt /> {item.branch_name}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <FaClock /> {item.updated_at}
                  </p>
                  {item.note && (
                    <p className="text-sm text-gray-700 mt-1">
                      {item.note}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}

        {loading && (
          <div className="text-center text-gray-600">Đang tải dữ liệu...</div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
