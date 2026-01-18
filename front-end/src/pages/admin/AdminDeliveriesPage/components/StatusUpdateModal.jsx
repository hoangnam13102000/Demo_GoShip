import React from "react";
import {
  FaTruck,
  FaEdit,
  FaTimes,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

const StatusUpdateModal = ({
  isOpen,
  onClose,
  selectedShipment,
  newStatus,
  setNewStatus,
  statusNote,
  setStatusNote,
  shipmentStatuses = [],
  isSubmitting,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            Cập nhật trạng thái
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
            disabled={isSubmitting}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Shipment Info */}
        {selectedShipment && (
          <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-slate-600 mb-1">Mã vận đơn:</p>
                <p className="font-semibold text-slate-900 text-sm">
                  {selectedShipment.tracking_number}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Người nhận:</p>
                <p className="font-semibold text-slate-900 text-sm">
                  {selectedShipment.receiver_name}
                </p>
              </div>
            </div>
            {selectedShipment.sender_name && (
              <div className="mt-2">
                <p className="text-sm text-slate-600 mb-1">Người gửi:</p>
                <p className="font-medium text-slate-800 text-sm">
                  {selectedShipment.sender_name}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Status Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <FaTruck className="w-4 h-4 text-blue-600" />
            Trạng thái mới
            <span className="text-red-500">*</span>
          </label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(Number(e.target.value))}
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
          >
            <option value="">-- Chọn trạng thái --</option>
            {shipmentStatuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
          {!newStatus && (
            <p className="text-xs text-red-500 mt-1">
              Vui lòng chọn trạng thái mới
            </p>
          )}
        </div>

        {/* Note Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <FaEdit className="w-4 h-4 text-slate-600" />
            Ghi chú (tùy chọn)
          </label>
          <textarea
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            placeholder="Nhập ghi chú về cập nhật trạng thái..."
            rows="3"
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-slate-500 mt-1">
            Ví dụ: Đã giao cho người nhận, chuyển hoàn, v.v.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaTimes className="w-4 h-4" />
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting || !newStatus}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:from-blue-400 disabled:to-blue-500"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="w-4 h-4 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              <>
                <FaCheckCircle className="w-4 h-4" />
                Xác nhận
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;