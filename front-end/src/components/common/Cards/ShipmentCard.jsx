import React from "react";
import {
  FaMapPin,
  FaPhone,
  FaUser,
  FaCalendar,
  FaDollarSign,
  FaChevronDown,
  FaClock,
  FaTruck,
  FaArrowRight,
  FaEdit,
  FaTrash,
  FaExchangeAlt,
  FaWarehouse,
  FaBuilding,
  FaBox,
} from "react-icons/fa";
import InfoCard, { InfoItem, InfoItemWithIcon } from "./InfoCard";

/**
 * ShipmentCard - Component hiển thị thông tin đơn hàng
 * @param {Object} props
 * @param {Object} props.shipment - Thông tin đơn hàng
 * @param {Object} props.statusConfig - Cấu hình trạng thái (color, textColor, icon, label, borderColor)
 * @param {boolean} props.isExpanded - Trạng thái mở rộng
 * @param {Function} props.onToggleExpand - Callback khi click để mở rộng/thu gọn
 * @param {Object} props.currentBranch - Thông tin chi nhánh hiện tại
 * @param {Array} props.branches - Danh sách tất cả chi nhánh
 * @param {boolean} props.showActions - Hiển thị các nút action (mặc định: false)
 * @param {Function} props.onStatusUpdate - Callback khi click "Cập nhật trạng thái"
 * @param {Function} props.onTransfer - Callback khi click "Chuyển chi nhánh"
 * @param {Function} props.onDelete - Callback khi click "Xóa"
 */
const ShipmentCard = ({
  shipment,
  statusConfig,
  isExpanded = false,
  onToggleExpand,
  currentBranch,
  branches = [],
  showActions = false,
  onStatusUpdate,
  onTransfer,
  onDelete,
}) => {
  const StatusIcon = statusConfig?.icon || FaClock;

  return (
    <div
      className={`bg-white rounded-lg shadow hover:shadow-md transition border-l-4 ${
        statusConfig?.borderColor || "border-gray-500"
      }`}
    >
      {/* Main Row */}
      <div onClick={onToggleExpand} className="p-4 cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex items-center gap-4">
            <div
              className={`p-3 rounded-lg ${
                statusConfig?.color || "bg-gray-100"
              }`}
            >
              <StatusIcon
                className={statusConfig?.textColor || "text-gray-800"}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="font-semibold text-slate-900 text-lg truncate">
                  {shipment.tracking_number}
                </p>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                    statusConfig?.color || "bg-gray-100"
                  } ${statusConfig?.textColor || "text-gray-800"}`}
                >
                  {statusConfig?.label || "Chưa cập nhật"}
                </span>
                {currentBranch && (
                  <span className="px-2 py-1 rounded text-xs font-medium whitespace-nowrap bg-purple-100 text-purple-800 flex items-center gap-1">
                    <FaWarehouse className="w-3 h-3" />
                    {currentBranch.name}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 truncate">
                <span className="truncate">{shipment.sender_name}</span>
                <FaArrowRight className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{shipment.receiver_name}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 ml-4 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <p className="font-semibold text-slate-900">
                {shipment.charge?.toLocaleString()}đ
              </p>
            </div>
            <FaChevronDown
              className={`w-5 h-5 text-slate-400 transition flex-shrink-0 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Sender Info */}
            <InfoCard title="Người gửi" icon={FaUser} iconColor="text-blue-600">
              <InfoItem label="Tên:">{shipment.sender_name}</InfoItem>
              {shipment.sender_phone && (
                <InfoItemWithIcon icon={FaPhone}>
                  {shipment.sender_phone}
                </InfoItemWithIcon>
              )}
              {shipment.sender_address && (
                <InfoItemWithIcon icon={FaMapPin}>
                  {shipment.sender_address}
                </InfoItemWithIcon>
              )}
            </InfoCard>

            {/* Receiver Info */}
            <InfoCard
              title="Người nhận"
              icon={FaUser}
              iconColor="text-green-600"
            >
              <InfoItem label="Tên:">{shipment.receiver_name}</InfoItem>
              {shipment.receiver_phone && (
                <InfoItemWithIcon icon={FaPhone}>
                  {shipment.receiver_phone}
                </InfoItemWithIcon>
              )}
              {shipment.receiver_address && (
                <InfoItemWithIcon icon={FaMapPin}>
                  {shipment.receiver_address}
                </InfoItemWithIcon>
              )}
            </InfoCard>

            {/* Shipment Details */}
            <InfoCard
              title="Thông tin kiện hàng"
              icon={FaBox}
              iconColor="text-purple-600"
            >
              <InfoItem label="Dịch vụ:">
                {shipment.shipment_service_code || "PACKAGE"}
              </InfoItem>
              <InfoItem label="Trọng lượng:">{shipment.weight}kg</InfoItem>
              <div className="flex items-center gap-2 mt-2">
                <FaDollarSign className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-600">
                  {shipment.charge?.toLocaleString()}đ
                </span>
              </div>
            </InfoCard>

            {/* Timeline & Location */}
            <InfoCard
              title="Thời gian & Vị trí"
              icon={FaCalendar}
              iconColor="text-orange-600"
            >
              <InfoItem label="Ngày tạo:">
                {new Date(shipment.created_at).toLocaleDateString("vi-VN")}
              </InfoItem>
              {shipment.expected_delivery_date && (
                <InfoItem label="Dự kiến giao:">
                  {new Date(shipment.expected_delivery_date).toLocaleDateString(
                    "vi-VN"
                  )}
                </InfoItem>
              )}
              {currentBranch && (
                <InfoItemWithIcon
                  icon={FaBuilding}
                  iconColor="text-purple-600"
                  className="pt-2 border-t border-slate-100"
                >
                  <div>
                    <p className="text-slate-600">Chi nhánh hiện tại:</p>
                    <p className="font-medium text-slate-900">
                      {currentBranch.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {currentBranch.address}
                    </p>
                  </div>
                </InfoItemWithIcon>
              )}
            </InfoCard>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="pt-4 border-t border-slate-200 flex gap-3 flex-wrap">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusUpdate?.(shipment);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2 min-w-[200px]"
              >
                <FaEdit className="w-4 h-4" />
                Cập nhật trạng thái
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTransfer?.(shipment);
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2 min-w-[200px]"
              >
                <FaExchangeAlt className="w-4 h-4" />
                Chuyển chi nhánh
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(shipment.id);
                }}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition flex items-center gap-2"
              >
                <FaTrash className="w-4 h-4" />
                Xóa
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShipmentCard;