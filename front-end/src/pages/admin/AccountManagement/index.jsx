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

const ROLE_OPTIONS = ["ADMIN", "AGENT"];
const STATUS_OPTIONS = ["ACTIVE", "INACTIVE"];

/* ================= INITIAL FORM ================= */
/**
 * status: boolean
 * true  -> ACTIVE
 * false -> INACTIVE
 */
const initialForm = {
  email: "",
  password: "",
  role: "AGENT",
  branch_id: "",
  status: true,
};

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

  // ================= CRUD =================
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
      branch_id: account.agent?.branch_id || "",
      status: account.status === "ACTIVE",
    });
    setShowModal(true);
  };

  // ================= SUBMIT =================
  const handleSubmitAccount = (e) => {
    const payload = {
      email: form.email,
      role: form.role,
      status: form.status ? "ACTIVE" : "INACTIVE",
    };

    // chỉ gửi branch_id khi là AGENT
    if (form.role === "AGENT") {
      payload.branch_id = form.branch_id;
    }

    // password
    if (form.password) {
      payload.password = form.password;
    }

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
      .filter((acc) =>
        filterRole === "ALL" ? true : acc.role === filterRole
      )
      .filter((acc) =>
        filterStatus === "ALL" ? true : acc.status === filterStatus
      );
  }, [accounts, search, filterRole, filterStatus]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

  const paginatedAccounts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAccounts.slice(start, start + itemsPerPage);
  }, [filteredAccounts, currentPage]);

  // ================= BADGES =================
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
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Quản lý tài khoản
        </h1>

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
          data={paginatedAccounts}
          isLoading={isLoading}
          isError={isError}
          onEdit={handleEdit}
          onDelete={handleDelete}
          columns={[
            {
              key: "index",
              title: "STT",
              render: (_, i) =>
                (currentPage - 1) * itemsPerPage + i + 1,
            },
            {
              key: "email",
              title: "Email",
              render: (row) => row.email || "—",
            },
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
          ...(form.role === "AGENT"
            ? [
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
              ]
            : []),
          {
            name: "status",
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

      <DynamicDialog
        open={dialog.open}
        mode={dialog.mode}
        title={dialog.title}
        message={dialog.message}
        onClose={() => setDialog({ ...dialog, open: false })}
        onConfirm={dialog.onConfirm}
      />
    </div>
  );
};

export default AdminAccountsPage;
