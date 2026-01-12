import { FaTruck, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const TrackingResult = ({ data }) => {
  if (!data) return null;

  return (
    <div className="mt-8 bg-white rounded-xl shadow p-6">
      <h3 className="text-xl font-bold mb-4">
        Kết quả tra cứu:{" "}
        <span className="text-blue-600">{data.tracking_number}</span>
      </h3>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FaTruck className="text-blue-600" />
          <span className="font-semibold">Trạng thái:</span>
          <span>{data.status}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-blue-600" />
          <span className="font-semibold">Vị trí hiện tại:</span>
          <span>{data.current_location}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaClock className="text-blue-600" />
          <span className="font-semibold">Dự kiến giao:</span>
          <span>{data.estimated_delivery}</span>
        </div>
      </div>

      <h4 className="font-bold mb-3">Lịch sử vận chuyển</h4>

      <div className="space-y-3">
        {data.history.map((item, idx) => (
          <div
            key={idx}
            className="border-l-4 border-blue-600 pl-4 py-2"
          >
            <p className="font-semibold">{item.status}</p>
            <p className="text-sm text-gray-600">
              {item.location} – {item.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackingResult;
