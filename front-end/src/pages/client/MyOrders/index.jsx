import { useEffect, useState } from "react";
import axios from "../../../api/axios"; // axios đã config baseURL + auth token
import TrackingResult from "../Tracking/TrackingResult";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/shipments/my-orders");
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-6">Đơn hàng của tôi</h1>

      {loading && <p>Đang tải đơn hàng...</p>}

      {!loading && orders.length === 0 && <p>Chưa có đơn hàng nào.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
            onClick={() => setSelectedOrder(order)}
          >
            <p>
              <span className="font-semibold">Mã vận đơn:</span>{" "}
              {order.tracking_number}
            </p>
            <p>
              <span className="font-semibold">Dịch vụ:</span> {order.service}
            </p>
            <p>
              <span className="font-semibold">Trạng thái:</span> {order.status}
            </p>
            <p>
              <span className="font-semibold">Ngày tạo:</span> {order.created_at}
            </p>
            <p>
              <span className="font-semibold">Dự kiến giao:</span>{" "}
              {order.estimated_delivery ?? "Chưa xác định"}
            </p>
          </div>
        ))}
      </div>

      {/* Modal hoặc panel hiện TrackingResult khi chọn đơn */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start p-4 overflow-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-red-500 font-bold text-xl"
              onClick={() => setSelectedOrder(null)}
            >
              ×
            </button>
            <TrackingResult data={selectedOrder} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
