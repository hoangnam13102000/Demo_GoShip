import { Bar } from "react-chartjs-2";
import { FaChartBar } from "react-icons/fa";

const formatCurrency = (num) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);

const RevenueChart = ({ 
  labels = [], 
  values = [], 
  isLoading = false,
  title = "Doanh thu",
  height = "350px"
}) => {
  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow border">
      <div className="flex items-center gap-2 mb-4">
        <FaChartBar className="text-blue-600 text-xl sm:text-2xl" />
        <h2 className="text-lg sm:text-xl font-bold">{title}</h2>
      </div>
      {isLoading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : (
        <div style={{ height }}>
          <Bar
            data={{
              labels,
              datasets: [
                {
                  label: "Doanh thu (VNĐ)",
                  data: values,
                  backgroundColor: "rgba(59,130,246,0.8)",
                  borderRadius: 6,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" },
                tooltip: {
                  callbacks: {
                    label: (ctx) => formatCurrency(ctx.parsed.y),
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (v) => `${(v / 1000000).toFixed(0)} Tr`,
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default RevenueChart;