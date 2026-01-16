import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DynamicDialog from "../../../../components/UI/DynamicDialog";

export default function MomoResult({ setCartItems }) {
  const navigate = useNavigate();
  const handledRef = useRef(false);

  const [dialog, setDialog] = useState({
    open: false,
    mode: "alert",
    title: "",
    message: "",
    onClose: null,
  });

  const apiBaseUrl = import.meta.env.VITE_API_URL;

  /* =======================
   * Helpers
   * ======================= */

  const openDialog = (mode, title, message, onClose) => {
    setDialog({
      open: true,
      mode,
      title,
      message,
      onClose: () => {
        setDialog((prev) => ({ ...prev, open: false }));
        onClose?.();
      },
    });
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCartItems?.([]);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const confirmMomoPayment = async (params) => {
    const res = await fetch(`${apiBaseUrl}/momo/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Xác nhận thanh toán thất bại");
    }

    return res.json();
  };

  /* =======================
   * Main Effect
   * ======================= */

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const query = new URLSearchParams(window.location.search);

    const resultCode = query.get("resultCode");
    const orderId    = query.get("orderId");
    const transId    = query.get("transId");
    const message    = query.get("message");

    /**
     * Validate URL
     */
    if (!orderId || resultCode === null) {
      openDialog(
        "error",
        "Truy cập không hợp lệ",
        "Thiếu thông tin kết quả thanh toán.",
        () => navigate("/tao-don-hang")
      );
      return;
    }

    /**
     * Người dùng hủy / thanh toán fail
     */
    if (resultCode !== "0") {
      openDialog(
        "warning",
        "Thanh toán không thành công",
        message || "Giao dịch đã bị hủy hoặc thất bại.",
        () => navigate("/tao-don-hang")
      );
      return;
    }

    /**
     * Thành công → confirm backend
     */
    (async () => {
      try {
        openDialog(
          "alert",
          "Đang xác nhận thanh toán",
          "Hệ thống đang xác nhận giao dịch. Vui lòng chờ..."
        );

        await confirmMomoPayment({
          orderId,
          transId,
          resultCode,
        });

        clearCart();

        openDialog(
          "success",
          "Thanh toán thành công 🎉",
          "Đơn hàng của bạn đã được thanh toán thành công.",
          () => navigate("/tao-don-hang")
        );
      } catch (err) {
        console.error(err);

        openDialog(
          "warning",
          "Đang xử lý",
          "Thanh toán đã hoàn tất trên MoMo nhưng hệ thống chưa cập nhật kịp. Vui lòng kiểm tra lại đơn hàng sau.",
          () => navigate("/tao-don-hang")
        );
      }
    })();
  }, [navigate]);

  /* =======================
   * Render
   * ======================= */

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600 text-lg">
        Đang xử lý kết quả thanh toán MoMo...
      </p>

      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onClose={dialog.onClose}
      />
    </div>
  );
}
