import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../Layout/AuthLayout";
import AuthHeader from "../Layout/AuthHeader";
import InputField from "../../../components/common/InputField";
import SubmitButton from "../../../components/common/buttons/SubmitButton";
import DynamicDialog from "../../../components/UI/DynamicDialog";

import { useAuthForm } from "../hooks/useAuthForm";

const LoginPage = () => {
  const form = useAuthForm("login");
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogMode, setDialogMode] = useState("success");

  // ================= HANDLE LOGIN =================
  const handleLogin = async () => {
    try {
      // submit đã gọi loginAPI & lưu user + token
      await form.submit(() => {
        setDialogMessage("Đăng nhập thành công");
        setDialogMode("success");
        setDialogOpen(true);
      });
    } catch (err) {
      setDialogMessage("Đăng nhập thất bại");
      setDialogMode("error");
      setDialogOpen(true);
    }
  };

  // ================= HANDLE CLOSE DIALOG =================
  const handleCloseDialog = () => {
    setDialogOpen(false);

    if (dialogMode === "success") {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user?.role === "USER") {
        navigate("/");
      } else if (["ADMIN", "AGENT"].includes(user?.role)) {
        navigate("/admin");
      } else {
        navigate("/");
      }
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
          <InputField
            label="Email"
            icon={FaEnvelope}
            value={form.values.email}
            onChange={(e) => form.setField("email", e.target.value)}
            placeholder="example@courier.com"
            error={form.errors.email}
            remember
            suggestions={form.emailSuggestions}
            onSelectSuggestion={(email) => form.setField("email", email)}
          />

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

          <div className="flex justify-end text-sm">
            <a href="#forgot" className="text-blue-600 font-semibold">
              Quên mật khẩu?
            </a>
          </div>

          <SubmitButton
            loading={form.loading}
            onClick={handleLogin}
          >
            Đăng nhập
          </SubmitButton>
        </div>
      </AuthLayout>

      <DynamicDialog
        open={dialogOpen}
        mode={dialogMode}
        title={
          dialogMode === "success"
            ? "Đăng nhập thành công"
            : "Lỗi đăng nhập"
        }
        message={dialogMessage}
        closeText="Tiếp tục"
        onClose={handleCloseDialog}
      />
    </>
  );
};

export default LoginPage;
