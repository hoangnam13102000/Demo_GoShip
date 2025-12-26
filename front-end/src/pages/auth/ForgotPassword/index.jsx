import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import AuthLayout from "../Layout/AuthLayout";
import AuthHeader from "../Layout/AuthHeader";
import InputField from "../../../components/common/InputField";
import SubmitButton from "../../../components/common/SubmitButton";
import DynamicDialog from "../../../components/UI/DynamicDialog";
import { useForgotPasswordForm } from "../hooks/useForgotPasswordForm";

const ForgotPasswordPage = () => {
  const form = useForgotPasswordForm();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSuccess = () => setDialogOpen(true);

  return (
    <AuthLayout>
      <AuthHeader title="CourierHub" subtitle="Quên mật khẩu" />
      <div className="p-8 space-y-6">
        <p className="text-gray-600 text-sm">
          Nhập email của bạn để nhận link đặt lại mật khẩu.
        </p>

        <InputField
          label="Email"
          icon={FaEnvelope}
          value={form.email}
          onChange={(e) => {
            form.setEmail(e.target.value);
            if (form.error) form.setError("");
          }}
          placeholder="example@courier.com"
          error={form.error}
        />

        <SubmitButton
          type="button"
          loading={form.loading}
          onClick={() => form.submit(handleSuccess)}
        >
          Gửi Email
        </SubmitButton>

        <p className="text-center text-sm text-gray-600 mt-4">
          Quay lại{" "}
          <Link to="/dang-nhap" className="text-blue-600 font-semibold">
            Đăng nhập
          </Link>
        </p>
      </div>

      <DynamicDialog
        open={dialogOpen}
        mode="success"
        title="Đã gửi email!"
        message="Kiểm tra hộp thư để đặt lại mật khẩu."
        onClose={() => setDialogOpen(false)}
        onConfirm={() => setDialogOpen(false)}
        confirmText="Đóng"
      />
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
