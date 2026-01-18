import React from "react";
import {
  FaTimes,
  FaSpinner,
  FaExchangeAlt,
  FaWarehouse,
  FaBuilding,
  FaRoad,
  FaEdit,
} from "react-icons/fa";

const TransferShipmentModal = ({
  isOpen,
  onClose,
  selectedShipment,
  transferToBranchId,
  setTransferToBranchId,
  transferStatusId,
  setTransferStatusId,
  transferNote,
  setTransferNote,
  availableBranchesForTransfer,
  transferStatusOptions,
  branches,
  shipmentStatuses,
  isSubmitting,
  isLoading,
  onConfirm,
}) => {
  if (!isOpen || !selectedShipment) return null;

  const currentBranch = branches.find(
    (b) => b.id === selectedShipment.current_branch_id
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Chuyển đơn hàng</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 bg-slate-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-sm text-slate-600 mb-1">Mã vận đơn:</p>
              <p className="font-semibold text-slate-900">
                {selectedShipment.tracking_number}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Người nhận:</p>
              <p className="font-semibold text-slate-900">
                {selectedShipment.receiver_name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded border border-slate-200">
            <FaWarehouse className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <div>
              <p className="text-sm text-slate-600">Chi nhánh hiện tại:</p>
              <p className="font-semibold text-slate-900">
                {currentBranch?.name || "Chưa xác định"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <FaBuilding className="w-4 h-4 text-purple-600" />
              Chuyển đến chi nhánh
            </label>
            <select
              value={transferToBranchId}
              onChange={(e) => setTransferToBranchId(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">-- Chọn chi nhánh đích --</option>
              {availableBranchesForTransfer.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} - {branch.city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <FaRoad className="w-4 h-4 text-blue-600" />
              Trạng thái chuyển hàng
            </label>
            <select
              value={transferStatusId}
              onChange={(e) => setTransferStatusId(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Chọn trạng thái --</option>
              {transferStatusOptions.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <FaEdit className="w-4 h-4 text-slate-600" />
              Ghi chú chuyển hàng (tùy chọn)
            </label>
            <textarea
              value={transferNote}
              onChange={(e) => setTransferNote(e.target.value)}
              placeholder="Ví dụ: Chuyển hàng đến chi nhánh Hà Nội..."
              rows="3"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting || isLoading}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FaTimes className="w-4 h-4" />
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={
              isSubmitting ||
              isLoading ||
              !transferToBranchId ||
              !transferStatusId
            }
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <FaSpinner className="w-4 h-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <FaExchangeAlt className="w-4 h-4" />
                Xác nhận chuyển
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferShipmentModal;