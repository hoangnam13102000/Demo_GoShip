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
} from "react-icons/fa";
import { FaWallet } from "react-icons/fa";
import { useCRUDApi } from "../../../api/hooks/useCRUDApi";
import axios from "../../../api/axios";

const CreateShipmentPage = () => {
  const location = useLocation();
  const serviceFromHome = location.state || null;

  const { profile, loading: profileLoading, error: profileError } =
    useProfileApi();

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    shipmentType: serviceFromHome?.service_code || "DOCUMENT",
    serviceName: serviceFromHome?.service_name || "",
    basePrice: serviceFromHome?.base_price || 0,
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

  /* ================= AUTO FILL PROFILE ================= */
  useEffect(() => {
    if (profile && profile.role !== "ADMIN") {
      setForm((p) => ({
        ...p,
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

  /* ================= FROM HOME ================= */
  useEffect(() => {
    if (!serviceFromHome) return;

    setForm((p) => ({
      ...p,
      shipmentType: serviceFromHome.service_code,
      serviceName: serviceFromHome.service_name,
      basePrice: serviceFromHome.base_price,
      package: {
        ...p.package,
        weight: p.package.weight || 1,
      },
    }));
  }, [serviceFromHome]);

  /* ================= CONSTANTS ================= */
  const STEPS = [
    { label: "Người gửi", icon: FaUser },
    { label: "Người nhận", icon: FaUser },
    { label: "Thông tin hàng", icon: FaBox },
    { label: "Xác nhận", icon: FaExclamationCircle },
  ];

  const SHIPMENT_TYPES = [
    { id: "DOCUMENT", label: "Tài liệu", base: 10000, kg: 5000 },
    { id: "PACKAGE", label: "Hàng hóa", base: 20000, kg: 8000 },
    { id: "EXPRESS", label: "Hỏa tốc", base: 30000, kg: 12000 },
  ];

  const PAYMENT_METHODS = [
    { id: "CASH", label: "Tiền mặt", icon: FaMoneyBillWave },
    { id: "MOMO", label: "Ví MoMo", icon: FaWallet },
    { id: "PAYPAL", label: "Thẻ tín dụng", icon: FaCreditCard },
  ];

  /* ================= API ================= */
  const { useCreate } = useCRUDApi("shipments");
  const createMutation = useCreate();

  /* ================= HELPERS ================= */
  const validateStep = (cur) => {
    const e = FieldValidator.validateStep(cur, form);
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handlePrev = () => {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  };

  const updateForm = (section, field, value) => {
    setForm((p) => ({
      ...p,
      [section]: { ...p[section], [field]: value },
    }));
  };

  const calculateFee = () => {
    const weight = Number(form.package.weight || 0);
    const fragile = form.package.fragile ? 5000 : 0;

    if (serviceFromHome?.base_price) {
      return form.basePrice + weight * 5000 + fragile;
    }

    const s = SHIPMENT_TYPES.find((t) => t.id === form.shipmentType);
    if (!s) return 0;

    return s.base + weight * s.kg + fragile;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    if (!validateStep(3)) return;

    const payload = {
      customer_id: profile?.customer_id,
      current_branch_id: profile?.branch_id || 1,
      current_status_id: 1,

      sender_name: form.sender.full_name,
      sender_phone: form.sender.phone,
      sender_address: form.sender.address,
      sender_city: form.sender.city,

      receiver_name: form.receiver.full_name,
      receiver_phone: form.receiver.phone,
      receiver_address: form.receiver.address,
      receiver_city: form.receiver.city,

      shipment_service_code: form.shipmentType,
      weight: Number(form.package.weight || 1),
      charge: calculateFee(),
      payment_method: form.payment,
    };

    createMutation.mutate(payload, {
      onSuccess: async (res) => {
        // CASH → done
        if (form.payment !== "MOMO") {
          setSuccess({
            tracking: res.tracking_number,
            fee: res.charge,
            paymentMethod: form.payment,
          });
          return;
        }

        // MOMO → call create-payment
        try {
          const momoRes = await axios.post("/momo/create", {
            bill_id: res.bill_id,
          });

          window.location.href = momoRes.data.pay_url;
        } catch (e) {
          setErrors({ submit: "Không tạo được link MoMo" });
        }
      },
      onError: (err) => {
        setErrors({
          submit:
            err?.response?.data?.message ||
            "Tạo đơn thất bại. Vui lòng thử lại.",
        });
      },
    });
  };

  /* ================= SUCCESS ================= */
  if (success) {
    return (
      <SuccessScreen
        tracking={success.tracking}
        fee={success.fee}
        paymentMethod={success.paymentMethod}
      />
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gray-200 rounded-lg"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold">Tạo đơn vận chuyển</h1>
        </div>

        <Stepper steps={STEPS} currentStep={step} />

        <div className="bg-white rounded-xl shadow p-6">
          {profileLoading && <p>Đang tải thông tin…</p>}
          {profileError && <p className="text-red-600">{profileError}</p>}

          {errors.submit && (
            <div className="mb-4 text-red-600 flex gap-2">
              <FaExclamationCircle />
              <span>{errors.submit}</span>
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
              onSelectPayment={(m) =>
                setForm((p) => ({ ...p, payment: m }))
              }
            />
          )}

          <div className="flex gap-4 mt-6">
            <PrevButton onClick={handlePrev} disabled={step === 0} />
            <NextButton
              onClick={step === 3 ? handleSubmit : handleNext}
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
