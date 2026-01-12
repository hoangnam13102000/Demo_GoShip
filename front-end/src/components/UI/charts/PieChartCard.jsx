import { Pie } from "react-chartjs-2";
import { memo } from "react";

const pieColors = [
  "rgba(249,115,22,0.8)",
  "rgba(239,68,68,0.8)",
  "rgba(168,85,247,0.8)",
  "rgba(59,130,246,0.8)",
  "rgba(34,197,94,0.8)",
];

const PieChartCard = ({ 
  labels = [], 
  values = [], 
  isLoading = false,
  title = "Biểu đồ",
  icon: Icon = null,
  iconColor = "text-blue-600",
  height = "180px"
}) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className={`${iconColor} text-xl sm:text-2xl`} />}
        <h2 className="text-lg sm:text-xl font-bold">{title}</h2>
      </div>
      {isLoading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : (
        <div style={{ height }}>
          <Pie
            data={{
              labels,
              datasets: [
                {
                  label: "Số đơn hàng",
                  data: values,
                  backgroundColor: pieColors,
                  borderColor: pieColors.map((c) => c.replace("0.8", "1")),
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "right" },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default memo(PieChartCard);