import { useState, useMemo } from "react";
import { useCRUDApi } from "../../../api/hooks/useCRUDApi";
import useHandleCRUD from "../../../utils/hooks/useHandleCRUD";
import DynamicTable from "../../../components/common/DynamicTable";
import DynamicForm from "../../../components/common/DynamicForm";
import FilterBar from "../../../components/common/FilterBar";
import CreateButton from "../../../components/common/buttons/CreateButton";
import DynamicDialog from "../../../components/UI/DynamicDialog";

const initialForm = {
  account_id: "",
  full_name: "",
  phone: "",
  address: "",
};

const AdminCustomersPage = () => {
  // ================= API =================
  const { useGetAll, useCreate, useUpdate, useDelete } =
    useCRUDApi("customers");

  const {
    data: customers = [],
    isLoading,
    isError,
  } = useGetAll({ staleTime: 1000 * 30 });

  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  // ================= STATE =================
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const resetForm = () => {
    setForm(initialForm);
    setEditing(null);
    setShowModal(false);
    setSuccessMessage("");
  };

  // ================= CRUD HOOK =================
  const {
    successMessage,
    setSuccessMessage,
    dialog,
    setDialog,
    handleSubmit,
    handleDelete,
  } = useHandleCRUD({
    createMutation,
    updateMutation,
    deleteMutation,
    resetForm,
  });

  // ================= HANDLERS =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenCreate = () => {
    setForm(initialForm);
    setEditing(null);
    setShowModal(true);
  };

  const handleEdit = (customer) => {
    setEditing(customer);
    setForm({
      account_id: customer.account_id || "",
      full_name: customer.full_name || "",
      phone: customer.phone || "",
      address: customer.address || "",
    });
    setShowModal(true);
  };

  // ================= FILTER =================
  const filteredCustomers = useMemo(() => {
    return customers.filter((cus) => {
      if (!search.trim()) return true;
      const keyword = search.toLowerCase();
      return (
        cus.full_name?.toLowerCase().includes(keyword) ||
        cus.phone?.toLowerCase().includes(keyword) ||
        cus.address?.toLowerCase().includes(keyword) ||
        String(cus.account_id).includes(keyword)
      );
    });
  }, [customers, search]);

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý khách hàng
        </h1>
        <p className="text-gray-600 mb-6">
          Quản lý thông tin khách hàng trong hệ thống
        </p>

        <FilterBar
          search={search}
          setSearch={setSearch}
          filteredCount={filteredCustomers.length}
          totalCount={customers.length}
        />

        <DynamicTable
          data={filteredCustomers}
          isLoading={isLoading}
          isError={isError}
          onEdit={handleEdit}
          onDelete={handleDelete}
          columns={[
            { key: "index", title: "STT", render: (_, i) => i + 1 },
            {
              key: "account_id",
              title: "Account ID",
              render: (row) => row.account_id,
            },
            {
              key: "full_name",
              title: "Họ tên",
              render: (row) => row.full_name,
            },
            {
              key: "phone",
              title: "Số điện thoại",
              render: (row) => row.phone || "-",
            },
            {
              key: "address",
              title: "Địa chỉ",
              render: (row) => row.address || "-",
            },
            {
              key: "created_at",
              title: "Ngày tạo",
              render: (row) =>
                row.created_at
                  ? new Date(row.created_at).toLocaleDateString("vi-VN")
                  : "-",
            },
          ]}
        />

        <CreateButton label="Thêm khách hàng" onClick={handleOpenCreate} />
      </div>

      {/* FORM */}
      <DynamicForm
        visible={showModal}
        title={editing ? "Chỉnh sửa khách hàng" : "Tạo khách hàng mới"}
        form={form}
        fields={[
          { name: "account_id", type: "number" },
          { name: "full_name", type: "text" },
          { name: "phone", type: "text" },
          { name: "address", type: "text" },
        ]}
        editing={editing}
        successMessage={successMessage}
        isSubmitting={
          createMutation.isPending || updateMutation.isPending
        }
        onChange={handleChange}
        onSubmit={(e) => handleSubmit(e, editing, form)}
        onCancel={resetForm}
      />

      {/* DIALOG */}
      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onClose={() => setDialog({ ...dialog, open: false })}
        onConfirm={async () => {
          if (dialog.onConfirm) {
            await dialog.onConfirm();
          }
        }}
      />
    </div>
  );
};

export default AdminCustomersPage;
