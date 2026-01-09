import { useState } from "react";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";

const STEPS = [
  "Người gửi",
  "Người nhận",
  "Thông tin hàng",
  "Xác nhận & thanh toán",
];

const CreateShipmentPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const shipmentType = params.get("type") || "PACKAGE";

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [successTracking, setSuccessTracking] = useState(null);

  const [form, setForm] = useState({
    sender: {
      name: "",
      phone: "",
      address: "",
      city: "",
    },
    receiver: {
      name: "",
      phone: "",
      address: "",
      city: "",
    },
    package: {
      weight: "",
      note: "",
      shipment_type: shipmentType,
    },
    pricing: null,
    payment_method: "CASH",
  });

  /* ================= HANDLERS ================= */

  const updateField = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  /* ================= API MOCK (REPLACE REAL API) ================= */

  const calculateFee = async () => {
    setLoading(true);
    // MOCK backend calculate
    await new Promise((r) => setTimeout(r, 600));
    setForm((prev) => ({
      ...prev,
      pricing: {
        base_amount: 15000,
        weight_fee: Number(prev.package.weight || 0) * 3000,
        tax: 2000,
        total_amount:
          15000 + Number(prev.package.weight || 0) * 3000 + 2000,
        expected_delivery_date: "2026-01-12",
      },
    }));
    setLoading(false);
    nextStep();
  };

  const submitShipment = async () => {
    setLoading(true);
    // MOCK create shipment
    await new Promise((r) => setTimeout(r, 800));
    setSuccessTracking("VDL" + Math.floor(Math.random() * 1_000_000_000));
    setLoading(false);
  };

  /* ================= UI ================= */

  if (successTracking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">
            Tạo đơn hàng thành công
          </h2>
          <p className="text-gray-600 mb-4">
            Mã vận đơn của bạn:
          </p>
          <div className="text-xl font-mono font-bold mb-6">
            {successTracking}
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border p-6">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Tạo đơn vận chuyển</h1>
            <p className="text-gray-500 text-sm">
              Dịch vụ: {shipmentType}
            </p>
          </div>
        </div>

        {/* STEPPER */}
        <div className="flex justify-between mb-8">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`text-sm font-medium ${
                i === step
                  ? "text-blue-600"
                  : i < step
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              {i + 1}. {s}
            </div>
          ))}
        </div>

        {/* STEP CONTENT */}

        {/* STEP 1 – SENDER */}
        {step === 0 && (
          <div className="space-y-4">
            <input
              placeholder="Tên người gửi"
              className="input"
              value={form.sender.name}
              onChange={(e) =>
                updateField("sender", "name", e.target.value)
              }
            />
            <input
              placeholder="Số điện thoại"
              className="input"
              value={form.sender.phone}
              onChange={(e) =>
                updateField("sender", "phone", e.target.value)
              }
            />
            <input
              placeholder="Địa chỉ"
              className="input"
              value={form.sender.address}
              onChange={(e) =>
                updateField("sender", "address", e.target.value)
              }
            />
            <input
              placeholder="Tỉnh / Thành phố"
              className="input"
              value={form.sender.city}
              onChange={(e) =>
                updateField("sender", "city", e.target.value)
              }
            />
            <button onClick={nextStep} className="btn-primary">
              Tiếp tục
            </button>
          </div>
        )}

        {/* STEP 2 – RECEIVER */}
        {step === 1 && (
          <div className="space-y-4">
            <input
              placeholder="Tên người nhận"
              className="input"
              value={form.receiver.name}
              onChange={(e) =>
                updateField("receiver", "name", e.target.value)
              }
            />
            <input
              placeholder="Số điện thoại"
              className="input"
              value={form.receiver.phone}
              onChange={(e) =>
                updateField("receiver", "phone", e.target.value)
              }
            />
            <input
              placeholder="Địa chỉ"
              className="input"
              value={form.receiver.address}
              onChange={(e) =>
                updateField("receiver", "address", e.target.value)
              }
            />
            <input
              placeholder="Tỉnh / Thành phố"
              className="input"
              value={form.receiver.city}
              onChange={(e) =>
                updateField("receiver", "city", e.target.value)
              }
            />
            <div className="flex justify-between">
              <button onClick={prevStep}>Quay lại</button>
              <button onClick={nextStep} className="btn-primary">
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 – PACKAGE */}
        {step === 2 && (
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Trọng lượng (kg)"
              className="input"
              value={form.package.weight}
              onChange={(e) =>
                updateField("package", "weight", e.target.value)
              }
            />
            <textarea
              placeholder="Ghi chú (không bắt buộc)"
              className="input"
              value={form.package.note}
              onChange={(e) =>
                updateField("package", "note", e.target.value)
              }
            />
            <div className="flex justify-between">
              <button onClick={prevStep}>Quay lại</button>
              <button
                onClick={calculateFee}
                className="btn-primary"
                disabled={loading}
              >
                {loading ? "Đang tính phí..." : "Tính phí"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 – CONFIRM */}
        {step === 3 && form.pricing && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p>Phí cơ bản: {form.pricing.base_amount}đ</p>
              <p>Phí cân nặng: {form.pricing.weight_fee}đ</p>
              <p>Thuế: {form.pricing.tax}đ</p>
              <p className="font-bold">
                Tổng: {form.pricing.total_amount}đ
              </p>
            </div>

            <select
              className="input"
              value={form.payment_method}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  payment_method: e.target.value,
                }))
              }
            >
              <option value="CASH">Thanh toán khi nhận</option>
              <option value="MOMO">MoMo</option>
              <option value="VNPAY">VNPay</option>
            </select>

            <div className="flex justify-between">
              <button onClick={prevStep}>Quay lại</button>
              <button
                onClick={submitShipment}
                className="btn-primary"
                disabled={loading}
              >
                {loading ? "Đang tạo đơn..." : "Xác nhận"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TAILWIND SHORTCUT */}
      <style>{`
        .input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        .btn-primary {
          background: #2563eb;
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default CreateShipmentPage;
