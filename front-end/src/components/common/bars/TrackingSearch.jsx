import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const TrackingSearch = ({ onSearch }) => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setSubmitted(true);
    onSearch?.(trackingNumber);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-2xl p-6"
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaSearch className="text-blue-600" />
        Tra cứu vận đơn
      </h2>

      <div className="flex gap-4">
        <input
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Nhập mã vận đơn"
          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
        >
          Tìm kiếm
        </button>
      </div>

      {submitted && (
        <div className="mt-4 p-3 bg-green-50 border rounded text-sm">
          Đang tìm vận đơn: <b>{trackingNumber}</b>
        </div>
      )}
    </form>
  );
};

export default TrackingSearch;
