import SummaryCard from "../../../../components/common/Cards/SummaryCard";
import { FaUser, FaBox, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";

const SummaryStep = ({
  form,
  shipmentTypes,
  paymentMethods,
  onSelectPayment,
}) => {
  const calculateCostBreakdown = () => {
    if (form.basePrice && form.basePrice > 0) {
      const weight = parseFloat(form.package?.weight) || 0;
      const kgRate = 5000;
      const baseFee = form.basePrice;
      const weightFee = weight * kgRate;
      const fragileFee = form.package?.fragile ? 5000 : 0;
      const total = baseFee + weightFee + fragileFee;

      return {
        baseFee,
        weightFee,
        fragileFee,
        total,
        weight,
        kgRate,
        label: form.serviceName || "Không xác định",
      };
    }

    const shipmentType =
      shipmentTypes.find((t) => t.id === form.shipmentType) || null;

    const weight = parseFloat(form.package?.weight) || 0;
    const baseFee = shipmentType?.base || 0;
    const kgRate = shipmentType?.kg || 0;
    const weightFee = weight * kgRate;
    const fragileFee = form.package?.fragile ? 5000 : 0;
    const total = baseFee + weightFee + fragileFee;

    return {
      baseFee,
      weightFee,
      fragileFee,
      total,
      weight,
      kgRate,
      label: shipmentType?.label || "Không xác định",
    };
  };

  const cost = calculateCostBreakdown();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <FaCheckCircle className="text-blue-600" /> Xác nhận đơn hàng
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SummaryCard title="Người gửi" icon={FaUser} data={form.sender} />
        <SummaryCard title="Người nhận" icon={FaUser} data={form.receiver} />
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <FaBox className="text-blue-600" /> Thông tin hàng
        </h3>
        <div className="space-y-2 text-sm">
          <p>
            <span className="text-gray-600">Loại dịch vụ:</span>{" "}
            <span className="font-semibold">{cost.label}</span>
          </p>
          <p>
            <span className="text-gray-600">Cân nặng:</span>{" "}
            <span className="font-semibold">{cost.weight}kg</span>
          </p>
          <p>
            <span className="text-gray-600">Kích thước:</span>{" "}
            <span className="font-semibold">
              {form.package.length || "?"} × {form.package.width || "?"} ×{" "}
              {form.package.height || "?"} cm
            </span>
          </p>
        </div>
      </div>

      {/* PAYMENT */}
      <div>
        <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
          <FaMoneyBillWave className="text-blue-600" /> Phương thức thanh toán
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {paymentMethods.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                onClick={() => {
                  console.log("💳 SELECT PAYMENT:", m.id);
                  onSelectPayment(m.id);
                }}
                className={`p-4 border-2 rounded-lg text-center cursor-pointer transition
                  ${
                    form.payment === m.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-400"
                  }`}
              >
                <Icon className={`text-3xl ${m.color} mx-auto mb-2`} />
                <p className="text-sm font-semibold">{m.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* COST */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border">
        <h3 className="font-bold mb-4">Tổng chi phí</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Phí cơ bản</span>
            <span>{cost.baseFee.toLocaleString()}₫</span>
          </div>
          <div className="flex justify-between">
            <span>
              Cân nặng ({cost.weight}kg × {cost.kgRate.toLocaleString()}₫)
            </span>
            <span>{cost.weightFee.toLocaleString()}₫</span>
          </div>
          {cost.fragileFee > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Hàng dễ vỡ</span>
              <span>{cost.fragileFee.toLocaleString()}₫</span>
            </div>
          )}
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Tổng cộng</span>
            <span className="text-blue-600">
              {cost.total.toLocaleString()}₫
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStep;
