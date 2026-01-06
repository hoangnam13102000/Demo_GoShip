import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import AuthLayout from "../Layout/AuthLayout";
import AuthHeader from "../Layout/AuthHeader";
import InputField from "../../../components/common/InputField";
import SubmitButton from "../../../components/common/buttons/SubmitButton";
import DynamicDialog from "../../../components/UI/DynamicDialog";
import { resetPasswordAPI } from "../../../api/auth/request";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp");
      return;
    }

    setLoading(true);
    try {
      await resetPasswordAPI({ email, token, password, password_confirmation: confirmPassword });
      setDialogOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthHeader title="CourierHub" subtitle="Đặt lại mật khẩu" />
      <div className="p-8 space-y-6">
        <InputField
          label="Mật khẩu mới"
          type={showPassword ? "text" : "password"}
          icon={FaLock}
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          placeholder="Nhập mật khẩu mới"
          rightElement={
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          }
        />

        <InputField
          label="Nhập lại mật khẩu"
          type={showConfirmPassword ? "text" : "password"}
          icon={FaLock}
          value={confirmPassword}
          onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
          placeholder="Nhập lại mật khẩu"
          rightElement={
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          }
          error={error}
        />

        <SubmitButton loading={loading} type="button" onClick={handleSubmit}>
          Đặt lại mật khẩu
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
        title="Đặt lại mật khẩu thành công!"
        message="Bạn có thể sử dụng mật khẩu mới để đăng nhập."
        onClose={() => { setDialogOpen(false); navigate("/dang-nhap"); }}
        onConfirm={() => { setDialogOpen(false); navigate("/dang-nhap"); }}
        confirmText="Đăng nhập"
      />
    </AuthLayout>
  );
};

export default ResetPasswordPage;
