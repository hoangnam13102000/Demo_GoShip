import {
  FaClock,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

export const statusColorMap = {
  PLACED: {
    color: "bg-yellow-100",
    textColor: "text-yellow-800",
    icon: FaClock,
    borderColor: "border-yellow-500",
  },
  PICKED_UP: {
    color: "bg-blue-100",
    textColor: "text-blue-800",
    icon: FaBox,
    borderColor: "border-blue-500",
  },
  IN_TRANSIT: {
    color: "bg-blue-100",
    textColor: "text-blue-800",
    icon: FaTruck,
    borderColor: "border-blue-500",
  },
  DELIVERED: {
    color: "bg-green-100",
    textColor: "text-green-800",
    icon: FaCheckCircle,
    borderColor: "border-green-500",
  },
  CANCELLED: {
    color: "bg-red-100",
    textColor: "text-red-800",
    icon: FaExclamationCircle,
    borderColor: "border-red-500",
  },
};

export const getStatusConfig = (statusId, shipmentStatuses) => {
  const status = shipmentStatuses.find((item) => item.id === statusId);

  if (!status) {
    return null;
  }

  const colorConfig = statusColorMap[status.code] || {
    color: "bg-gray-100",
    textColor: "text-gray-800",
    icon: FaClock,
    borderColor: "border-gray-500",
  };

  return {
    ...colorConfig,
    label: status.name,
    id: status.id,
    code: status.code,
  };
};