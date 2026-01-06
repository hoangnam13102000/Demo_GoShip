import { useState, useMemo } from "react";
import { useCRUDApi } from "../../../api/hooks/useCRUDApi";
import useHandleCRUD from "../../../utils/hooks/useHandleCRUD";
import DynamicTable from "../../../components/common/DynamicTable";
import DynamicForm from "../../../components/common/DynamicForm";
import FilterBar from "../../../components/common/FilterBar";
import CreateButton from "../../../components/common/buttons/CreateButton";
import GenericBadge from "../../../components/UI/GenericBadge";
import DynamicDialog from "../../../components/UI/DynamicDialog";

const ROLE_OPTIONS = ["ADMIN", "AGENT", "USER"];
const STATUS_OPTIONS = ["ACTIVE", "INACTIVE"];

const initialForm = {
  email: "",
  password: "",
  role: "USER",
  status: "ACTIVE",
};

const AdminAccountsPage = () => {
  // ================= API =================
  const { useGetAll, useCreate, useUpdate, useDelete } =
    useCRUDApi("accounts");

  const {
    data: accounts = [],
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
  const [filterRole, setFilterRole] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
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

  const handleEdit = (account) => {
    setEditing(account);
    setForm({
      email: account.email || "",
      password: "",
      role: account.role || "USER",
      status: account.status || "ACTIVE",
    });
    setShowModal(true);
  };

  // ================= FILTER =================
  const filteredAccounts = useMemo(() => {
    return accounts
      .filter((acc) => {
        if (!search.trim()) return true;
        const keyword = search.toLowerCase();
        return (
          acc.email?.toLowerCase().includes(keyword) ||
          acc.role?.toLowerCase().includes(keyword)
        );
      })
      .filter((acc) =>
        filterRole === "ALL" ? true : acc.role === filterRole
      )
      .filter((acc) =>
        filterStatus === "ALL" ? true : acc.status === filterStatus
      );
  }, [accounts, search, filterRole, filterStatus]);

  // ================= BADGE CONFIG =================
  const ROLE_BADGE_CONFIG = {
    ADMIN: { className: "bg-purple-100 text-purple-700" },
    AGENT: { className: "bg-blue-100 text-blue-700" },
    USER: { className: "bg-gray-100 text-gray-700" },
    DEFAULT: { className: "bg-gray-100 text-gray-700" },
  };

  const STATUS_BADGE_CONFIG = {
    ACTIVE: {
      className: "bg-green-100 text-green-700",
      dotColor: "bg-green-500",
    },
    INACTIVE: {
      className: "bg-red-100 text-red-700",
      dotColor: "bg-red-500",
    },
    DEFAULT: { className: "bg-gray-100 text-gray-700" },
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý tài khoản
        </h1>
        <p className="text-gray-600 mb-6">
          Quản lý các tài khoản hệ thống
        </p>

        <FilterBar
          search={search}
          setSearch={setSearch}
          filterRole={filterRole}
          setFilterRole={setFilterRole}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          roleOptions={ROLE_OPTIONS}
          statusOptions={STATUS_OPTIONS}
          filteredCount={filteredAccounts.length}
          totalCount={accounts.length}
        />

        <DynamicTable
          data={filteredAccounts}
          isLoading={isLoading}
          isError={isError}
          onEdit={handleEdit}
          onDelete={handleDelete}
          columns={[
            { key: "index", title: "STT", render: (_, i) => i + 1 },
            { key: "email", title: "Email", render: (row) => row.email },
            {
              key: "role",
              title: "Vai trò",
              render: (row) => (
                <GenericBadge value={row.role} config={ROLE_BADGE_CONFIG} />
              ),
            },
            {
              key: "status",
              title: "Trạng thái",
              render: (row) => (
                <GenericBadge value={row.status} config={STATUS_BADGE_CONFIG} />
              ),
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

        <CreateButton label="Thêm tài khoản" onClick={handleOpenCreate} />
      </div>

      {/* FORM */}
      <DynamicForm
        visible={showModal}
        title={editing ? "Chỉnh sửa tài khoản" : "Tạo tài khoản mới"}
        form={form}
        fields={[
          { name: "email", type: "email", hideWhenEdit: true },
          { name: "password", type: "password", hideWhenEdit: true },
          {
            name: "role",
            type: "select",
            options: ROLE_OPTIONS.map((r) => ({
              label: r,
              value: r,
            })),
          },
          {
            name: "status",
            type: "select",
            options: STATUS_OPTIONS.map((s) => ({
              label: s,
              value: s,
            })),
          },
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

export default AdminAccountsPage;
