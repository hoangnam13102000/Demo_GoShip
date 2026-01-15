import InputField from '../../../../components/common/InputField';
import { FaBox, FaTruck, FaClock, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

const PackageInfo = ({ form, errors, updateForm, shipmentTypes }) => {
  // Kiểm tra nếu service được chọn từ home
  const isServiceFromHome = form.basePrice && form.basePrice > 0;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <FaBox className="text-blue-600" /> Thông tin hàng hóa
      </h2>

      {/* Hiển thị service từ home nếu có */}
      {isServiceFromHome && (
        <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FaCheckCircle className="text-blue-600 text-lg mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-blue-900">Dịch vụ đã chọn từ trang chủ</p>
              <p className="text-sm text-blue-800 mt-1">{form.serviceName}</p>
              <p className="text-xs text-blue-700 mt-2">
                Phí cơ bản: <span className="font-bold">{form.basePrice.toLocaleString('vi-VN')}₫</span>
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold mb-3">
          Chọn loại dịch vụ *
          {isServiceFromHome && (
            <span className="text-xs text-gray-500 font-normal ml-2">(hoặc chọn khác nếu muốn thay đổi)</span>
          )}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {shipmentTypes.map((t) => (
            <label
              key={t.id}
              className={`cursor-pointer p-4 border-2 rounded-lg transition ${
                form.shipmentType === t.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <input
                type="radio"
                name="type"
                value={t.id}
                checked={form.shipmentType === t.id}
                onChange={(e) => {
                  updateForm('', 'shipmentType', e.target.value);
                  // Reset service data khi chọn service khác
                  updateForm('', 'serviceName', '');
                  updateForm('', 'basePrice', 0);
                }}
                className="sr-only"
              />
              <FaTruck className="text-3xl text-blue-600 mb-2" />
              <p className="font-semibold text-sm">{t.label}</p>
              <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                <FaClock className="text-gray-500" /> {t.time}
              </p>
              <p className="text-xs font-bold text-blue-600 mt-2">
                {t.base.toLocaleString('vi-VN')}₫ + {t.kg.toLocaleString('vi-VN')}₫/kg
              </p>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          type="number"
          step="0.1"
          min="0"
          label="Cân nặng (kg) *"
          value={form.package.weight}
          onChange={(v) => updateForm('package', 'weight', v)}
          error={errors.packageWeight}
        />
        <InputField
          type="number"
          step="0.1"
          min="0"
          label="Chiều dài (cm)"
          value={form.package.length}
          onChange={(v) => updateForm('package', 'length', v)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          type="number"
          step="0.1"
          min="0"
          label="Chiều rộng (cm)"
          value={form.package.width}
          onChange={(v) => updateForm('package', 'width', v)}
        />
        <InputField
          type="number"
          step="0.1"
          min="0"
          label="Chiều cao (cm)"
          value={form.package.height}
          onChange={(v) => updateForm('package', 'height', v)}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Mô tả hàng *</label>
        <textarea
          value={form.package.description}
          onChange={(e) => updateForm('package', 'description', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition resize-none ${
            errors.description
              ? 'border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:ring-blue-200'
          }`}
          rows="3"
          placeholder="Mô tả chi tiết sản phẩm (ví dụ: Sách, Quần áo, Điện tử...)"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <FaExclamationCircle /> {errors.description}
          </p>
        )}
      </div>

      <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition">
        <input
          type="checkbox"
          checked={form.package.fragile}
          onChange={(e) => updateForm('package', 'fragile', e.target.checked)}
          className="w-5 h-5 text-red-600 rounded"
        />
        <span className="font-semibold">Hàng dễ vỡ (phí +5.000₫)</span>
      </label>

      {/* Info box về tính phí */}
      {isServiceFromHome && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          <p className="font-semibold flex items-center gap-2 mb-2">
            <FaExclamationCircle /> Lưu ý tính phí
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Phí cơ bản: {form.basePrice.toLocaleString('vi-VN')}₫</li>
            <li>Phí cân nặng: Cân nặng (kg) × 5.000₫/kg</li>
            <li>Phí hàng dễ vỡ: +5.000₫ (nếu chọn)</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PackageInfo;