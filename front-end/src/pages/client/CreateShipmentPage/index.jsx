import { useState } from "react";
import Stepper from "./components/Stepper";
import SenderInfo from "./components/SenderForm";
import ReceiverInfo from "./components/ReceiverInfo";
import PackageInfo from "./components/PackageInfo";
import SummaryStep from "./components/SummaryStep";
import SuccessScreen from "./components/SuccessScreen";
import PrevButton from "../../../components/common/buttons/PrevButton";
import NextButton from "../../../components/common/buttons/NextButton";
import { FieldValidator } from "../../../utils/hooks/validate";
import {
  FaArrowLeft,
  FaExclamationCircle,
  FaBox,
  FaUser,
  FaCheck,
  FaMoneyBillWave,
  FaCreditCard,
  FaUniversity,
} from "react-icons/fa";

const CreateShipmentPage = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState({});

  const STEPS = [
    { label: "Người gửi", icon: FaUser },
    { label: "Người nhận", icon: FaUser },
    { label: "Thông tin hàng", icon: FaBox },
    { label: "Xác nhận", icon: FaExclamationCircle },
  ];

  const SHIPMENT_TYPES = [
    {
      id: "STANDARD",
      label: "Tiêu chuẩn",
      time: "3-5 ngày",
      base: 10000,
      kg: 5000,
    },
    { id: "EXPRESS", label: "Nhanh", time: "1-2 ngày", base: 20000, kg: 8000 },
    {
      id: "SAME_DAY",
      label: "Cùng ngày",
      time: "4-6 giờ",
      base: 30000,
      kg: 12000,
    },
  ];

  const PAYMENT_METHODS = [
    {
      id: "CASH",
      label: "Tiền mặt",
      icon: FaMoneyBillWave,
      color: "text-green-600",
    },
    {
      id: "CARD",
      label: "Thẻ tín dụng",
      icon: FaCreditCard,
      color: "text-blue-600",
    },
    {
      id: "BANK",
      label: "Chuyển khoản",
      icon: FaUniversity,
      color: "text-purple-600",
    },
  ];

  const [form, setForm] = useState({
    shipmentType: "STANDARD",
    sender: {
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      postcode: "",
    },
    receiver: {
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      postcode: "",
    },
    package: {
      weight: "",
      length: "",
      width: "",
      height: "",
      description: "",
      fragile: false,
    },
    payment: "CASH",
  });

  const validateStep = (cur) => {
    const n = FieldValidator.validateStep(cur, form);
    setErrors(n);
    return Object.keys(n).length === 0;
  };

  const handleNext = () => {
    validateStep(step) && setStep(step + 1);
  };

  const handlePrev = () => setStep(Math.max(0, step - 1));

  const updateForm = (section, field, value) => {
    setForm((p) => ({ ...p, [section]: { ...p[section], [field]: value } }));
    const key = `${section}${field.charAt(0).toUpperCase() + field.slice(1)}`;
    errors[key] &&
      setErrors((p) => {
        delete p[key];
        return { ...p };
      });
  };

  const calculateFee = () => {
    const s = SHIPMENT_TYPES.find((t) => t.id === form.shipmentType);
    const fragile = form.package.fragile ? 5000 : 0;
    return s.base + (parseFloat(form.package.weight) || 0) * s.kg + fragile;
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setSuccess({
        tracking: `TRK${Date.now()}`,
        fee: calculateFee(),
      });
    } catch (e) {
      setErrors({ submit: "Tạo đơn thất bại. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <SuccessScreen tracking={success.tracking} fee={success.fee} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
          >
            <FaArrowLeft className="text-xl text-gray-700" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tạo đơn vận chuyển
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {SHIPMENT_TYPES.find((s) => s.id === form.shipmentType)?.label}
            </p>
          </div>
        </div>

        {/* Stepper Component */}
        <Stepper steps={STEPS} currentStep={step} />

        {/* Form */}
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 sm:p-8">
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2">
              <FaExclamationCircle className="text-2xl text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* STEP 0: Sender */}
          {step === 0 && (
            <SenderInfo form={form} errors={errors} updateForm={updateForm} />
          )}

          {/* STEP 1: Receiver */}
          {step === 1 && (
            <ReceiverInfo form={form} errors={errors} updateForm={updateForm} />
          )}

          {/* STEP 2: Package */}
          {step === 2 && (
            <PackageInfo
              form={form}
              errors={errors}
              updateForm={updateForm}
              shipmentTypes={SHIPMENT_TYPES}
            />
          )}

          {/* STEP 3: Summary */}
          {step === 3 && (
            <SummaryStep
              form={form}
              shipmentTypes={SHIPMENT_TYPES}
              paymentMethods={PAYMENT_METHODS}
            />
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <PrevButton onClick={handlePrev} disabled={step === 0 || loading} />
            <NextButton
              onClick={step === 3 ? handleSubmit : handleNext}
              disabled={loading}
              loading={loading}
              label={step === 3 ? "Xác nhận & tạo đơn" : "Tiếp tục"}
              loadingText={step === 3 ? "Đang tạo..." : "Đang xử lý..."}
              icon={step === 3 ? FaCheck : undefined}
              showRightIcon={step !== 3}
              variant="primary"
              size="md"
              fullWidth={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateShipmentPage;