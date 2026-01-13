import React from "react";

export const QuickMetrics = ({ metrics = [] }) => {
  const defaultMetrics = [
    {
      title: "Hiệu suất hệ thống",
      icon: "📈",
      color: "from-blue-500 to-blue-600",
      value: "98.5%",
      label: "Tỷ lệ hoàn thành",
      progress: 98.5,
    },
    {
      title: "Hài lòng khách hàng",
      icon: "😊",
      color: "from-green-500 to-emerald-600",
      value: "4.8/5",
      label: "Đánh giá trung bình",
      stars: 5,
    },
    {
      title: "Thời gian xử lý",
      icon: "⚡",
      color: "from-purple-500 to-purple-600",
      value: "2.4h",
      label: "Trung bình/đơn",
      description: "Giảm 15% so với tháng trước",
    },
  ];

  const displayMetrics = metrics.length > 0 ? metrics : defaultMetrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {displayMetrics.map((metric, index) => (
        <div 
          key={index} 
          className={`bg-gradient-to-r ${metric.color} rounded-2xl shadow-lg p-6 text-white`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{metric.title}</h3>
            <div className="text-2xl">{metric.icon}</div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-${metric.color.split(' ')[0].split('-')[1]}-100`}>
                {metric.label}
              </span>
              <span className="text-xl font-bold">{metric.value}</span>
            </div>
            
            {metric.progress !== undefined && (
              <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full" 
                  style={{ width: `${metric.progress}%` }}
                ></div>
              </div>
            )}
            
            {metric.stars !== undefined && (
              <div className="flex items-center gap-1">
                {[...Array(metric.stars)].map((_, i) => (
                  <div key={i} className="w-6 h-6 text-yellow-300">★</div>
                ))}
              </div>
            )}
            
            {metric.description && (
              <div className="text-sm opacity-90">
                {metric.description}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
export default QuickMetrics;