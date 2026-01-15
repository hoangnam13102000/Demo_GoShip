import { useState } from "react";

/**
 * Hook xử lý CRUD dùng chung cho Admin
 * Chuẩn cho Laravel REST API
 */
const useHandleCRUD = ({
  createMutation,
  updateMutation,
  deleteMutation,
  resetForm,
  entity = "item",
}) => {
  const [successMessage, setSuccessMessage] = useState("");

  const [dialog, setDialog] = useState({
    open: false,
    mode: "alert", // alert | success | error | confirm | warning
    title: "",
    message: "",
    onConfirm: null,
  });

  /**
   * SUBMIT CREATE / UPDATE
   */
  const handleSubmit = async (e, editing, formData) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
      console.log("Submitting data:", formData);
      console.log("Data type of weight:", typeof formData.weight);
      console.log("Data type of charge:", typeof formData.charge);
    }

    setSuccessMessage("");

    try {
      // ================= CREATE =================
      if (!editing) {
        await createMutation.mutateAsync(formData);

        setDialog({
          open: true,
          mode: "success",
          title: "Thành công",
          message: `Tạo ${entity} thành công`,
          onConfirm: () => {
            setDialog((prev) => ({ ...prev, open: false }));
            resetForm();
          },
        });

        return;
      }

      // ================= UPDATE =================
      const payload = { ...formData };
      delete payload.email;
      await updateMutation.mutateAsync({
        id: editing.id,
        data: payload,
      });

      setDialog({
        open: true,
        mode: "success",
        title: "Cập nhật thành công",
        message: `Cập nhật ${entity} thành công`,
        onConfirm: () => {
          setDialog((prev) => ({ ...prev, open: false }));
          resetForm();
        },
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        `Không thể ${editing ? "cập nhật" : "tạo"} ${entity}`;

      setDialog({
        open: true,
        mode: "error",
        title: "Thao tác thất bại",
        message,
        onConfirm: () => setDialog((prev) => ({ ...prev, open: false })),
      });
    }
  };

  /**
   * DELETE WITH CONFIRM
   */
  const handleDelete = (item) => {
    setDialog({
      open: true,
      mode: "confirm",
      title: `Xóa ${entity}`,
      message: `Bạn có chắc chắn muốn xóa ${entity} này không? Hành động này không thể hoàn tác.`,
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(item.id);

          setDialog({
            open: true,
            mode: "success",
            title: "Xóa thành công",
            message: `Xóa ${entity} thành công`,
            onConfirm: () => setDialog((prev) => ({ ...prev, open: false })),
          });
        } catch (error) {
          const message =
            error?.response?.data?.message || `Không thể xóa ${entity}`;

          setDialog({
            open: true,
            mode: "error",
            title: "Xóa thất bại",
            message,
            onConfirm: () => setDialog((prev) => ({ ...prev, open: false })),
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
