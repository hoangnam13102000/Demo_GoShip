import { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../Layout/AuthLayout";
import AuthHeader from "../Layout/AuthHeader";
import InputField from "../../../components/common/InputField";
import SubmitButton from "../../../components/common/buttons/SubmitButton";
import DynamicDialog from "../../../components/UI/DynamicDialog";
import { useAuthForm } from "../hooks/useAuthForm";

const RegisterPage = () => {
  const form = useAuthForm("register");
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSuccess = () => {
    setDialogOpen(true);
  };

  return (
    <AuthLayout>
      <AuthHeader title="CourierHub" subtitle="Tạo tài khoản mới" />

      <div className="p-8 space-y-6">
        {/* Email */}
        <InputField
          label="Email"
          icon={FaEnvelope}
          value={form.values.email}
          onChange={(val) => form.setField("email", val)} // ✅ nhận giá trị trực tiếp
          placeholder="example@courier.com"
          error={form.errors.email}
        />

        {/* Password */}
        <InputField
          label="Mật khẩu"
          type={showPassword ? "text" : "password"}
          icon={FaLock}
          value={form.values.password}
          onChange={(val) => form.setField("password", val)} // ✅ nhận giá trị trực tiếp
          placeholder="Tối thiểu 6 ký tự"
          error={form.errors.password}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          }
        />

        {/* Confirm Password */}
        <InputField
          label="Nhập lại mật khẩu"
          type={showConfirmPassword ? "text" : "password"}
          icon={FaLock}
          value={form.values.confirmPassword}
          onChange={(val) => form.setField("confirmPassword", val)} // ✅ nhận giá trị trực tiếp
          placeholder="Nhập lại mật khẩu"
          error={form.errors.confirmPassword}
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          }
        />

        {/* Submit */}
        <SubmitButton
          type="button"
          loading={form.loading}
          onClick={() => form.submit(handleSuccess)}
        >
          Đăng ký
        </SubmitButton>

        {/* Login link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Đã có tài khoản?{" "}
          <Link to="/dang-nhap" className="text-blue-600 font-semibold">
            Đăng nhập
          </Link>
        </p>
      </div>

      {/* DynamicDialog xác nhận thành công */}
      <DynamicDialog
        open={dialogOpen}
        mode="success"
        title="Đăng ký thành công!"
        message="Tài khoản của bạn đã được tạo. Nhấn Xác nhận để chuyển đến trang Home."
        onClose={() => {
          setDialogOpen(false);
          navigate("/");
        }}
        onConfirm={() => navigate("/")}
        confirmText="Xác nhận"
      />
    </AuthLayout>
  );
};

export default RegisterPage;
