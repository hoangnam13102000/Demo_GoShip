import SummaryCard from '../../../../components/common/Cards/SummaryCard';
import { FaUser, FaBox, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';

const SummaryStep = ({ form, shipmentTypes, paymentMethods }) => {
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
        label: form.serviceName || 'Không xác định',
        fromHome: true,
      };
    }

    // Nếu không có dữ liệu từ home, sử dụng SHIPMENT_TYPES cũ
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
      label: shipmentType?.label || 'Không xác định',
      fromHome: false,
    };
  };

  const costBreakdown = calculateCostBreakdown();

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
            <span className="text-gray-600">Loại dịch vụ:</span>{' '}
            <span className="font-semibold">{costBreakdown.label}</span>
          </p>
          <p>
            <span className="text-gray-600">Cân nặng:</span>{' '}
            <span className="font-semibold">{costBreakdown.weight}kg</span>
          </p>
          <p>
            <span className="text-gray-600">Kích thước:</span>{' '}
            <span className="font-semibold">
              {form.package.length || '?'} × {form.package.width || '?'} ×{' '}
              {form.package.height || '?'} cm
            </span>
          </p>
          <p>
            <span className="text-gray-600">Mô tả:</span>{' '}
            <span className="font-semibold">{form.package.description}</span>
          </p>
          {costBreakdown.fromHome && (
            <p className="text-xs text-blue-600 italic pt-2">
              ℹ️ Sử dụng dữ liệu dịch vụ từ trang chủ
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
          <FaMoneyBillWave className="text-blue-600" /> Phương thức thanh toán
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {paymentMethods.map((m) => {
            const PaymentIcon = m.icon;
            return (
              <div
                key={m.id}
                className={`p-4 border-2 rounded-lg text-center ${
                  form.payment === m.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <PaymentIcon className={`text-3xl ${m.color} mx-auto mb-2`} />
                <p className="text-sm font-semibold">{m.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FaMoneyBillWave className="text-amber-600" /> Tổng hợp chi phí
        </h3>
        <div className="space-y-3 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Phí cơ bản:</span>
            <span className="font-semibold">
              {costBreakdown.baseFee.toLocaleString('vi-VN')}₫
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">
              Phí cân nặng ({costBreakdown.weight}kg ×{' '}
              {costBreakdown.kgRate.toLocaleString('vi-VN')}₫):
            </span>
            <span className="font-semibold">
              {costBreakdown.weightFee.toLocaleString('vi-VN')}₫
            </span>
          </div>
          {costBreakdown.fragileFee > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Phí hàng dễ vỡ:</span>
              <span className="font-semibold">
                {costBreakdown.fragileFee.toLocaleString('vi-VN')}₫
              </span>
            </div>
          )}
          <div className="border-t border-blue-300 pt-3 flex justify-between text-lg">
            <span className="font-bold">Tổng cộng:</span>
            <span className="font-bold text-blue-600">
              {costBreakdown.total.toLocaleString('vi-VN')}₫
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStep;