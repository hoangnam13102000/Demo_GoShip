import React from "react";
import { FaTimes } from "react-icons/fa";

const ShipmentDetailDialog = ({
  open,
  item,
  onClose,
  onEdit,
}) => {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">
              Chi tiết đơn vận chuyển
            </h2>
            <p className="text-blue-100 text-sm">
              {item.tracking_number}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white text-2xl hover:text-blue-100 transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Thông tin loại và phí */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-gray-500 text-sm font-medium">Loại vận chuyển</p>
              <p className="text-lg font-semibold text-gray-900">
                {item.shipment_type}
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="text-gray-500 text-sm font-medium">Phí vận chuyển</p>
              <p className="text-lg font-semibold text-green-600">
                {Number(item.charge).toLocaleString("vi-VN")}đ
              </p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <p className="text-gray-500 text-sm font-medium">Trọng lượng</p>
              <p className="text-lg font-semibold text-gray-900">
                {item.weight} kg
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <p className="text-gray-500 text-sm font-medium">Ngày dự kiến</p>
              <p className="text-lg font-semibold text-gray-900">
                {item.expected_delivery_date
                  ? new Date(item.expected_delivery_date).toLocaleDateString(
                      "vi-VN"
                    )
                  : "-"}
              </p>
            </div>
          </div>

          {/* Thông tin người gửi */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Thông tin người gửi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase">Tên</p>
                <p className="text-gray-900 font-medium">
                  {item.sender_name || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase">SĐT</p>
                <p className="text-gray-900 font-medium">
                  {item.sender_phone || "-"}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-gray-500 text-xs font-medium uppercase">Địa chỉ</p>
                <p className="text-gray-900 font-medium">
                  {item.sender_address || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Thông tin người nhận */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Thông tin người nhận
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase">Tên</p>
                <p className="text-gray-900 font-medium">
                  {item.receiver_name || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase">SĐT</p>
                <p className="text-gray-900 font-medium">
                  {item.receiver_phone || "-"}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-gray-500 text-xs font-medium uppercase">Địa chỉ</p>
                <p className="text-gray-900 font-medium">
                  {item.receiver_address || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Thông tin hệ thống */}
          <div className="border-t pt-4">
            <p className="text-xs text-gray-500 font-medium uppercase mb-3">
              Thông tin hệ thống
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Customer ID</p>
                <p className="font-semibold text-gray-900">
                  {item.customer_id}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Agent ID</p>
                <p className="font-semibold text-gray-900">
                  {item.agent_id || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Branch ID</p>
                <p className="font-semibold text-gray-900">
                  {item.branch_id}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              onEdit(item);
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
          >
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetailDialog;