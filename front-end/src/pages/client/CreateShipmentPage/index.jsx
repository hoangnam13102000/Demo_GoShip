import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useProfileApi } from "../../../api/hooks/useProfileApi";
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
import { useCRUDApi } from "../../../api/hooks/useCRUDApi";

const CreateShipmentPage = () => {
  const location = useLocation();
  const serviceFromHome = location.state || null;

  const {
    profile,
    loading: profileLoading,
    error: profileError,
  } = useProfileApi();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    shipmentType: "STANDARD",
    sender: {
      full_name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      postcode: "",
    },
    receiver: {
      full_name: "",
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

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);

  // ================= AUTO FILL PROFILE =================
  useEffect(() => {
    if (profile && profile.role !== "ADMIN") {
      setForm((prev) => ({
        ...prev,
        sender: {
          full_name: profile.full_name || "",
          phone: profile.phone || "",
          email: profile.email || "",
          address: profile.address || "",
          city: profile.city || "",
          postcode: profile.postcode || "",
        },
      }));
    }
  }, [profile]);

  // ================= FROM HOME PAGE =================
  useEffect(() => {
    if (!serviceFromHome) return;

    setForm((prev) => ({
      ...prev,
      package: {
        ...prev.package,
        weight: prev.package.weight || 1,
      },
    }));
  }, [serviceFromHome]);

  // ================= CONSTANTS =================
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

  // ================= API =================
  const { useCreate } = useCRUDApi("shipments");
  const createMutation = useCreate();

  // ================= HELPERS =================
  const validateStep = (cur) => {
    const n = FieldValidator.validateStep(cur, form);
    setErrors(n);
    return Object.keys(n).length === 0;
  };

  const handleNext = () => validateStep(step) && setStep(step + 1);
  const handlePrev = () => setStep((s) => Math.max(0, s - 1));

  const updateForm = (section, field, value) => {
    setForm((p) => ({
      ...p,
      [section]: { ...p[section], [field]: value },
    }));

    const key = section + field.charAt(0).toUpperCase() + field.slice(1);
    if (errors[key]) {
      setErrors((p) => {
        const copy = { ...p };
        delete copy[key];
        return copy;
      });
    }
  };

  const calculateFee = () => {
    const s = SHIPMENT_TYPES.find((t) => t.id === form.shipmentType);
    if (!s) return 0;
    const weight = parseFloat(form.package.weight) || 0;
    const fragile = form.package.fragile ? 5000 : 0;
    return s.base + weight * s.kg + fragile;
  };

  // ================= SUBMIT =================
  const handleSubmit = () => {
    if (!validateStep(3)) return;

    const payload = {
      customer_id: profile?.customer_id,
      current_status_id: 1,

      sender_name: form.sender.full_name,
      sender_phone: form.sender.phone,
      sender_address: form.sender.address,
      sender_city: form.sender.city,

      receiver_name: form.receiver.full_name,
      receiver_phone: form.receiver.phone,
      receiver_address: form.receiver.address,
      receiver_city: form.receiver.city,

      shipment_service_code: serviceFromHome?.service_code || form.shipmentType,

      weight: Number(form.package.weight || 1),
      charge: calculateFee(),

      agent_id: null,
      branch_id: null,
      expected_delivery_date: null,

      updated_by: profile?.id,
    };

    console.group(" CREATE SHIPMENT PAYLOAD");
    console.log("payload =", payload);
    console.log("serviceFromHome =", serviceFromHome);
    console.log("shipment_service_code =", payload.shipment_service_code);
    console.log("profile =", profile);
    console.groupEnd();

    createMutation.mutate(payload, {
      onSuccess: (res) => {
        setSuccess({
          tracking: res.tracking_number,
          fee: res.charge,
        });
      },
      onError: (err) => {
        console.error("❌ CREATE SHIPMENT ERROR", err?.response?.data);
        setErrors({
          submit: "Tạo đơn thất bại. Vui lòng kiểm tra lại dữ liệu.",
        });
      },
    });
  };

  if (success) {
    return <SuccessScreen tracking={success.tracking} fee={success.fee} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
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

        <Stepper steps={STEPS} currentStep={step} />

        <div className="bg-white rounded-2xl shadow border p-6 sm:p-8">
          {profileLoading && <p>Đang tải thông tin người gửi…</p>}
          {profileError && <p className="text-red-600">{profileError}</p>}

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border rounded-lg flex gap-2">
              <FaExclamationCircle className="text-2xl text-red-600" />
              <p className="text-red-700 text-sm">{errors.submit}</p>
            </div>
          )}

          {step === 0 && (
            <SenderInfo form={form} errors={errors} updateForm={updateForm} />
          )}
          {step === 1 && (
            <ReceiverInfo form={form} errors={errors} updateForm={updateForm} />
          )}
          {step === 2 && (
            <PackageInfo
              form={form}
              errors={errors}
              updateForm={updateForm}
              shipmentTypes={SHIPMENT_TYPES}
            />
          )}
          {step === 3 && (
            <SummaryStep
              form={form}
              shipmentTypes={SHIPMENT_TYPES}
              paymentMethods={PAYMENT_METHODS}
            />
          )}

          <div className="flex gap-4 mt-8">
            <PrevButton
              onClick={handlePrev}
              disabled={step === 0 || createMutation.isPending}
            />
            <NextButton
              onClick={step === 3 ? handleSubmit : handleNext}
              loading={createMutation.isPending}
              label={step === 3 ? "Xác nhận & tạo đơn" : "Tiếp tục"}
              icon={step === 3 ? FaCheck : undefined}
              fullWidth
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateShipmentPage;
