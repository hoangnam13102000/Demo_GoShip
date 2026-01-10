import { useState, useEffect } from "react";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useCRUDApi } from "../../../api/hooks/useCRUDApi";

/* ================= CONSTANTS ================= */

const STEPS = [
  "Người gửi",
  "Người nhận",
  "Thông tin hàng",
  "Xác nhận & thanh toán",
];

/* ================= PAGE ================= */

const CreateShipmentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const shipmentType = params.get("type") || null;
  const serviceInfo = location.state || null;

  /* ================= API ================= */

  const { useCreate } = useCRUDApi("shipments");
  const createShipmentMutation = useCreate();

  /* ================= GUARD ================= */

  useEffect(() => {
    if (!shipmentType) {
      navigate("/", { replace: true });
    }
  }, [shipmentType, navigate]);

  /* ================= STATE ================= */

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [successTracking, setSuccessTracking] = useState(null);
  const [error, setError] = useState(null);

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

  /* ================= HELPERS ================= */

  const updateField = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const nextStep = () =>
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () =>
    setStep((s) => Math.max(s - 1, 0));

  /* ================= CALCULATE FEE (GIỮ HÀM – ĐỔI NỘI DUNG) ================= */

  const calculateFee = async () => {
    try {
      setLoading(true);
      setError(null);

      const weight = Number(form.package.weight) || 0;
      let base = 0;
      let perKg = 0;

      switch (form.package.shipment_type) {
        case "Standard":
          base = 10000;
          perKg = 5000;
          break;
        case "Express":
          base = 20000;
          perKg = 8000;
          break;
        case "SameDay":
          base = 30000;
          perKg = 12000;
          break;
        default:
          base = 0;
          perKg = 0;
      }

      const fee = base + weight * perKg;

      /* 🔴 GIỮ LOGIC CŨ: set pricing + nextStep */
      setForm((prev) => ({
        ...prev,
        pricing: {
          base_amount: base,
          weight_fee: weight * perKg,
          tax: 0,
          total_amount: fee,
        },
      }));

      nextStep();
    } catch (err) {
      setError("Không thể tính phí. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUBMIT SHIPMENT (RESOURCE STORE) ================= */

  const submitShipment = async () => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        tracking_code: `TRK${Date.now()}`,

        sender_name: form.sender.name,
        sender_address: form.sender.address,
        sender_phone: form.sender.phone,

        receiver_name: form.receiver.name,
        receiver_address: form.receiver.address,
        receiver_phone: form.receiver.phone,

        shipment_type: form.package.shipment_type,
        weight: Number(form.package.weight),
        fee: form.pricing.total_amount,

        status: "PLACED",
      };

      const res = await createShipmentMutation.mutateAsync(payload);

      setSuccessTracking(res.tracking_code);
    } catch (err) {
      setError("Tạo đơn thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUCCESS ================= */

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
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border p-6">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-bold">
              Tạo đơn vận chuyển
            </h1>
            <p className="text-gray-500 text-sm">
              Loại: {form.package.shipment_type}
            </p>
          </div>
        </div>

        {/* STEPPER */}
        <div className="flex justify-between mb-8">
          {STEPS.map((label, i) => (
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
              {i + 1}. {label}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border text-red-600 rounded">
            {error}
          </div>
        )}

        {/* STEP 1 */}
        {step === 0 && (
          <div className="space-y-4">
            <input className="input" placeholder="Tên người gửi"
              value={form.sender.name}
              onChange={(e) =>
                updateField("sender", "name", e.target.value)
              }
            />
            <input className="input" placeholder="Số điện thoại"
              value={form.sender.phone}
              onChange={(e) =>
                updateField("sender", "phone", e.target.value)
              }
            />
            <input className="input" placeholder="Địa chỉ"
              value={form.sender.address}
              onChange={(e) =>
                updateField("sender", "address", e.target.value)
              }
            />
            <input className="input" placeholder="Thành phố"
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

        {/* STEP 2 */}
        {step === 1 && (
          <div className="space-y-4">
            <input className="input" placeholder="Tên người nhận"
              value={form.receiver.name}
              onChange={(e) =>
                updateField("receiver", "name", e.target.value)
              }
            />
            <input className="input" placeholder="Số điện thoại"
              value={form.receiver.phone}
              onChange={(e) =>
                updateField("receiver", "phone", e.target.value)
              }
            />
            <input className="input" placeholder="Địa chỉ"
              value={form.receiver.address}
              onChange={(e) =>
                updateField("receiver", "address", e.target.value)
              }
            />
            <input className="input" placeholder="Thành phố"
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

        {/* STEP 3 */}
        {step === 2 && (
          <div className="space-y-4">
            <input
              type="number"
              className="input"
              placeholder="Trọng lượng (kg)"
              value={form.package.weight}
              onChange={(e) =>
                updateField("package", "weight", e.target.value)
              }
            />
            <textarea
              className="input"
              placeholder="Ghi chú"
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

        {/* STEP 4 */}
        {step === 3 && form.pricing && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded">
              <p>Phí cơ bản: {form.pricing.base_amount}đ</p>
              <p>Phí cân nặng: {form.pricing.weight_fee}đ</p>
              <p className="font-bold">
                Tổng: {form.pricing.total_amount}đ
              </p>
            </div>

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
    </div>
  );
};

export default CreateShipmentPage;
