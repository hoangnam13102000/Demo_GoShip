import React from 'react';
import { 
  FaCheckCircle, 
  FaTruck, 
  FaBox, 
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaRoute
} from 'react-icons/fa';

const TrackingResult = ({ data }) => {
  if (!data) return null;

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('giao thành công') || statusLower.includes('hoàn thành')) {
      return 'bg-green-500';
    }
    if (statusLower.includes('đang giao') || statusLower.includes('vận chuyển')) {
      return 'bg-blue-500';
    }
    if (statusLower.includes('chờ') || statusLower.includes('pending')) {
      return 'bg-yellow-500';
    }
    if (statusLower.includes('huỷ') || statusLower.includes('thất bại')) {
      return 'bg-red-500';
    }
    return 'bg-gray-500';
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('giao thành công') || statusLower.includes('hoàn thành')) {
      return FaCheckCircle;
    }
    if (statusLower.includes('đang giao') || statusLower.includes('vận chuyển')) {
      return FaTruck;
    }
    return FaBox;
  };

  const StatusIcon = getStatusIcon(data.status);

  return (
    <div className="max-w-4xl mx-auto mt-8 animate-fadeIn">
      {/* Card chính */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Mã vận đơn</p>
              <h2 className="text-2xl font-bold text-white">{data.tracking_number}</h2>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              <StatusIcon className="text-white text-3xl" />
            </div>
          </div>
        </div>

        {/* Thông tin trạng thái hiện tại */}
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Trạng thái */}
            <div className="flex items-start space-x-3">
              <div className={`${getStatusColor(data.status)} rounded-full p-2 mt-1`}>
                <FaBox className="text-white text-sm" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Trạng thái</p>
                <p className="text-sm font-semibold text-gray-900">{data.status}</p>
              </div>
            </div>

            {/* Vị trí hiện tại */}
            <div className="flex items-start space-x-3">
              <div className="bg-purple-500 rounded-full p-2 mt-1">
                <FaMapMarkerAlt className="text-white text-sm" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Vị trí hiện tại</p>
                <p className="text-sm font-semibold text-gray-900">{data.current_location}</p>
              </div>
            </div>

            {/* Ngày giao dự kiến */}
            <div className="flex items-start space-x-3">
              <div className="bg-orange-500 rounded-full p-2 mt-1">
                <FaCalendarAlt className="text-white text-sm" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Giao hàng dự kiến</p>
                <p className="text-sm font-semibold text-gray-900">
                  {data.estimated_delivery || 'Chưa xác định'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lịch sử tracking */}
        <div className="px-6 py-6">
          <div className="flex items-center space-x-2 mb-6">
            <FaRoute className="text-blue-600 text-xl" />
            <h3 className="text-lg font-bold text-gray-900">Lịch sử vận chuyển</h3>
          </div>

          {data.history && data.history.length > 0 ? (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              {/* Timeline items */}
              <div className="space-y-6">
                {data.history.map((item, index) => (
                  <div key={index} className="relative flex items-start space-x-4">
                    {/* Timeline dot */}
                    <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                      index === 0 
                        ? 'bg-blue-600 ring-4 ring-blue-100' 
                        : 'bg-gray-400'
                    }`}>
                      {index === 0 ? (
                        <FaTruck className="text-white text-sm" />
                      ) : (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className={`flex-1 pb-8 ${
                      index === 0 
                        ? 'bg-blue-50 rounded-lg p-4 -ml-2' 
                        : 'pt-1'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`font-semibold ${
                            index === 0 ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {item.status}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <FaMapMarkerAlt className={`${
                              index === 0 ? 'text-blue-600' : 'text-gray-400'
                            } text-xs`} />
                            <p className={`text-sm ${
                              index === 0 ? 'text-blue-700' : 'text-gray-600'
                            }`}>
                              {item.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <FaClock className="text-xs" />
                          <span>{item.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FaBox className="mx-auto text-4xl mb-3 text-gray-300" />
              <p>Chưa có lịch sử vận chuyển</p>
            </div>
          )}
        </div>
      </div>

      {/* Info box */}
      <div className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-600 rounded-full p-2 mt-0.5">
            <FaTruck className="text-white text-sm" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-900 mb-1">
              Theo dõi đơn hàng của bạn
            </p>
            <p className="text-xs text-blue-700">
              Thông tin được cập nhật tự động. Vui lòng liên hệ hotline nếu cần hỗ trợ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingResult;