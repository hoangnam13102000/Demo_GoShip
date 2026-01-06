import { useState } from "react";

const useHandleCRUD = ({
  createMutation,
  updateMutation,
  deleteMutation,
  resetForm,
}) => {
  const [successMessage, setSuccessMessage] = useState("");

  const [dialog, setDialog] = useState({
    open: false,
    mode: "alert",
    title: "",
    message: "",
    onConfirm: null,
  });

  // ================= SUBMIT =================
  const handleSubmit = async (event, editing, form) => {
    event.preventDefault();

    try {
      if (!editing) {
        if (!form.email.trim() || !form.password.trim()) {
          setDialog({
            open: true,
            mode: "warning",
            title: "Thiếu thông tin",
            message: "Vui lòng nhập đầy đủ email và mật khẩu.",
            onConfirm: null,
          });
          return;
        }

        await createMutation.mutateAsync({
          email: form.email.trim(),
          password: form.password.trim(),
          role: form.role,
          status: form.status,
        });

        setSuccessMessage("Tài khoản đã được tạo thành công!");
        setTimeout(resetForm, 1500);
      } else {
        await updateMutation.mutateAsync({
          id: editing.id,
          data: {
            role: form.role,
            status: form.status,
          },
        });

        setSuccessMessage("Tài khoản đã được cập nhật thành công!");
        setTimeout(resetForm, 1500);
      }
    } catch (error) {
      setDialog({
        open: true,
        mode: "error",
        title: "Lỗi",
        message: "Có lỗi xảy ra. Vui lòng thử lại.",
        onConfirm: null,
      });
    }
  };

  // ================= DELETE =================
  const handleDelete = (account) => {
    setDialog({
      open: true,
      mode: "confirm",
      title: "Xác nhận xoá",
      message: `Bạn có chắc chắn muốn xoá tài khoản:\n${account.email}?`,
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(account.id);

          setDialog({
            open: true,
            mode: "success",
            title: "Xoá thành công",
            message: `Tài khoản ${account.email} đã được xoá.`,
            onConfirm: null,
          });
        } catch (error) {
          setDialog({
            open: true,
            mode: "error",
            title: "Xoá thất bại",
            message: "Không thể xoá tài khoản.",
            onConfirm: null,
          });
        }
      },
    });
  };

  return {
    successMessage,
    setSuccessMessage,
    dialog,
    setDialog,
    handleSubmit,
    handleDelete,
  };
};

export default useHandleCRUD;
