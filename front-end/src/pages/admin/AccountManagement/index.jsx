import { useState, useMemo } from "react";
import { useCRUDApi } from "../../../api/hooks/useCRUDApi";
import useHandleCRUD from "../../../utils/hooks/useHandleCRUD";
import DynamicTable from "../../../components/common/DynamicTable";
import DynamicForm from "../../../components/common/DynamicForm";
import FilterBar from "../../../components/common/FilterBar";
import CreateButton from "../../../components/common/buttons/CreateButton";
import GenericBadge from "../../../components/UI/GenericBadge";
import DynamicDialog from "../../../components/UI/DynamicDialog";
import Pagination from "../../../components/common/Pagination";

/* ================= CONSTANTS ================= */

// ❌ KHÔNG CÓ USER
const ROLE_OPTIONS = ["ADMIN", "AGENT"];
const STATUS_OPTIONS = ["ACTIVE", "INACTIVE"];

/* ================= INITIAL FORM ================= */

const initialForm = {
  email: "",
  password: "",
  role: "AGENT",
  branch_id: "",
  is_active: true,
};

/* ================= HELPERS ================= */

const toBool = (v) => v === true || v === 1 || v === "1" || v === "ACTIVE";
const toStatus = (v) => (toBool(v) ? "ACTIVE" : "INACTIVE");

/* ================= PAGE ================= */

const AdminAccountsPage = () => {
  // ================= API =================
  const { useGetAll, useCreate, useUpdate, useDelete } = useCRUDApi("accounts");

  const { useGetAll: useGetBranches } = useCRUDApi("branches");

  const {
    data: accounts = [],
    isLoading,
    isError,
  } = useGetAll({ staleTime: 1000 * 30 });

  const { data: branches = [] } = useGetBranches();

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    entityName: "tài khoản",
  });

  // ================= HANDLERS =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
      role: account.role || "AGENT",
      branch_id: account.branch_id || "",
      is_active: toBool(account.status),
    });
    setShowModal(true);
  };

  // ================= SUBMIT =================
  const handleSubmitAccount = (e) => {
    // 🔒 CHẶN USER (an toàn kép)
    if (form.role === "USER") {
      setDialog({
        open: true,
        mode: "error",
        title: "Không hợp lệ",
        message: "Không thể tạo tài khoản khách hàng tại đây.",
      });
      return;
    }

    const payload = {
      email: form.email,
      password: form.password || undefined,
      role: form.role,
      branch_id: form.branch_id,
      status: toStatus(form.is_active),
    };

    handleSubmit(e, editing, payload);
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
      .filter((acc) => (filterRole === "ALL" ? true : acc.role === filterRole))
      .filter((acc) => {
        if (filterStatus === "ALL") return true;
        return filterStatus === "ACTIVE"
          ? toBool(acc.status)
          : !toBool(acc.status);
      });
  }, [accounts, search, filterRole, filterStatus]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAccounts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAccounts, currentPage]);

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterRole = (value) => {
    setFilterRole(value);
    setCurrentPage(1);
  };

  const handleFilterStatus = (value) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  // ================= BADGE CONFIG =================
  const ROLE_BADGE_CONFIG = {
    ADMIN: { className: "bg-purple-100 text-purple-700" },
    AGENT: { className: "bg-blue-100 text-blue-700" },
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

        <FilterBar
          search={search}
          setSearch={handleSearch}
          filterRole={filterRole}
          setFilterRole={handleFilterRole}
          filterStatus={filterStatus}
          setFilterStatus={handleFilterStatus}
          roleOptions={ROLE_OPTIONS}
          statusOptions={STATUS_OPTIONS}
          filteredCount={filteredAccounts.length}
          totalCount={accounts.length}
        />

        <DynamicTable
          data={paginatedAccounts}
          isLoading={isLoading}
          isError={isError}
          onEdit={handleEdit}
          onDelete={handleDelete}
          columns={[
            {
              key: "index",
              title: "STT",
              render: (_, i) => (currentPage - 1) * itemsPerPage + i + 1,
            },
            { key: "email", title: "Email" },
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
                <GenericBadge
                  value={row.status || "ACTIVE"}
                  config={STATUS_BADGE_CONFIG}
                />
              ),
            },
          ]}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <CreateButton label="Thêm tài khoản" onClick={handleOpenCreate} />
      </div>

      {/* FORM */}
      <DynamicForm
        visible={showModal}
        title={editing ? "Chỉnh sửa tài khoản" : "Tạo tài khoản mới"}
        form={form}
        fields={[
          { name: "email", type: "email", readOnly: !!editing },
          {
            name: "password",
            type: "password",
            required: !editing,
            placeholder: editing ? "Để trống nếu không đổi" : "",
          },
          {
            name: "role",
            type: "select",
            options: ROLE_OPTIONS.map((r) => ({
              label: r,
              value: r,
            })),
          },
          {
            name: "branch_id",
            type: "select",
            label: "Chi nhánh",
            required: true,
            options: branches.map((b) => ({
              label: b.name,
              value: b.id,
            })),
          },
          {
            name: "is_active",
            type: "checkbox",
            label: "Kích hoạt",
          },
        ]}
        editing={editing}
        successMessage={successMessage}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onChange={handleChange}
        onSubmit={handleSubmitAccount}
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
          if (dialog.onConfirm) await dialog.onConfirm();
        }}
      />
    </div>
  );
};

export default AdminAccountsPage;
