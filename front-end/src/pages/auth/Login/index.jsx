import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../Layout/AuthLayout";
import AuthHeader from "../Layout/AuthHeader";
import InputField from "../../../components/common/InputField";
import SubmitButton from "../../../components/common/SubmitButton";
import { useAuthForm } from "../hooks/useAuthForm";
import { loginAPI } from "../../../api/auth/request";
import DynamicDialog from "../../../components/UI/DynamicDialog";

const LoginPage = () => {
  const form = useAuthForm("login");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loginUser, setLoginUser] = useState(null);

  const handleLogin = async () => {
    try {
      const res = await loginAPI({
        email: form.values.email,
        password: form.values.password,
      });

      // lưu user (nếu cần)
      localStorage.setItem("user", JSON.stringify(res.user));

      // mở dialog xác nhận
      setLoginUser(res.user);
      setDialogOpen(true);
    } catch (err) {
      alert(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <>
      <AuthLayout>
        <AuthHeader
          title="CourierHub"
          subtitle="Đăng nhập để quản lý đơn hàng"
        />

        <div className="p-8 space-y-6">
          {/* EMAIL */}
          <InputField
            label="Email"
            icon={FaEnvelope}
            value={form.values.email}
            onChange={(e) => form.setField("email", e.target.value)}
            placeholder="example@courier.com"
            error={form.errors.email}
          />

          {/* PASSWORD */}
          <InputField
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            icon={FaLock}
            value={form.values.password}
            onChange={(e) => form.setField("password", e.target.value)}
            placeholder="Nhập mật khẩu"
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

          {/* FORGOT */}
          <div className="flex justify-end text-sm">
            <a href="#forgot" className="text-blue-600 font-semibold">
              Quên mật khẩu?
            </a>
          </div>

          {/* SUBMIT */}
          <SubmitButton
            loading={form.loading}
            onClick={() => form.submit(handleLogin)}
          >
            Đăng nhập
          </SubmitButton>
        </div>
      </AuthLayout>

      {/* DIALOG CONFIRM */}
      <DynamicDialog
        open={dialogOpen}
        mode="success"
        title="Đăng nhập thành công"
        message={`Xin chào ${loginUser?.email}`}
        closeText="Vào trang chủ"
        onClose={() => {
          setDialogOpen(false);
          navigate("/");
        }}
      />
    </>
  );
};

export default LoginPage;
